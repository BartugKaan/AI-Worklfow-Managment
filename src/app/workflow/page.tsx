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
import { Bot } from 'lucide-react'
import { useAgents } from '@/hooks/useAgents'
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader'
import { WorkflowSidebar } from '@/components/workflow/WorkflowSidebar'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import { Trash2 } from 'lucide-react'

// Agent interface
interface Agent {
  id: string
  name: string
  description: string
  tool_selection_checkboxes_webSearch: boolean
  tool_selection_checkboxes_codeExecution: boolean
  tool_selection_checkboxes_fileAnalysis: boolean
}

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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Move removeNode up here, before it's used
  const removeNode = useCallback((nodeId: string) => {
    setNodes((nodes) => nodes.filter(n => n.id !== nodeId));
    setEdges((edges) => edges.filter(e => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  // UI States
  const [selectedSystem, setSelectedSystem] = useState('react-flow')
  const [showTestModal, setShowTestModal] = useState(false)
  const [testResult, setTestResult] = useState('')
  const [isRunningTest, setIsRunningTest] = useState(false)

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
     const newAgentNode: Node = {
  id: `agent-${agent.id}-${Date.now()}`,
  type: 'agentNode',
  data: {
    label: (
      <div className="relative bg-gradient-to-br from-white via-slate-50 to-gray-50 border border-slate-200/60 rounded-2xl shadow-xl p-7 w-52 transition-all duration-300 hover:shadow-2xl hover:border-blue-300/40 backdrop-blur-sm">
        {/* Remove Button */}
        <button
          className="absolute right-2 top-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setNodes((nodes) => nodes.filter(n => n.id !== `agent-${agent.id}-${Date.now()}`));
            setEdges((edges) => edges.filter(e => e.source !== `agent-${agent.id}-${Date.now()}` && e.target !== `agent-${agent.id}-${Date.now()}`));
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Agent Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Agent Name */}
        <div className="text-center mb-3">
          <h4 className="font-bold text-gray-900 text-base truncate tracking-wide">
            {agent.name}
          </h4>
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Agent Description */}
        <p className="text-xs text-gray-600 text-center mb-4 line-clamp-2 leading-relaxed">
          {agent.description}
        </p>

        {/* Tools */}
        {(agent.tool_selection_checkboxes_webSearch ||
          agent.tool_selection_checkboxes_codeExecution ||
          agent.tool_selection_checkboxes_fileAnalysis) && (
          <div className="border-t border-gray-200/50 pt-3">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {agent.tool_selection_checkboxes_webSearch && (
                <span className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-2.5 py-1 rounded-full font-medium shadow-sm">
                  🔍 Web
                </span>
              )}
              {agent.tool_selection_checkboxes_codeExecution && (
                <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2.5 py-1 rounded-full font-medium shadow-sm">
                  💻 Code
                </span>
              )}
              {agent.tool_selection_checkboxes_fileAnalysis && (
                <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-2.5 py-1 rounded-full font-medium shadow-sm">
                  📄 File
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    ),
  },
  position: {
    x: dropdownPosition.x - 96,
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
      const newNode: Node = {
        id: nodeId, // Use the same ID
        type: 'agentNode',
        data: {
          label: (
            <div className="relative bg-gradient-to-br from-white via-slate-50 to-gray-50 border border-slate-200/60 rounded-2xl shadow-xl p-7 w-52 transition-all duration-300 hover:shadow-2xl hover:border-blue-300/40 backdrop-blur-sm">
              {/* Remove Button */}
              <button
                className="absolute right-2 top-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNode(nodeId);
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Agent Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Agent Name */}
              <div className="text-center mb-3">
                <h4 className="font-bold text-gray-900 text-base truncate tracking-wide">
                  {agent.name}
                </h4>
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mt-2 rounded-full"></div>
              </div>

              {/* Agent Description */}
              <p className="text-xs text-gray-600 text-center mb-4 line-clamp-2 leading-relaxed">
                {agent.description}
              </p>

              {/* Tools */}
              {(agent.tool_selection_checkboxes_webSearch ||
                agent.tool_selection_checkboxes_codeExecution ||
                agent.tool_selection_checkboxes_fileAnalysis) && (
                <div className="border-t border-gray-200/50 pt-3">
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {agent.tool_selection_checkboxes_webSearch && (
                      <span className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-2.5 py-1 rounded-full font-medium shadow-sm">
                        🔍 Web
                      </span>
                    )}
                    {agent.tool_selection_checkboxes_codeExecution && (
                      <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2.5 py-1 rounded-full font-medium shadow-sm">
                        💻 Code
                      </span>
                    )}
                    {agent.tool_selection_checkboxes_fileAnalysis && (
                      <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-2.5 py-1 rounded-full font-medium shadow-sm">
                        📄 File
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ),
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
    console.log('Saving workflow...', { nodes, edges })
    // TODO: Implement save functionality
  }

  const handleTest = () => {
    setShowTestModal(true)
    setIsRunningTest(true)
    setTimeout(() => {
      setIsRunningTest(false)
      setTestResult('Workflow test completed successfully!')
    }, 2000)
  }

  const handleSystemChange = (systemId: string) => {
    setSelectedSystem(systemId)
  }

  const handleCloseDropdown = () => {
    setShowAgentDropdown(false)
    setSelectedEdgeId(null)
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
          selectedSystem={selectedSystem}
          onSystemChange={handleSystemChange}
          onAgentAdd={addAgentToWorkflow}
        />

        {/* Canvas */}
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          selectedSystem={selectedSystem}
          showAgentDropdown={showAgentDropdown}
          dropdownPosition={dropdownPosition}
          agents={agents}
          onAgentSelection={handleAgentSelection}
          onCloseDropdown={handleCloseDropdown}
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
    </div>
  )
}
