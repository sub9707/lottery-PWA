import { useState, useCallback } from 'react'
import { PageLayout } from '../components/layout/PageLayout'
import { InputScreen } from '../components/check/InputScreen'
import { ResultScreen } from '../components/check/ResultScreen'
import { useCheckNumber } from '../hooks/useCheckNumber'
import { useLotteryStore } from '../store/useLotteryStore'
import type { CheckResult } from '../types'
import { AUTO_RETURN_DELAY_MS } from '../constants/lottery'

type Screen = 'input' | 'result'

export function CheckPage() {
  const [input, setInput] = useState('')
  const [screen, setScreen] = useState<Screen>('input')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [confirming, setConfirming] = useState(false)
  const { check } = useCheckNumber()
  const { confirmEntry } = useLotteryStore()

  async function handleCheck() {
    const res = await check(parseInt(input, 10))
    setResult(res)
    setScreen('result')
  }

  const reset = useCallback(() => {
    setInput('')
    setResult(null)
    setScreen('input')
    setConfirming(false)
  }, [])

  async function handleConfirm() {
    if (!result || result.rank === undefined) return
    setConfirming(true)
    await confirmEntry({ number: result.number, rank: result.rank, confirmedAt: new Date().toISOString() })
    setTimeout(reset, AUTO_RETURN_DELAY_MS)
  }

  return (
    <PageLayout title="번호 확인" showBack mainClass="flex flex-col lg:flex-row lg:overflow-hidden">
      {screen === 'input' && (
        <InputScreen input={input} setInput={setInput} onCheck={handleCheck} />
      )}
      {screen === 'result' && result && (
        <ResultScreen result={result} onReset={reset} onConfirm={handleConfirm} confirming={confirming} />
      )}
    </PageLayout>
  )
}
