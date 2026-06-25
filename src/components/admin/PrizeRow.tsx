import type { Prize } from '../../types'

interface Props {
  prize: Prize
  isLast: boolean
  lastCount: number
  disableRemove: boolean
  onUpdate: (field: 'name' | 'count', value: string) => void
  onRemove: () => void
}

export function PrizeRow({ prize, isLast, lastCount, disableRemove, onUpdate, onRemove }: Props) {
  return (
    <div className={`flex items-center gap-3 rounded p-3.5 border ${isLast ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-900 border-zinc-800'}`}>
      <span className="w-12 text-base font-bold text-zinc-500 shrink-0">{prize.rank}등</span>
      <input
        className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-base text-slate-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 min-h-[52px]"
        placeholder="상품명"
        value={prize.name}
        onChange={e => onUpdate('name', e.target.value)}
      />
      {isLast ? (
        <div className="w-24 px-3 py-3 text-base text-center text-zinc-500 border border-zinc-800 rounded bg-zinc-900 tabular-nums min-h-[52px] flex items-center justify-center">
          {lastCount < 0 ? '—' : lastCount}
        </div>
      ) : (
        <input
          type="number"
          className="w-24 bg-zinc-800 border border-zinc-700 rounded px-3 py-3 text-base text-center text-slate-200 focus:outline-none focus:border-zinc-500 tabular-nums min-h-[52px]"
          min={1}
          value={prize.count}
          onChange={e => onUpdate('count', e.target.value)}
        />
      )}
      <button
        className="text-zinc-600 hover:text-red-400 min-w-[44px] min-h-[44px] flex items-center justify-center text-lg transition-colors"
        onClick={onRemove}
        disabled={disableRemove}
      >
        ✕
      </button>
    </div>
  )
}
