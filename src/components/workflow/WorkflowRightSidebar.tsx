'use client'

import React from 'react'
import { Bot, Calendar, Play, Trash2, Eye } from 'lucide-react'
import { Button } from '../ui/button'
import type { SavedWorkflow } from '@/types/workflow'

export interface WorkflowRightSidebarProps {
  savedWorkflows: SavedWorkflow[]
  onWorkflowLoad: (workflow: SavedWorkflow) => void
  onWorkflowDelete: (workflowId: string) => void
  onWorkflowPreview: (workflow: SavedWorkflow) => void
}

export const WorkflowRightSidebar = ({
  savedWorkflows,
  onWorkflowLoad,
  onWorkflowDelete,
  onWorkflowPreview,
}: WorkflowRightSidebarProps) => {
  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date)) {
      return 'Unknown date'
    }
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col shrink-0">
      <div className="p-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">Saved Workflows</h3>
        <p className="text-xs text-gray-600">Load or manage workflows</p>
      </div>

      
      <div className="flex-1 overflow-y-auto p-3">
        {savedWorkflows.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-8 h-8 text-gray-300 mx-auto mb-2" />
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
                    onClick={() => onWorkflowDelete(workflow.id)}
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
                    onClick={() => onWorkflowLoad(workflow)}
                    className="flex-1 text-xs h-6"
                  >
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onWorkflowPreview(workflow)}
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
  )
}
