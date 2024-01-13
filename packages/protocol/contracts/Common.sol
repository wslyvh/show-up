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
error UnexpectedConditionModuleError();

enum Status {
  Active,
  Cancelled,
  Settled
}

struct Record {
  uint256 id;
  uint256 endDate;
  uint256 limit;
  address owner;
  Status status;
  string contentUri;
  address conditionModule;
  //
  uint256 totalRegistrations;
  uint256 totalAttendees;
  mapping(uint256 => address) registrationIndex;
  mapping(address => Registrations) registrations;
}

struct Registrations {
  bool registered;
  bool attended;
}
