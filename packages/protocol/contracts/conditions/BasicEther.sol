// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {AbstractBasicModule} from './AbstractBasicModule.sol';
import '../Common.sol';

contract BasicEther is Ownable, AbstractBasicModule {
    constructor(address owner) AbstractBasicModule(owner) { 
        _name = "BasicEther";
    }

    function initialize(uint256 recordId, bytes calldata data) onlyOwner external virtual override {
        Conditions memory conditions = abi.decode(data, (Conditions));

        if (conditions.tokenAddress != address(0)) revert InvalidAddress();
        if (conditions.endDate < block.timestamp) revert InvalidDate();

        _conditions[recordId] = conditions;
    }

    function cancel(uint256 recordId, bytes calldata data) onlyOwner external virtual override {
        _cancel(recordId, data);

        for (uint256 i = 0; i < _registrations[recordId].totalRegistrations; i++) {
            payable(_registrations[recordId].registrationIndex[i]).transfer(_conditions[recordId].depositFee);
        }
    }

    function register(uint256 recordId, address participant, address sender, bytes calldata data) onlyOwner external payable virtual override {
        _register(recordId, participant);

        if(_conditions[recordId].depositFee != msg.value) revert IncorrectValue();

        _registrations[recordId].totalDepositAmount += msg.value;
    }

    function settle(uint256 recordId, bytes calldata data) onlyOwner external virtual override {
        _settle(recordId, data);
        
        (bool success, uint256 attendanceFee) = Math.tryDiv(_registrations[recordId].totalDepositAmount, _registrations[recordId].totalAttendees);
        if (!success) revert IncorrectValue();

        for (uint256 i = 0; i < _registrations[recordId].totalAttendees; i++) {
            payable(_registrations[recordId].attendees[i]).transfer(attendanceFee);
        }
    }
}
