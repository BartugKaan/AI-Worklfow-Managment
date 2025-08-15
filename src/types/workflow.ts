import type { Node, Edge } from '@xyflow/react'

// Minimal agent info stored on nodes to allow serialization and rebuild of labels
export interface WorkflowAgentInfo {
  id: string
  name: string
  description: string
  tool_selection_checkboxes_webSearch: boolean
  tool_selection_checkboxes_codeExecution: boolean
  tool_selection_checkboxes_fileAnalysis: boolean
}

export interface SavedWorkflow {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  nodeCount: number
  agentCount: number
  nodes: Node[]
  edges: Edge[]
}

// Workflow execution types (matching agent-workflow structure)
export interface WorkflowExecutionResult {
  workflow_id: string
  results: WorkflowNodeResult[]
  execution_time: number
  status: 'success' | 'failed'
}

export interface WorkflowNodeResult {
  node_id: string
  agent_name: string
  output: string
  processed_text: string
}

// For API calls to agent-workflow backend
export interface WorkflowData {
  id?: string
  name: string
  nodes: Node[]
  edges: Edge[]
}


