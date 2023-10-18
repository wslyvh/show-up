// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import {AbstractBasicModule} from './AbstractBasicModule.sol';
import '../Common.sol';

contract BasicToken is AbstractBasicModule {
    constructor() AbstractBasicModule() { 
        _name = "BasicToken";
    }

    function initialize(uint256 recordId, bytes calldata data) external virtual override {
        Conditions memory conditions = abi.decode(data, (Conditions));

        if (conditions.tokenAddress == address(0)) revert InvalidAddress();
        if (conditions.endDate < block.timestamp) revert InvalidDate();

        _conditions[recordId] = conditions;
    }

    function cancel(uint256 recordId, bytes calldata data) external virtual override {
        super._cancel(recordId, data);

        IERC20 token = IERC20(_conditions[recordId].tokenAddress);
        for (uint256 i = 0; i < _registrations[recordId].totalRegistrations; i++) {
            require(token.transfer(_registrations[recordId].registrationIndex[i], _conditions[recordId].depositFee));
        }
    }

    function register(uint256 recordId, address participant, address sender, bytes calldata data) external payable virtual override {
        super._register(recordId, participant);

        if(msg.value > 0) revert IncorrectValue();

        _registrations[recordId].totalDepositAmount += _conditions[recordId].depositFee;

        IERC20 token = IERC20(_conditions[recordId].tokenAddress);
        require(token.transferFrom(sender, address(this), _conditions[recordId].depositFee));
    }

    function settle(uint256 recordId, bytes calldata data) external virtual override {
        super._settle(recordId, data);
        
        (bool success, uint256 attendanceFee) = Math.tryDiv(_registrations[recordId].totalDepositAmount, _registrations[recordId].totalAttendees);
        if (!success) revert IncorrectValue();

        IERC20 token = IERC20(_conditions[recordId].tokenAddress);
        for (uint256 i = 0; i < _registrations[recordId].totalAttendees; i++) {
            require(token.transfer(_registrations[recordId].attendees[i], attendanceFee));
        }
    }
}
