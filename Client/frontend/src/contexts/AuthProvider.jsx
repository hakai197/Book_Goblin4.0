import { useState, useEffect, useCallback } from 'react'
import AuthContext from './AuthContext'
import authService from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = authService.getCurrentUser()
    if (stored) setUser(stored)
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data)
    return data
  }, [])

  const register = useCallback(async (username, email, password) => {
    const data = await authService.register(username, email, password)
    setUser(data)
    return data
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
