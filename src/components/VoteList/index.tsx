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

import React from 'react';
import { Empty, Table, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import EllipsisMiddle from "../EllipsisMiddle";
import {web3AvatarUrl} from "../../common/consts";
import {Chain} from "wagmi";
import {ProposalHistory} from "../../common/types";
import './index.less';
import {bigNumberToFloat, convertBytes} from "../../utils";

interface Props {
  voteList: ProposalHistory[];
  chain?: Chain;
}

const VoteList: React.FC<Props> = ({ voteList, chain }) => {

  const columns = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Power',
      dataIndex: 'power',
      key: 'power',
    },
    {
      title: 'Total Power',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Percent',
      dataIndex: 'percent',
      key: 'percent',
      render: (text: string) => {
        return text === '0%' ? 'NO VOTES' : text;
      }
    },
    {
      title: 'Block Height',
      dataIndex: 'powerBlockHeight',
      key: 'powerBlockHeight',
    },
  ];

  const getPowerData = (votePower: any) => {
    return [
      {
        key: 'sp',
        role: 'SP',
        powerBlockHeight: votePower.powerBlockHeight,
        power: convertBytes(votePower.spPower),
        total: convertBytes(votePower.totalSpPower),
        percent: `${votePower.spPowerPercent}%`,
      },
      {
        key: 'client',
        role: 'Client',
        powerBlockHeight: votePower.powerBlockHeight,
        power: convertBytes(Number(votePower.clientPower) / (10 ** 18)),
        total: convertBytes(Number(votePower.totalClientPower) / (10 ** 18)),
        percent: `${votePower.clientPowerPercent}%`,
      },
      {
        key: 'developer',
        role: 'Developer',
        powerBlockHeight: votePower.powerBlockHeight,
        power: votePower.developerPower,
        total: votePower.totalDeveloperPower,
        percent: `${votePower.developerPowerPercent}%`,
      },
      {
        key: 'tokenHolder',
        role: 'TokenHolder',
        powerBlockHeight: votePower.powerBlockHeight,
        power: bigNumberToFloat(votePower.tokenHolderPower),
        total: bigNumberToFloat(votePower.totalTokenHolderPower),
        percent: `${votePower.tokenHolderPowerPercent}%`
      },
    ];
  }

  const renderFooter = (data: any[], votes: number) => {
    let totalPercent = "Total Percent = ";
    let count = 0;
    const arr: string[] = [];
    data.forEach(item => {
      const { total, percent } = item;
      if (total !== '0') {
        arr.push(percent);
        count++;
      }
    });

    arr.forEach((item, index) => {
      if (index < arr.length - 1) {
        totalPercent += `${item} / 4 + `;
      } else {
        totalPercent += `${item} / 4`;
      }
    });


    totalPercent += `= ${votes}%`;

    return <div>{totalPercent}</div>;
  }

  return (
    <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border my-12">
      <div className="group flex h-[57px] justify-between rounded-t-none border-b border-skin-border px-6 pb-[12px] pt-3 md:rounded-t-lg">
        <h4 className="flex items-center">
          <div className="font-semibold">Votes</div>
          {/*<div className="h-[20px] min-w-[20px] rounded-full bg-[#8b949e] px-1 text-center text-xs leading-5 text-white ml-2 inline-block">{totalVotes}</div>*/}
        </h4>
        <div className="flex items-center" />
      </div>
      {
        voteList?.length > 0 ?
          <div className="voteList leading-5 sm:leading-6 max-h-[260px] overflow-auto">
            {
              voteList?.map((item: ProposalHistory, index: number) => {
                return (
                  <div className={`flex items-center gap-3 border-t px-4 py-[14px] ${index === 0 && '!border-0'}`} key={item.address + index}>
                    <div className="w-[140px] flex items-center">
                      <img className="w-[20px] h-[20px] rounded-full mr-2" src={`${web3AvatarUrl}:${item.address}`} alt="" />
                      <a
                        className="text-white"
                        target="_blank"
                        rel="noopener"
                        href={`${chain?.blockExplorers?.default.url}/address/${item?.address}`}
                      >
                        {EllipsisMiddle({ suffixCount: 4, children: item?.address })}
                      </a>
                    </div>
                    <div className="w-[180px] flex-auto truncate px-2 text-center text-skin-link">
                      <div className="truncate text-center text-skin-link">{item.optionName}</div>
                    </div>
                    <div className="flex min-w-[110px] items-center justify-end whitespace-nowrap text-center text-skin-link xs:w-[130px] xs:min-w-[130px] cursor-pointer">
                      <Popover content={
                        <Table
                          dataSource={getPowerData(item)}
                          columns={columns}
                          pagination={false}
                          footer={(currentData: any) => renderFooter(currentData, item.votes)}
                        />
                      }>
                        <span>{item.votes}% <InfoCircleOutlined style={{ fontSize: 14 }} /></span>
                      </Popover>
                    </div>
                  </div>
                )
              })
            }
          </div> :
          <Empty
            className='my-12'
            description={
              <span className='text-white'>No Data</span>
            }
          />
      }
    </div>
  )
}

export default VoteList;