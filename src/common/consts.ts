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

import { Chain } from 'wagmi';

export const bobChain: Chain = {
  id: 111,
  name: "puff-bob-jznbxtoq7h",
  network: "puff-bob-jznbxtoq7h",
  nativeCurrency: {
    decimals: 18,
    name: "puff-bob",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ['https://l2-puff-bob-jznbxtoq7h.t.conduit.xyz'],
    },
    default: {
      http: ['https://l2-puff-bob-jznbxtoq7h.t.conduit.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: "BobScan",
      url: "https://explorerl2-puff-bob-jznbxtoq7h.t.conduit.xyz",
    },
  },
  testnet: false,
};
export const bobContractAddress = process.env.POWER_VOTING_CONTRACT_ADDRESS || '';
export const wBtcContractAddress = '0x2868d708e442A6a940670d26100036d426F1e16b';
export const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY || '';
export const walletConnectProjectId = process.env.WALLET_CONNECT_ID || '';

export const walletChainList = [
  bobChain,
];

export const contractAddressList = [
  {
    id: bobChain.id,
    address: bobContractAddress
  },
];
export const IN_PROGRESS_STATUS = 0;
export const COMPLETED_STATUS = 1;
export const VOTE_COUNTING_STATUS = 3;
export const VOTE_ALL_STATUS = 4;
export const WRONG_NET_STATUS = 5;
export const VOTE_LIST = [
  {
    value: IN_PROGRESS_STATUS,
    color: 'bg-green-700',
    label: 'In Progress'
  },
  {
    value: VOTE_COUNTING_STATUS,
    color: 'bg-yellow-700',
    label: 'Vote Counting'
  },
  {
    value: COMPLETED_STATUS,
    color: 'bg-[#6D28D9]',
    label: 'Completed'
  },
]

export const VOTE_FILTER_LIST = [
  {
    label: "All",
    value: VOTE_ALL_STATUS
  },
  {
    label: "In Progress",
    value: IN_PROGRESS_STATUS
  },
  {
    label: "Vote Counting",
    value: VOTE_COUNTING_STATUS
  },
  {
    label: "Completed",
    value: COMPLETED_STATUS
  }
];

export const SINGLE_VOTE = 1;
export const MULTI_VOTE = 2;
export const VOTE_TYPE_OPTIONS = [
  {
    label: 'Single Answer',
    value: SINGLE_VOTE
  },
  {
    label: 'Multiple Answers',
    value: MULTI_VOTE
  }
];
export const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const web3AvatarUrl = 'https://cdn.stamp.fyi/avatar/eth';

export const SUCCESS_INFO= 'success';
export const ERROR_INFO= 'error';
export const OPERATION_FAILED_MSG= 'Operation Failed';
export const STORING_DATA_MSG= 'Storing data on chain!';
export const VOTE_SUCCESS_MSG= 'Vote successful!';
export const COPY_SUCCESS_MSG= 'AA wallet address has been copied!';
export const CHOOSE_VOTE_MSG= 'Please choose a option to vote!';
export const WRONG_EXPIRATION_TIME_MSG= 'Expiration time can\'t be less than current time!';
export const WRONG_MINER_ID_MSG= 'Please check your miner ID!';