'use client'

import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Node, Edge } from '@xyflow/react'
import type { SavedWorkflow } from '@/types/workflow'

const STORAGE_KEY = 'ai-workflow-saved-workflows'

export function useWorkflows() {
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([])
  const [loading, setLoading] = useState(true)

  // Load workflows from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const workflows = JSON.parse(stored)
        // Convert date strings back to Date objects and sanitize nodes
        const workflowsWithDates = workflows.map((workflow: any) => ({
          ...workflow,
          createdAt: workflow.createdAt ? new Date(workflow.createdAt) : new Date(),
          updatedAt: workflow.updatedAt ? new Date(workflow.updatedAt) : new Date(),
          nodes: Array.isArray(workflow.nodes)
            ? workflow.nodes.map((node: any) => {
                const data = node?.data || {}
                // If label is a plain object (from JSON of a React element), drop it
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
      }
    } catch (error) {
      console.error('Error loading workflows from localStorage:', error)
      setSavedWorkflows([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Save workflows to localStorage whenever savedWorkflows changes
  const saveToStorage = useCallback((workflows: SavedWorkflow[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows))
    } catch (error) {
      console.error('Error saving workflows to localStorage:', error)
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
            // keep agentInfo as-is if present; always null out label to ensure serializable
            agentInfo: data.agentInfo || undefined,
            label: null,
          },
        }
      }
      return node
    })
  }, [])

  // Save a new workflow
  const saveWorkflow = useCallback((
    name: string,
    nodes: Node[],
    edges: Edge[],
    description?: string
  ) => {
    const { nodeCount, agentCount } = generateWorkflowStats(nodes, edges)
    
    const newWorkflow: SavedWorkflow = {
      id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      nodeCount,
      agentCount,
      nodes: serializeNodes(nodes), // Serialize nodes for storage
      edges: JSON.parse(JSON.stringify(edges)), // Deep clone
    }

    const updatedWorkflows = [newWorkflow, ...savedWorkflows]
    setSavedWorkflows(updatedWorkflows)
    saveToStorage(updatedWorkflows)
    
    return newWorkflow
  }, [savedWorkflows, saveToStorage, generateWorkflowStats, serializeNodes])

  // Delete a workflow
  const deleteWorkflow = useCallback((workflowId: string) => {
    const updatedWorkflows = savedWorkflows.filter(workflow => workflow.id !== workflowId)
    setSavedWorkflows(updatedWorkflows)
    saveToStorage(updatedWorkflows)
    
    return true
  }, [savedWorkflows, saveToStorage])

  return {
    // State
    savedWorkflows,
    loading,
    
    // Actions
    saveWorkflow,
    deleteWorkflow,
  }
}