// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '../Common.sol';

interface IConditionModule {
    function initialize(uint256 recordId, bytes calldata data) external;
    function cancel(uint256 recordId, bytes calldata data) external;
    function register(uint256 recordId, address from, bytes calldata data) external payable;
    function checkin(uint256 recordId, address[] calldata attendees, bytes calldata data) external;
    function settle(uint256 recordId, bytes calldata data) external;
}
