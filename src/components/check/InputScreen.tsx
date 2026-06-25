import { Numpad } from '../ui/Numpad'
import { Button } from '../ui/Button'

interface Props {
  input: string
  setInput: (v: string) => void
  onCheck: () => void
}

export function InputScreen({ input, setInput, onCheck }: Props) {
  return (
    <div className="flex flex-col lg:flex-row flex-1">
      {/* Display */}
      <div className="flex flex-col items-center justify-center py-10 lg:py-0 px-6 flex-1 border-b lg:border-b-0 lg:border-r border-zinc-800">
        <p className="text-xs text-zinc-600 uppercase tracking-[0.25em] mb-6">컵 바닥 번호 입력 (1 ~ 1000)</p>
        <div className="text-6xl sm:text-7xl lg:text-[88px] xl:text-[108px] font-black text-slate-100 leading-none tracking-widest tabular-nums min-h-[80px] lg:min-h-[120px] flex items-center">
          {input || <span className="text-zinc-800">_ _ _ _</span>}
        </div>
      </div>

      {/* Numpad */}
      <div className="flex flex-col items-center justify-center px-6 lg:px-10 py-6 lg:py-0 gap-4 w-full lg:w-[320px] xl:w-[360px] lg:shrink-0">
        <Numpad value={input} onChange={setInput} maxLength={4} />
        <Button fullWidth size="lg" onClick={onCheck} disabled={!input}>
          확인
        </Button>
      </div>
    </div>
  )
}
