'use client'

import React, { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'

interface WorkflowSaveModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, description?: string) => void
  isLoading?: boolean
}

export const WorkflowSaveModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: WorkflowSaveModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ name?: string }>({})

  const handleSave = () => {
    // Validation
    const newErrors: { name?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = 'Workflow name is required'
    } else if (name.trim().length < 3) {
      newErrors.name = 'Workflow name must be at least 3 characters'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSave(name.trim(), description.trim() || undefined)
      handleClose()
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setErrors({})
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
                          <h3 className="text-lg font-semibold text-gray-900">
              Save Workflow
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Give your workflow a name and description
            </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Workflow Name */}
            <div>
              <Label htmlFor="workflow-name" className="text-sm font-medium text-gray-900">
                Workflow Name *
              </Label>
              <Input
                id="workflow-name"
                type="text"
                placeholder="e.g. Customer Support Workflow"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined })
                  }
                }}
                className={`mt-1 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                disabled={isLoading}
                maxLength={50}
                autoFocus
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {name.length}/50 characters
              </p>
            </div>

            {/* Workflow Description */}
            <div>
              <Label htmlFor="workflow-description" className="text-sm font-medium text-gray-900">
                Description (Optional)
              </Label>
              <Textarea
                id="workflow-description"
                placeholder="Briefly describe what this workflow does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 resize-none"
                rows={3}
                disabled={isLoading}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/200 characters
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="min-w-[80px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !name.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-400">
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl + Enter</kbd> to save, 
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">Esc</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
