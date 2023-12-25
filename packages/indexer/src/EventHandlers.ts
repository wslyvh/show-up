
import {
  ShowHubContract_Canceled_loader,
  ShowHubContract_Canceled_handler,
  ShowHubContract_CheckedIn_loader,
  ShowHubContract_CheckedIn_handler,
  ShowHubContract_ConditionModuleWhitelisted_loader,
  ShowHubContract_ConditionModuleWhitelisted_handler,
  ShowHubContract_Created_loader,
  ShowHubContract_Created_handler,
  ShowHubContract_Funded_loader,
  ShowHubContract_Funded_handler,
  ShowHubContract_OwnershipTransferred_loader,
  ShowHubContract_OwnershipTransferred_handler,
  ShowHubContract_Registered_loader,
  ShowHubContract_Registered_handler,
  ShowHubContract_Settled_loader,
  ShowHubContract_Settled_handler,
  ShowHubContract_Updated_loader,
  ShowHubContract_Updated_handler,
  ShowHubContract_Canceled_handlerAsync,
  ShowHubContract_Updated_handlerAsync,
} from "../generated/src/Handlers.gen"

import { ConditionModuleEntity, RecordEntity, conditionModuleEntity } from "../generated/src/Types.gen"
import { GetChainId, GetClient } from "./utils/client"
import { TryFetchIpfsFile } from "./utils/ipfs"
import { GetStatusId, TruncateMiddle } from "./utils/mapping"
import { decodeAbiParameters, parseAbiParameters } from 'viem'

interface ConditionModuleData {
  depositFee: BigInt
  tokenAddress?: string
  recipient?: string
}

const RecipientEtherDataParams = [{ name: "depositFee", type: "uint256" }, { name: "recipient", type: "address" }]
const RecipientTokenDataParams = [{ name: "depositFee", type: "uint256" }, { name: "tokenAddress", type: "address" }, { name: "recipient", type: "address" }]
const SplitEtherDataParams = [{ name: "depositFee", type: "uint256" }]
const SplitTokenDataParams = [{ name: "depositFee", type: "uint256" }, { name: "tokenAddress", type: "address" }]

ShowHubContract_ConditionModuleWhitelisted_handler(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  context.log.info(`Processing ShowHubContract_ConditionModuleWhitelisted @ chain ${chainId} | Block # ${event.blockNumber}`)

  let entity = await context.ConditionModule.get(event.params.conditionModule)
  if (entity == null) {
    entity = {
      id: event.params.conditionModule,
      chainId: chainId,
      createdAt: BigInt(event.params.timestamp),
      createdBy: event.params.sender,
      blockNumber: BigInt(event.blockNumber),
      transactionHash: event.transactionHash,

      name: event.params.name,
      whitelisted: event.params.whitelisted,
    }
  }

  entity = {
    ...entity,
    whitelisted: event.params.whitelisted,
  }

  context.ConditionModule.set(entity)
})

ShowHubContract_Created_handler(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  const eventId = `${chainId}-${event.params.id}`
  context.log.info(`Processing ShowHubContract_Created # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = await context.Record.get(eventId)
  if (entity == null) {
    // Process Event metadata
    let metadataId = null;
    const contentUri = event.params.contentUri
    context.log.info(`Process ContentUri ${contentUri}`)

    if (contentUri.startsWith('ipfs://')) {
      const ipfsHash = event.params.contentUri.replace('ipfs://', '')
      context.log.info(`Fetch metadata from IPFS ${ipfsHash}`)

      const metadata = await TryFetchIpfsFile(ipfsHash) as any
      if (metadata) {
        context.log.info(`Save Event metadata`)
        metadataId = ipfsHash
        context.Event.set({ ...metadata, id: ipfsHash })
      }
    }

    // Process Condition Module data
    let data: ConditionModuleData | null = null
    const conditionModule = await context.ConditionModule.get(event.params.conditionModule)
    context.log.info(`Process ConditionModule data ${event.params.conditionModule} | ${conditionModule?.name}`)

    if (conditionModule?.name == 'RecipientEther') {
      const value = decodeAbiParameters(RecipientEtherDataParams, event.params.data as any) as any[]
      data = {
        depositFee: value[0],
        recipient: value[1],
      }
    }

    if (conditionModule?.name == 'RecipientToken') {
      const value = decodeAbiParameters(RecipientTokenDataParams, event.params.data as any) as any[]
      data = {
        depositFee: value[0],
        tokenAddress: value[1],
        recipient: value[2],
      }
    }

    if (conditionModule?.name == 'SplitEther') {
      const value = decodeAbiParameters(SplitEtherDataParams, event.params.data as any) as any[]
      data = {
        depositFee: value[0],
      }
    }

    if (conditionModule?.name == 'SplitToken') {
      const value = decodeAbiParameters(SplitTokenDataParams, event.params.data as any) as any[]
      data = {
        depositFee: value[0],
        tokenAddress: value[1],
      }
    }

    entity = {
      id: eventId,
      chainId: chainId,
      createdAt: BigInt(event.params.timestamp),
      createdBy: event.params.sender,
      blockNumber: BigInt(event.blockNumber),
      transactionHash: event.transactionHash,

      endDate: BigInt(event.params.endDate),
      limit: BigInt(event.params.limit),
      owner: event.params.sender,
      status: GetStatusId('Active'),
      message: null,

      contentUri: event.params.contentUri,
      metadata: metadataId ?? null,

      conditionModule: event.params.conditionModule,
      depositFee: BigInt(data?.depositFee?.toString() ?? 0),
      tokenAddress: data?.tokenAddress ?? null,
      recipient: data?.recipient ?? null,

      totalRegistrations: BigInt(0),
      totalAttendees: BigInt(0),
    }

    context.Record.set(entity)
  }
})

ShowHubContract_Updated_handlerAsync(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  context.log.info(`[info] Processing ShowHubContract_Updated @ chain ${chainId} | Block # ${event.blockNumber}`)

  let entity = await context.Record.get(event.params.id.toString())
  if (entity == null) {
    context.log.error(`[error] Record ${event.params.id.toString()} not found`)
    return
  }

  entity = {
    ...entity,
    contentUri: event.params.contentUri,
    limit: BigInt(event.params.limit),
    owner: event.params.owner,
  }

  context.Record.set(entity)
})

ShowHubContract_Canceled_handlerAsync(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  context.log.info(`[info] Processing ShowHubContract_Canceled @ chain ${chainId} | Block # ${event.blockNumber}`)

  let entity = await context.Record.get(event.params.id.toString())
  if (entity == null) {
    context.log.error(`[error] Record ${event.params.id.toString()} not found`)
    return
  }

  entity = {
    ...entity,
    status: GetStatusId('Cancelled'),
    message: event.params.reason,
  }

  context.Record.set(entity)
})

ShowHubContract_Funded_handler(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  context.log.info(`[info] Processing ShowHubContract_Funded @ chain ${chainId} | Block # ${event.blockNumber}`)

  let entity = await context.Record.get(event.params.id.toString())
  if (entity == null) {
    context.log.error(`[error] Record ${event.params.id.toString()} not found`)
    return
  }

  // TODO: Decode conditionModuleData
  entity = {
    ...entity,
  }

  context.Record.set(entity)
})

ShowHubContract_Registered_handler(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  context.log.info(`[info] Processing ShowHubContract_Registered @ chain ${chainId} | Block # ${event.blockNumber}`)

  let entity = await context.Record.get(event.params.id.toString())
  if (entity == null) {
    context.log.error(`[error] Record ${event.params.id.toString()} not found`)
    return
  }

  let user = await context.User.get(event.params.participant)
  if (user == null) {
    user = {
      id: event.params.id.toString(),
      address: event.params.participant,
      name: TruncateMiddle(event.params.participant), // TODO: ENS Name
      avatar: null, // TODO: ENS Avatar
    }

    context.User.set(user)
  }

  // TODO: Event-User relationship
  entity = {
    ...entity,
    totalRegistrations: entity.totalRegistrations + BigInt(1),
  }

  context.Record.set(entity)
})

ShowHubContract_CheckedIn_handler(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  context.log.info(`[info] Processing ShowHubContract_CheckedIn @ chain ${chainId} | Block # ${event.blockNumber}`)

  let entity = await context.Record.get(event.params.id.toString())
  if (entity == null) {
    context.log.error(`[error] Record ${event.params.id.toString()} not found`)
    return
  }

  // TODO: Event-User relationship
  entity = {
    ...entity,
    totalAttendees: entity.totalAttendees + BigInt(event.params.attendees.length),
  }

  context.Record.set(entity)
})

ShowHubContract_Settled_handler(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  context.log.info(`[info] Processing ShowHubContract_Settled @ chain ${chainId} | Block # ${event.blockNumber}`)

  let entity = await context.Record.get(event.params.id.toString())
  if (entity == null) {
    context.log.error(`[error] Record ${event.params.id.toString()} not found`)
    return
  }

  entity = {
    ...entity,
    status: GetStatusId('Settled'),
  }

  context.Record.set(entity)
})