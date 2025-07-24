'use client'

import React, { useState, useCallback } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Play,
  Square,
  Bot,
  ArrowLeft,
  Save,
  Info,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAgents } from '@/hooks/useAgents'

// Initial nodes - Start and End points (now draggable)
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    data: {
      label: (
        <div className="text-center p-2">
          <Play className="w-5 h-5 mx-auto mb-1" />
          <div className="font-bold">START</div>
          <div className="text-xs opacity-75">Başlangıç</div>
        </div>
      ),
    },
    position: { x: 100, y: 50 },
    draggable: true,
    style: {
      background: '#22c55e',
      color: 'white',
      borderRadius: '12px',
      border: '3px solid #16a34a',
      minWidth: '100px',
    },
  },
  {
    id: 'end',
    type: 'output',
    data: {
      label: (
        <div className="text-center p-2">
          <Square className="w-5 h-5 mx-auto mb-1" />
          <div className="font-bold">END</div>
          <div className="text-xs opacity-75">Bitiş</div>
        </div>
      ),
    },
    position: { x: 600, y: 300 },
    draggable: true,
    style: {
      background: '#ef4444',
      color: 'white',
      borderRadius: '12px',
      border: '3px solid #dc2626',
      minWidth: '100px',
    },
  },
]

const initialEdges: Edge[] = []

// Workflow systems
const workflowSystems = [
  {
    id: 'react-flow',
    name: 'React Flow',
    description: 'Professional node-based UI',
  },
]

export default function WorkflowPage() {
  const { agents, loading } = useAgents()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedSystem, setSelectedSystem] = useState('react-flow')
  const [showTestModal, setShowTestModal] = useState(false)
  const [testPrompt, setTestPrompt] = useState('')
  const [testResult, setTestResult] = useState('')
  const [isRunningTest, setIsRunningTest] = useState(false)

  // System info modal state
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [selectedSystemInfo, setSelectedSystemInfo] = useState<{
    name: string
    description: string
    icon: React.ReactNode
    color: string
    strengths: string[]
    weaknesses: string[]
    bestFor: string
  } | null>(null)

  // System information database
  const systemInfos = {
    'react-flow': {
      name: 'React Flow',
      description: 'Node-based visual workflow designer',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-blue-500',
      strengths: [
        'Çok esnek ve özelleştirilebilir',
        'Node-based tasarım',
        'Güçlü React entegrasyonu',
        'Aktif geliştirici topluluğu',
        "Kompleks workflow'lar için ideal",
      ],
      weaknesses: [
        'Öğrenme eğrisi biraz yüksek',
        'Basit süreçler için fazla kompleks olabilir',
        'Performans optimizasyonu gerektirebilir',
      ],
      bestFor:
        "Kompleks, çok dallanmalı workflow'lar ve özel tasarım gereksinimleri",
    },
  }

  const handleShowInfo = (systemId: string) => {
    setSelectedSystemInfo(systemInfos[systemId as keyof typeof systemInfos])
    setShowInfoModal(true)
  }

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Add agent to workflow
  const addAgentToWorkflow = useCallback(
    (agent: {
      id: string
      name: string
      description: string
      tool_selection_checkboxes_webSearch: boolean
      tool_selection_checkboxes_codeExecution: boolean
      tool_selection_checkboxes_fileAnalysis: boolean
    }) => {
      const newNode: Node = {
        id: `agent-${agent.id}`,
        type: 'default',
        data: {
          label: (
            <div
              style={{
                background: 'white',
                border: '2px solid #BFDBFE',
                borderRadius: '12px',
                boxShadow:
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '16px',
                width: '180px',
                textAlign: 'center',
                fontSize: '14px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#2563EB',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot
                    style={{ width: '20px', height: '20px', color: 'white' }}
                  />
                </div>
              </div>

              {/* Agent Name */}
              <div
                style={{
                  fontWeight: '600',
                  fontSize: '15px',
                  color: '#111827',
                  marginBottom: '4px',
                  wordWrap: 'break-word',
                  lineHeight: '1.2',
                }}
              >
                {agent.name}
              </div>

              {/* AI Agent Label */}
              <div
                style={{
                  fontSize: '12px',
                  color: '#2563EB',
                  fontWeight: '500',
                  marginBottom: '12px',
                }}
              >
                AI Agent
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: '11px',
                  color: '#4B5563',
                  lineHeight: '1.4',
                  marginBottom: '12px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textAlign: 'left',
                }}
              >
                {agent.description}
              </div>

              {/* Tools */}
              {(agent.tool_selection_checkboxes_webSearch ||
                agent.tool_selection_checkboxes_codeExecution ||
                agent.tool_selection_checkboxes_fileAnalysis) && (
                <div
                  style={{ borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}
                >
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#6B7280',
                      marginBottom: '6px',
                      textAlign: 'center',
                    }}
                  >
                    Available Tools
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      justifyContent: 'center',
                    }}
                  >
                    {agent.tool_selection_checkboxes_webSearch && (
                      <span
                        style={{
                          padding: '3px 6px',
                          backgroundColor: '#DBEAFE',
                          color: '#1D4ED8',
                          fontSize: '10px',
                          borderRadius: '4px',
                          fontWeight: '500',
                        }}
                      >
                        🌐 Web
                      </span>
                    )}
                    {agent.tool_selection_checkboxes_codeExecution && (
                      <span
                        style={{
                          padding: '3px 6px',
                          backgroundColor: '#DCFCE7',
                          color: '#166534',
                          fontSize: '10px',
                          borderRadius: '4px',
                          fontWeight: '500',
                        }}
                      >
                        📝 Code
                      </span>
                    )}
                    {agent.tool_selection_checkboxes_fileAnalysis && (
                      <span
                        style={{
                          padding: '3px 6px',
                          backgroundColor: '#F3E8FF',
                          color: '#7C3AED',
                          fontSize: '10px',
                          borderRadius: '4px',
                          fontWeight: '500',
                        }}
                      >
                        📄 File
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ),
        },
        position: {
          x: Math.random() * 300 + 200,
          y: Math.random() * 200 + 150,
        },
        draggable: true,
        style: {
          background: 'transparent',
          border: 'none',
          padding: 0,
          width: 'auto',
          height: 'auto',
        },
      }
      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes]
  )

  // Run workflow test
  const runWorkflow = useCallback(() => {
    setShowTestModal(true)
    setTestResult('')
    setTestPrompt('')
  }, [])

  // Execute test with prompt
  const executeTest = useCallback(async () => {
    if (!testPrompt.trim()) {
      alert('Lütfen test için bir prompt girin')
      return
    }

    setIsRunningTest(true)
    setTestResult('')

    try {
      // Simulate workflow execution
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const workflowNodes = nodes.filter((n) => n.id.startsWith('agent-'))
      const result = `🚀 Workflow Test Sonucu (${selectedSystem}):

📝 Prompt: "${testPrompt}"

🔄 İşlenen Node'lar: ${workflowNodes.length} agent
📊 Bağlantılar: ${edges.length} bağlantı
⚡ Sistem: ${workflowSystems.find((s) => s.id === selectedSystem)?.name}

✅ Test başarıyla tamamlandı!
💡 Bu bir demo sonucudur. Gerçek entegrasyonda agent'lar sırayla çalıştırılacak.

${workflowNodes
  .map((node, i) => `${i + 1}. Node ${i + 1} - Simulated Response`)
  .join('\n')}`

      setTestResult(result)
    } catch (error) {
      setTestResult(`❌ Test sırasında hata: ${error}`)
    } finally {
      setIsRunningTest(false)
    }
  }, [testPrompt, selectedSystem, nodes, edges, workflowSystems])

  // Save workflow
  const saveWorkflow = useCallback(() => {
    const workflowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    }
    console.log('Workflow Data:', workflowData)
    alert('Workflow kaydedildi! (Konsola yazdırıldı)')
  }, [nodes, edges])

  return (
    <div className="h-full w-full bg-white flex">
      {/* Sidebar - Agent Library */}
      <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
          </div>
          <h2 className="text-lg font-semibold text-black">Workflow Builder</h2>
          <p className="text-sm text-gray-600">
            Agent&apos;ları sürükleyip workflow oluşturun
          </p>
        </div>

        {/* System Selection */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-black">Workflow Sistemi</h3>
            <Button
              onClick={() => handleShowInfo(selectedSystem)}
              variant="outline"
              size="sm"
              className="px-2 py-1 h-7 border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Info className="w-3 h-3" />
            </Button>
          </div>
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          >
            {workflowSystems.map((system) => (
              <option key={system.id} value={system.id}>
                {system.name} - {system.description}
              </option>
            ))}
          </select>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex gap-2">
            <Button
              onClick={runWorkflow}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              Test Et
            </Button>
            <Button onClick={saveWorkflow} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </div>

        {/* Workflow Elements */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="text-sm font-medium text-black mb-3">
            Workflow Elemanları
          </h3>
          <div className="space-y-2">
            <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-center">
              <div className="text-green-800 font-medium text-sm">START</div>
              <div className="text-xs text-green-600">Başlangıç noktası</div>
            </div>
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-center">
              <div className="text-red-800 font-medium text-sm">END</div>
              <div className="text-xs text-red-600">Bitiş noktası</div>
            </div>
          </div>
        </div>

        {/* Agent Library */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-sm font-medium text-black mb-3">
            Agent Kütüphanesi ({agents.length})
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Agent&apos;lar yükleniyor...</div>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-500">
                Henüz agent oluşturulmamış
              </div>
              <Link href="/add-agent">
                <Button size="sm" className="mt-2">
                  Agent Oluştur
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                  onClick={() => addAgentToWorkflow(agent)}
                >
                  <div className="flex items-start gap-2">
                    <Bot className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-black truncate">
                        {agent.name}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {agent.description}
                      </div>

                      {/* Tools */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agent.tool_selection_checkboxes_webSearch && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
                            Web
                          </span>
                        )}
                        {agent.tool_selection_checkboxes_codeExecution && (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-600 text-xs rounded">
                            Code
                          </span>
                        )}
                        {agent.tool_selection_checkboxes_fileAnalysis && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded">
                            File
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-400 text-center">
                    Tıklayarak workflow&apos;a ekle
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Workflow Canvas */}
      <div className="flex-1 relative">
        {selectedSystem === 'react-flow' ? (
          <div className="h-full w-full relative">
            {/* React Flow Header */}
            <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md border border-blue-200 px-3 py-2">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  React Flow Designer
                </span>
              </div>
            </div>

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              attributionPosition="bottom-left"
              className="bg-gradient-to-br from-blue-50 to-indigo-100"
            >
              <Controls
                style={{
                  background: 'white',
                  border: '2px solid #3B82F6',
                  borderRadius: '8px',
                }}
              />
              <MiniMap
                style={{
                  height: 120,
                  backgroundColor: '#EBF8FF',
                  border: '2px solid #3B82F6',
                  borderRadius: '8px',
                }}
                zoomable
                pannable
              />
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                color="#93C5FD"
              />
            </ReactFlow>
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4 p-4 bg-gray-200 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <Settings className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {workflowSystems.find((s) => s.id === selectedSystem)?.name}
              </h3>
              <p className="text-gray-600">Bu sistem henüz entegre edilmedi</p>
            </div>
          </div>
        )}

        {/* Instructions Overlay */}
        {nodes.length === 2 && selectedSystem === 'react-flow' && (
          <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center pointer-events-none">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
              <Bot className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">
                Workflow Oluşturmaya Başlayın
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Sol panelden agent&apos;ları seçip workflow&apos;a ekleyin.
                Sonra bunları START ve END arasında bağlayın.
              </p>
              <div className="text-xs text-gray-500">
                💡 Agent&apos;lara tıklayın, sürükleyin ve bağlantıları
                oluşturun
              </div>
            </div>
          </div>
        )}

        {/* Test Modal */}
        {showTestModal && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-2">
                  Workflow Test -{' '}
                  {workflowSystems.find((s) => s.id === selectedSystem)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Workflow&apos;unuzu test etmek için bir prompt girin
                </p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    Test Prompt&apos;u:
                  </label>
                  <textarea
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Workflow'unuzu test etmek istediğiniz prompt'u girin..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
                    disabled={isRunningTest}
                  />
                </div>

                {testResult && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-black mb-2">
                      Test Sonucu:
                    </label>
                    <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                      {testResult}
                    </pre>
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setShowTestModal(false)}
                    variant="outline"
                    disabled={isRunningTest}
                  >
                    Kapat
                  </Button>
                  <Button
                    onClick={executeTest}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isRunningTest || !testPrompt.trim()}
                  >
                    {isRunningTest ? 'Test Çalışıyor...' : 'Test Çalıştır'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Info Modal */}
        {showInfoModal && selectedSystemInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${selectedSystemInfo.color} text-white`}
                  >
                    {selectedSystemInfo.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedSystemInfo.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedSystemInfo.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInfoModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div>
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Güçlü Yanları
                  </h4>
                  <ul className="space-y-2">
                    {selectedSystemInfo.strengths.map(
                      (strength: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <span className="text-red-600">⚠</span>
                    Zayıf Yanları
                  </h4>
                  <ul className="space-y-2">
                    {selectedSystemInfo.weaknesses.map(
                      (weakness: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-red-500 mt-1">•</span>
                          {weakness}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Best For */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">🎯</span>
                  En İyi Kullanım Alanı
                </h4>
                <p className="text-sm text-blue-700">
                  {selectedSystemInfo.bestFor}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setShowInfoModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Anladım
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
