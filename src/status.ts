export type StatusType = 'success' | 'failure' | 'cancelled' | 'custom'

export const getStatusType = (value: string): StatusType => {
  switch (value) {
    case 'Success':
      return 'success'
    case 'Failure':
      return 'cancelled'
    case 'Cancelled':
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
