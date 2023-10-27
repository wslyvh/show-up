export interface State<T> {
  loading: boolean
  data?: T
  error?: string
}

export enum Status {
  Active,
  Cancelled,
  Settled,
}

export interface Record {
  id: string
  createdAt: string | number
  createdBy: string
  updatedAt?: string | number
  status: Status
  message?: string

  conditionModule: string
  condition: ConditionModuleData

  contentUri: string
  metadata?: EventMetadata

  participants: Participant[]
}

export interface Participant {
  id: string
  createdAt: string | number
  createdBy: string
  address: string
  checkedIn: boolean
  transactionHash: string
  url: string
}

export interface EventMetadata {
  appId?: string
  title: string
  description: string
  start: string | number
  end: string | number
  timezone: string
  location: string
  website: string
  imageUrl: string
  links: string[]
  tags: string[]
}

export interface Profile {
  address: string
}

export enum ConditionModuleType {
  BasicEther = 'BasicEther',
  BasicToken = 'BasicToken',
}

export interface ConditionModule {
  type: ConditionModuleType
  address: String
  whitelisted?: boolean
}

export interface ConditionModuleData extends ConditionModule {
  endDate: string | bigint
  depositFee: bigint
  maxParticipants: number
  tokenAddress?: string // Only used for BasicToken module
  tokenSymbol?: string
  tokenName?: string
  tokenDecimals?: number
}
