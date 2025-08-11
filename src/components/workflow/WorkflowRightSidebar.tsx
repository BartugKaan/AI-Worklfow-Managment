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
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Saved Workflows
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          {savedWorkflows.length} workflow{savedWorkflows.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Workflow List */}
      <div className="flex-1 overflow-y-auto p-4">
        {savedWorkflows.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No workflows saved yet
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Create and save your first workflow
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
              >
                {/* Workflow Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                      {workflow.name}
                    </h4>
                    {workflow.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {workflow.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Workflow Stats */}
                <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    <span>{workflow.agentCount} agent{workflow.agentCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{workflow.nodeCount} node{workflow.nodeCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Creation Date */}
                <div className="flex items-center gap-1 mb-3 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(workflow.createdAt)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onWorkflowLoad(workflow)}
                    className="flex-1 h-8 text-xs hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Load
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onWorkflowPreview(workflow)}
                    className="h-8 px-2 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onWorkflowDelete(workflow.id)}
                    className="h-8 px-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Workflows are stored locally
        </p>
      </div>
    </div>
  )
}
