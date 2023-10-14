// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../Common.sol';

interface IRegistry {
    // Hub events
    event ConditionModuleWhitelisted(address indexed conditionModule, bool indexed whitelisted, uint256 timestamp);

    // Registry events
    event Created(uint256 indexed id, string indexed contentUri, address sender, uint256 timestamp);
    event Canceled(uint256 indexed id, string indexed reason, address sender, uint256 timestamp);
    event Registered(uint256 indexed id, address sender, uint256 timestamp);
    event CheckedIn(uint256 indexed id, address[] indexed attendees, address sender, uint256 timestamp);    
    event Settled(uint256 indexed id, address sender, uint256 timestamp);

    // Hub functions
    function whitelistConditionModule(address conditionModule, bool whitelist) external;

    // Registry functions
    function create(string calldata contentUri, address conditionModule, bytes calldata conditionModuleData) external;
    function cancel(uint256 id, string calldata reason, bytes calldata conditionModuleData) external;
    function register(uint256 id, bytes calldata conditionModuleData) external payable;
    function checkin(uint256 id, address[] calldata attendees, bytes calldata conditionModuleData) external;
    function settle(uint256 id, bytes calldata conditionModuleData) external;

    // View functions 
    function getRecord(uint256 id) external view returns (Record memory);
    function isConditionModuleWhitelisted(address conditionModule) external view returns (bool);
}
