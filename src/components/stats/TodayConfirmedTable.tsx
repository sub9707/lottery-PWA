import { useState, useMemo } from 'react'
import type { ConfirmedEntry, Prize } from '../../types'

interface Props {
  entries: ConfirmedEntry[]
  prizeMap: Record<number, Prize>
}

export function TodayConfirmedTable({ entries, prizeMap }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return entries
    return entries.filter(c =>
      String(c.number).includes(q) ||
      (prizeMap[c.rank]?.name ?? '').includes(q) ||
      String(c.rank).includes(q)
    )
  }, [entries, query, prizeMap])

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="shrink-0 px-4 lg:px-5 py-3.5 border-b border-zinc-800 flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-base text-slate-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
            placeholder="번호, 등수, 상품명으로 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 text-sm min-w-[28px] min-h-[28px] flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>
        <span className="text-sm text-zinc-600 tabular-nums shrink-0">{filtered.length} / {entries.length}건</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-zinc-600 text-base">
            {entries.length === 0 ? '확정된 내역이 없습니다.' : '검색 결과가 없습니다.'}
          </div>
        ) : (
          <table className="w-full min-w-[320px]">
            <thead className="bg-zinc-950 sticky top-0">
              <tr>
                {['번호', '등수', '상품명', '확정 시각'].map(h => (
                  <th key={h} className="px-4 lg:px-5 py-3 text-left text-zinc-600 font-medium text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} className="border-t border-zinc-800/60 hover:bg-zinc-900/50 transition-colors">
                  <td className="px-4 lg:px-5 py-4 font-bold text-slate-100 tabular-nums text-xl">{c.number}</td>
                  <td className="px-4 lg:px-5 py-4 text-zinc-400 text-base">{c.rank}등</td>
                  <td className="px-4 lg:px-5 py-4 text-zinc-400 text-base">{prizeMap[c.rank]?.name ?? ''}</td>
                  <td className="px-4 lg:px-5 py-4 text-zinc-600 text-sm tabular-nums">
                    {new Date(c.confirmedAt).toLocaleTimeString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
