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
import { conditionModuleDataEntity } from "./src/Types.gen"

import { GetClient, GetEnsProfile } from "./utils/client"
import { TryFetchIpfsFile } from "./utils/ipfs"
import { GetStatusId, GetVisibilityId, Slugify } from "./utils/mapping"
import { decodeAbiParameters } from 'viem'
import dayjs from 'dayjs'

const Erc20ABI = [
  { name: "decimals", type: "function", inputs: [], outputs: [{ name: "", type: "uint8" }] },
  { name: "symbol", type: "function", inputs: [], outputs: [{ name: "", type: "string" }] },
  { name: "name", type: "function", inputs: [], outputs: [{ name: "", type: "string" }] },
]
const TotalFundedABI = [{ name: 'getTotalFunded', type: 'function', inputs: [{ name: 'id', type: 'uint256' }], outputs: [{ name: '', type: 'uint256' }] }]
const RecipientEtherDataParams = [{ name: "depositFee", type: "uint256" }, { name: "recipient", type: "address" }]
const RecipientTokenDataParams = [{ name: "depositFee", type: "uint256" }, { name: "tokenAddress", type: "address" }, { name: "recipient", type: "address" }]
const SplitEtherDataParams = [{ name: "depositFee", type: "uint256" }]
const SplitTokenDataParams = [{ name: "depositFee", type: "uint256" }, { name: "tokenAddress", type: "address" }]

ShowHubContract_ConditionModuleWhitelisted_handler(({ event, context }) => {
  const chainId = event.chainId
  const moduleId = `${chainId}-${event.params.conditionModule}`
  context.log.debug(`Processing ShowHubContract_ConditionModuleWhitelisted @ chain ${chainId} | Block # ${event.blockNumber}`)

  let module = context.ConditionModule.get(moduleId)
  if (module == null) {
    module = {
      id: moduleId,
      address: event.params.conditionModule,
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
    ...module,
    whitelisted: event.params.whitelisted,
  })
})

ShowHubContract_Created_handler(async ({ event, context }) => {
  const chainId = event.chainId
  const eventId = `${chainId}-${event.params.id}`
  const moduleId = `${chainId}-${event.params.conditionModule}`
  const dataId = `${chainId}-${event.params.id}-${event.params.conditionModule}`
  context.log.debug(`Processing ShowHubContract_Created # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = await context.Record.get(eventId)
  if (entity == null) {
    // Process Event metadata
    let metadataId = null
    let slug = eventId
    const contentUri = event.params.contentUri

    if (contentUri.startsWith('ipfs://')) {
      const ipfsHash = event.params.contentUri.replace('ipfs://', '')
      context.log.debug(`Fetch metadata from IPFS ${ipfsHash}`)

      const metadata = await TryFetchIpfsFile(ipfsHash) as any
      if (metadata) {
        metadataId = ipfsHash
        slug = `${Slugify(metadata.title)}_${event.params.id}`

        context.Event.set({
          ...metadata,
          id: ipfsHash,
          start: BigInt(typeof metadata.start === 'string' ? dayjs(metadata.start).unix() : metadata.start),
          end: BigInt(typeof metadata.end === 'string' ? dayjs(metadata.end).unix() : metadata.end),
          visibility: GetVisibilityId(metadata.visibility),
        })
      }
    }

    // Process Condition Module data
    let data: conditionModuleDataEntity = {
      id: dataId,
      conditionModule: moduleId,
      depositFee: BigInt(0),

      recipient: null,
      tokenAddress: null,
      tokenSymbol: null,
      tokenName: null,
      tokenDecimals: null
    }

    const conditionModule = await context.ConditionModule.get(moduleId)
    if (!conditionModule) {
      context.log.warn(`ConditionModule ${moduleId} not found`)
    }

    context.log.debug(`Process ConditionModule data ${moduleId} | ${conditionModule?.name}`)
    if (conditionModule?.name == 'RecipientEther') {
      const value = decodeAbiParameters(RecipientEtherDataParams, event.params.data as any) as any[]
      data = {
        ...data,
        depositFee: BigInt(value[0]),
        recipient: value[1],
      }
    }

    if (conditionModule?.name == 'RecipientToken') {
      const value = decodeAbiParameters(RecipientTokenDataParams, event.params.data as any) as any[]
      data = {
        ...data,
        depositFee: BigInt(value[0]),
        tokenAddress: value[1],
        recipient: value[2],
      }
    }

    if (conditionModule?.name == 'SplitEther') {
      const value = decodeAbiParameters(SplitEtherDataParams, event.params.data as any) as any[]
      data = {
        ...data,
        depositFee: BigInt(value[0]),
      }
    }

    if (conditionModule?.name == 'SplitToken') {
      const value = decodeAbiParameters(SplitTokenDataParams, event.params.data as any) as any[]
      data = {
        ...data,
        depositFee: BigInt(value[0]),
        tokenAddress: value[1],
      }
    }

    // Process Token Info
    if (data?.tokenAddress) {
      try {
        const client = GetClient(chainId)
        const name = await client.readContract({
          address: data.tokenAddress as any,
          abi: Erc20ABI,
          functionName: "name",
          args: []
        }) as string

        const symbol = await client.readContract({
          address: data.tokenAddress as any,
          abi: Erc20ABI,
          functionName: "symbol",
          args: []
        }) as string

        const decimals = await client.readContract({
          address: data.tokenAddress as any,
          abi: Erc20ABI,
          functionName: "decimals",
          args: []
        }) as number


        context.log.debug(`Add Token Info: ${name} | ${symbol} | ${decimals}`)
        data = {
          ...data,
          tokenName: name,
          tokenSymbol: symbol,
          tokenDecimals: decimals,
        }
      } catch (error) {
        context.log.error(`Unable to fetch token info ${data.tokenAddress} | Record ${eventId}`)
      }
    }

    // Add Condition Module Data
    context.ConditionModuleData.set(data)

    // Add Owner ENS Profile
    const user = await GetEnsProfile(event.params.sender)
    context.User.set(user)

    // Add Record Entity 
    entity = {
      id: eventId,
      chainId: chainId,
      recordId: event.params.id.toString(),
      slug: slug,
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

      conditionModule: moduleId,
      conditionModuleData: data.id,

      totalRegistrations: BigInt(0),
      totalAttendees: BigInt(0),
      totalFunded: BigInt(0),
    }

    context.Record.set(entity)
  }
})

ShowHubContract_Updated_handlerAsync(async ({ event, context }) => {
  const chainId = event.chainId
  const eventId = `${chainId}-${event.params.id}`
  context.log.debug(`Processing ShowHubContract_Updated # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = await context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  const user = await GetEnsProfile(event.params.owner)
  context.User.set(user)

  context.Record.set({
    ...entity,
    contentUri: event.params.contentUri,
    limit: BigInt(event.params.limit),
    owner: event.params.owner,
  })
})

ShowHubContract_Canceled_handlerAsync(async ({ event, context }) => {
  const chainId = event.chainId
  const eventId = `${chainId}-${event.params.id}`
  context.log.debug(`Processing ShowHubContract_Canceled # ${eventId} @ Block # ${event.blockNumber}`)

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
  const chainId = event.chainId
  const eventId = `${chainId}-${event.params.id}`
  context.log.debug(`Processing ShowHubContract_Funded # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = await context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  let conditionModule = await context.ConditionModule.get(entity.conditionModule)
  if (conditionModule == null) {
    context.log.error(`ConditionModule ${entity.conditionModule} not found`)
    return
  }

  try {
    const client = GetClient(chainId)
    const funded = await client.readContract({
      address: conditionModule.address as any,
      abi: TotalFundedABI,
      functionName: "getTotalFunded",
      args: [event.params.id],
    }) as string

    context.Record.set({
      ...entity,
      totalFunded: BigInt(funded ?? 0),
    })
  } catch (error) {
    context.log.error(`Unable to fetch total funded ${entity.conditionModule} | Record ${eventId}`)
  }
})

ShowHubContract_Registered_handler(async ({ event, context }) => {
  const chainId = event.chainId
  const eventId = `${chainId}-${event.params.id}`
  context.log.debug(`Processing ShowHubContract_Registered # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = await context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  const user = await GetEnsProfile(event.params.participant)
  context.User.set(user)

  const registration = {
    id: `${eventId}-${event.params.participant}`,
    createdAt: BigInt(event.params.timestamp),
    createdBy: event.params.sender,
    blockNumber: BigInt(event.blockNumber),
    transactionHash: event.transactionHash,

    participated: false,
    record: eventId,
    user: user.id,
  }

  context.log.debug(`Create Event Registration ${registration.id}`)
  context.Registration.set(registration)

  context.log.debug(`Update Total Registrations ${entity.id}`)
  context.Record.set({
    ...entity,
    totalRegistrations: entity.totalRegistrations + BigInt(1),
  })
})

ShowHubContract_CheckedIn_handler(({ event, context }) => {
  const chainId = event.chainId
  const eventId = `${chainId}-${event.params.id}`
  context.log.debug(`Processing ShowHubContract_CheckedIn # ${eventId} @ Block # ${event.blockNumber}`)

  const entity = context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  for (let i = 0; i < event.params.attendees.length; i++) {
    const attendee = event.params.attendees[i];
    const registration = context.Registration.get(`${eventId}-${attendee}`)

    if (registration) {
      context.log.debug(`Checkin attendee ${attendee}`)
      context.Registration.set({
        ...registration,
        participated: true,
      })
    }
  }

  context.Record.set({
    ...entity,
    totalAttendees: entity.totalAttendees + BigInt(event.params.attendees.length),
  })
})

ShowHubContract_Settled_handler(({ event, context }) => {
  const chainId = event.chainId
  const eventId = `${chainId}-${event.params.id}`
  context.log.debug(`Processing ShowHubContract_Settled # ${eventId} @ Block # ${event.blockNumber}`)

  let entity = context.Record.get(eventId)
  if (entity == null) {
    context.log.error(`Record ${eventId} not found`)
    return
  }

  context.Record.set({
    ...entity,
    status: GetStatusId('Settled'),
  })
})