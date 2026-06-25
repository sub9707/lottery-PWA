import { useState } from 'react'
import { useLotteryStore } from '../../store/useLotteryStore'
import { Button } from '../../components/ui/Button'

export function InventoryTab() {
  const { prizes, confirmed, hydrate, loading } = useLotteryStore()
  const [refreshed, setRefreshed] = useState(false)

  async function handleRefresh() {
    await hydrate()
    setRefreshed(true)
    setTimeout(() => setRefreshed(false), 1500)
  }

  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-base text-zinc-500">{today}</span>
        <Button size="md" variant="ghost" onClick={handleRefresh} disabled={loading}>
          {refreshed ? '완료' : '새로고침'}
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-950 border-b border-zinc-800">
            <tr>
              {['등수', '상품명', '총수량', '확정', '잔여'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-zinc-600 font-medium text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prizes.map(p => {
              const done = confirmed.filter(c => c.rank === p.rank).length
              const remain = p.count - done
              const soldOut = remain === 0
              return (
                <tr key={p.rank} className={`border-t border-zinc-800 ${soldOut ? 'bg-red-950/30' : ''}`}>
                  <td className="px-4 py-4 font-bold text-slate-300 text-base">{p.rank}등</td>
                  <td className="px-4 py-4 text-zinc-400 text-base">{p.name}</td>
                  <td className="px-4 py-4 text-zinc-500 tabular-nums text-base">{p.count}</td>
                  <td className="px-4 py-4 text-zinc-500 tabular-nums text-base">{done}</td>
                  <td className={`px-4 py-4 font-bold tabular-nums text-base ${soldOut ? 'text-red-500' : 'text-emerald-400'}`}>
                    {soldOut ? '품절' : remain}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
