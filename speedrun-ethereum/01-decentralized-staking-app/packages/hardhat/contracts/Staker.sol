// SPDX-License-Identifier: MIT
pragma solidity 0.8.20; //Do not change the solidity version as it negatively impacts submission grading

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {
    ExampleExternalContract public exampleExternalContract;
    constructor(address exampleExternalContractAddress) {
        exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
        uint256 public deadline = block.timestamp + 72 hours;
    }
    modifier notComplete(){
        require(!exampleExternalContract.completed(), "Already completed");
        _;
    }

    mapping(address => uint256) public balances;
    uint256 public constant threshold = 1 ether;
    event Stake(address indexed staker, uint256 amount);

    // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
    // (Make sure to add a `Stake(address,uint256)` event and emit it for the frontend `All Stakings` tab to display)
    function stake() public payable {
        balances[msg.sender] += msg.value;
        emit Stake(msg.sender, msg.value);
    }

    // After some `deadline` allow anyone to call an `execute()` function
    // If the deadline has passed and the threshold is met, it should call `exampleExternalContract.complete{value: address(this).balance}()`
    bool public openForWithdraw = false;

    function execute() public notComplete{
        require(block.timestamp >= deadline, "Deadline not reached");
        if(address(this).balance >= threshold){
            exampleExternalContract.complete{value: address(this).balance}();
        }
        else{
            openForWithdraw = true;
        }
    }
    
    // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend
    function timeLeft() public view returns(uint256){
        if(block.timestamp >= deadline){
            return 0;
        }
        else{
            return deadline - block.timestamp;
        }
    }

    // If the `threshold` was not met, allow everyone to call a `withdraw()` function to withdraw their balance
    function withdraw() public notComplete{
        require(openForWithdraw, "Withdrawals not open");
        uint256 amount = balances[msg.sender];
        require (amount > 0, "You broke");
        balances[msg.sender] = 0;
        (bool s, ) = msg.sender.call{value: amount}("");
        require (s, "Failed to send Ether");
    }

    // Add the `receive()` special function that receives eth and calls stake()
    receive() external payable {
        stake();
    }
}
