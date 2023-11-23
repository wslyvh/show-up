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
  creatorProfile: EnsProfile
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
  profile: EnsProfile
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

export interface EnsProfile {
  address: string
  name: string
  avatar: string
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
  endDate: string | number
  depositFee: bigint
  maxParticipants: number
  tokenAddress?: string // Only used for BasicToken module
  tokenSymbol?: string
  tokenName?: string
  tokenDecimals?: number
}
