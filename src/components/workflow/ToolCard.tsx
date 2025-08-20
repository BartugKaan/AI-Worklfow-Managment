import React from 'react'
import { Globe, Code, FileText, Trash2 } from 'lucide-react'

export interface ToolInfo {
  id: string
  name: string
  description: string
  icon: 'web-search' | 'code-execution' | 'file-analysis'
  color: string
}

interface ToolCardProps {
  tool: ToolInfo
  onRemove?: () => void
}

const iconMap = {
  'web-search': Globe,
  'code-execution': Code,
  'file-analysis': FileText,
}

const colorMap = {
  'web-search': {
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
    bg: 'from-blue-100 to-cyan-100',
    text: 'text-blue-700',
    border: 'border-blue-300/40'
  },
  'code-execution': {
    gradient: 'from-green-500 via-green-600 to-green-700',
    bg: 'from-green-100 to-emerald-100',
    text: 'text-green-700',
    border: 'border-green-300/40'
  },
  'file-analysis': {
    gradient: 'from-purple-500 via-purple-600 to-purple-700',
    bg: 'from-purple-100 to-indigo-100',
    text: 'text-purple-700',
    border: 'border-purple-300/40'
  }
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onRemove }) => {
  const IconComponent = iconMap[tool.icon]
  const colors = colorMap[tool.icon]

  return (
    <div className={`relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-200/60 rounded-xl shadow-lg p-4 w-48 transition-all duration-300 hover:shadow-xl hover:border-orange-300 backdrop-blur-sm`}>
      {/* Remove Button */}
      {onRemove && (
        <button
          className="absolute right-2 top-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md flex items-center justify-center transition-colors duration-200 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
      
      {/* Tool Badge */}
      <div className="absolute left-2 top-2">
        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-medium shadow-sm">
          TOOL
        </span>
      </div>

      <div className="flex justify-center mb-3 mt-2">
        <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-md border-2 border-white`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="text-center mb-2">
        <h4 className="font-bold text-gray-900 text-sm truncate tracking-wide">
          {tool.name}
        </h4>
        <div className="w-6 h-0.5 bg-gradient-to-r from-orange-400 to-amber-500 mx-auto mt-1.5 rounded-full"></div>
      </div>

      <p className="text-xs text-gray-700 text-center mb-3 line-clamp-2 leading-relaxed">
        {tool.description}
      </p>

      <div className="border-t border-orange-200/50 pt-2">
        <div className="flex justify-center">
          <span className={`text-xs bg-gradient-to-r ${colors.bg} ${colors.text} px-2.5 py-1 rounded-full font-medium shadow-sm border border-white`}>
            🔧 {tool.icon === 'web-search' ? 'Search' : tool.icon === 'code-execution' ? 'Execute' : 'Analyze'}
          </span>
        </div>
      </div>
    </div>
  )
}
