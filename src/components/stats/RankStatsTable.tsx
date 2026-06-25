import type { Prize } from '../../types'

interface RankStat extends Prize {
  done: number
  remain: number
}

export function RankStatsTable({ stats }: { stats: RankStat[] }) {
  return (
    <div className="flex flex-col">
      <div className="px-4 lg:px-5 py-3.5 border-b border-zinc-800 shrink-0">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">등수별 현황</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px]">
          <thead className="bg-zinc-950 sticky top-0">
            <tr>
              {['등수', '상품명', '총', '확정', '미확정', '진행률'].map(h => (
                <th key={h} className="px-4 lg:px-5 py-3 text-left text-zinc-600 font-medium text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map(p => (
              <tr key={p.rank} className="border-t border-zinc-800 hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 lg:px-5 py-4 font-bold text-slate-200 text-base">{p.rank}등</td>
                <td className="px-4 lg:px-5 py-4 text-zinc-400 text-base max-w-[130px] truncate">{p.name}</td>
                <td className="px-4 lg:px-5 py-4 text-zinc-500 tabular-nums text-base">{p.count}</td>
                <td className="px-4 lg:px-5 py-4 text-emerald-400 font-bold tabular-nums text-base">{p.done}</td>
                <td className="px-4 lg:px-5 py-4 text-zinc-500 tabular-nums text-base">{p.remain}</td>
                <td className="px-4 lg:px-5 py-4 w-24">
                  <div className="bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-slate-300 h-2 rounded-full"
                      style={{ width: p.count ? `${(p.done / p.count) * 100}%` : '0%' }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
