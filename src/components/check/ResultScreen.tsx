import type { CheckResult } from '../../types'
import { Button } from '../ui/Button'
import { ResultCard } from './ResultCard'

interface Props {
  result: CheckResult
  onReset: () => void
  onConfirm: () => void
  confirming: boolean
}

const borderColor: Record<CheckResult['status'], string> = {
  win:       'border-emerald-900',
  used:      'border-yellow-900',
  not_ready: 'border-zinc-800',
  invalid:   'border-red-950',
}

export function ResultScreen({ result, onReset, onConfirm, confirming }: Props) {
  return (
    <div className="flex flex-col lg:flex-row flex-1 animate-fade-in">
      {/* Result card */}
      <div className={`flex-1 border-b lg:border-b-0 lg:border-r ${borderColor[result.status]} bg-zinc-900/30 min-h-[280px]`}>
        <ResultCard result={result} />
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-center gap-3 px-6 lg:px-10 py-6 lg:py-0 w-full lg:w-[260px] xl:w-[300px] lg:shrink-0">
        {result.status === 'win' && (
          <Button variant="success" size="lg" fullWidth onClick={onConfirm} disabled={confirming}>
            {confirming ? '처리 중...' : '수령 확정'}
          </Button>
        )}
        <Button variant="ghost" size="lg" fullWidth onClick={onReset}>
          다시 입력
        </Button>
      </div>
    </div>
  )
}
