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
  createdBy: Profile
  conditions: ConditionModuleData
  status: Status
  contentUri: string
  metadata?: EventMetadata

  attendees: Profile[]
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
}

export interface ConditionModuleData extends ConditionModule {
  endDate: string | bigint
  depositFee: bigint
  maxParticipants: number
  tokenAddress?: string // Only used for BasicToken module
}
