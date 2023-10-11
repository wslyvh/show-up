export interface State<T> {
  loading: boolean
  data?: T
  error?: string
}

export enum Status {
  Active,
  Cancelled,
  Settled
}

export interface Record {
  id: string,
  createdAt: string | number,
  createdBy: Profile,
  conditions: ConditionModule,
  status: Status,
  contentUri: string,
  metadata?: EventMetadata,

  attendees: Profile[],
}

export interface EventMetadata {
  appId?: string,
  title: string,
  description: string,
  start: string | number,
  end: string | number,
  timezone: string,
  location: string,
  website: string,
  imageUrl: string,
  links: string[]
  tags: string[]
}

export interface Profile {
  address: string
}

export interface ConditionModule {
  type: 'BasicEther' | 'BasicERC20'
  address: string
  tokenAddress?: string
  endDate: string | number
  depositFee: number,
  maxParticipants: number,
}