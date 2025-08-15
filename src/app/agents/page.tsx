'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAgents } from '@/hooks/useAgents'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { 
  Bot, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Clock,
  CheckCircle,
  Circle,
  Globe,
  Code,
  FileText,
  Settings
} from 'lucide-react'

export default function AgentsPage() {
  const { agents, loading, deleteAgent, updateAgentStatus } = useAgents()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')

  // Filter agents based on search and filter criteria
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && agent.isActive) ||
                         (filterActive === 'inactive' && !agent.isActive)
    
    return matchesSearch && matchesFilter
  })

  const handleDeleteAgent = async (agentId: string, agentName: string) => {
    if (window.confirm(`Are you sure you want to delete "${agentName}"? This action cannot be undone.`)) {
      await deleteAgent(agentId)
    }
  }

  const handleToggleActive = async (agentId: string, currentStatus: boolean) => {
    await updateAgentStatus(agentId, !currentStatus)
  }

  const getToolIcons = (agent: any) => {
    const tools = []
    if (agent.tool_selection_checkboxes_tool1) tools.push({ icon: Settings, name: 'General Tool' })
    if (agent.tool_selection_checkboxes_webSearch) tools.push({ icon: Globe, name: 'Web Search' })
    if (agent.tool_selection_checkboxes_codeExecution) tools.push({ icon: Code, name: 'Code Execution' })
    if (agent.tool_selection_checkboxes_fileAnalysis) tools.push({ icon: FileText, name: 'File Analysis' })
    return tools
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading agents...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Agent Management
              </h1>
              <p className="text-gray-600">
                Manage your AI agents, view details, and configure settings
              </p>
            </div>
            <Link href="/add-agent">
              <Button className="flex items-center gap-2 bg-black hover:bg-gray-800">
                <Plus className="w-4 h-4" />
                Create New Agent
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search agents by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Agents</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
                <p className="text-sm text-gray-600">Total Agents</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {agents.filter(a => a.isActive).length}
                </p>
                <p className="text-sm text-gray-600">Active Agents</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Circle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {agents.filter(a => !a.isActive).length}
                </p>
                <p className="text-sm text-gray-600">Inactive Agents</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agents List */}
        {filteredAgents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterActive !== 'all' ? 'No agents found' : 'No agents created yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterActive !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first AI agent'
              }
            </p>
            {!searchTerm && filterActive === 'all' && (
              <Link href="/add-agent">
                <Button className="bg-black hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Agent
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => {
              const tools = getToolIcons(agent)
              return (
                <div key={agent.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  {/* Agent Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        agent.isActive ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Bot className={`w-5 h-5 ${
                          agent.isActive ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {agent.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {agent.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <Circle className="w-3 h-3" />
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {agent.description}
                  </p>

                  {/* Tools */}
                  {tools.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">TOOLS</p>
                      <div className="flex flex-wrap gap-2">
                        {tools.map((tool, index) => {
                          const ToolIcon = tool.icon
                          return (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700"
                              title={tool.name}
                            >
                              <ToolIcon className="w-3 h-3" />
                              {tool.name}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                    <Clock className="w-3 h-3" />
                    Created {new Date(agent.createdAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(agent.id, agent.isActive)}
                      className="flex-1"
                    >
                      {agent.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <Link href={`/edit-agent/${agent.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAgent(agent.id, agent.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
