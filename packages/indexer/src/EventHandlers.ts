
import {
  ShowHubContract_CheckedIn_handler,
  ShowHubContract_ConditionModuleWhitelisted_handler,
  ShowHubContract_Created_handler,
  ShowHubContract_Funded_handler,
  ShowHubContract_Registered_handler,
  ShowHubContract_Settled_handler,
  ShowHubContract_Canceled_handlerAsync,
  ShowHubContract_Updated_handlerAsync,
} from "../generated/src/Handlers.gen"

import { GetChainId, GetClient } from "./utils/client"
import { TryFetchIpfsFile } from "./utils/ipfs"
import { GetStatusId, GetVisibilityId, TruncateMiddle } from "./utils/mapping"
import { decodeAbiParameters } from 'viem'

interface ConditionModuleData {
  depositFee: BigInt
  tokenAddress?: string
  recipient?: string
}

const TotalDepositsABI = [{ name: "getTotalDeposits", inputs: [{ name: "id", type: "uint256" }], outputs: [{ name: "", type: "uint256" }], }]
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

  context.ConditionModule.set({
    ...entity,
    whitelisted: event.params.whitelisted,
  })
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
        context.Event.set({
          ...metadata,
          id: ipfsHash,
          visibility: GetVisibilityId(metadata.visibility),
        })
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
      totalFunded: BigInt(0),
    }

    context.Record.set(entity)
  }
})

ShowHubContract_Updated_handlerAsync(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  const eventId = `${chainId}-${event.params.id}`
  context.log.info(`Processing ShowHubContract_Updated # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = await context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  context.Record.set({
    ...entity,
    contentUri: event.params.contentUri,
    limit: BigInt(event.params.limit),
    owner: event.params.owner,
  })
})

ShowHubContract_Canceled_handlerAsync(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  const eventId = `${chainId}-${event.params.id}`
  context.log.info(`Processing ShowHubContract_Canceled # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = await context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  context.Record.set({
    ...entity,
    status: GetStatusId('Cancelled'),
    message: event.params.reason,
  })
})

ShowHubContract_Funded_handler(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  const eventId = `${chainId}-${event.params.id}`
  context.log.info(`Processing ShowHubContract_Funded # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = await context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  const client = GetClient(chainId)
  const funded = await client.readContract({
    address: entity.conditionModule as any,
    abi: TotalDepositsABI,
    functionName: "getTotalDeposits",
    args: [event.params.id],
  }) as string

  context.Record.set({
    ...entity,
    totalFunded: BigInt(funded ?? 0),
  })
})

ShowHubContract_Registered_handler(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  const eventId = `${chainId}-${event.params.id}`
  context.log.info(`Processing ShowHubContract_Registered # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = await context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  let user = await context.User.get(event.params.participant)
  if (user == null) {
    context.log.error(`User not found. Create user ${event.params.participant}`)
    user = {
      id: event.params.participant,
      name: TruncateMiddle(event.params.participant), // TODO: ENS Name
      avatar: null, // TODO: ENS Avatar
    }

    context.User.set(user)
  }
  // TODO: Update User entity with ENS Name and Avatar

  const registration = {
    id: `${eventId}-${event.params.participant}`,
    createdAt: BigInt(event.params.timestamp),
    createdBy: event.params.sender,
    blockNumber: BigInt(event.blockNumber),
    transactionHash: event.transactionHash,

    checkedIn: false,
    record: eventId,
    user: user.id,
  }

  context.log.info(`Create Event Registration ${registration.id}`)
  context.Registration.set(registration)

  context.log.info(`Update Total Registrations ${entity.id}`)
  context.Record.set({
    ...entity,
    totalRegistrations: entity.totalRegistrations + BigInt(1),
    totalFunded: entity.totalFunded + entity.depositFee,
  })
})

ShowHubContract_CheckedIn_handler(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  const eventId = `${chainId}-${event.params.id}`
  context.log.info(`Processing ShowHubContract_CheckedIn # ${eventId} @ Block # ${event.blockNumber}`)

  const entity = await context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  // TODO: Update User entity with ENS Name and Avatar

  for (let i = 0; i < event.params.attendees.length; i++) {
    const attendee = event.params.attendees[i];
    const registration = await context.Registration.get(`${eventId}-${attendee}`)

    if (registration) {
      context.log.info(`Checkin attendee ${attendee}`)
      context.Registration.set({
        ...registration,
        checkedIn: true,
      })
    }
  }

  context.Record.set({
    ...entity,
    totalAttendees: entity.totalAttendees + BigInt(event.params.attendees.length),
  })
})

ShowHubContract_Settled_handler(async ({ event, context }) => {
  const chainId = GetChainId(event.srcAddress) // TODO: Get ChainId from context
  const eventId = `${chainId}-${event.params.id}`
  context.log.info(`Processing ShowHubContract_Settled # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = await context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  context.Record.set({
    ...entity,
    status: GetStatusId('Settled'),
  })
})