import React from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  SelectionMode,
} from '@xyflow/react'
import { nodeTypes } from './WorkflowNodes'
import { edgeTypes } from './WorkflowEdges'
import { Bot, Settings } from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  tool_selection_checkboxes_webSearch: boolean
  tool_selection_checkboxes_codeExecution: boolean
  tool_selection_checkboxes_fileAnalysis: boolean
}

interface WorkflowCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  selectedSystem: string
  // Agent dropdown props
  showAgentDropdown: boolean
  dropdownPosition: { x: number; y: number }
  agents: Agent[]
  onAgentSelection: (agent: Agent) => void
  onCloseDropdown: () => void
}

export const WorkflowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  selectedSystem,
  showAgentDropdown,
  agents,
  onAgentSelection,
  onCloseDropdown,
}: WorkflowCanvasProps) => {

  return (
    <div className="flex-1 relative bg-gray-50">
      {selectedSystem === 'react-flow' ? (
        <div className="h-full w-full relative">


          {/* Main ReactFlow */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-left"
            className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50"
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.3}
            maxZoom={3}
            panOnScroll={false}
            zoomOnScroll={true}
            zoomOnDoubleClick={true}
            selectionOnDrag
            panOnDrag={[1, 2]}
            selectionMode={SelectionMode.Partial}
          >
            {/* Enhanced Controls */}
            <Controls
              className="bg-white border-2 border-blue-200 rounded-lg shadow-lg"
              showZoom={true}
              showFitView={true}
              showInteractive={true}
              position="bottom-right"
            />

            {/* Compact MiniMap - Left Side */}
            <MiniMap
              className="border border-gray-300 rounded-md shadow-sm bg-white/95 backdrop-blur-sm"
              style={{ height: 80, width: 120 }}
              position="bottom-left"
              zoomable
              pannable
              nodeColor={(node) => {
                if (node.type === 'startNode') return '#22c55e'
                if (node.type === 'endNode') return '#ef4444'
                return '#3b82f6'
              }}
            />

            {/* Professional Background */}
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="#cbd5e1"
              className="opacity-40"
            />
          </ReactFlow>

          {/* Agent Selection Dropdown for Edge */}
          {showAgentDropdown && (
            <>
              <div
                className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 max-h-72 overflow-y-auto"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  minWidth: '240px',
                }}
              >
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    Select Agent to Add
                  </span>
                </div>

                <div className="space-y-2">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      className="w-full text-left p-3 text-sm hover:bg-blue-50 rounded-lg flex items-center gap-3 transition-all duration-200 group border border-transparent hover:border-blue-200 cursor-pointer hover:shadow-md"
                      onClick={() => onAgentSelection(agent)}
                    >
                      <div className="w-8 h-8 bg-blue-500 group-hover:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate group-hover:text-blue-900">
                          {agent.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-1">
                          {agent.description}
                        </div>
                        {/* Quick tool indicators */}
                        <div className="flex gap-1 mt-2">
                          {agent.tool_selection_checkboxes_webSearch && (
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full"
                              title="Web Search"
                            />
                          )}
                          {agent.tool_selection_checkboxes_codeExecution && (
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full"
                              title="Code Execution"
                            />
                          )}
                          {agent.tool_selection_checkboxes_fileAnalysis && (
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full"
                              title="File Analysis"
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}

                  {agents.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Bot className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <div className="text-sm">No agents available</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Create agents first
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Click outside to close dropdown */}
              <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                onClick={onCloseDropdown}
              />
            </>
          )}
        </div>
      ) : (
        // Other workflow systems placeholder
        <div className="h-full w-full bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 p-6 bg-gray-200 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <Settings className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600">
              This workflow system will be available soon
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
