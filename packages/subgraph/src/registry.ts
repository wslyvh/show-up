import {
  Canceled as CanceledEvent,
  CheckedIn as CheckedInEvent,
  ConditionModuleWhitelisted as ConditionModuleWhitelistedEvent,
  Created as CreatedEvent,
  Registered as RegisteredEvent,
  Settled as SettledEvent
} from "../generated/Registry/Registry"
import { EventMetaData as EventMetadataTemplate } from '../generated/templates'
import { Bytes, BigInt, log } from "@graphprotocol/graph-ts";
import { Record, ConditionModule, Participant, User } from "../generated/schema"

export function handleCanceled(event: CanceledEvent): void {
  log.warning('ShowUp.Protocol - handleCanceled for {}', [event.params.id.toString()])

  let record = Record.load(bigIntToBytes(event.params.id))

  if (record) {
    record.status = 'Cancelled'
    record.message = event.params.reason.toString()
    record.updatedAt = event.block.timestamp

    record.save()
  }
}

export function handleCheckedIn(event: CheckedInEvent): void {
  log.warning('ShowUp.Protocol - handleCheckedIn for {}', [event.params.id.toString()])
  let record = Record.load(bigIntToBytes(event.params.id))

  if (record) {
    for (let i = 0; i < event.params.attendees.length; i++) {
      const attendee = event.params.attendees[i];
      const participantKey = event.params.id.toString().concat(".").concat(attendee.toHexString());
      let participant = Participant.load(participantKey);
      if (participant) {
        participant.checkedIn = true;
        participant.save();
      }
    }
  }
}

export function handleConditionModuleWhitelisted(event: ConditionModuleWhitelistedEvent): void {
  log.warning('ShowUp.Protocol - handleConditionModuleWhitelisted for {}', [event.params.conditionModule.toHexString()])
  let module = ConditionModule.load(event.params.conditionModule)
  if (module == null) {
    module = new ConditionModule(event.params.conditionModule)
  }

  module.createdAt = event.block.timestamp
  module.createdBy = event.params.sender
  module.whitelisted = event.params.whitelisted
  module.blockNumber = event.block.number
  module.transactionHash = event.transaction.hash

  module.save()
}

export function handleCreated(event: CreatedEvent): void {
  log.warning('ShowUp.Protocol - handleCreated for {}', [event.params.id.toString()])
  let record = new Record(bigIntToBytes(event.params.id))

  record.recordId = event.params.id
  record.createdAt = event.block.timestamp
  record.createdBy = event.params.sender
  record.status = 'Active'
  record.conditionModule = event.params.conditionModule
  record.contentUri = event.params.contentUri.toString()

  if (record.contentUri.startsWith('ipfs://')) {
    const ipfsHash = event.params.contentUri.replace('ipfs://', '')
    record.ipfsHash = ipfsHash
    log.warning('ShowUp.Protocol - create EventMetadataTemplate {}', [ipfsHash])
    EventMetadataTemplate.create("bafkreignteurfbjxn3u6ve6f2dmxdckgvbdoxne345e2cv3azshsm54oym")
  }

  record.blockNumber = event.block.number
  record.transactionHash = event.transaction.hash

  record.save()
}

export function handleRegistered(event: RegisteredEvent): void {
  log.warning('ShowUp.Protocol - handleRegistered for {}', [event.params.id.toString()])
  let record = Record.load(bigIntToBytes(event.params.id))

  if (record) {
    let user = User.load(event.params.participant);
    if (!user) {
      user = new User(event.params.participant);
      user.save();
    }

    const participantKey = event.params.id.toString().concat(".").concat(event.params.participant.toHexString());
    let participant = Participant.load(participantKey);
    if (!participant) {
      participant = new Participant(participantKey);
    }

    participant.createdAt = event.block.timestamp;
    participant.createdBy = event.params.sender;
    participant.address = event.params.participant;
    participant.checkedIn = false;
    participant.record = record.id;
    participant.user = user.id;
    participant.save();

    record.updatedAt = event.block.timestamp
    record.save()
  }
}

export function handleSettled(event: SettledEvent): void {
  log.warning('ShowUp.Protocol - handleSettled for {}', [event.params.id.toString()])
  let record = Record.load(bigIntToBytes(event.params.id))

  if (record) {
    record.status = 'Settled'
    record.updatedAt = event.block.timestamp

    record.save()
  }
}

export function bigIntToBytes(value: BigInt): Bytes {
  if (value.isI32()) {
    return Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromI32(value.toI32())))
  }

  return Bytes.fromByteArray(Bytes.fromBigInt(value))
}
