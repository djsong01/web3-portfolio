// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/console.sol";

contract Example {
    uint256 a = 100;
    uint256 b = type(uint256).max; // storage slot - 0x0
    bool c = true; // storage slot - 0x1

    constructor() {
        // SSTORE - store to some storage location
        // SLOAD - read from some storage location
        /*
        bool x;
        assembly {
            x := sload(0x2)
        }
        */
        
        uint256 x = a;
        assembly{
            x := sload(0x0)
        }
        console.log(a);
    }
}
