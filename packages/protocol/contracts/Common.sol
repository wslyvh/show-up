// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

error AccessDenied();
error AlreadyRegistered();
error AlreadyStarted();
error InactiveRecord();
error IncorrectValue();
error InvalidAddress();
error InvalidDate();
error LimitReached();
error NoAttendees();
error NotFound();
error NotWhitelisted();

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

  address conditionModule;
}
