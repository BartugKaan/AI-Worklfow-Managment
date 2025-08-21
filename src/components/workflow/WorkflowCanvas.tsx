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
import { Bot, Globe, Code, FileText, Settings } from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  tool_selection_checkboxes_webSearch: boolean
  tool_selection_checkboxes_codeExecution: boolean
  tool_selection_checkboxes_fileAnalysis: boolean
  isActive?: boolean
}

interface Tool {
  id: string
  name: string
  description: string
  icon: 'web-search' | 'code-execution' | 'file-analysis'
  color: string
}

interface WorkflowCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  // Agent dropdown props
  showAgentDropdown: boolean
  dropdownPosition: { x: number; y: number }
  agents: Agent[]
  tools: Tool[]
  onAgentSelection: (agent: Agent) => void
  onToolSelection: (tool: Tool) => void
  onCloseDropdown: () => void
}

export const WorkflowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  showAgentDropdown,
  agents,
  tools,
  onAgentSelection,
  onToolSelection,
  onCloseDropdown,
}: WorkflowCanvasProps) => {

  return (
    <div className="w-full h-full relative bg-gray-50">
      {/* Always render React Flow */}
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

          {/* Agent & Tool Selection Dropdown for Edge */}
          {showAgentDropdown && (
            <>
              <div
                className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-h-80 overflow-y-auto"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  minWidth: '280px',
                }}
              >
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    Add to Workflow
                  </span>
                </div>

                {/* Tools Section */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Tools</h4>
                  <div className="space-y-2">
                    {tools.map((tool) => (
                      <button
                        key={tool.id}
                        className="w-full text-left p-2.5 text-sm hover:bg-orange-50 rounded-lg flex items-center gap-3 transition-all duration-200 group border border-transparent hover:border-orange-200 cursor-pointer"
                        onClick={() => onToolSelection(tool)}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                          tool.icon === 'web-search' ? 'bg-blue-500 group-hover:bg-blue-600' :
                          tool.icon === 'code-execution' ? 'bg-green-500 group-hover:bg-green-600' : 
                          'bg-purple-500 group-hover:bg-purple-600'
                        }`}>
                          {tool.icon === 'web-search' && <Globe className="w-3.5 h-3.5 text-white" />}
                          {tool.icon === 'code-execution' && <Code className="w-3.5 h-3.5 text-white" />}
                          {tool.icon === 'file-analysis' && <FileText className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate group-hover:text-orange-800">
                            {tool.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {tool.description}
                          </div>
                        </div>
                        <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                          Tool
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Agents Section */}
                <div>
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Agents</h4>
                  <div className="space-y-2">
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        className="w-full text-left p-2.5 text-sm hover:bg-blue-50 rounded-lg flex items-center gap-3 transition-all duration-200 group border border-transparent hover:border-blue-200 cursor-pointer"
                        onClick={() => onAgentSelection(agent)}
                      >
                        <div className="w-7 h-7 bg-blue-500 group-hover:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate group-hover:text-blue-900">
                            {agent.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {agent.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {agent.isActive && (
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          )}
                          <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                            Agent
                          </span>
                        </div>
                      </button>
                    ))}

                    {agents.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <Bot className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                        <div className="text-xs">No agents available</div>
                      </div>
                    )}
                  </div>
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
      
    </div>
  )
}
