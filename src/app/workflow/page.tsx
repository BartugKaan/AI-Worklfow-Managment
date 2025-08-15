'use client'

import React, { useState, useCallback } from 'react'
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useAgents, type Agent as AppAgent } from '@/hooks/useAgents'
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader'
import { WorkflowSidebar } from '@/components/workflow/WorkflowSidebar'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import { WorkflowRightSidebar } from '@/components/workflow/WorkflowRightSidebar'
import { WorkflowSaveModal } from '@/components/workflow/WorkflowSaveModal'
import { WorkflowExecutionModal } from '@/components/workflow/WorkflowExecutionModal'
import { useWorkflows } from '@/hooks/useWorkflows'
import { WorkflowApiService } from '@/lib/workflow-api'
import type { SavedWorkflow, WorkflowAgentInfo, WorkflowExecutionResult, WorkflowData } from '@/types/workflow'

// Local view model for agent info on nodes
type Agent = Pick<
  AppAgent,
  | 'id'
  | 'name'
  | 'description'
  | 'tool_selection_checkboxes_webSearch'
  | 'tool_selection_checkboxes_codeExecution'
  | 'tool_selection_checkboxes_fileAnalysis'
>

const X_POSITION_RANGE = 400
const Y_POSITION_RANGE = 200
const X_POSITION_OFFSET = 250
const Y_POSITION_OFFSET = 150

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'startNode',
    data: { label: 'START', agentId: 'START' },
    position: { x: 200, y: 300 },
    draggable: true,
  },
  {
    id: 'end',
    type: 'endNode',
    data: { label: 'END', agentId: 'END' },
    position: { x: 800, y: 300 },
    draggable: true,
  },
]

// Test connection between START and END
const initialEdges: Edge[] = [
  {
    id: 'start-end',
    source: 'start',
    target: 'end',
    type: 'custom',
  },
]

export default function WorkflowPage() {
  const { agents, loading } = useAgents()
  const { savedWorkflows, saveWorkflow, deleteWorkflow } = useWorkflows()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Move removeNode up here, before it's used
  const removeNode = useCallback((nodeId: string) => {
    setNodes((nodes) => nodes.filter(n => n.id !== nodeId));
    setEdges((edges) => edges.filter(e => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  // UI States
  const [showExecutionModal, setShowExecutionModal] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<WorkflowExecutionResult | null>(null)
  const [executionError, setExecutionError] = useState<string | null>(null)
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null)
  
  // Workflow save modal states
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Edge interaction states
  const [showAgentDropdown, setShowAgentDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

  // Connection handler
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds)),
    [setEdges]
  )

  // Handle edge button events
  React.useEffect(() => {
    const handleAddAgentOnEdge = (event: Event) => {
      const customEvent = event as CustomEvent<{
        edgeId: string
        labelX: number
        labelY: number
      }>
      const { edgeId, labelX, labelY } = customEvent.detail
      setSelectedEdgeId(edgeId)
      setDropdownPosition({ x: labelX, y: labelY })
      setShowAgentDropdown(true)
    }

    const handleDeleteEdge = (event: Event) => {
      const customEvent = event as CustomEvent<{ edgeId: string }>
      const { edgeId } = customEvent.detail
      setEdges((edges) => edges.filter((edge) => edge.id !== edgeId))
    }

    window.addEventListener('addAgentOnEdge', handleAddAgentOnEdge)
    window.addEventListener('deleteEdge', handleDeleteEdge)

    return () => {
      window.removeEventListener('addAgentOnEdge', handleAddAgentOnEdge)
      window.removeEventListener('deleteEdge', handleDeleteEdge)
    }
  }, [setEdges])

  // Handle adding agent on edge
  const handleAgentSelection = useCallback(
    (agent: Agent) => {
      if (!selectedEdgeId) return

      // Find the selected edge
      const edge = edges.find((e) => e.id === selectedEdgeId)
      if (!edge) return

      // Create a new agent node with modern styling
      const nodeId = `agent-${agent.id}-${Date.now()}`
      const agentInfo: WorkflowAgentInfo = {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        tool_selection_checkboxes_webSearch:
          agent.tool_selection_checkboxes_webSearch,
        tool_selection_checkboxes_codeExecution:
          agent.tool_selection_checkboxes_codeExecution,
        tool_selection_checkboxes_fileAnalysis:
          agent.tool_selection_checkboxes_fileAnalysis,
      }

      const newAgentNode: Node = {
        id: nodeId,
        type: 'agentNode',
        data: {
          agentInfo,
          label: agent.name,
          agentId: agent.id,
          onRemove: () => removeNode(nodeId),
        },
        position: {
          x: dropdownPosition.x - 96, // Center the node (width/2)
          y: dropdownPosition.y - 60,
        },
        draggable: true,
      }

      // Remove the old edge and create two new edges
      setEdges((edges) => {
        const filteredEdges = edges.filter((e) => e.id !== selectedEdgeId)
        const newEdges = [
          {
            id: `${edge.source}-${newAgentNode.id}`,
            source: edge.source,
            target: newAgentNode.id,
            type: 'custom',
          },
          {
            id: `${newAgentNode.id}-${edge.target}`,
            source: newAgentNode.id,
            target: edge.target,
            type: 'custom',
          },
        ]
        return [...filteredEdges, ...newEdges]
      })

      // Add the new node
      setNodes((nodes) => [...nodes, newAgentNode])

      // Close dropdown
      setShowAgentDropdown(false)
      setSelectedEdgeId(null)
    },
    [edges, selectedEdgeId, dropdownPosition, setEdges, setNodes, removeNode]
  )

  // Add agent to workflow from sidebar
  const addAgentToWorkflow = useCallback(
    (agent: Agent) => {
      const nodeId = `agent-${agent.id}-${Date.now()}`; // Create ID once
      const agentInfo: WorkflowAgentInfo = {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        tool_selection_checkboxes_webSearch:
          agent.tool_selection_checkboxes_webSearch,
        tool_selection_checkboxes_codeExecution:
          agent.tool_selection_checkboxes_codeExecution,
        tool_selection_checkboxes_fileAnalysis:
          agent.tool_selection_checkboxes_fileAnalysis,
      }

      const newNode: Node = {
        id: nodeId, // Use the same ID
        type: 'agentNode',
        data: {
          agentInfo,
          label: agent.name,
          agentId: agent.id,
          onRemove: () => removeNode(nodeId),
        },
        position: {
          x: Math.random() * X_POSITION_RANGE + X_POSITION_OFFSET,
          y: Math.random() * Y_POSITION_RANGE + Y_POSITION_OFFSET,
        },
        draggable: true,
      }

      setNodes((nodes) => [...nodes, newNode])
    },
    [setNodes, removeNode]
  )

  // Action handlers
  const handleSave = () => {
    setShowSaveModal(true)
  }

  const handleSaveWorkflow = async (name: string, description?: string) => {
    setIsSaving(true)
    try {
      // Simulate saving delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const savedWorkflow = saveWorkflow(name, nodes, edges, description)
      console.log('Workflow saved:', savedWorkflow)
      
    } catch (error) {
      console.error('Error saving workflow:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async () => {
    // First save the workflow to get an ID if we don't have one
    if (!currentWorkflowId) {
      try {
        const workflowData: WorkflowData = {
          name: `Workflow_${Date.now()}`,
          nodes,
          edges,
        }
        const savedWorkflow = await WorkflowApiService.saveWorkflow(workflowData)
        setCurrentWorkflowId(savedWorkflow.id || null)
      } catch (error) {
        console.error('Error saving workflow before execution:', error)
        setExecutionError('Failed to save workflow before execution')
        setShowExecutionModal(true)
        return
      }
    }
    
    // Reset previous results and show execution modal
    setExecutionResult(null)
    setExecutionError(null)
    setShowExecutionModal(true)
  }

  const handleExecuteWorkflow = async (inputText: string) => {
    if (!currentWorkflowId) {
      setExecutionError('No workflow ID available for execution')
      return
    }

    setIsExecuting(true)
    setExecutionError(null)
    
    try {
      // Create workflow data for execution
      const workflowData: WorkflowData = {
        id: currentWorkflowId,
        name: `Workflow_${Date.now()}`,
        nodes,
        edges,
      }
      
      // Use the new sync method to ensure agents exist in backend before execution
      const result = await WorkflowApiService.executeWithAgentSync(
        workflowData,
        inputText,
        agents
      )
      setExecutionResult(result)
    } catch (error) {
      console.error('Error executing workflow:', error)
      setExecutionError(error instanceof Error ? error.message : 'Failed to execute workflow')
    } finally {
      setIsExecuting(false)
    }
  }

  // system selection removed

  const handleCloseDropdown = () => {
    setShowAgentDropdown(false)
    setSelectedEdgeId(null)
  }

  // Right sidebar handlers  
  const handleWorkflowLoad = (workflow: SavedWorkflow) => {
    setNodes(workflow.nodes || [])
    setEdges(workflow.edges || [])
    console.log('Workflow loaded:', workflow)
  }

  const handleWorkflowDelete = (workflowId: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(workflowId)
      console.log('Workflow deleted:', workflowId)
    }
  }

  const handleWorkflowPreview = (workflow: SavedWorkflow) => {
    handleWorkflowLoad(workflow)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <WorkflowHeader
        onSave={handleSave}
        onTest={handleTest}
        isRunningTest={isExecuting}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <WorkflowSidebar
          agents={agents}
          loading={loading}
          onAgentAdd={addAgentToWorkflow}
        />

        {/* Canvas */}
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          showAgentDropdown={showAgentDropdown}
          dropdownPosition={dropdownPosition}
          agents={agents}
          onAgentSelection={handleAgentSelection}
          onCloseDropdown={handleCloseDropdown}
        />

        {/* Right Sidebar - Saved Workflows */}
        <WorkflowRightSidebar
          savedWorkflows={savedWorkflows}
          onWorkflowLoad={handleWorkflowLoad}
          onWorkflowDelete={handleWorkflowDelete}
          onWorkflowPreview={handleWorkflowPreview}
        />
      </div>

      {/* Workflow Execution Modal */}
      <WorkflowExecutionModal
        isOpen={showExecutionModal}
        onClose={() => {
          setShowExecutionModal(false)
          setExecutionResult(null)
          setExecutionError(null)
        }}
        onExecute={handleExecuteWorkflow}
        isExecuting={isExecuting}
        executionResult={executionResult}
        error={executionError}
      />

      {/* Workflow Save Modal */}
      <WorkflowSaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveWorkflow}
        isLoading={isSaving}
      />
    </div>
  )
}
