'use client'

import React from 'react'
import { Globe, Code, FileText, Wrench, Info } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

// Tool information interface
interface ToolInfo {
  id: string
  name: string
  description: string
  icon: 'web-search' | 'code-execution' | 'file-analysis'
  color: string
  features: string[]
  useCases: string[]
}

// Available tools data
const availableTools: ToolInfo[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for information and retrieve relevant data from various sources',
    icon: 'web-search',
    color: 'blue',
    features: [
      'Real-time web searching',
      'Multiple search engines',
      'Content extraction',
      'Relevance ranking'
    ],
    useCases: [
      'Research and fact-checking',
      'Market analysis',
      'News and trend monitoring',
      'Competitive intelligence'
    ]
  },
  {
    id: 'code-execution',
    name: 'Code Execution',
    description: 'Execute code snippets and programming tasks in various languages',
    icon: 'code-execution',
    color: 'green',
    features: [
      'Multi-language support',
      'Secure execution environment',
      'Output capture',
      'Error handling'
    ],
    useCases: [
      'Data processing and analysis',
      'Algorithm testing',
      'Automation scripts',
      'Mathematical calculations'
    ]
  },
  {
    id: 'file-analysis',
    name: 'File Analysis',
    description: 'Analyze and process various file formats including documents, images, and data files',
    icon: 'file-analysis',
    color: 'purple',
    features: [
      'Multiple file format support',
      'Content extraction',
      'Metadata analysis',
      'Structure parsing'
    ],
    useCases: [
      'Document processing',
      'Data extraction',
      'Content analysis',
      'File format conversion'
    ]
  }
]

const iconMap = {
  'web-search': Globe,
  'code-execution': Code,
  'file-analysis': FileText,
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-500',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-500',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-800'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'bg-purple-500',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-800'
  }
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Available Tools</h1>
          </div>
          <p className="text-gray-600">
            Explore the powerful tools available in your AI workflow system. These tools can be integrated into your workflows to enhance agent capabilities.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTools.map((tool) => {
            const IconComponent = iconMap[tool.icon]
            const colors = colorMap[tool.color as keyof typeof colorMap]
            
            return (
              <div key={tool.id} className={`${colors.bg} ${colors.border} border-2 hover:shadow-lg transition-all duration-200 rounded-lg shadow-sm`}>
                <div className="flex flex-col space-y-1.5 p-6 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold leading-none tracking-tight ${colors.text}`}>{tool.name}</h3>
                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${colors.badge} mt-1`}>
                        Tool
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                
                <div className="p-6 pt-0 space-y-4">
                  {/* Features Section */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800 mb-2 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Use Cases Section */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800 mb-2">Use Cases</h4>
                    <div className="flex flex-wrap gap-1">
                      {tool.useCases.map((useCase, index) => (
                        <div 
                          key={index} 
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          {useCase}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How to Use Tools</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  These tools are automatically available when creating agents and building workflows. 
                  You can enable specific tools for each agent based on your workflow requirements.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Tools are selected during agent creation in the <strong>Add Agent</strong> page</li>
                  <li>Each agent can have multiple tools enabled simultaneously</li>
                  <li>Tools can be added to workflow canvases by dragging them from the tool library</li>
                  <li>Tool capabilities are automatically integrated into agent responses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
