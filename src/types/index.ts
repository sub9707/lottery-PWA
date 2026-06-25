export interface Prize {
  rank: number
  name: string
  count: number
}

export type WinnerMap = Record<number, number>

export interface ConfirmedEntry {
  id?: number
  number: number
  rank: number
  confirmedAt: string
}

export type CheckStatus = 'win' | 'used' | 'invalid' | 'not_ready'

export interface CheckResult {
  status: CheckStatus
  number: number
  rank?: number
  prize?: Prize
  confirmedAt?: string
}
