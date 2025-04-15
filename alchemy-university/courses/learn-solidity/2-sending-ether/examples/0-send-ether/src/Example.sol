// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/console.sol";

contract A {
    address b;

    constructor(address _b) payable {
        b = _b;
        console.log(b);
        console.log(msg.value);
        console.log(address(this).balance);
    }

    function payHalf() external {
        uint256 balance = address(this).balance;
        (bool success,) = b.call{value: balance / 2}("");
        require(success);
    }
}

contract B {
    receive() external payable {}
}
