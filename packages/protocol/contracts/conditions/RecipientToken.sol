// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {AbstractConditionModule} from './AbstractConditionModule.sol';
import '../Common.sol';

contract RecipientToken is Ownable, AbstractConditionModule {
  struct Conditions {
    address owner;
    uint256 depositFee;
    address tokenAddress;
    address recipient;
  }

  mapping(uint256 => Conditions) internal _conditions;
  mapping(uint256 => uint256) internal _totalDeposits;

  constructor(address owner) AbstractConditionModule(owner) {
    _name = 'RecipientToken';
  }

  function initialize(uint256 id, bytes calldata data) external virtual override onlyOwner returns (bool) {
    Conditions memory conditions = abi.decode(data, (Conditions));

    _conditions[id] = conditions;

    return true;
  }

  function cancel(
    uint256 id,
    address[] calldata registrations,
    bytes calldata data
  ) external virtual override onlyOwner returns (bool) {
    IERC20 token = IERC20(_conditions[id].tokenAddress);

    for (uint256 i = 0; i < registrations.length; i++) {
      require(token.transfer(registrations[i], _conditions[id].depositFee));
    }

    _totalDeposits[id] = 0;

    return true;
  }

  function fund(
    uint256 id,
    address sender,
    bytes calldata data
  ) external payable virtual override onlyOwner returns (bool) {
    if (msg.value > 0) revert IncorrectValue();
    uint256 amount = abi.decode(data, (uint256));
    if (amount == 0) revert IncorrectValue();

    IERC20 token = IERC20(_conditions[id].tokenAddress);
    require(token.transferFrom(sender, address(this), amount));

    _totalDeposits[id] += amount;

    return true;
  }

  function register(
    uint256 id,
    address participant,
    address sender,
    bytes calldata data
  ) external payable virtual override onlyOwner returns (bool) {
    if (msg.value > 0) revert IncorrectValue();

    IERC20 token = IERC20(_conditions[id].tokenAddress);
    require(token.transferFrom(sender, address(this), _conditions[id].depositFee));

    _totalDeposits[id] += _conditions[id].depositFee;

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
    uint256 totalPayouts = 0;
    IERC20 token = IERC20(_conditions[id].tokenAddress);
    for (uint256 i = 0; i < attendees.length; i++) {
      require(token.transfer(attendees[i], _conditions[id].depositFee));
      totalPayouts += _conditions[id].depositFee;
    }

    if (_totalDeposits[id] > totalPayouts) {
      require(token.transfer(_conditions[id].recipient, _totalDeposits[id] - totalPayouts));
    }

    _totalDeposits[id] = 0;

    return true;
  }

  // View functions
  // =======================

  function getConditions(uint256 id) external view returns (Conditions memory) {
    return _conditions[id];
  }

  function getTotalDeposits(uint256 id) external view returns (uint256) {
    return _totalDeposits[id];
  }
}
