import { create } from 'zustand'
import type { Prize, WinnerMap, ConfirmedEntry } from '../types'
import {
  getPrizes, savePrizes, getWinnerMap, saveWinnerMap,
  getAllConfirmed, addConfirmed, clearConfirmed, clearAll,
  getLastShuffleAt, saveLastShuffleAt, getAdminPassword, saveAdminPassword,
} from '../db'
import { buildWinnerMap } from '../utils/shuffle'
import { TOTAL_CUPS } from '../constants/lottery'

interface LotteryState {
  prizes: Prize[]
  winnerMap: WinnerMap
  confirmed: ConfirmedEntry[]
  lastShuffleAt: string | null
  adminPassword: string
  loading: boolean
  error: string | null

  hydrate: () => Promise<void>
  setPrizes: (prizes: Prize[]) => Promise<void>
  shuffle: () => Promise<void>
  confirmEntry: (entry: Omit<ConfirmedEntry, 'id'>) => Promise<void>
  clearConfirmedEntries: () => Promise<void>
  resetAll: () => Promise<void>
  setAdminPassword: (pw: string) => Promise<void>
  clearError: () => void
}

const DEFAULT_PRIZES: Prize[] = [
  { rank: 1, name: '1등 상품', count: 1 },
  { rank: 2, name: '2등 상품', count: 5 },
  { rank: 3, name: '3등 상품', count: 10 },
]

export const useLotteryStore = create<LotteryState>((set, get) => ({
  prizes: [],
  winnerMap: {},
  confirmed: [],
  lastShuffleAt: null,
  adminPassword: '1234',
  loading: false,
  error: null,

  hydrate: async () => {
    set({ loading: true, error: null })
    try {
      const [prizes, winnerMap, confirmed, lastShuffleAt, adminPassword] = await Promise.all([
        getPrizes(),
        getWinnerMap(),
        getAllConfirmed(),
        getLastShuffleAt(),
        getAdminPassword(),
      ])
      set({
        prizes: prizes.length ? prizes : DEFAULT_PRIZES,
        winnerMap,
        confirmed,
        lastShuffleAt,
        adminPassword,
      })
    } catch (e) {
      set({ error: String(e) })
    } finally {
      set({ loading: false })
    }
  },

  setPrizes: async (prizes) => {
    set({ loading: true, error: null })
    try {
      await savePrizes(prizes)
      set({ prizes })
    } catch (e) {
      set({ error: String(e) })
    } finally {
      set({ loading: false })
    }
  },

  shuffle: async () => {
    const { prizes } = get()
    const total = prizes.reduce((s, p) => s + p.count, 0)
    if (total > TOTAL_CUPS) {
      set({ error: `총 당첨 수(${total})가 ${TOTAL_CUPS}를 초과합니다.` })
      return
    }
    set({ loading: true, error: null })
    try {
      const winnerMap = buildWinnerMap(prizes, TOTAL_CUPS)
      const now = new Date().toISOString()
      await Promise.all([
        saveWinnerMap(winnerMap),
        saveLastShuffleAt(now),
        clearConfirmed(),
      ])
      set({ winnerMap, lastShuffleAt: now, confirmed: [] })
    } catch (e) {
      set({ error: String(e) })
    } finally {
      set({ loading: false })
    }
  },

  confirmEntry: async (entry) => {
    set({ loading: true, error: null })
    try {
      await addConfirmed(entry)
      const confirmed = await getAllConfirmed()
      set({ confirmed })
    } catch (e) {
      set({ error: String(e) })
    } finally {
      set({ loading: false })
    }
  },

  clearConfirmedEntries: async () => {
    set({ loading: true, error: null })
    try {
      await clearConfirmed()
      set({ confirmed: [] })
    } catch (e) {
      set({ error: String(e) })
    } finally {
      set({ loading: false })
    }
  },

  resetAll: async () => {
    set({ loading: true, error: null })
    try {
      await clearAll()
      await savePrizes(DEFAULT_PRIZES)
      set({ prizes: DEFAULT_PRIZES, winnerMap: {}, confirmed: [], lastShuffleAt: null })
    } catch (e) {
      set({ error: String(e) })
    } finally {
      set({ loading: false })
    }
  },

  setAdminPassword: async (pw) => {
    set({ loading: true, error: null })
    try {
      await saveAdminPassword(pw)
      set({ adminPassword: pw })
    } catch (e) {
      set({ error: String(e) })
    } finally {
      set({ loading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
