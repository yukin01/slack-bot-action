export type StatusType = 'success' | 'failure' | 'cancelled' | 'custom'

export const getStatusType = (value: string): StatusType => {
  switch (value.toLowerCase()) {
    case 'success':
      return 'success'
    case 'failure':
      return 'failure'
    case 'cancelled':
      return 'cancelled'
    default:
      return 'custom'
  }
}

export type Status = {
  type: StatusType
  value: string
}

export const getStatus = (value: string): Status => ({ type: getStatusType(value), value })
