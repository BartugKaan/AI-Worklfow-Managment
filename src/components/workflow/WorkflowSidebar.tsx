import React from 'react'
import { Bot, Plus } from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  tool_selection_checkboxes_webSearch: boolean
  tool_selection_checkboxes_codeExecution: boolean
  tool_selection_checkboxes_fileAnalysis: boolean
}

interface WorkflowSidebarProps {
  agents: Agent[]
  loading: boolean
  onAgentAdd: (agent: Agent) => void
}

// removed workflow system selector; we always use React Flow

export const WorkflowSidebar = ({
  agents,
  loading,
  onAgentAdd,
}: WorkflowSidebarProps) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* System selection removed */}

      {/* Agent Library */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Agent Library ({agents.length})
            </h3>
            <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Drag to add
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Click on agents below to add them to your workflow
          </p>
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0 agent-library-scroll">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No agents available</p>
              <div className="text-xs text-gray-400">
                Create agents first to use in workflows
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => onAgentAdd(agent)}
                  className="group p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500 group-hover:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                      <Bot className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-900">
                          {agent.name}
                        </h4>
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {agent.description}
                      </p>

                      {/* Tool indicators */}
                      <div className="flex flex-wrap gap-1">
                        {agent.tool_selection_checkboxes_webSearch && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            🔍 Web
                          </span>
                        )}
                        {agent.tool_selection_checkboxes_codeExecution && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            💻 Code
                          </span>
                        )}
                        {agent.tool_selection_checkboxes_fileAnalysis && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            📄 File
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
