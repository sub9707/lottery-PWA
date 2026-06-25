interface Props {
  onUnlock: () => void
}

export function IdleLockScreen({ onUnlock }: Props) {
  return (
    <div
      className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center select-none"
      onPointerDown={e => { e.stopPropagation(); onUnlock() }}
    >
      <p className="text-zinc-800 text-xs uppercase tracking-[0.4em] mb-6">화면 잠금</p>
      <h1 className="text-zinc-700 text-7xl font-black tracking-tight mb-12">행사 추첨</h1>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-zinc-800 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-zinc-700" />
        </div>
        <p className="text-zinc-700 text-sm">화면을 터치하면 잠금이 해제됩니다</p>
      </div>
    </div>
  )
}
