// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import '../Common.sol';

contract RecipientEther is Ownable {
  struct Conditions {
    address owner;
    uint256 depositFee;
    address recipient;
  }

  mapping(uint256 => Conditions) internal _conditions;
  mapping(uint256 => uint256) internal _totalDeposits;
  mapping(uint256 => uint256) internal _totalFunded;

  string internal _name;

  constructor(address owner) Ownable(owner) {
    _name = 'RecipientEther';
  }

  function initialize(uint256 id, bytes calldata data) external virtual onlyOwner returns (bool) {
    Conditions memory conditions = abi.decode(data, (Conditions));

    _conditions[id] = conditions;

    return true;
  }

  function cancel(
    uint256 id,
    address[] calldata registrations,
    bytes calldata data
  ) external virtual onlyOwner returns (bool) {
    for (uint256 i = 0; i < registrations.length; i++) {
      payable(registrations[i]).transfer(_conditions[id].depositFee);
    }

    _totalDeposits[id] = 0;

    return true;
  }

  function fund(uint256 id, address sender, bytes calldata data) external payable virtual onlyOwner returns (bool) {
    if (msg.value == 0) revert IncorrectValue();

    _totalFunded[id] += msg.value;

    return true;
  }

  function register(
    uint256 id,
    address participant,
    address sender,
    bytes calldata data
  ) external payable virtual onlyOwner returns (bool) {
    if (_conditions[id].depositFee != msg.value) revert IncorrectValue();

    _totalDeposits[id] += _conditions[id].depositFee;

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
    (bool success, uint256 fundFee) = Math.tryDiv(_totalFunded[id], attendees.length);
    if (!success) revert IncorrectValue();

    uint256 totalPayouts = 0;
    uint256 settlementFee = _conditions[id].depositFee + fundFee;
    for (uint256 i = 0; i < attendees.length; i++) {
      payable(attendees[i]).transfer(settlementFee);
      totalPayouts += _conditions[id].depositFee;
    }

    if (_totalDeposits[id] > totalPayouts) {
      uint256 recipientFee = _totalDeposits[id] - totalPayouts;
      payable(_conditions[id].recipient).transfer(recipientFee);
    }

    _totalDeposits[id] = 0;
    _totalFunded[id] = 0;

    return true;
  }

  // View functions
  // =======================

  function name() external view returns (string memory) {
    return _name;
  }

  function getConditions(uint256 id) external view returns (Conditions memory) {
    return _conditions[id];
  }

  function getTotalDeposits(uint256 id) external view returns (uint256) {
    return _totalDeposits[id] + _totalFunded[id];
  }
}