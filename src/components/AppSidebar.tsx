'use client'

import React from 'react'
import Link from 'next/link'
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'
import { Sidebar } from './ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Bot, Plus, Loader2, MoreVertical, Trash2, Edit, X } from 'lucide-react'
import { Button } from './ui/button'
import { useAgents } from '@/hooks/useAgents'
import { useIsMobile } from '@/hooks/use-mobile'

function AppSidebar() {
  const { agents, loading, error, deleteAgent } = useAgents()
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  const handleAgentClick = async (agentId: string) => {
    // Always navigate to the agent chat page
    window.location.href = `/agent/${agentId}`
  }

  const handleDeleteAgent = async (agentId: string) => {
    const agent = agents.find((agent) => agent.id === agentId)

    if (!agent) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${agent.name}?`
    )

    if (!confirmed) return

    try {
      const success = await deleteAgent(agentId)
      if (!success) throw new Error('Failed to delete agent')
    } catch (error) {
      console.error('Error deleting agent:', error)
      alert('Failed to delete agent. Please try again.')
    }
  }

  const handleEditAgent = async (agentId: string) => {
    // Navigate to edit agent page
    window.location.href = `/edit-agent/${agentId}`
  }

  if (error) {
    console.error('Error loading agents:', error)
  }

  return (
    <Sidebar 
      className="bg-white text-black border-r border-gray-200 w-full max-w-[85vw] md:w-80 md:max-w-none"
      collapsible="offcanvas"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-black">Agents</h2>
          <div className="flex items-center gap-2">
            {/* Mobile Close Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-8 w-8 p-0 md:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Link href="/add-agent">
              <Button variant="outline" size="sm" className="gap-2 min-h-[44px] px-3">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Agent</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Workflow Builder Link */}
        <Link href="/workflow">
          <Button
            variant="outline"
            className="w-full gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 min-h-[44px] justify-start"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Workflow Builder</span>
            <span className="sm:hidden">Workflow</span>
          </Button>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-600 text-sm">
                  Failed to load agents
                </div>
              ) : agents.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No agents yet. Create your first agent!
                </div>
              ) : (
                agents.map((agent) => (
                  <SidebarMenuItem key={agent.id}>
                    <div
                      className={`w-full rounded-lg mb-2 transition-colors py-4 px-3 group min-h-[60px] ${
                        agent.isActive
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div
                          className="flex items-start gap-3 flex-1 cursor-pointer"
                          onClick={() => handleAgentClick(agent.id)}
                        >
                          <div className="relative">
                            <Bot className="w-5 h-5 mt-0.5" />
                            {agent.isActive && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-black"></div>
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm">
                              {agent.name}
                            </div>
                            <div className="text-xs opacity-75">
                              {agent.description}
                            </div>
                          </div>
                        </div>

                        {/* Dropdown Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-10 w-10 p-0 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-manipulation`}
                              onClick={(e: React.MouseEvent) =>
                                e.stopPropagation()
                              }
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation()
                                handleDeleteAgent(agent.id)
                              }}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation()
                                handleEditAgent(agent.id)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar
