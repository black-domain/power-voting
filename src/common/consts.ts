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
import { filecoin } from 'wagmi/chains';

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
      name: "BOB",
      url: "https://testnet-explorer.gobob.xyz:443",
    },
  },
  testnet: false,
};
export const bobContractAddress = '';
export const NFT_STORAGE_KEY = '';
export const walletConnectProjectId = '';

export const walletChainList = [
  bobChain,
  {
    ...filecoin,
    iconUrl: 'data:image/png;base64,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'
  },
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
export const CHOOSE_VOTE_MSG= 'Please choose a option to vote!';
export const WRONG_EXPIRATION_TIME_MSG= 'Expiration time can\'t be less than current time!';
export const WRONG_MINER_ID_MSG= 'Please check your miner ID!';