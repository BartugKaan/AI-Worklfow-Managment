import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AI Agent Workflow System',
  description: 'Multi-Agent Workflow Management System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white h-full`}
      >
        <SidebarProvider>
          <div className="flex h-full w-full">
            <AppSidebar />
            <main className="flex-1 min-w-0 h-full">
              <div className="h-full w-full">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
