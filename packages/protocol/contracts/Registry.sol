// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {IConditionModule} from './interfaces/IConditionModule.sol';
import {IRegistry} from './interfaces/IRegistry.sol';
import './Common.sol';

contract Registry is Ownable, IRegistry {
  mapping(address => bool) internal _conditionModules;
  mapping(uint256 => Record) internal _records;

  uint256 private _recordCount = 0;

  constructor() Ownable(msg.sender) { }

  // Hub Owner functions
  // =======================

  function whitelistConditionModule(address conditionModule, bool enable) external onlyOwner {
    // TODO: Check if implements IConditionModule interface
    _conditionModules[conditionModule] = enable;

    emit ConditionModuleWhitelisted(conditionModule, enable, msg.sender, block.timestamp);
  }

  // Main Registry functions 
  // =======================

  function create(string calldata contentUri, address conditionModule, bytes calldata conditionModuleData) external {
    verifyValidConditionModule(conditionModule);

    _records[_recordCount].id = _recordCount;
    _records[_recordCount].owner = msg.sender;
    _records[_recordCount].status = Status.Active;
    _records[_recordCount].contentUri = contentUri;
    _records[_recordCount].conditionModule = conditionModule;

    IConditionModule(conditionModule).initialize(_recordCount, conditionModuleData);

    emit Created(_recordCount, contentUri, conditionModule, conditionModuleData, msg.sender, block.timestamp);
    _recordCount++;
  }

  function cancel(uint id, string calldata reason, bytes calldata conditionModuleData) external {
    verifyValidRecord(id);
    verifyValidOwner(id);

    _records[id].status = Status.Cancelled;

    IConditionModule(_records[id].conditionModule).cancel(id, conditionModuleData);

    emit Canceled(id, reason, conditionModuleData, msg.sender, block.timestamp);
  }

  function register(uint id, address participant, bytes calldata conditionModuleData) external payable {
    verifyValidRecord(id);

    IConditionModule(_records[id].conditionModule).register{value:msg.value}(id, participant, msg.sender, conditionModuleData);

    emit Registered(id, participant, conditionModuleData, msg.sender, block.timestamp);
  }

  function checkin(uint256 id, address[] calldata attendees, bytes calldata conditionModuleData) external {
    verifyValidRecord(id);
    verifyValidOwner(id);

    IConditionModule(_records[id].conditionModule).checkin(id, attendees, conditionModuleData);

    emit CheckedIn(id, attendees, conditionModuleData, msg.sender, block.timestamp);
  }

  function settle(uint id, bytes calldata conditionModuleData) external {
    verifyValidRecord(id);

    _records[id].status = Status.Settled; 

    IConditionModule(_records[id].conditionModule).settle(id, conditionModuleData);

    emit Settled(id, conditionModuleData, msg.sender, block.timestamp);
  }

  // View functions
  // =======================

  function getRecord(uint256 id) external view returns (Record memory) {
    return _records[id];
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

  function verifyValidConditionModule(address conditionModule) internal view {
    if (conditionModule == address(0)) revert NotFound();
    if (!_conditionModules[conditionModule]) revert NotWhitelisted();
  }
}
