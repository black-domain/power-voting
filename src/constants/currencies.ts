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

import { HexString } from '../types';

enum Erc20CurrencyTicker {
  WBTC = 'WBTC',
  USDT = 'USDT'
}

type CurrencyTicker = keyof typeof Erc20CurrencyTicker;

interface CurrencyBase {
  ticker: string;
  name: string;
  decimals: number;
}

interface Erc20Currency extends CurrencyBase {
  ticker: Erc20CurrencyTicker;
  address: HexString;
}

type Currency = Erc20Currency;

const Erc20Currencies: {
  [ticker in Erc20CurrencyTicker]: Erc20Currency;
} = {
  [Erc20CurrencyTicker.WBTC]: {
    ticker: Erc20CurrencyTicker.WBTC,
    name: 'wBTC',
    decimals: 8,
    address: '0x2868d708e442A6a940670d26100036d426F1e16b'
  },
  [Erc20CurrencyTicker.USDT]: {
    ticker: Erc20CurrencyTicker.USDT,
    name: 'Tether USD',
    decimals: 6,
    address: '0x3c252953224948E441aAfdE7b391685201ccd3bC'
  }
};

const currencies = {
  ...Erc20Currencies
};

export { Erc20Currencies, Erc20CurrencyTicker, currencies };
export type { Erc20Currency, Currency, CurrencyTicker };
