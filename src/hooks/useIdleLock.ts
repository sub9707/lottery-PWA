import { useState, useEffect, useCallback } from 'react'

const IDLE_MS = 5 * 60 * 1000 // 5분

export function useIdleLock() {
  const [locked, setLocked] = useState(false)

  const unlock = useCallback(() => setLocked(false), [])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    function reset() {
      clearTimeout(timer)
      if (!locked) timer = setTimeout(() => setLocked(true), IDLE_MS)
    }

    const events = ['pointerdown', 'pointermove', 'keydown'] as const
    events.forEach(e => document.addEventListener(e, reset, { passive: true }))
    reset()

    return () => {
      clearTimeout(timer)
      events.forEach(e => document.removeEventListener(e, reset))
    }
  }, [locked])

  return { locked, unlock }
}
