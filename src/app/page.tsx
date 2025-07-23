'use client'

import { Bot, MessageSquare, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAgents } from '@/hooks/useAgents'
import Link from 'next/link'

export default function Home() {
  const { agents, loading } = useAgents()

  return (
    <div className="h-full w-full bg-white text-black flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-black mb-2">
              AI Agent Workflow System
            </h1>
            <p className="text-gray-600 text-lg">
              Multi-Agent Workflow Management System
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              Welcome to Your AI Agent Hub
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Create, manage, and chat with your custom AI agents. Each agent
              can be configured with specific prompts, tools, and capabilities
              to help you with different tasks.
            </p>
          </div>

          {/* Getting Started Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Plus className="w-6 h-6 text-black" />
                <h3 className="text-xl font-semibold">
                  Create Your First Agent
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Start by creating a custom AI agent with specific prompts and
                tool configurations.
              </p>
              <Link href="/add-agent">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
              </Link>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-black" />
                <h3 className="text-xl font-semibold">Chat with Agents</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Select an agent from the sidebar to start a conversation and
                leverage their capabilities.
              </p>
              <Button variant="outline" disabled={agents.length === 0}>
                {agents.length === 0 ? 'No Agents Yet' : 'Select from Sidebar'}
              </Button>
            </div>
          </div>

          {/* Agents Overview */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6">Your Agents</h3>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading agents...</p>
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No agents created yet
                </h4>
                <p className="text-gray-600 mb-6">
                  Create your first AI agent to get started
                </p>
                <Link href="/add-agent">
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Agent
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <Link
                    key={agent.id}
                    href={`/agent/${agent.id}`}
                    className="block h-full"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer h-full">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                          <Bot className="w-5 h-5 text-gray-600 mt-0.5" />
                          {agent.isActive && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-black mb-1">
                            {agent.name}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {agent.description}
                          </p>
                        </div>
                      </div>

                      {/* Tools indicator */}
                      <div className="flex flex-wrap gap-1">
                        {agent.tool_selection_checkboxes_webSearch && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            Web Search
                          </span>
                        )}
                        {agent.tool_selection_checkboxes_codeExecution && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            Code
                          </span>
                        )}
                        {agent.tool_selection_checkboxes_fileAnalysis && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            Files
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">
              How to Get Started
            </h4>
            <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
              <li>Create a new agent using the &quot;Add Agent&quot; button</li>
              <li>
                Configure the agent&apos;s name, description, and system prompts
              </li>
              <li>Select the tools and capabilities for your agent</li>
              <li>Click on any agent from the sidebar to start chatting</li>
              <li>
                Use the agent&apos;s specialized capabilities for your tasks
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
