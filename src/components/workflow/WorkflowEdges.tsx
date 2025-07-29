import React from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath, Position } from '@xyflow/react'
import { Plus, Trash2 } from 'lucide-react'

interface CustomEdgeProps {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  style?: React.CSSProperties
  markerEnd?: string
}

// Custom Edge Component with + and Delete buttons (n8n style)
export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: CustomEdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {/* Modern Edge Controls */}
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-lg rounded-full shadow-xl border border-gray-200/50 p-1 edge-controls">
            {/* Add Agent Button */}
            <button
              className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer"
              onClick={(event) => {
                event.stopPropagation()
                const customEvent = new CustomEvent('addAgentOnEdge', {
                  detail: { edgeId: id, labelX, labelY },
                })
                window.dispatchEvent(customEvent)
              }}
              title="Add Agent"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Delete Edge Button */}
            <button
              className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer"
              onClick={(event) => {
                event.stopPropagation()
                const customEvent = new CustomEvent('deleteEdge', {
                  detail: { edgeId: id },
                })
                window.dispatchEvent(customEvent)
              }}
              title="Delete Connection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

// Edge types configuration
export const edgeTypes = {
  custom: CustomEdge,
}
