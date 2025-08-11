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


