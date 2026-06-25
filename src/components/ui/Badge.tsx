interface Props {
  rank: number
  className?: string
}

const rankColors: Record<number, string> = {
  1: 'bg-yellow-400 text-zinc-900',
  2: 'bg-zinc-300 text-zinc-900',
  3: 'bg-amber-700 text-white',
}

export function Badge({ rank, className = '' }: Props) {
  const color = rankColors[rank] ?? 'bg-zinc-700 text-slate-100'
  return (
    <span className={`inline-flex items-center justify-center px-3 py-1 rounded font-bold text-sm ${color} ${className}`}>
      {rank}등
    </span>
  )
}
