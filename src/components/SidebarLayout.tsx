'use client'

import React from 'react'
import { SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import AppSidebar from '@/components/AppSidebar'

interface SidebarLayoutProps {
  children: React.ReactNode
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const { open, setOpen } = useSidebar()
  const isMobile = useIsMobile()
  
  return (
    <>
      <AppSidebar />
      
      {/* Mobile Backdrop - Only show on mobile when sidebar is open */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      
      <SidebarInset className="relative">
        {/* Toggle Button - Mobile-friendly positioning */}
        <SidebarTrigger 
          className={`fixed z-50 bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 ${
            isMobile 
              ? 'top-4 left-4 p-3 w-12 h-12' // Mobile: top-left, larger
              : open 
                ? 'top-1/2 -translate-y-1/2 left-80 p-2 w-10 h-10' // Desktop: dynamic position when open
                : 'top-1/2 -translate-y-1/2 left-4 p-2 w-10 h-10' // Desktop: left when closed
          }`} 
        />
        
        <main className="flex-1 h-full">
          {children}
        </main>
      </SidebarInset>
    </>
  )
}
