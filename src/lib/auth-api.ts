/**
 * Authentication API Service
 * API service for authentication operations with Next.js backend
 */

const API_BASE_URL = '/api/auth'

export interface LoginRequest {
  username: string // will be used as email
  password: string
}

export interface RegisterRequest {
  email: string
  full_name: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface UserResponse {
  id: string
  email: string
  full_name: string
}

export class AuthApiService {
  /**
   * Create user registration
   */
  static async register(userData: RegisterRequest): Promise<UserResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      const result = await response.json()
      return result.user
    } catch (error) {
      console.error('Register API error:', error)
      throw error
    }
  }

  /**
   * User login
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Send in OAuth2PasswordRequestForm format
      const formData = new FormData()
      formData.append('username', credentials.username)
      formData.append('password', credentials.password)

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Login failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Login API error:', error)
      throw error
    }
  }

  /**
   * Get current user information
   */
  static async getCurrentUser(token: string): Promise<UserResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to get user information')
      }

      return await response.json()
    } catch (error) {
      console.error('Get current user API error:', error)
      throw error
    }
  }

  /**
   * Get token from localStorage
   */
  static getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  /**
   * Save token to localStorage
   */
  static setStoredToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', token)
  }

  /**
   * Remove token from localStorage
   */
  static removeStoredToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
  }

  /**
   * Save user information to localStorage
   */
  static setStoredUser(user: UserResponse): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_user', JSON.stringify(user))
  }

  /**
   * Get user information from localStorage
   */
  static getStoredUser(): UserResponse | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('auth_user')
    return userStr ? JSON.parse(userStr) : null
  }

  /**
   * Remove user information from localStorage
   */
  static removeStoredUser(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_user')
  }

  /**
   * Logout - clear all auth data
   */
  static logout(): void {
    this.removeStoredToken()
    this.removeStoredUser()
  }
}
