import { useCallback } from 'react'
import { useLotteryStore } from '../store/useLotteryStore'
import { isNumberConfirmed } from '../db'
import type { CheckResult } from '../types'
import { TOTAL_CUPS } from '../constants/lottery'

export function useCheckNumber() {
  const { winnerMap, prizes } = useLotteryStore()

  const check = useCallback(async (input: number): Promise<CheckResult> => {
    if (Object.keys(winnerMap).length === 0) {
      return { status: 'not_ready', number: input }
    }

    if (!Number.isInteger(input) || input < 1 || input > TOTAL_CUPS) {
      return { status: 'invalid', number: input }
    }

    const rank = winnerMap[input]
    const existing = await isNumberConfirmed(input)
    if (existing) {
      return { status: 'used', number: input, rank, confirmedAt: existing.confirmedAt }
    }

    const prize = prizes.find(p => p.rank === rank)
    return { status: 'win', number: input, rank, prize }
  }, [winnerMap, prizes])

  return { check }
}
