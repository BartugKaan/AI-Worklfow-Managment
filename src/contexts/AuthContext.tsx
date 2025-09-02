'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AuthApiService, UserResponse, LoginRequest, RegisterRequest } from '@/lib/auth-api'

interface AuthContextType {
  user: UserResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check current auth status when page loads
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = AuthApiService.getStoredToken()
        const storedUser = AuthApiService.getStoredUser()

        if (storedToken && storedUser) {
          // Check token validity
          try {
            const currentUser = await AuthApiService.getCurrentUser(storedToken)
            setUser(currentUser)
          } catch (error) {
            // Clear if token is invalid
            console.warn('Stored token invalid, clearing:', error)
            AuthApiService.logout()
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        AuthApiService.logout()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      
      // Login API call
      const authResponse = await AuthApiService.login(credentials)
      
      // Save token
      AuthApiService.setStoredToken(authResponse.access_token)
      
      // Get user information
      const userData = await AuthApiService.getCurrentUser(authResponse.access_token)
      
      // Save user information
      AuthApiService.setStoredUser(userData)
      setUser(userData)
      
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true)
      
      // Register API call
      const newUser = await AuthApiService.register(userData)
      
      // Auto login after successful registration
      await login({
        username: userData.email,
        password: userData.password
      })
      
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    AuthApiService.logout()
    setUser(null)
    router.push('/') // Ana sayfaya yönlendirme
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth hook must be used within AuthProvider')
  }
  return context
}
