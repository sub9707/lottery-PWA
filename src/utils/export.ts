import * as XLSX from 'xlsx'
import type { ConfirmedEntry, Prize } from '../types'

export function exportExcel(prizes: Prize[], confirmed: ConfirmedEntry[]): void {
  const wb = XLSX.utils.book_new()

  const prizeMap = Object.fromEntries(prizes.map(p => [p.rank, p]))
  const summaryData = prizes.map(p => {
    const done = confirmed.filter(c => c.rank === p.rank).length
    return {
      등수: `${p.rank}등`,
      상품명: p.name,
      총당첨: p.count,
      확정: done,
      미확정: p.count - done,
    }
  })
  const ws1 = XLSX.utils.json_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, ws1, '등수별요약')

  const detailData = confirmed.map(c => ({
    번호: c.number,
    등수: `${c.rank}등`,
    상품명: prizeMap[c.rank]?.name ?? '',
    확정시각: new Date(c.confirmedAt).toLocaleString('ko-KR'),
  }))
  const ws2 = XLSX.utils.json_to_sheet(detailData)
  XLSX.utils.book_append_sheet(wb, ws2, '전체확정내역')

  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `추첨결과_${date}.xlsx`)
}
