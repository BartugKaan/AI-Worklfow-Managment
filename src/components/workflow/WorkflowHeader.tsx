import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Play, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WorkflowHeaderProps {
  onSave: () => void
  onTest: () => void
  isRunningTest: boolean
}

export const WorkflowHeader = ({
  onSave,
  onTest,
  isRunningTest,
}: WorkflowHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Back navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Agents</span>
          </Link>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Workflow Builder
              </h1>
              <p className="text-sm text-gray-500">
                Design your agent workflow
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onSave}
            className="flex items-center gap-2 hover:bg-gray-50 cursor-pointer hover:shadow-md transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            Save Workflow
          </Button>

          <Button
            onClick={onTest}
            disabled={isRunningTest}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
          >
            <Play className="w-4 h-4" />
            {isRunningTest ? 'Testing...' : 'Test Workflow'}
          </Button>
        </div>
      </div>
    </div>
  )
}
