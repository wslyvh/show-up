export interface State<T> {
  loading: boolean
  data?: T
  error?: string
}

export interface LoadingStateData {
  isLoading: boolean
  message: string
  type: 'error' | 'success' | 'info' | ''
  data?: any
}

export interface LoadingState {
  isLoading: boolean
  message: string
  type: 'error' | 'success' | 'info' | ''
}

export enum Status {
  Active,
  Cancelled,
  Settled,
}

export enum Visibility {
  Public,
  Unlisted,
}

export interface Record {
  id: string
  chainId: number
  recordId: string
  createdAt: string | number
  createdBy: string
  endDate: string | number
  limit: number
  status: Status
  message?: string

  ownerId: string
  owner: UserProfile

  conditionModuleId: string
  conditionModule: ConditionModule
  conditionModuleData: ConditionModuleData

  contentUri: string
  metadata: EventMetadata

  registrations: Registration[]
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
  visibility: Visibility
  links: string[]
  tags: string[]
}

export interface UserProfile {
  id: string
  name: string
  avatar: string
}

export interface Registration extends UserProfile {
  participated: boolean
  transactionHash: string
}

export interface ConditionModule {
  id: string
  chainId: number
  name: 'RecipientEther' | 'RecipientToken' | 'SplitEther' | 'SplitToken'
  whitelisted: boolean
}

export interface ConditionModuleData extends ConditionModule {
  depositFee: bigint
  tokenAddress?: string
  tokenSymbol?: string
  tokenName?: string
  tokenDecimals?: number
}

export interface CreateEventData {
  chainId: number
  endDate: string | number
  limit: number
  depositFee: number
  recipient?: string
  tokenAddress?: string
}
