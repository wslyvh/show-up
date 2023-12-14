// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {IConditionModule} from '../interfaces/IConditionModule.sol';
import '../Common.sol';

contract AbstractConditionModule is Ownable, IConditionModule {
  string internal _name;

  constructor(address owner) Ownable(owner) {}

  function initialize(uint256 id, bytes calldata data) external virtual onlyOwner returns (bool) {
    revert('not implemented');
  }

  function cancel(
    uint256 id,
    address[] calldata registrations,
    bytes calldata data
  ) external virtual onlyOwner returns (bool) {
    revert('not implemented');
  }

  function fund(uint256 id, address sender, bytes calldata data) external payable virtual onlyOwner returns (bool) {
    revert('not implemented');
  }

  function register(
    uint256 id,
    address participant,
    address sender,
    bytes calldata data
  ) external payable virtual onlyOwner returns (bool) {
    revert('not implemented');
  }

  function checkin(
    uint256 id,
    address[] calldata attendees,
    bytes calldata data
  ) external virtual onlyOwner returns (bool) {
    revert('not implemented');
  }

  function settle(
    uint256 id,
    address[] calldata attendees,
    bytes calldata data
  ) external virtual onlyOwner returns (bool) {
    revert('not implemented');
  }

  // View functions
  // =======================
  function name() external view returns (string memory) {
    return _name;
  }
}
