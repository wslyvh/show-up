// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

error AccessDenied();
error NotFound();
error InactiveRecord();
error IncorrectValue();
error LimitReached();
error InvalidDate();

enum Status {
  Active,
  Cancelled,
  Settled
}

struct Record {
  uint256 id;
  address owner;
  Status status;
  string contentUri;

  uint256 endDate;
  uint256 depositFee;
  uint256 maxParticipants;
  address tokenAddress;

  uint256 totalParticipants;
  mapping(address => bool) participants;
}

struct Participant {
  uint256 id;
  address payable addr;
  bool paid;
}