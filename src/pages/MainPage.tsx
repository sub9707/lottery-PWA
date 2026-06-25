import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLotteryStore } from '../store/useLotteryStore'
import { Button } from '../components/ui/Button'

const HOLD_MS = 800

function useFullscreen() {
  const [isFs, setIsFs] = useState(!!document.fullscreenElement)
  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])
  function enter() {
    document.documentElement.requestFullscreen?.().catch(() => {})
  }
  return { isFs, enter }
}

function HoldButton({
  children,
  onActivate,
  size = 'lg',
  variant = 'ghost',
}: {
  children: React.ReactNode
  onActivate: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'ghost' | 'danger' | 'success'
}) {
  const [progress, setProgress] = useState(0)
  const raf = useRef<number>(0)
  const start = useRef<number>(0)

  function beginHold() {
    start.current = Date.now()
    function tick() {
      const p = Math.min(100, ((Date.now() - start.current) / HOLD_MS) * 100)
      setProgress(p)
      if (p < 100) raf.current = requestAnimationFrame(tick)
      else { setProgress(0); onActivate() }
    }
    raf.current = requestAnimationFrame(tick)
  }

  function cancelHold() {
    cancelAnimationFrame(raf.current)
    setProgress(0)
  }

  return (
    <div className="relative overflow-hidden rounded">
      <div
        className="absolute inset-y-0 left-0 bg-zinc-600/50 pointer-events-none"
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? 'width 180ms ease-out' : 'none',
        }}
      />
      <Button
        size={size}
        variant={variant}
        fullWidth
        onPointerDown={beginHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        className="relative"
      >
        {children}
      </Button>
    </div>
  )
}

export function MainPage() {
  const navigate = useNavigate()
  const { winnerMap, prizes, confirmed } = useLotteryStore()
  const { isFs, enter } = useFullscreen()

  const isShuffled = Object.keys(winnerMap).length > 0
  const totalWinners = prizes.reduce((s, p) => s + p.count, 0)
  const confirmedCount = confirmed.length
  const rate = totalWinners > 0 ? Math.round((confirmedCount / totalWinners) * 100) : 0

  // 메인 화면에서 뒤로가기 차단 (PWA 이탈 방지)
  useEffect(() => {
    history.pushState(null, '', window.location.pathname)
    const block = () => history.pushState(null, '', window.location.pathname)
    window.addEventListener('popstate', block)
    return () => window.removeEventListener('popstate', block)
  }, [])

  return (
    <div className="min-h-screen lg:h-screen bg-zinc-950 flex flex-col lg:flex-row lg:overflow-hidden">
      {/* 전체화면 버튼 */}
      {!isFs && (
        <button
          onClick={enter}
          className="absolute top-3 right-3 z-10 text-zinc-700 hover:text-zinc-400 text-xs px-3 py-1.5 border border-zinc-800 rounded transition-colors"
        >
          전체화면
        </button>
      )}

      {/* Branding panel */}
      <div className="flex flex-col justify-center px-8 lg:px-16 pt-16 pb-8 lg:py-0 flex-1 border-b lg:border-b-0 lg:border-r border-zinc-800">
        <p className="text-xs text-zinc-600 uppercase tracking-[0.3em] mb-3">Event Lottery</p>
        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-slate-100 tracking-tight leading-none mb-8 lg:mb-10">
          행사<br />추첨
        </h1>

        {!isShuffled ? (
          <div className="border border-yellow-800 bg-yellow-950/40 rounded px-4 py-3 text-yellow-400 text-sm max-w-sm">
            번호 배정이 필요합니다 — 관리자 설정에서 번호 섞기를 실행하세요.
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-w-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 uppercase tracking-widest">진행률</span>
              <span className="text-slate-300 font-bold tabular-nums">{confirmedCount} / {totalWinners}</span>
            </div>
            <div className="bg-zinc-800 rounded-full h-2">
              <div
                className="bg-slate-300 h-2 rounded-full transition-all duration-500"
                style={{ width: `${rate}%` }}
              />
            </div>
            <p className="text-zinc-600 text-xs tabular-nums">{rate}% 완료</p>
          </div>
        )}
      </div>

      {/* Navigation panel */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-10 lg:py-0 gap-3 lg:flex-1">
        <Button size="xl" fullWidth onClick={() => navigate('/check')}>
          번호 확인
        </Button>
        <HoldButton onActivate={() => navigate('/admin/login')}>
          관리자 설정
        </HoldButton>
        <HoldButton onActivate={() => navigate('/stats')}>
          통계 보기
        </HoldButton>
      </div>
    </div>
  )
}
