// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import 'hardhat/console.sol';

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {IConditionModule} from './interfaces/IConditionModule.sol';
import {IShowHub} from './interfaces/IShowHub.sol';
import './Common.sol';

contract ShowHub is Ownable, IShowHub {
  mapping(address => bool) internal _conditionModules;
  mapping(uint256 => Record) internal _records;

  uint256 private _recordCount = 0;

  constructor() Ownable(msg.sender) {}

  function whitelistConditionModule(address conditionModule, bool enable) external onlyOwner {
    _conditionModules[conditionModule] = enable;

    emit ConditionModuleWhitelisted(conditionModule, enable, msg.sender, block.timestamp);
  }

  // Main Registry functions
  // =======================
  function create(
    string calldata contentUri,
    uint256 endDate,
    uint256 limit,
    address conditionModule,
    bytes calldata conditionModuleData
  ) external {
    verifyValidConditionModule(conditionModule);

    _records[_recordCount].id = _recordCount;
    _records[_recordCount].endDate = endDate;
    _records[_recordCount].limit = limit;
    _records[_recordCount].owner = msg.sender;
    _records[_recordCount].status = Status.Active;
    _records[_recordCount].contentUri = contentUri;
    _records[_recordCount].conditionModule = conditionModule;

    bool result = IConditionModule(conditionModule).initialize(_recordCount, conditionModuleData);
    if (!result) revert UnexpectedConditionModuleError();

    _recordCount++;

    emit Created(_recordCount, contentUri, conditionModule, conditionModuleData, msg.sender, block.timestamp);
  }

  function updateContentUri(uint256 id, string calldata contentUri) external {
    verifyValidRecord(id);
    verifyValidOwner(id);
    verifyDateNotPassed(id);

    _records[id].contentUri = contentUri;

    emit Updated(id, msg.sender, block.timestamp);
  }

  function updateLimit(uint256 id, uint256 limit) external {
    verifyValidRecord(id);
    verifyValidOwner(id);
    verifyDateNotPassed(id);

    _records[id].limit = limit;

    emit Updated(id, msg.sender, block.timestamp);
  }

  function updateOwner(uint256 id, address owner) external {
    verifyValidRecord(id);
    verifyValidOwner(id);
    verifyDateNotPassed(id);

    _records[id].owner = owner;

    emit Updated(id, msg.sender, block.timestamp);
  }

  function cancel(uint id, string calldata reason, bytes calldata conditionModuleData) external {
    verifyValidRecord(id);
    verifyValidOwner(id);
    verifyDateNotPassed(id);
    verifyHasNoAttendees(id);

    address[] memory registrations = new address[](_records[id].totalRegistrations);
    for (uint256 i = 0; i < _records[id].totalRegistrations; i++) {
      registrations[i] = _records[id].registrationIndex[i];
    }

    bool result = IConditionModule(_records[id].conditionModule).cancel(id, registrations, conditionModuleData);
    if (!result) revert UnexpectedConditionModuleError();

    _records[id].status = Status.Cancelled;

    emit Canceled(id, reason, conditionModuleData, msg.sender, block.timestamp);
  }

  function fund(uint id, bytes calldata conditionModuleData) external payable {
    verifyValidRecord(id);
    verifyDateNotPassed(id);

    bool result = IConditionModule(_records[id].conditionModule).fund(id, msg.sender, conditionModuleData);
    if (!result) revert UnexpectedConditionModuleError();

    emit Funded(id, conditionModuleData, msg.sender, block.timestamp);
  }

  function register(uint id, address participant, bytes calldata conditionModuleData) external payable {
    verifyValidRecord(id);
    verifyDateNotPassed(id);
    verifyLimit(id);
    verifyNotRegistered(id, participant);

    bool result = IConditionModule(_records[id].conditionModule).register{value: msg.value}(
      id,
      participant,
      msg.sender,
      conditionModuleData
    );
    if (!result) revert UnexpectedConditionModuleError();

    _records[id].registrations[participant].registered = true;
    _records[id].registrationIndex[_records[id].totalRegistrations] = participant;
    _records[id].totalRegistrations++;

    emit Registered(id, participant, conditionModuleData, msg.sender, block.timestamp);
  }

  function checkin(uint256 id, address[] calldata attendees, bytes calldata conditionModuleData) external {
    verifyValidRecord(id);
    verifyValidOwner(id);
    verifyDateNotPassed(id);

    uint checkinCount = 0;
    address[] memory validAttendees = new address[](attendees.length);
    for (uint256 i = 0; i < attendees.length; i++) {
      if (!_records[id].registrations[attendees[i]].registered) {
        continue;
      }
      if (_records[id].registrations[attendees[i]].attended) {
        continue;
      }

      _records[id].registrations[attendees[i]].attended = true;
      _records[id].totalAttendees++;
      validAttendees[checkinCount] = attendees[i];
      checkinCount++;
    }

    address[] memory checkins = new address[](checkinCount);
    for (uint256 i = 0; i < attendees.length; i++) {
      if (validAttendees[i] == address(0)) {
        continue;
      }

      checkins[i] = validAttendees[i];
    }

    bool result = IConditionModule(_records[id].conditionModule).checkin(id, checkins, conditionModuleData);
    if (!result) revert UnexpectedConditionModuleError();

    emit CheckedIn(id, checkins, conditionModuleData, msg.sender, block.timestamp);
  }

  function settle(uint id, bytes calldata conditionModuleData) external {
    verifyValidRecord(id);
    verifyValidOwner(id);
    verifyDateHasPassed(id);
    verifyHasAttendees(id);

    address[] memory attendees = this.getAttendees(id);
    bool result = IConditionModule(_records[id].conditionModule).settle(id, attendees, conditionModuleData);
    if (!result) revert UnexpectedConditionModuleError();

    _records[id].status = Status.Settled;

    emit Settled(id, conditionModuleData, msg.sender, block.timestamp);
  }

  // View functions
  // =======================

  function getRecord(
    uint256 id
  )
    external
    view
    returns (
      uint256 endDate,
      uint256 limit,
      address owner,
      Status status,
      string memory contentUri,
      address conditionModule
    )
  {
    return (
      _records[id].endDate,
      _records[id].limit,
      _records[id].owner,
      _records[id].status,
      _records[id].contentUri,
      _records[id].conditionModule
    );
  }

  function getRegistrations(uint256 id) external view returns (address[] memory) {
    address[] memory registrations = new address[](_records[id].totalRegistrations);
    for (uint256 i = 0; i < _records[id].totalRegistrations; i++) {
      registrations[i] = _records[id].registrationIndex[i];
    }

    return registrations;
  }

  function getAttendees(uint256 id) external view returns (address[] memory) {
    uint totalAttendees = 0;
    address[] memory attendees = new address[](_records[id].totalAttendees);
    for (uint256 i = 0; i < _records[id].totalRegistrations; i++) {
      if (!_records[id].registrations[_records[id].registrationIndex[i]].attended) {
        continue;
      }

      attendees[totalAttendees] = _records[id].registrationIndex[i];
      totalAttendees++;
    }

    return attendees;
  }

  function isRegistered(uint256 id, address participant) external view returns (bool) {
    return _records[id].registrations[participant].registered;
  }

  function isAttending(uint256 id, address participant) external view returns (bool) {
    return _records[id].registrations[participant].attended;
  }

  function isConditionModuleWhitelisted(address conditionModule) external view returns (bool) {
    return _conditionModules[conditionModule];
  }

  // Internal Verifications
  // =======================

  function verifyValidRecord(uint256 id) internal view {
    if (_records[id].owner == address(0)) revert NotFound();
    if (_records[id].status != Status.Active) revert InactiveRecord();
  }

  function verifyValidOwner(uint256 id) internal view {
    if (_records[id].owner != msg.sender) revert AccessDenied();
  }

  function verifyDateNotPassed(uint256 id) internal view {
    if (_records[id].endDate < block.timestamp) revert InvalidDate();
  }

  function verifyDateHasPassed(uint256 id) internal view {
    if (_records[id].endDate > block.timestamp) revert InvalidDate();
  }

  function verifyLimit(uint256 id) internal view {
    if (_records[id].limit > 0 && _records[id].limit == _records[id].totalRegistrations) revert LimitReached();
  }

  function verifyNotRegistered(uint256 id, address participant) internal view {
    if (_records[id].registrations[participant].registered) revert AlreadyRegistered();
  }

  function verifyHasNoAttendees(uint256 id) internal view {
    if (_records[id].totalAttendees > 0) revert AlreadyStarted();
  }

  function verifyHasAttendees(uint256 id) internal view {
    if (_records[id].totalAttendees == 0) revert NoAttendees();
  }

  function verifyValidConditionModule(address conditionModule) internal view {
    if (conditionModule == address(0)) revert NotFound();
    if (!_conditionModules[conditionModule]) revert NotWhitelisted();
  }
}
