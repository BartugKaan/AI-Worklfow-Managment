import React from 'react'
import { Globe, Code, FileText, Bot, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ToolInfo } from '@/components/workflow/ToolCard'

interface Agent {
  id: string
  name: string
  description: string
  isActive?: boolean
  tool_selection_checkboxes_webSearch: boolean
  tool_selection_checkboxes_codeExecution: boolean
  tool_selection_checkboxes_fileAnalysis: boolean
}


interface WorkflowSidebarProps {
  agents: Agent[]
  tools: ToolInfo[]
  loading: boolean
  onAgentAdd: (agent: Agent) => void
  onToolAdd: (tool: ToolInfo) => void
}

export const WorkflowSidebar = ({
  agents,
  tools,
  loading,
  onAgentAdd,
  onToolAdd,
}: WorkflowSidebarProps) => {
  return (
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
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onToolAdd(tool)}
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
                  onClick={() => onAgentAdd(agent)}
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
  )
}
