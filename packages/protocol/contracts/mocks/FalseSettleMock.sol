// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import '../Common.sol';

contract FalseSettleMock is Ownable {
  constructor(address owner) Ownable(owner) {}

  function initialize(uint256 id, bytes calldata data) external virtual onlyOwner returns (bool) {
    return true;
  }

  function cancel(
    uint256 id,
    address owner,
    address[] calldata registrations,
    bytes calldata data
  ) external virtual onlyOwner returns (bool) {
    return true;
  }

  function fund(uint256 id, address sender, bytes calldata data) external payable virtual onlyOwner returns (bool) {
    return true;
  }

  function register(
    uint256 id,
    address participant,
    address sender,
    bytes calldata data
  ) external payable virtual onlyOwner returns (bool) {
    return true;
  }

  function checkin(
    uint256 id,
    address[] calldata attendees,
    bytes calldata data
  ) external virtual onlyOwner returns (bool) {
    return true;
  }

  function settle(
    uint256 id,
    address[] calldata attendees,
    bytes calldata data
  ) external virtual onlyOwner returns (bool) {
    return false;
  }

  function name() external view returns (string memory) {
    return 'FalseSettleMock';
  }
}
