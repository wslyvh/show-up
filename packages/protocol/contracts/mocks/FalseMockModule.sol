// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {AbstractConditionModule} from '../conditions/AbstractConditionModule.sol';
import '../Common.sol';

contract FalseMockModule is Ownable, AbstractConditionModule {
  constructor(address owner) AbstractConditionModule(owner) {
    _name = 'FalseMockModule';
  }

  function initialize(uint256 id, bytes calldata data) external virtual override onlyOwner returns (bool) {
    return false;
  }

  function cancel(
    uint256 id,
    address[] calldata registrations,
    bytes calldata data
  ) external virtual override onlyOwner returns (bool) {
    return false;
  }

  function register(
    uint256 id,
    address participant,
    address sender,
    bytes calldata data
  ) external payable virtual override onlyOwner returns (bool) {
    return false;
  }

  function checkin(
    uint256 id,
    address[] calldata attendees,
    bytes calldata data
  ) external virtual override onlyOwner returns (bool) {
    return false;
  }

  function settle(
    uint256 id,
    address[] calldata attendees,
    bytes calldata data
  ) external virtual override onlyOwner returns (bool) {
    return false;
  }
}
