import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'paprd_auth'

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

async function authRequest(path: string, body: object): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.detail ?? 'Something went wrong')
  return data
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session on load and verify it's still valid
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setLoading(false)
      return
    }
    try {
      const { token: savedToken, user: savedUser } = JSON.parse(stored)
      setUser(savedUser)
      setToken(savedToken)
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${savedToken}` } })
        .then((res) => {
          if (!res.ok) throw new Error('expired')
          return res.json()
        })
        .then(setUser)
        .catch(() => {
          // Backend offline or session expired — keep optimistic local session
          // only if the failure wasn't an explicit 401 (handled above by throw).
          setUser(savedUser)
        })
        .finally(() => setLoading(false))
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      setLoading(false)
    }
  }, [])

  const persist = (nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }))
  }

  const login = useCallback(async (email: string, password: string) => {
    const { token: t, user: u } = await authRequest('login', { email, password })
    persist(t, u)
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { token: t, user: u } = await authRequest('signup', { name, email, password })
    persist(t, u)
  }, [])

  const logout = useCallback(() => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [token])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
  )
}
