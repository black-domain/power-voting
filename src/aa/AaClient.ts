// Copyright (C) 2023-2024 StorSwift Inc.
// This file is part of the PowerVoting library.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at:
// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { BaseAccountAPI, HttpRpcClient } from '@account-abstraction/sdk';
import { providers, Contract } from 'ethers';
import { wrapProvider } from './utils';
import { HexString } from '../types';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { ContractType, contracts } from '../constants';
import { BigNumberish, UserOperationStruct } from './types';
import { SimplePaymasterApi } from './SimplePaymasterApi';

interface AaClientConstructorOpts {
  bundlerUrl?: string;
  paymasterAddress?: HexString;
  onInitCallback?: (client: AaClient) => void;
}

class AaClient {
  public isInitialized = false;
  public paymasterAddress: HexString | undefined;
  public accountApi: BaseAccountAPI | null = null;
  public smartAccountAddress: HexString | null = null;
  public rpcClient: HttpRpcClient | null = null;

  private _signer: providers.JsonRpcSigner | null = null;
  private _injectedProvider: Web3Provider;

  constructor(opts: AaClientConstructorOpts = {}) {
    if (!window.ethereum) {
      throw new Error('Injected wallet not found.');
    }
    this._injectedProvider = new providers.Web3Provider(window.ethereum as unknown as ExternalProvider);
    this.paymasterAddress = opts.paymasterAddress;
    this._initialize(opts);
  }

  /**
   * Initializes connection to bundler and prepares class members.
   * @param opts Initialization params.
   */
  private async _initialize(opts: AaClientConstructorOpts) {
    const config = {
      chainId: await this._injectedProvider.getNetwork().then((network) => network.chainId),
      entryPointAddress: contracts[ContractType.ENTRY_POINT].address,
      bundlerUrl: opts.bundlerUrl || 'https://bundler-sepolia.gobob.xyz/rpc',
      paymasterAPI: opts.paymasterAddress && new SimplePaymasterApi(opts.paymasterAddress) // TODO: make optional and allow other paymasters.
    };
    this._signer = this._injectedProvider.getSigner();

    const wrappedProvider = await wrapProvider(this._injectedProvider, config, this._signer);
    this.accountApi?.paymasterAPI;
    this.smartAccountAddress = (await wrappedProvider.smartAccountAPI.getAccountAddress()) as HexString;
    this.accountApi = wrappedProvider.smartAccountAPI;
    this.rpcClient = wrappedProvider.httpRpcClient;

    this.isInitialized = true;
    opts.onInitCallback?.(this);
  }

  private _checkInitialized() {
    if (!this.isInitialized) {
      throw new Error('AA client is not initialized yet.');
    }
  }

  /**
   * Creates user operation based on passed address, value and calldata.
   *
   * @returns User operation in standard format.
   */
  public async createUserOp({
    address,
    value,
    callData,
    nonce
  }: {
    address: HexString;
    value: string | number | undefined;
    callData: HexString;
    nonce?: BigNumberish;
  }) {
    this._checkInitialized();

    const op = await this.accountApi!.createUnsignedUserOp({
      target: address,
      value: value,
      data: callData,
      // TODO: Set gas limits dynamically.
      maxFeePerGas: 0x6507a5d0,
      maxPriorityFeePerGas: 0x6507a5c0,
      nonce
    });

    return op as UserOperationStruct;
  }

  /**
   * Runs before user operation to ensure its submission will be sucessful.
   * If paymaster is not used, this method will check entrypoint deposit and
   * try to deposit more funds if needed.
   */
  protected async _preSendUserOp(userOp: UserOperationStruct) {
    this._checkInitialized();
    console.log(userOp);
    if (userOp.paymasterAndData !== '0x') {
      // TODO: paymasters are now handled outside of this client, decide
      // whether erc20 approval tx should be moved here for wbtc paymaster.
      return;
    }

    const MINIMUM_ENTRY_POINT_DEPOSIT = 1000; // 1000 wei

    const entryPointContract = new Contract(
      contracts[ContractType.ENTRY_POINT].address,
      contracts[ContractType.ENTRY_POINT].abi,
      this._injectedProvider
    );

    const entryPointDeposit = await entryPointContract.balanceOf(this.smartAccountAddress);

    if (entryPointDeposit < MINIMUM_ENTRY_POINT_DEPOSIT) {
      const rawSmartAccount = this.smartAccountAddress!.slice(2);
      await this._signer!.sendTransaction({
        to: contracts[ContractType.ENTRY_POINT].address,
        value: 1000000000000000,
        data: `0xb760faf9000000000000000000000000${rawSmartAccount}`,
        gasLimit: 100000 // TODO: set dynamically
      }).then(async (tx) => await tx.wait());
    }
  }

  /**
   * Signs and sends user operation to bundler.
   *
   * @param userOp User operation to be sent.
   * @returns userOpHash the id of this operation.
   */
  public async signAndSendUserOp(userOp: UserOperationStruct) {
    await this._preSendUserOp(userOp);

    const signedUserOp = await this.accountApi!.signUserOp(userOp);

    return await this.rpcClient?.sendUserOpToBundler(signedUserOp);
  }
}

export { AaClient };
