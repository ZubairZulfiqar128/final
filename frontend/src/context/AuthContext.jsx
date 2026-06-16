import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { fetchMe, loginUser, registerUser } from '../services/api'

const TOKEN_KEY = 'maison-chronos-token'

const AuthContext = createContext(null)

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

/**
 * JWT auth state: register, login, logout, and session restore on refresh.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(readToken)
  const [loading, setLoading] = useState(() => !!readToken())

  const persistSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    try {
      if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken)
      else localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* private mode */
    }
  }, [])

  const logout = useCallback(() => {
    persistSession(null, null)
  }, [persistSession])

  // Restore session from JWT on mount
  useEffect(() => {
    if (!token) return

    let cancelled = false
    fetchMe(token)
      .then((data) => {
        if (!cancelled) setUser(data.user)
      })
      .catch(() => {
        if (!cancelled) logout()
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, logout])

  const login = useCallback(
    async ({ email, password, guestItems = [] }) => {
      const data = await loginUser({ email, password, guestItems })
      persistSession(data.token, data.user)
      return data.user
    },
    [persistSession]
  )

  const register = useCallback(
    async ({ name, email, password, guestItems = [] }) => {
      const data = await registerUser({ name, email, password, guestItems })
      persistSession(data.token, data.user)
      return data.user
    },
    [persistSession]
  )

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user && !!token,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { TOKEN_KEY as AUTH_TOKEN_KEY }
