import { createContext, useContext, useState, useCallback } from 'react'

export interface DoctorUser {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: DoctorUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DoctorUser | null>(null)

  // Check for stored auth on mount
  useState(() => {
    const storedUser = localStorage.getItem('doctorUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  })

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login - accepts any credentials
    const mockUser: DoctorUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
    }
    setUser(mockUser)
    localStorage.setItem('doctorUser', JSON.stringify(mockUser))
  }, [])

  const signup = useCallback(async (email: string, _password: string, name: string) => {
    // Mock signup - creates new user
    const mockUser: DoctorUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
    }
    setUser(mockUser)
    localStorage.setItem('doctorUser', JSON.stringify(mockUser))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('doctorUser')
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
