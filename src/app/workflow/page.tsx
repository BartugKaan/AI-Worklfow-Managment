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
import { Navbar } from '@/components/Navbar'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import { WorkflowSaveModal } from '@/components/workflow/WorkflowSaveModal'
import { WorkflowExecutionModal } from '@/components/workflow/WorkflowExecutionModal'
import { useWorkflows } from '@/hooks/useWorkflows'
import { WorkflowApiService } from '@/lib/workflow-api'
import { Button } from '@/components/ui/button'
import { Play, Save, FolderOpen, Bot, Plus, Globe, Code, FileText, Wrench } from 'lucide-react'
import type { SavedWorkflow, WorkflowAgentInfo, WorkflowExecutionResult, WorkflowData } from '@/types/workflow'
import type { ToolInfo } from '@/components/workflow/ToolCard'

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

// Available tools for workflow
const availableTools: ToolInfo[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for information and retrieve relevant data',
    icon: 'web-search',
    color: 'blue'
  },
  {
    id: 'code-execution',
    name: 'Code Execution',
    description: 'Execute code snippets and programming tasks',
    icon: 'code-execution',
    color: 'green'
  },
  {
    id: 'file-analysis',
    name: 'File Analysis',
    description: 'Analyze and process various file formats',
    icon: 'file-analysis',
    color: 'purple'
  }
]

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

      const newNode: Node = {
        id: nodeId,
        type: 'agentNode',
        data: {
          agentInfo,
          label: agent.name,
          agentId: agent.id,
          onRemove: () => removeNode(nodeId),
        },
        position: { x: 400, y: 200 },
        draggable: true,
      }

      // Remove the original edge and add the new node
      setEdges((edges) => edges.filter((e) => e.id !== selectedEdgeId))
      setNodes((nodes) => [...nodes, newNode])

      // Create new edges connecting through the agent
      const newEdge1: Edge = {
        id: `edge-${Date.now()}-1`,
        source: edge.source,
        target: newNode.id,
        type: 'custom',
      }

      const newEdge2: Edge = {
        id: `edge-${Date.now()}-2`,
        source: newNode.id,
        target: edge.target,
        type: 'custom',
      }

      setEdges((prevEdges) => [...prevEdges, newEdge1, newEdge2])

      // Close dropdown
      setShowAgentDropdown(false)
      setSelectedEdgeId(null)
    },
    [edges, selectedEdgeId, setEdges, setNodes, removeNode]
  )

  const handleToolSelection = useCallback(
    (tool: ToolInfo) => {
      if (!selectedEdgeId) return

      // Find the selected edge
      const edge = edges.find((e) => e.id === selectedEdgeId)
      if (!edge) return

      // Create new tool node
      const nodeId = `tool-${tool.id}-${Date.now()}`
      const newNode: Node = {
        id: nodeId,
        type: 'toolNode',
        position: { x: 400, y: 200 },
        data: { 
          toolInfo: tool,
          onRemove: () => removeNode(nodeId)
        },
        draggable: true,
      }
      
      // Remove the original edge and add the new node
      setEdges((edges) => edges.filter((e) => e.id !== selectedEdgeId))
      setNodes((nodes) => [...nodes, newNode])
      
      // Create new edges connecting through the tool
      const newEdge1: Edge = {
        id: `edge-${Date.now()}-1`,
        source: edge.source,
        target: newNode.id,
        type: 'custom',
      }
      
      const newEdge2: Edge = {
        id: `edge-${Date.now()}-2`,
        source: newNode.id,
        target: edge.target,
        type: 'custom',
      }
      
      setEdges((prevEdges) => [...prevEdges, newEdge1, newEdge2])
      
      // Close dropdown
      setShowAgentDropdown(false)
      setSelectedEdgeId(null)
    },
    [edges, selectedEdgeId, setEdges, setNodes, removeNode]
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

  // Add tool to workflow from sidebar
  const addToolToWorkflow = useCallback(
    (tool: ToolInfo) => {
      const nodeId = `tool-${tool.id}-${Date.now()}`

      const newNode: Node = {
        id: nodeId,
        type: 'toolNode',
        data: {
          toolInfo: tool,
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
    //  save the workflow to get an ID
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
      <Navbar />
      
      {/* Workflow Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Workflow Builder</h1>
            <p className="text-sm text-gray-600">Design and execute multi-agent workflows</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Workflow
            </Button>
            
            <Button
              onClick={handleTest}
              disabled={isExecuting}
              className="flex items-center gap-2 bg-black hover:bg-gray-800"
            >
              <Play className="w-4 h-4" />
              {isExecuting ? 'Running...' : 'Test Workflow'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Unified Library */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Workflow Library</h3>
            <p className="text-xs text-gray-600">Drag items to add to workflow</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {/* Tool Section */}
            <div className="p-3 border-b border-gray-100">
              <h4 className="font-medium text-gray-800 text-xs mb-3 uppercase tracking-wide">Tools</h4>
              <div className="space-y-2">
                {availableTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => addToolToWorkflow(tool)}
                    className="p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer hover:from-orange-50 hover:to-orange-100 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        tool.icon === 'web-search' ? 'bg-blue-500' :
                        tool.icon === 'code-execution' ? 'bg-green-500' : 'bg-purple-500'
                      }`}>
                        {tool.icon === 'web-search' && <Globe className="w-3 h-3 text-white" />}
                        {tool.icon === 'code-execution' && <Code className="w-3 h-3 text-white" />}
                        {tool.icon === 'file-analysis' && <FileText className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-medium text-xs text-gray-900 truncate group-hover:text-orange-800">
                        {tool.name}
                      </span>
                      <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                        Tool
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 ml-8">{tool.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Section */}
            <div className="p-3">
              <h4 className="font-medium text-gray-800 text-xs mb-3 uppercase tracking-wide">Agents</h4>
              {loading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mx-auto mb-2"></div>
                  <p className="text-xs text-gray-600">Loading agents...</p>
                </div>
              ) : agents.length === 0 ? (
                <div className="text-center py-6">
                  <Bot className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-3">No agents available</p>
                  <Button size="sm" className="bg-black hover:bg-gray-800 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Create Agent
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      onClick={() => addAgentToWorkflow(agent)}
                      className="p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer hover:from-blue-50 hover:to-blue-100 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-xs text-gray-900 truncate group-hover:text-blue-800">
                          {agent.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {agent.isActive && (
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          )}
                          <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                            Agent
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 ml-8">{agent.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative h-full">
          <div className="absolute inset-0">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              showAgentDropdown={showAgentDropdown}
              dropdownPosition={dropdownPosition}
              agents={agents}
              tools={availableTools}
              onAgentSelection={handleAgentSelection}
              onToolSelection={handleToolSelection}
              onCloseDropdown={() => setShowAgentDropdown(false)}
            />
          </div>
        </div>

        {/* Right Panel - Saved Workflows */}
        <div className="w-64 bg-white border-l border-gray-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Saved Workflows</h3>
            <p className="text-xs text-gray-600">Load or manage workflows</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {savedWorkflows.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-600">No saved workflows</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedWorkflows.map((workflow) => (
                  <div key={workflow.id} className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-xs text-gray-900 truncate">{workflow.name}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowDelete(workflow.id)}
                        className="text-red-600 hover:text-red-700 h-4 w-4 p-0 text-xs"
                      >
                        ×
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{workflow.description}</p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowLoad(workflow)}
                        className="flex-1 text-xs h-6"
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowPreview(workflow)}
                        className="flex-1 text-xs h-6"
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
