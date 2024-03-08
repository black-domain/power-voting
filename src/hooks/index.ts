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

import { ethers } from "ethers";
import { NFTStorage, Blob } from 'nft.storage';
import {BigNumberish } from '../aa';
import { encodeFunctionData } from 'viem';
import {PowerVotingAbi} from "../common/abi/PowerVoting";
import {

  contractAddressList,
  NFT_STORAGE_KEY,
  bobContractAddress,
  SUCCESS_INFO,
  ERROR_INFO,
  OPERATION_FAILED_MSG, wBtcContractAddress,
} from "../common/consts";
import { bobChain } from "../common/consts";
import {HexString} from "../types";
import {ERC20Abi} from "../common/abi/ERC20.abi";


const decodeError = (data: string) => {
  const errorData = data.substring(0, 2) + data.substring(10);
  const defaultAbiCoder = new ethers.utils.AbiCoder();
  let decodedData =  '';
  try {
    decodedData = defaultAbiCoder.decode(['string'], errorData)[0];
  } catch (e) {
    console.log(e);
  }
  return decodedData;
}

// @ts-ignore
const handleReturn = ({ type, data }) => {
  let code = 200;
  let msg = SUCCESS_INFO;
  if (type === Error) {
    const encodeData = data?.error?.data?.originalError?.data;
    if (encodeData) {
      code = 401
      msg = decodeError(encodeData) || OPERATION_FAILED_MSG;
    } else {
      code = 402;
      msg = OPERATION_FAILED_MSG;
    }
  }

  return {
    code,
    msg,
    data
  }
}

export const handleContract = async (client: any, functionName: string, args: any[]) => {
  const rpcUrl = bobChain.rpcUrls.default.http[0];
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wBTCContract = new ethers.Contract(wBtcContractAddress, ERC20Abi, provider);

  let approvalUserOpNonce: BigNumberish | null = null;
  // approve wbtc spending by paymaster contract
  if (client.paymasterAddress && client.smartAccountAddress) {
    const allowance = await wBTCContract.allowance(client.smartAccountAddress, client.paymasterAddress);
    console.log(allowance);
    const uint256Max = BigInt(2 ** 256) - BigInt(1);
    if (allowance < uint256Max) {
      const approvalCallData = encodeFunctionData({
        abi: ERC20Abi,
        functionName: 'approve',
        args: [client.paymasterAddress as HexString, uint256Max]
      });
      const approvalUserOp = await client.createUserOp({
        address: wBtcContractAddress,
        callData: approvalCallData,
        value: 0
      });
      approvalUserOp.paymasterAndData = '0x';
      await client.signAndSendUserOp(approvalUserOp);
      approvalUserOpNonce = await approvalUserOp.nonce;
    }
  }

  // send userop
  const callData = encodeFunctionData({
    abi: PowerVotingAbi,
    functionName,
    args: [...args]
  });

  const userOp = await client.createUserOp({
    address: bobContractAddress as HexString,
    callData,
    value: 0,
    nonce: approvalUserOpNonce ? parseInt(approvalUserOpNonce.toString()) + 1 : undefined
  });

  const transferResult = await client?.signAndSendUserOp(userOp);

  return transferResult;
}

export const useStaticContract = async (chainId: number) => {
  const rpcUrl = bobChain.rpcUrls.default.http[0];
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const powerVotingContractAddress = contractAddressList.find(item => item.id === chainId)?.address || bobContractAddress;
  const powerVotingContract = new ethers.Contract(powerVotingContractAddress, PowerVotingAbi, provider);

  const wBTCContract = new ethers.Contract(wBtcContractAddress, ERC20Abi, provider);

  /**
   * get latest proposal id
   */
  const getLatestId = async () => {
    try {
      const data = await powerVotingContract.proposalId();
      return handleReturn({
        type: SUCCESS_INFO,
        data
      })
    } catch (e) {
      console.log(e);
      return handleReturn({
        type: ERROR_INFO,
        data: e
      })
    }
  }

  /**
   * get proposal detail
   * @param id
   */
  const getProposal = async (id: number) => {
    try {
      const data = await powerVotingContract.idToProposal(id);
      return handleReturn({
        type: SUCCESS_INFO,
        data
      })
    } catch (e) {
      console.log(e);
      return handleReturn({
        type: ERROR_INFO,
        data: e
      })
    }
  }

  const getWBTCBalance = async (address: HexString) => {
    try {
      const data = await wBTCContract.balanceOf(address);
      return handleReturn({
        type: SUCCESS_INFO,
        data
      })
    } catch (e) {
      console.log(e);
      return handleReturn({
        type: ERROR_INFO,
        data: e
      })
    }
  }

  return {
    getLatestId,
    getProposal,
    getWBTCBalance
  }
}

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {object} params for the NFT
 */
const storeIpfs = (params: object) => {
  const json = JSON.stringify(params);
  const data = new Blob([json]);

  const nftStorage = new NFTStorage({ token: NFT_STORAGE_KEY });

  return nftStorage.storeBlob(data);
}

/**
 * The main entry point for the script that checks the command line arguments and
 * calls storeNFT.
 *
 * To simplify the example, we don't do any fancy command line parsing. Just three
 * positional arguments for imagePath, name, and description
 */
export const getIpfsId = async (props: any) => {
  const result = await storeIpfs(props);
  return result;
}