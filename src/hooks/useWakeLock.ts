import { useEffect } from 'react'

type WakeLockSentinel = { release(): Promise<void> }
type NavWithWakeLock = Navigator & {
  wakeLock?: { request(type: 'screen'): Promise<WakeLockSentinel> }
}

export function useWakeLock() {
  useEffect(() => {
    let lock: WakeLockSentinel | null = null

    async function acquire() {
      try {
        const nav = navigator as NavWithWakeLock
        if (nav.wakeLock) lock = await nav.wakeLock.request('screen')
      } catch {}
    }

    acquire()

    // 탭 전환 후 복귀 시 재획득
    const reacquire = () => { if (document.visibilityState === 'visible') acquire() }
    document.addEventListener('visibilitychange', reacquire)
    return () => {
      document.removeEventListener('visibilitychange', reacquire)
      lock?.release()
    }
  }, [])
}
