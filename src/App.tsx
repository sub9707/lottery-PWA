import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useLotteryStore } from './store/useLotteryStore'
import { useWakeLock } from './hooks/useWakeLock'
import { MainPage } from './pages/MainPage'
import { CheckPage } from './pages/CheckPage'
import { StatsPage } from './pages/StatsPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminPage } from './pages/admin/AdminPage'

function OfflineBanner() {
  const offline = !navigator.onLine
  if (!offline) return null
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-red-900 text-red-400 text-center text-xs py-2 font-semibold tracking-widest uppercase">
      오프라인 상태
    </div>
  )
}

export default function App() {
  const { hydrate, loading } = useLotteryStore()
  useWakeLock()

  useEffect(() => { hydrate() }, [hydrate])

  // 컨텍스트 메뉴 차단
  useEffect(() => {
    const block = (e: Event) => e.preventDefault()
    document.addEventListener('contextmenu', block)
    return () => document.removeEventListener('contextmenu', block)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-zinc-600 text-sm tracking-widest uppercase">Loading</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/check" element={<CheckPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
