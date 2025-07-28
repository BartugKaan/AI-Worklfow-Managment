import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Play, Square } from 'lucide-react'

// Custom Node Components with Enhanced Connection Handles
export const StartNode = () => {
  return (
    <div className="relative group">
      <div className="text-center p-6 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white rounded-2xl border border-emerald-400/30 min-w-[140px] shadow-xl backdrop-blur-sm group-hover:shadow-2xl transition-all duration-300">
        <div className="bg-white/20 rounded-full p-3 w-12 h-12 mx-auto mb-3 backdrop-blur-sm">
          <Play className="w-6 h-6" />
        </div>
        <div className="font-bold text-xl tracking-wide">START</div>
        <div className="text-xs opacity-80 font-medium mt-1">
          Begin Workflow
        </div>
      </div>
      {/* Modern Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="custom-handle-emerald"
        style={{ right: '-10px' }}
      />
      {/* Connection hint circle */}
      <div className="connection-hint absolute -right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-emerald-400/30 rounded-full pointer-events-none backdrop-blur-sm"></div>
    </div>
  )
}

export const EndNode = () => {
  return (
    <div className="relative group">
      <div className="text-center p-6 bg-gradient-to-br from-rose-500 via-red-500 to-rose-600 text-white rounded-2xl border border-rose-400/30 min-w-[140px] shadow-xl backdrop-blur-sm group-hover:shadow-2xl transition-all duration-300">
        <div className="bg-white/20 rounded-full p-3 w-12 h-12 mx-auto mb-3 backdrop-blur-sm">
          <Square className="w-6 h-6" />
        </div>
        <div className="font-bold text-xl tracking-wide">END</div>
        <div className="text-xs opacity-80 font-medium mt-1">
          Complete Workflow
        </div>
      </div>
      {/* Modern Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-5 !h-5 !bg-rose-600 !border-3 !border-white !shadow-xl hover:!scale-150 transition-all duration-200 !rounded-full"
        style={{ left: '-10px' }}
      />
      {/* Connection hint circle */}
      <div className="connection-hint absolute -left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-rose-400/30 rounded-full pointer-events-none backdrop-blur-sm"></div>
    </div>
  )
}

export const AgentNode = ({ data }: { data: { label: React.ReactNode } }) => {
  return (
    <div className="relative group">
      <div className="transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
        {data.label}
      </div>
      {/* Modern Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-5 !h-5 !bg-blue-600 !border-3 !border-white !shadow-xl hover:!scale-150 transition-all duration-200 !rounded-full"
        style={{ left: '-10px' }}
      />
      {/* Modern Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-5 !h-5 !bg-blue-600 !border-3 !border-white !shadow-xl hover:!scale-150 transition-all duration-200 !rounded-full"
        style={{ right: '-10px' }}
      />
      {/* Connection hint circles */}
      <div className="connection-hint absolute -left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-400/30 rounded-full pointer-events-none backdrop-blur-sm"></div>
      <div className="connection-hint absolute -right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-400/30 rounded-full pointer-events-none backdrop-blur-sm"></div>
    </div>
  )
}

// Node types configuration
export const nodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  agentNode: AgentNode,
}
