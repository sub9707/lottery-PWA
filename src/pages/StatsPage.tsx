import { useMemo } from 'react'
import { PageLayout } from '../components/layout/PageLayout'
import { Button } from '../components/ui/Button'
import { StatCard } from '../components/stats/StatCard'
import { RankStatsTable } from '../components/stats/RankStatsTable'
import { TodayConfirmedTable } from '../components/stats/TodayConfirmedTable'
import { useLotteryStore } from '../store/useLotteryStore'
import { exportExcel } from '../utils/export'

export function StatsPage() {
  const { prizes, confirmed } = useLotteryStore()

  const totalWinners = prizes.reduce((s, p) => s + p.count, 0)
  const confirmedCount = confirmed.length
  const rate = totalWinners > 0 ? Math.round((confirmedCount / totalWinners) * 100) : 0

  const rankStats = useMemo(() =>
    prizes.map(p => {
      const done = confirmed.filter(c => c.rank === p.rank).length
      return { ...p, done, remain: p.count - done }
    }),
    [prizes, confirmed]
  )

  const prizeMap = Object.fromEntries(prizes.map(p => [p.rank, p]))

  const todayStr = new Date().toLocaleDateString('ko-KR')
  const todayConfirmed = useMemo(() =>
    confirmed.filter(c => new Date(c.confirmedAt).toLocaleDateString('ko-KR') === todayStr),
    [confirmed, todayStr]
  )

  return (
    <PageLayout
      title="통계"
      showBack
      mainClass="flex flex-col lg:overflow-hidden"
      headerRight={<Button size="sm" onClick={() => exportExcel(prizes, confirmed)}>Excel</Button>}
    >
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-4 lg:px-6 lg:py-4 shrink-0 border-b border-zinc-800">
        <StatCard label="전체 당첨" value={totalWinners} />
        <StatCard label="확정 완료" value={confirmedCount} highlight />
        <StatCard label="미확정" value={totalWinners - confirmedCount} />
        <StatCard label="확정률" value={`${rate}%`} highlight />
      </div>

      {/* Body — stacked on mobile, 2-col on lg */}
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
        {/* Rank stats */}
        <div className="lg:w-[400px] xl:w-[460px] lg:shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-800 overflow-x-auto lg:overflow-y-auto">
          <RankStatsTable stats={rankStats} />
        </div>

        {/* Confirmed history */}
        <div className="flex-1 flex flex-col lg:overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">오늘 확정 내역</span>
          </div>
          <div className="flex-1 lg:overflow-hidden">
            <TodayConfirmedTable entries={todayConfirmed} prizeMap={prizeMap} />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
