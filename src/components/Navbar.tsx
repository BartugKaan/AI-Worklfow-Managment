'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, Workflow, Users, Plus, Home, Wrench, LogIn, UserPlus, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { LoginModal } from '@/components/auth/LoginModal'
import { RegisterModal } from '@/components/auth/RegisterModal'

export const Navbar = () => {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      active: pathname === '/'
    },
    {
      name: 'Workflow',
      href: '/workflow',
      icon: Workflow,
      active: pathname === '/workflow'
    },
    {
      name: 'Tools',
      href: '/tools',
      icon: Wrench,
      active: pathname === '/tools'
    },
    {
      name: 'Agent Management',
      href: '/agents',
      icon: Users,
      active: pathname === '/agents'
    }
  ]

  const handleSwitchToRegister = () => {
    setShowLoginModal(false)
    setShowRegisterModal(true)
  }

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-black rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">
                AI Workflow
              </h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>

          {/* Navigation Links - Only for logged in users */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${item.active 
                        ? 'bg-black text-white' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              // For logged in user
              <>
                <Link href="/add-agent">
                  <Button className="flex items-center gap-2 bg-black hover:bg-gray-800">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Agent</span>
                  </Button>
                </Link>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.full_name}</span>
                </div>
                
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              // For non-logged in user
              <>
                <Button
                  onClick={() => setShowLoginModal(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
                
                <Button
                  onClick={() => setShowRegisterModal(true)}
                  className="flex items-center gap-2 bg-black hover:bg-gray-800"
                  size="sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Register</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Only for logged in users */}
        {isAuthenticated && (
          <div className="md:hidden border-t border-gray-200 pt-2 pb-3">
            <div className="flex flex-wrap gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${item.active 
                        ? 'bg-black text-white' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Mobile Auth Actions - For non-logged in users */}
        {!isAuthenticated && (
          <div className="md:hidden border-t border-gray-200 pt-2 pb-3">
            <div className="flex gap-2">
              <Button
                onClick={() => setShowLoginModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 flex-1"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
              
              <Button
                onClick={() => setShowRegisterModal(true)}
                className="flex items-center gap-2 bg-black hover:bg-gray-800 flex-1"
                size="sm"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </nav>
  )
}
