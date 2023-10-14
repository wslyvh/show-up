// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import 'hardhat/console.sol';

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import {IShowHub} from './interfaces/IShowHub.sol';
import './Constants.sol';

contract ShowHub is Ownable, IShowHub {
  uint256 private _nextProjectId = 0;

  mapping(address => bool) private _registrations;
  mapping(uint256 id => Record) internal _records;

  constructor() Ownable(msg.sender) {
    console.log('[solidity] showhub.constructor %o', msg.sender);
  }

  function createWithEther(string calldata contentUri, uint256 endDate, uint256 depositFee, uint256 maxParticipants) external {
    console.log('[solidity] showhub.createWithEther', msg.sender);
    _create(contentUri, endDate, depositFee, maxParticipants, address(0));
  }

  function createWithToken(string calldata contentUri, uint256 endDate, uint256 depositFee, uint256 maxParticipants, address tokenAddress) external {
    console.log('[solidity] showhub.createWithToken %o', msg.sender);
    _create(contentUri, endDate, depositFee, maxParticipants, tokenAddress);
  }

  function _create(string calldata contentUri, uint256 endDate, uint256 depositFee, uint256 maxParticipants, address tokenAddress) internal {
    console.log('[solidity] showhub.create %o', msg.sender);
    if (endDate < block.timestamp) revert InvalidDate();

    _records[_nextProjectId].id = _nextProjectId;
    _records[_nextProjectId].owner = msg.sender;
    _records[_nextProjectId].status = Status.Active;

    _records[_nextProjectId].contentUri = contentUri;
    _records[_nextProjectId].endDate = endDate;
    _records[_nextProjectId].depositFee = depositFee;
    _records[_nextProjectId].maxParticipants = maxParticipants;
    _records[_nextProjectId].tokenAddress = tokenAddress;

    emit Created(_nextProjectId, msg.sender, block.timestamp);

    _nextProjectId++;
  }

  function cancel(uint256 id, string calldata reason) external {
    console.log('[solidity] showhub.cancel %o %o %o', id, reason, msg.sender);
    verifyValidRecord(id);
    verifyValidOwner(id);
    verifyBeforeEndDate(id);

    _records[id].status = Status.Cancelled;

    // TODO: Settle/disperse any funds to participants

    emit Cancelled(id, reason, msg.sender, block.timestamp);
  }

  function register(uint256 id, address participant) external payable {
    console.log('[solidity] showhub.register %o %o %o', id, participant, msg.sender);
    verifyValidRecord(id);
    verifyBeforeEndDate(id);

    if(_records[id].totalParticipants == _records[id].maxParticipants) revert LimitReached();
  
    // Ether Deposits should have correct msg.value
    if (_records[id].tokenAddress == address(0)) {
      if(_records[id].depositFee != msg.value) revert IncorrectValue();
      
      console.log('[solidity] showhub.register Ether deposit %o', msg.value);
      _records[id].participants[participant] = true;
      _records[id].totalParticipants++;
    }

    // ERC20 Token Deposits should not have a value but transferFrom token
    if (_records[id].tokenAddress != address(0)) {
      if(msg.value > 0) revert IncorrectValue();
      
      console.log('[solidity] showhub.register Token deposit %o', _records[id].depositFee);
      _records[id].participants[participant] = true;
      _records[id].totalParticipants++;

      IERC20 token = IERC20(_records[id].tokenAddress);
      require(token.transferFrom(msg.sender, address(this), _records[id].depositFee));
    }

    emit Registered(id, participant, msg.sender, block.timestamp);
  }

  function settle(uint256 id, address[] calldata participants) external {
    console.log('[solidity] showhub.settle %o %o', id, msg.sender);
    verifyValidRecord(id);
    verifyValidOwner(id);
    verifyAfterEndDate(id);

    _records[id].status = Status.Settled; 

    uint256 totalAttendees = 0;
    for (uint256 i = 0; i < participants.length; i++) {
      if (_records[id].participants[participants[i]]) {
        totalAttendees++;
      }
    }

    uint256 totalDeposited = _records[id].depositFee * _records[id].totalParticipants;
    uint256 attendanceFee = totalDeposited / totalAttendees;

    IERC20 token = IERC20(_records[id].tokenAddress);
    for (uint256 i = 0; i < participants.length; i++) {
      if (!_records[id].participants[participants[i]]) {
        continue;
      }

      // Ether Sends
      if (_records[id].tokenAddress == address(0)) {
        console.log('[solidity] showhub.settle | Send %o Ether to %o', attendanceFee, participants[i]);
        payable(participants[i]).transfer(attendanceFee);
      }

      // ERC20 tokenTransfer
      if (_records[id].tokenAddress != address(0)) {
        console.log('[solidity] showhub.settle | Transfer %o Tokens to %o', attendanceFee, participants[i]);
        require(token.transfer(participants[i], attendanceFee));
      }
    }

    emit Settled(id, msg.sender, block.timestamp);
  }

  function verifyValidRecord(uint256 id) internal view {
    if (_records[id].owner == address(0)) revert NotFound();
    if (_records[id].status != Status.Active) revert InactiveRecord();
  }

  function verifyValidOwner(uint256 id) internal view {
    if (_records[id].owner != msg.sender) revert AccessDenied();
  }

  function verifyBeforeEndDate(uint256 id) internal view {
    if (_records[id].endDate < block.timestamp) revert InvalidDate();
  }

  function verifyAfterEndDate(uint256 id) internal view {
    if (_records[id].endDate > block.timestamp) revert InvalidDate();
  }
}
