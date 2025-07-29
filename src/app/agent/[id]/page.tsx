'use client'

import { MessageSquare, Send, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAgents } from '@/hooks/useAgents'
import FilePickerButton from '@/components/FilePickerButton'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AgentChatPage() {
  const params = useParams()
  const agentId = params.id as string

  const { agents, loading, updateAgentStatus } = useAgents()

  // Find the current agent
  const currentAgent = agents.find((agent) => agent.id === agentId)

  // Conversation state
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Set this agent as active when page loads
  useEffect(() => {
    if (currentAgent && !currentAgent.isActive) {
      updateAgentStatus(agentId, true)
    }
  }, [currentAgent, agentId, updateAgentStatus])

  // Send message to agent
  const sendMessage = async () => {
    if (!currentMessage.trim() || !currentAgent || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date(),
    }

    // Add user message to conversation
    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage('')
    setIsSending(true)

    try {
      const response = await fetch('http://localhost:8000/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: currentAgent.id,
          message: userMessage.content,
          system_prompt: currentAgent.systemPrompt,
          query_prompt: currentAgent.queryPrompt,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const result = await response.json()

      if (result.success && result.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error(result.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Sorry, I encountered an error. Please make sure the Python backend is running on port 8000.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // If agent not found or loading, show appropriate state
  if (loading) {
    return (
      <div className="h-full w-full bg-white text-black flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading agent...</p>
        </div>
      </div>
    )
  }

  if (!currentAgent) {
    return (
      <div className="h-full w-full bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
          <p className="text-gray-600 mb-6">
            The requested agent could not be found.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-white text-black flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-black mb-1">
              Chat with {currentAgent.name}
            </h1>
            <p className="text-gray-600 text-sm">{currentAgent.description}</p>
          </div>
        </div>
      </div>

      {/* Agent Conversation Section Header */}
      <div className="p-6 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-medium text-black">Agent Conversation</h2>
        </div>
      </div>

      {/* Main Conversation Area - Takes all available space */}
      <div className="flex-1 px-6 pb-4 min-h-0">
        <div className="bg-gray-50 border border-gray-200 rounded-lg h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <p className="text-gray-500 mb-4">
                  Start a conversation with {currentAgent.name}...
                </p>
                <div className="text-xs text-gray-400 mb-4">
                  <p className="mb-2 font-medium">Available Tools:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentAgent.tool_selection_checkboxes_tool1 && (
                      <span className="px-2 py-1 bg-gray-200 rounded-md text-xs">
                        Tool
                      </span>
                    )}
                    {currentAgent.tool_selection_checkboxes_webSearch && (
                      <span className="px-2 py-1 bg-gray-200 rounded-md text-xs">
                        Web Search
                      </span>
                    )}
                    {currentAgent.tool_selection_checkboxes_codeExecution && (
                      <span className="px-2 py-1 bg-gray-200 rounded-md text-xs">
                        Code Execution
                      </span>
                    )}
                    {currentAgent.tool_selection_checkboxes_fileAnalysis && (
                      <span className="px-2 py-1 bg-gray-200 rounded-md text-xs">
                        File Analysis
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-black text-white'
                        : 'bg-white border border-gray-200 text-black'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user'
                          ? 'text-gray-300'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 text-black rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Message Input Section */}
      <div className="p-6 pt-2 shrink-0">
        <h3 className="text-lg font-medium text-black mb-4">Message Input</h3>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Enter your message for ${currentAgent.name}...`}
            className="w-full h-32 bg-transparent text-black placeholder-gray-400 border-none outline-none resize-none"
            disabled={isSending}
          />

          <Separator className="my-4 bg-gray-200" />

          <div className="flex items-center justify-between">
            <FilePickerButton onFilesSelected={() => {}} />

            <Button
              onClick={sendMessage}
              className="bg-black hover:bg-gray-800 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
              disabled={!currentMessage.trim() || isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
