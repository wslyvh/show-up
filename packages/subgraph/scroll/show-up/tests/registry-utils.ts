import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  Canceled,
  CheckedIn,
  ConditionModuleWhitelisted,
  Created,
  OwnershipTransferred,
  Registered,
  Settled
} from "../generated/Registry/Registry"

export function createCanceledEvent(
  id: BigInt,
  reason: string,
  data: Bytes,
  sender: Address,
  timestamp: BigInt
): Canceled {
  let canceledEvent = changetype<Canceled>(newMockEvent())

  canceledEvent.parameters = new Array()

  canceledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  canceledEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )
  canceledEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )
  canceledEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  canceledEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return canceledEvent
}

export function createCheckedInEvent(
  id: BigInt,
  attendees: Array<Address>,
  data: Bytes,
  sender: Address,
  timestamp: BigInt
): CheckedIn {
  let checkedInEvent = changetype<CheckedIn>(newMockEvent())

  checkedInEvent.parameters = new Array()

  checkedInEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  checkedInEvent.parameters.push(
    new ethereum.EventParam(
      "attendees",
      ethereum.Value.fromAddressArray(attendees)
    )
  )
  checkedInEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )
  checkedInEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  checkedInEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return checkedInEvent
}

export function createConditionModuleWhitelistedEvent(
  conditionModule: Address,
  whitelisted: boolean,
  sender: Address,
  timestamp: BigInt
): ConditionModuleWhitelisted {
  let conditionModuleWhitelistedEvent = changetype<ConditionModuleWhitelisted>(
    newMockEvent()
  )

  conditionModuleWhitelistedEvent.parameters = new Array()

  conditionModuleWhitelistedEvent.parameters.push(
    new ethereum.EventParam(
      "conditionModule",
      ethereum.Value.fromAddress(conditionModule)
    )
  )
  conditionModuleWhitelistedEvent.parameters.push(
    new ethereum.EventParam(
      "whitelisted",
      ethereum.Value.fromBoolean(whitelisted)
    )
  )
  conditionModuleWhitelistedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  conditionModuleWhitelistedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return conditionModuleWhitelistedEvent
}

export function createCreatedEvent(
  id: BigInt,
  contentUri: string,
  conditionModule: Address,
  data: Bytes,
  sender: Address,
  timestamp: BigInt
): Created {
  let createdEvent = changetype<Created>(newMockEvent())

  createdEvent.parameters = new Array()

  createdEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  createdEvent.parameters.push(
    new ethereum.EventParam("contentUri", ethereum.Value.fromString(contentUri))
  )
  createdEvent.parameters.push(
    new ethereum.EventParam(
      "conditionModule",
      ethereum.Value.fromAddress(conditionModule)
    )
  )
  createdEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )
  createdEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  createdEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return createdEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRegisteredEvent(
  id: BigInt,
  participant: Address,
  data: Bytes,
  sender: Address,
  timestamp: BigInt
): Registered {
  let registeredEvent = changetype<Registered>(newMockEvent())

  registeredEvent.parameters = new Array()

  registeredEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  registeredEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  registeredEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )
  registeredEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  registeredEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return registeredEvent
}

export function createSettledEvent(
  id: BigInt,
  data: Bytes,
  sender: Address,
  timestamp: BigInt
): Settled {
  let settledEvent = changetype<Settled>(newMockEvent())

  settledEvent.parameters = new Array()

  settledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  settledEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )
  settledEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  settledEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return settledEvent
}
