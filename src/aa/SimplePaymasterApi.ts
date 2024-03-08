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

/**
 * an API to external a UserOperation with paymaster info
 */
class SimplePaymasterApi {
  /**
   * @param userOp a partially-filled UserOperation (without signature and paymasterAndData
   *  note that the "preVerificationGas" is incomplete: it can't account for the
   *  paymasterAndData value, which will only be returned by this method..
   * @returns the value to put into the PaymasterAndData, undefined to leave it empty
   */
  public paymasterAddress: HexString;

  constructor(address: HexString) {
    this.paymasterAddress = address;
  }

  async getPaymasterAndData(): Promise<string | undefined> {
    // TODO: Add custom fee limit passed into class constructor.
    const unlimitedPaymasterAndData = `${this.paymasterAddress}ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`;
    return unlimitedPaymasterAndData;
  }
}
export { SimplePaymasterApi };
