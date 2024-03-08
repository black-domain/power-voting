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

import React,{ useState, useEffect, useRef } from "react";
import {useRoutes, useLocation, Link} from "react-router-dom";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import { message } from 'antd';
import "@rainbow-me/rainbowkit/styles.css";
import {useNetwork, useAccount} from "wagmi";
import Footer from './components/Footer';
import "@rainbow-me/rainbowkit/styles.css";
import "./common/styles/reset.less";
import "tailwindcss/tailwind.css";
import routes from "./router";
import Loading from "./components/Loading";
import { useAccountAbstraction } from './aa';
import EllipsisMiddle from "./components/EllipsisMiddle";
import {useStaticContract} from "./hooks";
import {HexString} from "./types";
import {COPY_SUCCESS_MSG, OPERATION_FAILED_MSG} from "./common/consts";

const App: React.FC = () => {
  const location = useLocation();
  const {chain} = useNetwork();
  const { address}= useAccount();
  const element = useRoutes(routes);
  const [showButton, setShowButton] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const { client } = useAccountAbstraction();
  const [wBTCBalance, setWBTCBalance] = useState(0);
  const [smartAccount, setSmartAccount] = useState('');
  const [smartAccountBalance, setSmartAccountBalance] = useState(0);


  const getWBTCBalance = async (address: HexString, type: string) => {
    const chainId = chain?.id || 0;
    const { getWBTCBalance } = await useStaticContract(chainId);
    const res = await getWBTCBalance(address);
    const balance = res.data.toNumber();
    const number = Math.floor((balance / 100000000) * 100) / 100;
    type === 'smartAccount' ? setSmartAccountBalance(number) : setWBTCBalance(number);
  }

  const scrollToTop = () => {
    const element = scrollRef.current;
    // @ts-ignore
    element.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  const scrollRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(smartAccount)
      .then(() => {
        message.success(COPY_SUCCESS_MSG);
      })
      .catch((error) => {
        message.error(OPERATION_FAILED_MSG);
      });
  }

  useEffect(() => {
    const handleScroll = () => {
      const element = scrollRef.current;
      // @ts-ignore
      setShowButton(element.scrollTop > 300)
    };

    // @ts-ignore
    scrollRef.current.addEventListener('scroll', handleScroll);

    return () => {
      // @ts-ignore
      scrollRef.current.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [location])

  useEffect(() => {
    const address = client?.smartAccountAddress as HexString;
    if (address) {
      setSmartAccount(address);
      getWBTCBalance(address, 'smartAccount');
    }
  }, [client])

  useEffect(() => {
    if (address) {
      getWBTCBalance(address, 'account');
    }
  }, [address])

  return (
    <div className="layout font-body" id='scrollBox' ref={scrollRef}>
      <header className='h-[96px]  bg-[#273141]'>
        <div className='w-[1280px] h-[96px] mx-auto flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <Link to='/'>
                <img className="logo" src="/images/logo.png" alt=""/>
              </Link>
            </div>
            <div className='ml-6 flex items-baseline space-x-20'>
              <Link
                to='/'
                className='text-white text-2xl font-semibold hover:opacity-80'
              >
                Power Voting
              </Link>
            </div>
          </div>
          <div className='flex items-center'>
            <div className="connect flex items-center">
              <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                  // Note: If your app doesn't use authentication, you
                  // can remove all 'authenticationStatus' checks
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');
                  return (
                    <div
                      className='iekbcc0 ju367va ju367v1s'
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <div className='iekbcc0 ju367va ju367v1s'>
                              <button className='iekbcc0 iekbcc9 ju367v78 ju367v7t ju367v9i ju367vn ju367vei ju367vf3 ju367v16 ju367v1h ju367v2g ju367v8u _12cbo8i3 ju367v8r _12cbo8i4 _12cbo8i6' onClick={openConnectModal} type="button">
                                Connect Wallet
                              </button>
                            </div>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button className='iekbcc0 iekbcc9 ju367v76 ju367v7r ju367v8b ju367v6k ju367v4 ju367va6 ju367vn ju367vei ju367vfx ju367vb ju367va ju367v16 ju367v1h ju367v1p ju367v8u _12cbo8i3 ju367v8r _12cbo8i4 _12cbo8i6' onClick={openChainModal} type="button">
                              Wrong network
                            </button>
                          );
                        }

                        return (
                          <div style={{ display: 'flex', justifyContent: 'align-center', gap: 12 }}>

                            <button
                              className='iekbcc0 iekbcc9 ju367v76 ju367v7r ju367v8b ju367v6k ju367v4 ju367va3 ju367vn ju367vei ju367vfu ju367vb ju367va ju367v16 ju367v1h ju367v1p ju367v8u _12cbo8i3 ju367v8r _12cbo8i4 _12cbo8i6'
                              onClick={openChainModal}
                              style={{ display: 'flex', alignItems: 'center' }}
                              type="button"
                            >
                              <div className='iekbcc0 ju367v4 ju367va ju367v1p'>
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 24,
                                      height: 24,
                                      borderRadius: 999,
                                      overflow: 'hidden',
                                      marginRight: 4,
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 24, height: 24 }}
                                      />
                                    )}
                                  </div>
                                )}
                                {chain.name}
                              </div>
                            </button>

                            {
                              smartAccount &&
                                <button className='iekbcc0 iekbcc9 ju367v4 ju367va3 ju367vn ju367vei ju367vfu ju367va ju367v16 ju367v1h ju367v8u _12cbo8i3 ju367v8r _12cbo8i4 _12cbo8i6' onClick={handleCopy} type="button">
                                    <div className='iekbcc0 ju367v75 ju367v7q ju367v8a ju367v6j ju367va9 ju367vcl ju367vn ju367vt ju367vw ju367vfu ju367v16 ju367v1h ju367v8u'>
                                        <div className='iekbcc0 ju367v4 ju367va ju367v1p ju367v2a'>
                                            AA Wallet:
                                            <div className='iekbcc0 ju367v4 ju367va ju367v1p'>
                                              {EllipsisMiddle({className: 'text-[16px]', suffixCount: 4, children: smartAccount || ''})}
                                              {` (${smartAccountBalance} wBTC)`}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            }

                            <button className='iekbcc0 iekbcc9 ju367v4 ju367va3 ju367vn ju367vei ju367vfu ju367va ju367v16 ju367v1h ju367v8u _12cbo8i3 ju367v8r _12cbo8i4 _12cbo8i6' onClick={openAccountModal} type="button">
                              <div className='iekbcc0 ju367v75 ju367v7q ju367v8a ju367v6j ju367va9 ju367vcl ju367vn ju367vt ju367vw ju367vfu ju367v16 ju367v1h ju367v8u'>
                                <div className='iekbcc0 ju367v4 ju367va ju367v1p ju367v2a'>
                                  EOA Wallet:
                                  <div className='iekbcc0 ju367v4 ju367va ju367v1p'>
                                    {account.displayName}
                                    {` (${wBTCBalance} wBTC)`}
                                  </div>
                                  <svg fill="none" height="7" width="14" xmlns="http://www.w3.org/2000/svg"><title>Dropdown</title><path d="M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg"></path></svg>
                                </div>
                              </div>
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </header>
      <div className='content w-[1000px] mx-auto pt-10 pb-10'>
        {
          spinning ? <Loading /> : element
        }
      </div>
      <Footer/>
      <button onClick={scrollToTop} className={`${showButton ? '' : 'hidden'} fixed bottom-[6rem] right-[6rem] z-40  p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none`}>
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 3l-8 8h5v10h6V11h5z" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}

export default App
