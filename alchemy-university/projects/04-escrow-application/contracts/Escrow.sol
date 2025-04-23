// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
    address public depositor;
    address public beneficiary;
    address public arbiter; 
    bool public isApproved = false;
    uint balance = address(this).balance;

    event Approved(uint);
    constructor(address _arbiter, address _beneficiary) payable{
        beneficiary = _beneficiary;
        arbiter = _arbiter;
        depositor = msg.sender;
    }

    function approve() external{
        require(msg.sender == arbiter);
        payable(beneficiary).transfer(address(this).balance);
        isApproved = true;
        emit Approved(balance);
    }

}
