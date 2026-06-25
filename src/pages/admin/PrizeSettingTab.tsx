import { useState } from 'react'
import { useLotteryStore } from '../../store/useLotteryStore'
import { Button } from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'
import { PrizeRow } from '../../components/admin/PrizeRow'
import type { Prize } from '../../types'
import { TOTAL_CUPS, MAX_RANKS } from '../../constants/lottery'

function withLastCount(list: Prize[]): Prize[] {
  if (list.length === 0) return list
  const others = list.slice(0, -1).reduce((s, p) => s + p.count, 0)
  return list.map((p, i) => i === list.length - 1 ? { ...p, count: TOTAL_CUPS - others } : p)
}

export function PrizeSettingTab() {
  const { prizes, setPrizes, loading } = useLotteryStore()
  const [local, setLocal] = useState<Prize[]>(prizes)
  const [toast, setToast] = useState('')

  const lastIdx = local.length - 1
  const othersTotal = local.slice(0, lastIdx).reduce((s, p) => s + p.count, 0)
  const lastCount = TOTAL_CUPS - othersTotal
  const invalid = othersTotal >= TOTAL_CUPS

  function addRank() {
    if (local.length >= MAX_RANKS) return
    setLocal(withLastCount([...local, { rank: local.length + 1, name: '', count: 0 }]))
  }

  function removeRank(idx: number) {
    const next = local.filter((_, i) => i !== idx).map((p, i) => ({ ...p, rank: i + 1 }))
    setLocal(withLastCount(next))
  }

  function update(idx: number, field: 'name' | 'count', value: string) {
    const updated = local.map((p, i) =>
      i === idx ? { ...p, [field]: field === 'count' ? Math.max(1, Number(value)) : value } : p
    )
    setLocal(field === 'count' ? withLastCount(updated) : updated)
  }

  async function handleSave() {
    if (invalid || local.length === 0) return
    await setPrizes(withLastCount(local))
    setToast('저장되었습니다. 변경 사항 적용을 위해 번호 섞기를 다시 실행하세요.')
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className={`text-base font-semibold ${invalid ? 'text-red-400' : 'text-zinc-500'}`}>
          상위 등수 합계: {othersTotal} / {TOTAL_CUPS}{invalid && ' — 초과'}
        </span>
        <Button size="md" variant="ghost" onClick={addRank} disabled={local.length >= MAX_RANKS || invalid}>
          + 등수 추가
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {local.map((p, i) => (
          <PrizeRow
            key={i}
            prize={p}
            isLast={i === lastIdx}
            lastCount={lastCount}
            disableRemove={local.length <= 1}
            onUpdate={(field, value) => update(i, field, value)}
            onRemove={() => removeRank(i)}
          />
        ))}
      </div>

      <p className="text-sm text-zinc-600">
        마지막 등수 수량은 자동 계산됩니다 ({TOTAL_CUPS} - 상위 등수 합계)
      </p>

      <Button fullWidth size="lg" onClick={handleSave} disabled={invalid || local.length === 0 || loading || lastCount <= 0}>
        {loading ? '저장 중...' : '저장'}
      </Button>

      {toast && <Toast message={toast} onDone={() => setToast('')} duration={3000} />}
    </div>
  )
}
