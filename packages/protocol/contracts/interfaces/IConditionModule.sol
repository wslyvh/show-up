// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '../Common.sol';

interface IConditionModule {
  function initialize(uint256 id, bytes calldata data) external returns (bool);

  function cancel(uint256 id, address[] calldata registrations, bytes calldata data) external returns (bool);

  function register(
    uint256 id,
    address participant,
    address sender,
    bytes calldata data
  ) external payable returns (bool);

  function checkin(uint256 id, address[] calldata attendees, bytes calldata data) external returns (bool);

  function settle(uint256 id, address[] calldata attendees, bytes calldata data) external returns (bool);

  function name() external view returns (string memory);
}
