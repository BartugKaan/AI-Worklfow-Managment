'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Navbar } from '@/components/Navbar'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { ArrowLeft, Save, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAgents, CreateAgentData } from '@/hooks/useAgents'

function AddAgentPage() {
  const router = useRouter()
  const { createAgent } = useAgents()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateAgentData>({
    name: '',
    description: '',
    systemPrompt: '',
    queryPrompt: '',
    toolConfig: {
      tool1: false,
      webSearch: false,
      codeExecution: false,
      fileAnalysis: false,
    },
  })
  const [creationPrompt, setCreationPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = (field: keyof CreateAgentData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleToolConfigChange = (tool: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      toolConfig: {
        ...prev.toolConfig,
        [tool]: checked,
      },
    }))
  }
// Generate agent configuration with backend
  const handleGenerateAgent = async () => {
    if (!creationPrompt.trim()) {
      alert('Please provide a description for your agent')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('http://localhost:8000/api/generate-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: creationPrompt,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate agent configuration')
      }

      const result = await response.json()

      if (result.success && result.data) {
        // Populate form with generated data
        setFormData({
          name: result.data.agent_name,
          description: result.data.agent_description,
          systemPrompt: result.data.system_prompt,
          queryPrompt: result.data.query_prompt,
          toolConfig: {
            tool1: result.data.selected_tools.tool1,
            webSearch: result.data.selected_tools.webSearch,
            codeExecution: result.data.selected_tools.codeExecution,
            fileAnalysis: result.data.selected_tools.fileAnalysis,
          },
        })

        alert('Agent configuration generated successfully!')
      } else {
        throw new Error(result.error || 'Failed to generate agent configuration')
      }
    } catch (error) {
      console.error('Error generating agent:', error)
      alert('Failed to generate agent configuration. Make sure the Python backend is running on port 8000.')
    } finally {
      setIsGenerating(false)
    }
  }
  // Can be Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.description ||
      !formData.systemPrompt ||
      !formData.queryPrompt
    ) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const newAgent = await createAgent(formData)
      if (newAgent) {
        router.push('/')
      } else {
        alert('Failed to create agent. Please try again.')
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      alert('Failed to create agent. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="h-full w-full bg-white text-black flex flex-col">
        <Navbar />
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-black hover:bg-gray-100 p-2 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-black">
                Agent Create Section
              </h1>
            </div>
          </div>
          
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-auto">
        <div className="h-full flex gap-6">
          {/* Left Column - Agent Creation Prompt */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-black">
                  Agent Creation Prompt
                </h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Describe what you want your agent to do. Be specific about its
                role, capabilities, and behavior...
              </p>

              <div className="flex-1 flex flex-col">
                <Textarea
                  placeholder="Describe what you want your agent to do. Be specific about its role, capabilities, and behavior..."
                  className="flex-1 resize-none mb-4"
                  value={creationPrompt}
                  onChange={(e) => setCreationPrompt(e.target.value)}
                />

                <Button
                  type="button"
                  onClick={handleGenerateAgent}
                  disabled={isGenerating || !creationPrompt.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Agent...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Agent with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Agent Configuration */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full">
              <h2 className="text-lg font-semibold text-black mb-6">
                Agent Configuration
              </h2>

              <div className="space-y-6 h-full flex flex-col">
                {/* Agent Name */}
                <div>
                  <Label
                    htmlFor="agentName"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Agent Name: *
                  </Label>
                  <Input
                    type="text"
                    id="agentName"
                    name="agentName"
                    placeholder="Enter agent name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                {/* Agent Description */}
                <div>
                  <Label
                    htmlFor="agentDescription"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Agent Description: *
                  </Label>
                  <Textarea
                    id="agentDescription"
                    name="agentDescription"
                    placeholder="Brief description of the agent's purpose"
                    className="resize-none"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    required
                  />
                </div>

                {/* Agent System Prompt */}
                <div>
                  <Label
                    htmlFor="agentSystemPrompt"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Agent System Prompt: *
                  </Label>
                  <Textarea
                    id="agentSystemPrompt"
                    name="agentSystemPrompt"
                    placeholder="System instructions for the agent"
                    className="resize-none"
                    rows={3}
                    value={formData.systemPrompt}
                    onChange={(e) =>
                      handleInputChange('systemPrompt', e.target.value)
                    }
                    required
                  />
                </div>

                {/* Agent Query Prompt */}
                <div>
                  <Label
                    htmlFor="agentQueryPrompt"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Agent Query Prompt: *
                  </Label>
                  <Textarea
                    id="agentQueryPrompt"
                    name="agentQueryPrompt"
                    placeholder="Default query instructions"
                    className="resize-none"
                    rows={3}
                    value={formData.queryPrompt}
                    onChange={(e) =>
                      handleInputChange('queryPrompt', e.target.value)
                    }
                    required
                  />
                </div>

                {/* Config YAML Checkboxes */}
                <div>
                  <Label className="block text-sm font-medium text-black mb-3">
                    Config YAML Checkboxes:
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tool1"
                        checked={formData.toolConfig?.tool1}
                        onCheckedChange={(checked) =>
                          handleToolConfigChange('tool1', !!checked)
                        }
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor="tool1"
                        className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      >
                        Tool
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="webSearch"
                        checked={formData.toolConfig?.webSearch}
                        onCheckedChange={(checked) =>
                          handleToolConfigChange('webSearch', !!checked)
                        }
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor="webSearch"
                        className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      >
                        Web Search
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="codeExecution"
                        checked={formData.toolConfig?.codeExecution}
                        onCheckedChange={(checked) =>
                          handleToolConfigChange('codeExecution', !!checked)
                        }
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor="codeExecution"
                        className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      >
                        Code Execution
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fileAnalysis"
                        checked={formData.toolConfig?.fileAnalysis}
                        onCheckedChange={(checked) =>
                          handleToolConfigChange('fileAnalysis', !!checked)
                        }
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor="fileAnalysis"
                        className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      >
                        File Analysis
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Create Agent Button */}
                <div>
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white cursor-pointer hover:shadow-lg transition-all duration-200 py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Agent...
                      </>
                    ) : (
                      'Create Agent'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      </div>
    </AuthGuard>
  )
}

export default AddAgentPage
