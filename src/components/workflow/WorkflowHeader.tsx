import React from 'react'
import { Save, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WorkflowHeaderProps {
  onSave: () => void
  onTest: () => void
  isExecuting: boolean
}

export const WorkflowHeader = ({
  onSave,
  onTest,
  isExecuting,
}: WorkflowHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Workflow Builder</h1>
          <p className="text-sm text-gray-600">Design and execute multi-agent workflows</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onSave}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Workflow
          </Button>
          
          <Button
            onClick={onTest}
            disabled={isExecuting}
            className="flex items-center gap-2 bg-black hover:bg-gray-800"
          >
            <Play className="w-4 h-4" />
            {isExecuting ? 'Running...' : 'Test Workflow'}
          </Button>
        </div>
      </div>
    </div>
  )
}
