// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {AbstractConditionModule} from '../conditions/AbstractConditionModule.sol';
import '../Common.sol';

contract TrueMockModule is Ownable, AbstractConditionModule {
  constructor(address owner) AbstractConditionModule(owner) {
    _name = 'TrueMockModule';
  }

  function initialize(uint256 id, bytes calldata data) external virtual override onlyOwner returns (bool) {
    return true;
  }

  function cancel(
    uint256 id,
    address[] calldata registrations,
    bytes calldata data
  ) external virtual override onlyOwner returns (bool) {
    return true;
  }

  function register(
    uint256 id,
    address participant,
    address sender,
    bytes calldata data
  ) external payable virtual override onlyOwner returns (bool) {
    return true;
  }

  function checkin(
    uint256 id,
    address[] calldata attendees,
    bytes calldata data
  ) external virtual override onlyOwner returns (bool) {
    return true;
  }

  function settle(
    uint256 id,
    address[] calldata attendees,
    bytes calldata data
  ) external virtual override onlyOwner returns (bool) {
    return true;
  }
}
