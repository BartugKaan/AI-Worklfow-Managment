import React from 'react'
import { Bot, Trash2 } from 'lucide-react'
import type { WorkflowAgentInfo } from '@/types/workflow'

interface AgentCardProps {
  agent: WorkflowAgentInfo
  onRemove?: () => void
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onRemove }) => {
  return (
    <div className="relative bg-gradient-to-br from-white via-slate-50 to-gray-50 border border-slate-200/60 rounded-2xl shadow-xl p-5 w-52 transition-all duration-300 hover:shadow-2xl hover:border-blue-300/40 backdrop-blur-sm">
      {/* Remove Button */}
      {onRemove && (
        <button
          className="absolute right-2 top-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Bot className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="text-center mb-3">
        <h4 className="font-bold text-gray-900 text-base truncate tracking-wide">
          {agent.name}
        </h4>
        <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mt-2 rounded-full"></div>
      </div>

      <p className="text-xs text-gray-600 text-center mb-4 line-clamp-2 leading-relaxed">
        {agent.description}
      </p>

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
  )
}


