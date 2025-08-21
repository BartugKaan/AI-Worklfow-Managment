import React, { useState } from 'react'
import { X, Play, Clock, CheckCircle, XCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { WorkflowExecutionResult } from '@/types/workflow'

interface WorkflowExecutionModalProps {
  isOpen: boolean
  onClose: () => void
  onExecute: (inputText: string) => Promise<void>
  isExecuting: boolean
  executionResult: WorkflowExecutionResult | null
  error: string | null
}

// Helper function to format agent output for better readability
function formatAgentOutput(output: any): React.ReactNode {
  if (typeof output === 'string') {
    // Check if it's the messy END agent output format
    if (output.includes('Workflow Completed') || output.includes('Process Details:')) {
      // Extract the meaningful content from the messy format
      const lines = output.split('\n')
      const meaningfulContent = []
      let inResultSection = false
      
      for (const line of lines) {
        if (line.includes('Result Text:')) {
          inResultSection = true
          continue
        }
        if (inResultSection && line.trim() && !line.includes('This workflow has been completed successfully')) {
          // Clean up quotes and extract actual content
          const cleanLine = line.replace(/^["']|["']$/g, '').trim()
          if (cleanLine && cleanLine !== '"') {
            meaningfulContent.push(cleanLine)
          }
        }
      }
      
      if (meaningfulContent.length > 0) {
        return (
          <div className="space-y-2">
            <div className="text-green-600 font-medium">✅ Workflow Completed Successfully</div>
            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
              <div className="font-medium text-blue-800 mb-1">Result:</div>
              <div className="text-blue-700">{meaningfulContent.join(' ')}</div>
            </div>
          </div>
        )
      }
    }
    
    // For other string outputs, format nicely
    return (
      <div className="whitespace-pre-wrap">
        {output}
      </div>
    )
  }
  
  // For object outputs
  if (typeof output === 'object' && output !== null) {
    if ('output_text' in output) {
      return formatAgentOutput((output as any).output_text)
    }
    return (
      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
        {JSON.stringify(output, null, 2)}
      </pre>
    )
  }
  
  return <span>{String(output)}</span>
}

export const WorkflowExecutionModal = ({
  isOpen,
  onClose,
  onExecute,
  isExecuting,
  executionResult,
  error,
}: WorkflowExecutionModalProps) => {
  const [inputText, setInputText] = useState('')

  if (!isOpen) return null

  const handleExecute = async () => {
    if (!inputText.trim()) return
    await onExecute(inputText)
  }

  const handleClose = () => {
    setInputText('')
    onClose()
  }

  const formatExecutionTime = (seconds: number) => {
    return `${seconds.toFixed(2)}s`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Play className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Execute Workflow
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Input Section */}
          {!executionResult && !error && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Text for Workflow
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter the text that will be processed by your workflow..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isExecuting}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isExecuting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExecute}
                  disabled={isExecuting || !inputText.trim()}
                  className="flex items-center gap-2"
                >
                  {isExecuting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Execute Workflow
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Execution Progress */}
          {isExecuting && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Executing Workflow...
              </p>
              <p className="text-gray-600">
                Processing your input through the workflow pipeline
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <XCircle className="w-6 h-6" />
                <h4 className="text-lg font-semibold">Execution Failed</h4>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleClose}>Close</Button>
              </div>
            </div>
          )}

          {/* Results Display */}
          {executionResult && (
            <div className="space-y-6">
              {/* Execution Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">
                    Workflow Executed Successfully
                  </h4>
                </div>
                <div className="flex items-center gap-4 text-sm text-green-700">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      Execution Time: {formatExecutionTime(executionResult.execution_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>
                      {executionResult.results.length} steps processed
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Results */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <h4 className="font-semibold text-gray-900">Step Results:</h4>
                {executionResult.results.map((result, index) => (
                  <div key={result.node_id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <h4 className="font-medium text-gray-900">
                        Step {index + 1}: {result.agent_name}
                      </h4>
                    </div>
                    
                    <div className="space-y-3">
                      {result.processed_text && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Input Text:</span>
                          <p className="text-sm text-gray-800 mt-1 p-3 bg-white rounded border">
                            {result.processed_text}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-sm font-medium text-gray-600">Agent Output:</span>
                        <div className="text-sm text-gray-800 mt-1 p-3 bg-white rounded border">
                          {formatAgentOutput(result.output)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Reset to input state for another execution
                    setInputText('')
                  }}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Run Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
