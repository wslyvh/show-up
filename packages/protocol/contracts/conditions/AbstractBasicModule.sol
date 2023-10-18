// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

import {IConditionModule} from '../interfaces/IConditionModule.sol';
import '../Common.sol';

contract AbstractBasicModule is IConditionModule {
    struct Conditions {
        address owner;
        uint256 endDate;
        uint256 depositFee;
        uint256 maxParticipants;
        address tokenAddress; // Only used for BasicToken module
    }

    struct Registrations {
        uint256 totalDepositAmount;
        uint256 totalRegistrations;
        uint256 totalAttendees;

        mapping(address => bool) registrations; // TODO: Should be able to cancel registration (= 1. refund deposit, 2. sub from totalDepositAmount, 3. set registrations to false)
        mapping(uint256 => address) registrationIndex;
        mapping(uint256 => address) attendees;
    }

    mapping(uint256 => Conditions) internal _conditions;
    mapping(uint256 => Registrations) internal _registrations;

    string internal _name;

    constructor() { }

    function initialize(uint256 recordId, bytes calldata data) external virtual {
        Conditions memory conditions = abi.decode(data, (Conditions));

        if (conditions.endDate < block.timestamp) revert InvalidDate();

        _conditions[recordId] = conditions;
    }

    function cancel(uint256 recordId, bytes calldata data) external virtual {
        // Derived contract should handle cancellation and settlement of deposits as transfers depend on the module implementation
        // e.g. for each registration, transfer deposit back to participant

        this._cancel(recordId, data);    
    }

    function _cancel(uint256 recordId, bytes calldata data) public virtual {
        if(_conditions[recordId].endDate < block.timestamp) revert InvalidDate();
        if(_registrations[recordId].totalAttendees > 0) revert AlreadyStarted();
    }

    function register(uint256 recordId, address participant, address sender, bytes calldata data) external payable virtual {
        // Derived contract should check depositFee and handle totalDepositAmount as the deposits depend on the module implementation
        // e.g. if(_conditions[recordId].depositFee != msg.value) revert IncorrectValue();
        // e.g. _registrations[recordId].totalDepositAmount += msg.value;

        this._register(recordId, participant);
    }

    function _register(uint256 recordId, address participant) public payable virtual {
        if(_conditions[recordId].maxParticipants > 0 && _conditions[recordId].maxParticipants == _registrations[recordId].totalRegistrations) revert LimitReached();
        if(_registrations[recordId].registrations[participant]) revert AlreadyRegistered();
        if(_conditions[recordId].endDate < block.timestamp) revert InvalidDate();

        _registrations[recordId].registrations[participant] = true;
        _registrations[recordId].registrationIndex[_registrations[recordId].totalRegistrations] = participant;
        _registrations[recordId].totalRegistrations++;
    }

    function checkin(uint256 recordId, address[] calldata attendees, bytes calldata data) external virtual returns(address[] memory) {
        address[] memory registrations = new address[](attendees.length);

        for (uint256 i = 0; i < attendees.length; i++) {
            if (!_registrations[recordId].registrations[attendees[i]]) {
                continue;
            }

            registrations[i] = attendees[i];
            _registrations[recordId].attendees[_registrations[recordId].totalAttendees] = attendees[i];
            _registrations[recordId].totalAttendees++;
        }

        return registrations;
    }

    function settle(uint256 recordId, bytes calldata data) external virtual {
        // Derived contract should handle settlement and transfering attendance fees as transfer depend on the module implementation
        // e.g. for each attendee, transfer attendance fee to participant

        this._settle(recordId, data);
    }

    function _settle(uint256 recordId, bytes calldata data) public virtual {
        if (_conditions[recordId].endDate > block.timestamp) revert InvalidDate();
        if (_registrations[recordId].totalAttendees == 0) revert NoAttendees();
    }

    // View functions
    // =======================

    function getConditions(uint256 recordId) external view returns (Conditions memory) {
        return _conditions[recordId];
    }

    function getRegistrationInfo(uint256 recordId) external view returns (uint256 totalDepositAmount, uint256 totalRegistrations, uint256 totalAttendees) {
        return (_registrations[recordId].totalDepositAmount, _registrations[recordId].totalRegistrations, _registrations[recordId].totalAttendees);
    }

    function getAttendees(uint256 recordId) external view returns (address[] memory) {
        address[] memory attendees = new address[](_registrations[recordId].totalAttendees);

        for (uint256 i = 0; i < _registrations[recordId].totalAttendees; i++) {
            attendees[i] = _registrations[recordId].attendees[i];
        }

        return attendees;
    }

    function getRegistrations(uint256 recordId) external view returns (address[] memory) {
        address[] memory registrations = new address[](_registrations[recordId].totalRegistrations);

        for (uint256 i = 0; i < _registrations[recordId].totalRegistrations; i++) {
            registrations[i] = _registrations[recordId].registrationIndex[i];
        }

        return registrations;
    }

    function isRegistered(uint256 recordId, address participant) external view returns (bool) {
        return _registrations[recordId].registrations[participant];
    }

    function name() external view returns (string memory) {
        return _name;
    }
}
