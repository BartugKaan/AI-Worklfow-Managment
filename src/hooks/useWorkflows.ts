'use client'

import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Node, Edge } from '@xyflow/react'
import type { SavedWorkflow } from '@/types/workflow'

const STORAGE_KEY = 'ai-workflow-saved-workflows'

export function useWorkflows() {
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([])
  const [loading, setLoading] = useState(true)

  // Load workflows from database on mount
  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        // First check if we need to migrate localStorage data
        const localStorageData = localStorage.getItem(STORAGE_KEY)
        if (localStorageData) {
          await migrateLocalStorageData(localStorageData)
          localStorage.removeItem(STORAGE_KEY) // Clear localStorage after migration
        }

        // Load workflows from database
        const response = await fetch('/api/workflows')
        if (!response.ok) {
          throw new Error('Failed to fetch workflows')
        }

        const workflows = await response.json()
        const workflowsWithDates = workflows.map((workflow: any) => ({
          ...workflow,
          createdAt: workflow.createdAt ? new Date(workflow.createdAt) : new Date(),
          updatedAt: workflow.updatedAt ? new Date(workflow.updatedAt) : new Date(),
          nodes: Array.isArray(workflow.nodes)
            ? workflow.nodes.map((node: any) => {
                const data = node?.data || {}
                const nextLabel =
                  data && typeof data.label !== 'undefined'
                    ? (React.isValidElement?.(data.label) ? data.label : null)
                    : undefined
                return {
                  ...node,
                  data:
                    nextLabel === undefined
                      ? data
                      : { ...data, label: nextLabel },
                }
              })
            : [],
        }))
        setSavedWorkflows(workflowsWithDates)
      } catch (error) {
        console.error('Error loading workflows:', error)
        setSavedWorkflows([])
      } finally {
        setLoading(false)
      }
    }

    loadWorkflows()
  }, [])

  // Migrate localStorage data to database
  const migrateLocalStorageData = async (localStorageData: string) => {
    try {
      const workflows = JSON.parse(localStorageData)
      console.log('Migrating localStorage workflows to database...')
      
      const response = await fetch('/api/workflows/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflows }),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log(`Successfully migrated ${result.migratedCount} workflows`)
      }
    } catch (error) {
      console.error('Error migrating localStorage data:', error)
    }
  }

  // Save workflow to database
  const saveWorkflowToDb = useCallback(async (workflow: SavedWorkflow) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      })

      if (!response.ok) {
        throw new Error('Failed to save workflow')
      }

      const savedWorkflow = await response.json()
      return savedWorkflow
    } catch (error) {
      console.error('Error saving workflow to database:', error)
      throw error
    }
  }, [])

  // Generate workflow statistics
  const generateWorkflowStats = useCallback((nodes: Node[], edges: Edge[]) => {
    const nodeCount = nodes.length
    const agentCount = nodes.filter(node => node.type === 'agentNode').length
    
    return { nodeCount, agentCount }
  }, [])

  // Serialize nodes for storage (remove JSX elements)
  const serializeNodes = useCallback((nodes: Node[]) => {
    return nodes.map((node: any) => {
      if (node?.type === 'agentNode') {
        const data = node.data || {}
        const hasNonSerializableLabel =
          typeof data.label !== 'undefined' && !(
            typeof data.label === 'string' || Array.isArray(data.label) || data.label == null
          )
        return {
          ...node,
          data: {
            ...data,
            agentInfo: data.agentInfo || undefined,
            label: null,
          },
        }
      }
      return node
    })
  }, [])

  // Save a new workflow
  const saveWorkflow = useCallback(async (
    name: string,
    nodes: Node[],
    edges: Edge[],
    description?: string
  ) => {
    const { nodeCount, agentCount } = generateWorkflowStats(nodes, edges)
    
    const workflowData = {
      name,
      description,
      nodeCount,
      agentCount,
      nodes: serializeNodes(nodes),
      edges: JSON.parse(JSON.stringify(edges)),
    }

    try {
      const savedWorkflow = await saveWorkflowToDb(workflowData as SavedWorkflow)
      
      // Update local state
      const updatedWorkflows = [savedWorkflow, ...savedWorkflows]
      setSavedWorkflows(updatedWorkflows)
      
      return savedWorkflow
    } catch (error) {
      console.error('Failed to save workflow:', error)
      throw error
    }
  }, [savedWorkflows, saveWorkflowToDb, generateWorkflowStats, serializeNodes])

  // Delete a workflow
  const deleteWorkflow = useCallback(async (workflowId: string) => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete workflow')
      }

      // Update local state
      const updatedWorkflows = savedWorkflows.filter(workflow => workflow.id !== workflowId)
      setSavedWorkflows(updatedWorkflows)
      
      return true
    } catch (error) {
      console.error('Failed to delete workflow:', error)
      throw error
    }
  }, [savedWorkflows])

  return {
    // State
    savedWorkflows,
    loading,
    
    // Actions
    saveWorkflow,
    deleteWorkflow,
  }
}