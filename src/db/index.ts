import Dexie, { type Table } from 'dexie'
import type { ConfirmedEntry, Prize, WinnerMap } from '../types'

interface SettingsRecord {
  key: string
  value: unknown
}

class LotteryDB extends Dexie {
  settings!: Table<SettingsRecord, string>
  confirmed!: Table<ConfirmedEntry, number>

  constructor() {
    super('LotteryDB')
    this.version(1).stores({
      settings: 'key',
      confirmed: '++id, number, rank, confirmedAt',
    })
  }
}

export const db = new LotteryDB()

export async function getPrizes(): Promise<Prize[]> {
  const record = await db.settings.get('prizes')
  return (record?.value as Prize[]) ?? []
}

export async function savePrizes(prizes: Prize[]): Promise<void> {
  await db.settings.put({ key: 'prizes', value: prizes })
}

export async function getWinnerMap(): Promise<WinnerMap> {
  const record = await db.settings.get('winnerMap')
  return (record?.value as WinnerMap) ?? {}
}

export async function saveWinnerMap(map: WinnerMap): Promise<void> {
  await db.settings.put({ key: 'winnerMap', value: map })
}

export async function getLastShuffleAt(): Promise<string | null> {
  const record = await db.settings.get('lastShuffleAt')
  return (record?.value as string) ?? null
}

export async function saveLastShuffleAt(iso: string): Promise<void> {
  await db.settings.put({ key: 'lastShuffleAt', value: iso })
}

export async function getAdminPassword(): Promise<string> {
  const record = await db.settings.get('adminPassword')
  return (record?.value as string) ?? '1234'
}

export async function saveAdminPassword(pw: string): Promise<void> {
  await db.settings.put({ key: 'adminPassword', value: pw })
}

export async function addConfirmed(entry: Omit<ConfirmedEntry, 'id'>): Promise<void> {
  await db.confirmed.add(entry)
}

export async function getAllConfirmed(): Promise<ConfirmedEntry[]> {
  return db.confirmed.toArray()
}

export async function isNumberConfirmed(number: number): Promise<ConfirmedEntry | undefined> {
  return db.confirmed.where('number').equals(number).first()
}

export async function clearConfirmed(): Promise<void> {
  await db.confirmed.clear()
}

export async function clearAll(): Promise<void> {
  await db.settings.clear()
  await db.confirmed.clear()
}
