'use client'

import React, { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Show spinner during loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Auth required but user is not logged in
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-6">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Login Required
              </h1>
              <p className="text-gray-600">
                You need to log in to access this page.
              </p>
            </div>
            
            <div className="text-sm text-gray-500">
              Please log in or register from the top menu.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If auth is not required or user is logged in, render children
  return <>{children}</>
}
