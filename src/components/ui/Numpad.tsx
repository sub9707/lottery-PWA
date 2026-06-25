interface Props {
  value: string
  onChange: (v: string) => void
  maxLength?: number
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', 'C']

function vibrate() {
  if ('vibrate' in navigator) navigator.vibrate(30)
}

export function Numpad({ value, onChange, maxLength = 4 }: Props) {
  function handleKey(key: string) {
    vibrate()
    if (key === 'C') { onChange(''); return }
    if (key === '←') { onChange(value.slice(0, -1)); return }
    if (value.length >= maxLength) return
    onChange(value + key)
  }

  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {KEYS.map(k => (
        <button
          key={k}
          onClick={() => handleKey(k)}
          className={`
            min-h-[80px] rounded text-4xl font-bold select-none transition-colors active:scale-95
            ${k === '←' || k === 'C'
              ? 'bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 text-zinc-300'
              : 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-slate-100 border border-zinc-700'}
          `}
        >
          {k}
        </button>
      ))}
    </div>
  )
}
