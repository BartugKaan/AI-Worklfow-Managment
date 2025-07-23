'use client'

import { useState, useEffect } from 'react'

export interface Agent {
  id: string
  name: string
  description: string
  systemPrompt: string
  queryPrompt: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  // Tool selection checkboxes
  tool_selection_checkboxes_tool1: boolean
  tool_selection_checkboxes_webSearch: boolean
  tool_selection_checkboxes_codeExecution: boolean
  tool_selection_checkboxes_fileAnalysis: boolean
}

export interface CreateAgentData {
  name: string
  description: string
  systemPrompt: string
  queryPrompt: string
  toolConfig?: {
    tool1?: boolean
    webSearch?: boolean
    codeExecution?: boolean
    fileAnalysis?: boolean
  }
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all agents
  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agents')
      if (!response.ok) {
        throw new Error('Failed to fetch agents')
      }
      const data = await response.json()
      setAgents(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching agents:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create new agent
  const createAgent = async (
    agentData: CreateAgentData
  ): Promise<Agent | null> => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      })

      if (!response.ok) {
        throw new Error('Failed to create agent')
      }

      const newAgent = await response.json()
      setAgents((prev) => [newAgent, ...prev])
      return newAgent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error creating agent:', err)
      return null
    }
  }

  // Update agent active status
  const updateAgentStatus = async (
    id: string,
    isActive: boolean
  ): Promise<boolean> => {
    try {
      // First, set all agents to inactive if we're activating this one
      if (isActive) {
        const updatedAgents = agents.map((agent) => ({
          ...agent,
          isActive: agent.id === id,
        }))
        setAgents(updatedAgents)
      }

      const agent = agents.find((a) => a.id === id)
      if (!agent) return false

      const response = await fetch(`/api/agents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...agent, isActive }),
      })

      if (!response.ok) {
        throw new Error('Failed to update agent')
      }

      // Refresh agents after update
      await fetchAgents()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error updating agent:', err)
      return false
    }
  }

  // Delete agent
  const deleteAgent = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete agent')
      }

      setAgents((prev) => prev.filter((agent) => agent.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error deleting agent:', err)
      return false
    }
  }

  // Get active agent
  const getActiveAgent = () => {
    return agents.find((agent) => agent.isActive) || null
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  return {
    agents,
    loading,
    error,
    createAgent,
    updateAgentStatus,
    deleteAgent,
    getActiveAgent,
    refreshAgents: fetchAgents,
  }
}
