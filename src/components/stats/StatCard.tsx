interface Props {
  label: string
  value: string | number
  highlight?: boolean
}

export function StatCard({ label, value, highlight }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded p-4 lg:p-5">
      <div className="text-xs text-zinc-600 mb-2 uppercase tracking-widest">{label}</div>
      <div className={`text-4xl lg:text-5xl font-bold tabular-nums ${highlight ? 'text-slate-100' : 'text-zinc-400'}`}>
        {value}
      </div>
    </div>
  )
}
