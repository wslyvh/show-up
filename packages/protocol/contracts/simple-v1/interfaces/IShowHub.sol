// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IShowHub {
  event Created(uint256 indexed id, address sender, uint256 timestamp);
  event Cancelled(uint256 indexed id, string indexed reason, address sender, uint256 timestamp);
  event Registered(uint256 indexed id, address indexed participant, address sender, uint256 timestamp);
  event Settled(uint256 indexed id, address sender, uint256 timestamp);

  function createWithEther(string calldata contentUri, uint256 endDate, uint256 depositFee, uint256 maxParticipants) external;
  function createWithToken(string calldata contentUri, uint256 endDate, uint256 depositFee, uint256 maxParticipants, address tokenAddress) external;
  
  function cancel(uint256 id, string calldata reason) external;
  function register(uint256 id, address participant) external payable;
  function settle(uint256 id, address[] calldata participants) external;
}
