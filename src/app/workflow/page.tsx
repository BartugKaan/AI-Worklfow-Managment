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
import { useWorkflows } from '@/hooks/useWorkflows'
import type { SavedWorkflow, WorkflowAgentInfo } from '@/types/workflow'

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
    data: {},
    position: { x: 200, y: 300 },
    draggable: true,
  },
  {
    id: 'end',
    type: 'endNode',
    data: {},
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
  const [showTestModal, setShowTestModal] = useState(false)
  const [testResult, setTestResult] = useState('')
  const [isRunningTest, setIsRunningTest] = useState(false)
  
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
          label: null,
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
          label: null,
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
      
      // Optional: Show success message
      // You could add a toast notification here
    } catch (error) {
      console.error('Error saving workflow:', error)
      // Handle error - could show error toast
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = () => {
    setShowTestModal(true)
    setIsRunningTest(true)
    setTimeout(() => {
      setIsRunningTest(false)
      setTestResult('Workflow test completed successfully!')
    }, 2000)
  }

  // system selection removed

  const handleCloseDropdown = () => {
    setShowAgentDropdown(false)
    setSelectedEdgeId(null)
  }

  // Right sidebar handlers  
  const handleWorkflowLoad = (workflow: SavedWorkflow) => {
    // For now, just set the workflow directly
    // The deserialization will be handled in the useWorkflows hook
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
    // For now, just load the workflow
    // In the future, this could open a preview modal
    handleWorkflowLoad(workflow)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <WorkflowHeader
        onSave={handleSave}
        onTest={handleTest}
        isRunningTest={isRunningTest}
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

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Test Workflow</h3>
            {isRunningTest ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Running workflow test...</p>
              </div>
            ) : (
              <div>
                <p className="text-green-600 mb-4">{testResult}</p>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer hover:shadow-lg transition-all duration-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
