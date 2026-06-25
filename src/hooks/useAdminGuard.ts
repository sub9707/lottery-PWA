import { useState, useCallback } from 'react'
import { useLotteryStore } from '../store/useLotteryStore'
import { MAX_LOGIN_ATTEMPTS, LOCKOUT_SECONDS } from '../constants/lottery'

export function useAdminGuard() {
  const { adminPassword } = useLotteryStore()
  const [authenticated, setAuthenticated] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)

  const login = useCallback((input: string): boolean => {
    const now = Date.now()
    if (lockedUntil && now < lockedUntil) return false

    if (input === adminPassword) {
      setAuthenticated(true)
      setAttempts(0)
      return true
    }

    const next = attempts + 1
    setAttempts(next)
    if (next >= MAX_LOGIN_ATTEMPTS) {
      setLockedUntil(now + LOCKOUT_SECONDS * 1000)
      setAttempts(0)
    }
    return false
  }, [adminPassword, attempts, lockedUntil])

  const logout = useCallback(() => setAuthenticated(false), [])

  const isLocked = lockedUntil ? Date.now() < lockedUntil : false
  const remainingLock = lockedUntil ? Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000)) : 0

  return { authenticated, login, logout, isLocked, remainingLock, attempts }
}
