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
import bobAbi from "../common/abi/power-voting.json";
import {

  contractAddressList,
  NFT_STORAGE_KEY,
  bobContractAddress,
  SUCCESS_INFO,
  ERROR_INFO,
  OPERATION_FAILED_MSG,
} from "../common/consts";
import { bobChain } from "../common/consts";

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

export const useStaticContract = async (chainId: number) => {
  const rpcUrl = bobChain.rpcUrls.default.http[0];
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const powerVotingContractAddress = contractAddressList.find(item => item.id === chainId)?.address || bobContractAddress;
  const powerVotingContract = new ethers.Contract(powerVotingContractAddress, bobAbi, provider);

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

  return {
    getLatestId,
    getProposal,
  }
}

export const useDynamicContract = (chainId: number) => {
  const contractAddress = contractAddressList.find(item => item.id === chainId)?.address || bobContractAddress;
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, bobAbi, signer);

  /**
   * create proposal
   * @param proposalCid
   * @param expTime
   * @param proposalType
   */
  const createVotingApi = async (proposalCid: string, expTime: number, proposalType: number) => {
    try {
      const data = await contract.createProposal(proposalCid, expTime, proposalType);
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
   * proposal vote
   * @param proposalId
   * @param optionId
   */
  const voteApi = async (proposalId: number, optionId: string) => {
    try {
      const data = await contract.vote(proposalId, optionId);
      return handleReturn({
        type: SUCCESS_INFO,
        data
      })
    } catch (e) {
      return handleReturn({
        type: ERROR_INFO,
        data: e
      })
    }
  }

  return {
    createVotingApi,
    voteApi,
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