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
import {
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import routes from "./router";
import Footer from './components/Footer';
import "@rainbow-me/rainbowkit/styles.css";
import "./common/styles/reset.less";
import "tailwindcss/tailwind.css";
import Loading from "./components/Loading";

const App: React.FC = () => {
  const location = useLocation();
  const element = useRoutes(routes);
  const [showButton, setShowButton] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const scrollToTop = () => {
    const element = scrollRef.current;
    // @ts-ignore
    element.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  const scrollRef = useRef(null);

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

  return (
    <div className="layout font-body" id='scrollBox' ref={scrollRef}>
      <header className='h-[96px]  bg-[#273141]'>
        <div className='w-[1000px] h-[96px] mx-auto flex items-center justify-between'>
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
              <ConnectButton />
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
