import {
  Canceled as CanceledEvent,
  CheckedIn as CheckedInEvent,
  ConditionModuleWhitelisted as ConditionModuleWhitelistedEvent,
  Created as CreatedEvent,
  Registered as RegisteredEvent,
  Settled as SettledEvent
} from "../generated/Registry/Registry"
import { Bytes, BigInt, log } from "@graphprotocol/graph-ts";
import { Record, ConditionModule } from "../generated/schema"

export function handleCanceled(event: CanceledEvent): void {
  log.warning('handleCanceled', [event.params.id.toHexString()])
  let entity = Record.load(bigIntToBytes(event.params.id))

  if (entity) {
    entity.status = 'Canceled'
    entity.message = event.params.reason.toHexString()
    entity.updatedAt = event.block.timestamp

    entity.save()
  }
}

export function handleCheckedIn(event: CheckedInEvent): void {
  log.warning('handleCheckedIn', [event.params.id.toHexString()])
  let entity = Record.load(bigIntToBytes(event.params.id))

  if (entity) {
    entity.updatedAt = event.block.timestamp

    entity.save()
  }
}

export function handleConditionModuleWhitelisted(event: ConditionModuleWhitelistedEvent): void {
  log.warning('handleConditionModuleWhitelisted', [event.params.conditionModule.toHexString()])
  let entity = ConditionModule.load(event.params.conditionModule)
  if (entity == null) {
    entity = new ConditionModule(event.params.conditionModule)
  }

  entity.createdAt = event.block.timestamp
  entity.createdBy = event.params.sender

  entity.whitelisted = event.params.whitelisted

  entity.blockNumber = event.block.number
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreated(event: CreatedEvent): void {
  log.warning('handleCreated', [event.params.id.toHexString()])
  let entity = new Record(bigIntToBytes(event.params.id))

  entity.recordId = event.params.id
  entity.createdAt = event.block.timestamp
  entity.createdBy = event.params.sender

  entity.conditionModule = event.params.conditionModule
  entity.status = 'Active'
  entity.contentUri = event.params.contentUri.toHexString()

  entity.blockNumber = event.block.number
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRegistered(event: RegisteredEvent): void {
  log.warning('handleRegistered', [event.params.id.toHexString()])
  let entity = Record.load(bigIntToBytes(event.params.id))

  if (entity) {
    entity.updatedAt = event.block.timestamp

    entity.save()
  }
}

export function handleSettled(event: SettledEvent): void {
  log.warning('handleSettled', [event.params.id.toHexString()])
  let entity = Record.load(bigIntToBytes(event.params.id))

  if (entity) {
    entity.status = 'Settled'
    entity.updatedAt = event.block.timestamp

    entity.save()
  }
}

export function bigIntToBytes(value: BigInt): Bytes {
  if (value.isI32()) {
    return Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromI32(value.toI32())))
  }

  return Bytes.fromByteArray(Bytes.fromBigInt(value))
}
