export interface State<T> {
  loading: boolean
  data?: T
  error?: string
}

export interface EventMetadata {
  id: string,
  createdAt: string | number,
  createdBy: Profile,

  appId?: string,
  title: string,
  description: string,
  start: string | number,
  end: string | number,
  location: string,
  website: string,
  imageUrl: string,
  links: string[]
  tags: string[]

  attendees: Profile[],
}

export interface Profile {
  address: string
}

export interface Condition {
  address: string
  date: string | number
  limit: number
}