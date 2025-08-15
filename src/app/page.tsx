'use client'

import { Bot, MessageSquare, Plus, Workflow, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAgents } from '@/hooks/useAgents'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  const { agents, loading } = useAgents()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AI Workflow System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create, manage, and orchestrate your custom AI agents. Build powerful workflows
            and leverage AI capabilities to automate complex tasks.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Create Agent
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Start by creating a custom AI agent with specific prompts and
              tool configurations tailored to your needs.
            </p>
            <Link href="/add-agent">
              <Button className="w-full bg-black hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Create New Agent
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Manage Agents
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              View, edit, and manage all your AI agents. Configure their settings,
              activate or deactivate them as needed.
            </p>
            <Link href="/agents">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                View All Agents
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Build Workflow
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Create drag-and-drop workflows with your agents. Design multi-agent 
              processes and automate complex tasks.
            </p>
            <Link href="/workflow">
              <Button variant="outline" className="w-full">
                <Workflow className="w-4 h-4 mr-2" />
                Open Workflow Builder
              </Button>
            </Link>
          </div>
        </div>

        {/* Agents Overview */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Agents</h3>
          
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                No agents created yet
              </h4>
              <p className="text-gray-600 mb-6">
                Create your first AI agent to get started with the workflow system
              </p>
              <Link href="/add-agent">
                <Button className="bg-black hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Agent
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.slice(0, 6).map((agent) => (
                <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      agent.isActive ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Bot className={`w-5 h-5 ${
                        agent.isActive ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {agent.name}
                      </h4>
                      {agent.isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {agent.description}
                  </p>

                  {/* Tools indicator */}
                  <div className="flex flex-wrap gap-2">
                    {agent.tool_selection_checkboxes_webSearch && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                        Web Search
                      </span>
                    )}
                    {agent.tool_selection_checkboxes_codeExecution && (
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md">
                        Code
                      </span>
                    )}
                    {agent.tool_selection_checkboxes_fileAnalysis && (
                      <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md">
                        Files
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {agents.length > 6 && (
            <div className="text-center mt-6">
              <Link href="/agents">
                <Button variant="outline">
                  View All {agents.length} Agents
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-6">
            Getting Started Guide
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Create & Manage Agents</h5>
              <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                <li>Create a new agent with custom prompts and tools</li>
                <li>Configure agent capabilities and settings</li>
                <li>Activate agents for use in workflows</li>
              </ol>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Build Workflows</h5>
              <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                <li>Open the workflow builder interface</li>
                <li>Drag agents to create workflow steps</li>
                <li>Connect agents and execute workflows</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
