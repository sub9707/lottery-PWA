import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../../components/layout/PageLayout'
import { Numpad } from '../../components/ui/Numpad'
import { Button } from '../../components/ui/Button'
import { useAdminGuard } from '../../hooks/useAdminGuard'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login, isLocked, remainingLock, attempts } = useAdminGuard()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (!isLocked) return
    setTimer(remainingLock)
    const id = setInterval(() => {
      setTimer(t => { if (t <= 1) { clearInterval(id); return 0 } return t - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [isLocked, remainingLock])

  function handleConfirm() {
    if (isLocked) return
    if (login(input)) {
      navigate('/admin', { replace: true })
    } else {
      setError('비밀번호가 틀렸습니다.')
      setInput('')
    }
  }

  return (
    <PageLayout title="관리자 로그인" showBack mainClass="flex flex-col lg:flex-row lg:overflow-hidden">
      {/* PIN display */}
      <div className="flex flex-col items-center justify-center py-12 lg:py-0 px-8 flex-1 border-b lg:border-b-0 lg:border-r border-zinc-800 gap-5">
        <p className="text-xs text-zinc-600 uppercase tracking-[0.3em]">PIN 입력</p>
        <div className="text-5xl lg:text-6xl xl:text-7xl font-black text-slate-100 tracking-[0.4em] min-h-[72px] flex items-center">
          {input ? '●'.repeat(input.length) : <span className="text-zinc-800">— — — —</span>}
        </div>
        {isLocked && <p className="text-red-400 font-semibold text-sm">{timer}초 후 재시도 가능</p>}
        {error && !isLocked && <p className="text-red-400 text-sm">{error} ({attempts}/5)</p>}
      </div>

      {/* Numpad */}
      <div className="flex flex-col items-center justify-center px-6 lg:px-10 py-6 lg:py-0 gap-4 w-full lg:w-[320px] xl:w-[360px] lg:shrink-0">
        <Numpad value={input} onChange={setInput} maxLength={4} />
        <Button fullWidth size="lg" onClick={handleConfirm} disabled={isLocked || !input}>
          {isLocked ? `잠금 (${timer}초)` : '로그인'}
        </Button>
      </div>
    </PageLayout>
  )
}
