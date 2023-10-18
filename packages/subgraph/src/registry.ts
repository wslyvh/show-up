import {
  Canceled as CanceledEvent,
  CheckedIn as CheckedInEvent,
  ConditionModuleWhitelisted as ConditionModuleWhitelistedEvent,
  Created as CreatedEvent,
  Registered as RegisteredEvent,
  Settled as SettledEvent
} from "../generated/Registry/Registry"
import { IConditionModule } from "../generated/Registry/IConditionModule"
import { Event as EventMetadataTemplate } from '../generated/templates'
import { Bytes, BigInt, log, ethereum } from "@graphprotocol/graph-ts";
import { Record, ConditionModule, Participant, User, Condition } from "../generated/schema"

export function handleCanceled(event: CanceledEvent): void {
  log.debug('ShowUp.Protocol - handleCanceled for {}', [event.params.id.toString()])
  let record = Record.load(event.params.id.toString())

  if (record) {
    record.status = 'Cancelled'
    record.message = event.params.reason.toString()
    record.updatedAt = event.block.timestamp

    record.save()
  }
}

export function handleCheckedIn(event: CheckedInEvent): void {
  log.debug('ShowUp.Protocol - handleCheckedIn for {}', [event.params.id.toString()])
  let record = Record.load(event.params.id.toString())

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
  log.debug('ShowUp.Protocol - handleConditionModuleWhitelisted for {}', [event.params.conditionModule.toHexString()])
  let module = ConditionModule.load(event.params.conditionModule)

  if (module == null) {
    module = new ConditionModule(event.params.conditionModule)

    let contract = IConditionModule.bind(event.params.conditionModule)
    if (contract) {
      module.name = contract.name()
    }
  }

  module.createdAt = event.block.timestamp
  module.createdBy = event.params.sender
  module.whitelisted = event.params.whitelisted
  module.blockNumber = event.block.number
  module.transactionHash = event.transaction.hash

  module.save()
}

export function handleCreated(event: CreatedEvent): void {
  log.debug('ShowUp.Protocol - handleCreated for {}', [event.params.id.toString()])
  let record = new Record(event.params.id.toString())

  record.createdAt = event.block.timestamp
  record.createdBy = event.params.sender
  record.status = 'Active'
  record.conditionModule = event.params.conditionModule

  // Load Event Metadata
  record.contentUri = event.params.contentUri.toString()
  if (record.contentUri.startsWith('ipfs://')) {
    const ipfsHash = event.params.contentUri.replace('ipfs://', '')
    record.metadata = ipfsHash
    log.debug('ShowUp.Protocol - create EventMetadataTemplate {}', [ipfsHash])
    EventMetadataTemplate.create(ipfsHash)
  }

  // Add decoded Condition Module Data
  const conditionModuleContract = IConditionModule.bind(event.params.conditionModule)
  if (conditionModuleContract) {
    const moduleName = conditionModuleContract.name()
    log.debug('ShowUp.Protocol - Check moduleName {}', [moduleName])

    if (moduleName == 'BasicEther' || moduleName == 'BasicToken') {
      // address owner; uint256 endDate; uint256 depositFee; uint256 maxParticipants; address tokenAddress;
      const decoded = ethereum.decode('(address,uint256,uint256,uint256,address)', event.params.data)
      if (decoded) {
        const data = decoded.toTuple()
        const owner = data.at(0).toAddress()
        const endDate = data.at(1).toBigInt()
        const depositFee = data.at(2).toBigInt()
        const maxParticipants = data.at(3).toBigInt()
        const tokenAddress = data.at(4).toAddress()

        log.debug('ShowUp.Protocol - decoded conditionModuleData {} | {} | {} | {} | {}', [
          owner.toHexString(),
          endDate.toString(),
          depositFee.toString(),
          maxParticipants.toString(),
          tokenAddress.toHexString()
        ])

        const conditionKey = event.params.id.toString().concat(".").concat(event.params.conditionModule.toHexString())
        let condition = Condition.load(conditionKey)
        if (!condition) {
          condition = new Condition(conditionKey)
        }

        condition.address = event.params.conditionModule
        condition.name = moduleName
        condition.owner = owner
        condition.endDate = endDate
        condition.depositFee = depositFee
        condition.maxParticipants = maxParticipants
        condition.tokenAddress = tokenAddress
        condition.save()

        record.condition = condition.id
      }
    }
  }

  record.blockNumber = event.block.number
  record.transactionHash = event.transaction.hash

  record.save()
}

export function handleRegistered(event: RegisteredEvent): void {
  log.debug('ShowUp.Protocol - handleRegistered for {}', [event.params.id.toString()])
  let record = Record.load(event.params.id.toString())

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
  log.debug('ShowUp.Protocol - handleSettled for {}', [event.params.id.toString()])
  let record = Record.load(event.params.id.toString())

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
