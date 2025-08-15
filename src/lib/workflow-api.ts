import type { WorkflowData, WorkflowExecutionResult } from '@/types/workflow'
import type { Agent } from '@/hooks/useAgents'

const AGENT_WORKFLOW_API_URL = 'http://localhost:8001'

export class WorkflowApiService {
  /**
   * Transform workflow data to ensure correct agent IDs
   */
  private static transformWorkflowForBackend(workflow: WorkflowData): WorkflowData {
    const transformedNodes = workflow.nodes.map(node => {
      const nodeData = node.data as any
      
      // For START and END nodes, ensure agentId is set correctly
      if (node.type === 'startNode') {
        return {
          ...node,
          data: {
            ...nodeData,
            label: 'START',
            agentId: 'START'
          }
        }
      }
      
      if (node.type === 'endNode') {
        return {
          ...node,
          data: {
            ...nodeData,
            label: 'END',
            agentId: 'END'
          }
        }
      }
      
      if (node.type === 'agentNode' && nodeData && nodeData.agentInfo && nodeData.agentInfo.id) {
        return {
          ...node,
          data: {
            ...nodeData,
            label: nodeData.agentInfo.name || nodeData.label,
            agentId: nodeData.agentInfo.id, 
          }
        }
      }
      
      return node
    })

    console.log('Workflow transformation details:', {
      originalNodes: workflow.nodes.map(n => ({ 
        id: n.id, 
        type: n.type, 
        data: n.data 
      })),
      transformedNodes: transformedNodes.map(n => ({ 
        id: n.id, 
        type: n.type, 
        data: n.data 
      }))
    })

    return {
      ...workflow,
      nodes: transformedNodes
    }
  }

  /**
   * Save workflow to agent-workflow backend
   */
  static async saveWorkflow(workflow: WorkflowData): Promise<WorkflowData> {
    try {
      // Transform workflow data before sending
      const transformedWorkflow = this.transformWorkflowForBackend(workflow)
      
      console.log('Saving workflow with transformed data:', {
        originalNodes: workflow.nodes.map(n => ({ id: n.id, type: n.type, data: n.data })),
        transformedNodes: transformedWorkflow.nodes.map(n => ({ id: n.id, type: n.type, data: n.data }))
      })

      const response = await fetch(`${AGENT_WORKFLOW_API_URL}/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedWorkflow),
      })

      if (!response.ok) {
        throw new Error(`Failed to save workflow: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving workflow:', error)
      throw error
    }
  }

  /**
   * Execute workflow on agent-workflow backend
   */
  static async executeWorkflow(
    workflowId: string,
    inputText: string
  ): Promise<WorkflowExecutionResult> {
    try {
      const response = await fetch(
        `${AGENT_WORKFLOW_API_URL}/workflows/${workflowId}/execute`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input_text: inputText }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.detail || `Failed to execute workflow: ${response.statusText}`
        )
      }

      return await response.json()
    } catch (error) {
      console.error('Error executing workflow:', error)
      throw error
    }
  }

  /**
   * Get all workflows from agent-workflow backend
   */
  static async getWorkflows(): Promise<WorkflowData[]> {
    try {
      const response = await fetch(`${AGENT_WORKFLOW_API_URL}/workflows`)

      if (!response.ok) {
        throw new Error(`Failed to get workflows: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting workflows:', error)
      throw error
    }
  }

  /**
   * Sync agents from AI-Workflow-Management to agent-workflow backend
   */
  static async syncAgents(agents: Agent[]): Promise<void> {
    try {
      console.log('🔄 Starting agent sync...');
      console.log('Agents to sync:', agents.map(a => ({ id: a.id, name: a.name })));
      
      // Get existing agents from backend
      const response = await fetch(`${AGENT_WORKFLOW_API_URL}/agents`);
      const existingAgents = await response.json();
      const existingAgentIds = new Set(existingAgents.map((agent: any) => agent.id));
      
      console.log('Existing agents in backend:', existingAgents.map((a: any) => ({ id: a.id, name: a.name })));

      // Sync only new agents
      for (const agent of agents) {
        if (!existingAgentIds.has(agent.id)) {
          console.log(`➕ Syncing new agent: ${agent.name} (ID: ${agent.id})`);
          const syncResponse = await fetch(`${AGENT_WORKFLOW_API_URL}/agents`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: agent.id, // Include agent ID so backend uses it instead of generating new one
              name: agent.name,
              description: agent.description,
              prompt: agent.systemPrompt, // Backend expects 'prompt', not 'systemPrompt'
            }),
          });
          
          if (syncResponse.ok) {
            console.log(`✅ Successfully synced agent: ${agent.name} (ID: ${agent.id})`);
          } else {
            console.error(`❌ Failed to sync agent: ${agent.name}`, await syncResponse.text());
          }
        } else {
          console.log(`⏭️ Agent already exists: ${agent.name} (ID: ${agent.id})`);
        }
      }
      
      // Verify sync by getting agents again
      const verifyResponse = await fetch(`${AGENT_WORKFLOW_API_URL}/agents`);
      const finalAgents = await verifyResponse.json();
      console.log('Final agents in backend after sync:', finalAgents.map((a: any) => ({ id: a.id, name: a.name })));
      
    } catch (error) {
      console.error('Error syncing agents:', error)
      // Don't throw error - workflow execution should continue even if sync fails
    }
  }

  /**
   * Execute workflow with automatic agent sync
   */
  static async executeWithAgentSync(workflowData: WorkflowData, inputText: string, agents: Agent[]): Promise<WorkflowExecutionResult> {
    // First sync agents to backend
    await this.syncAgents(agents)
    
    // Small delay to ensure agents are persisted
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Then execute workflow
    if (!workflowData.id) {
      throw new Error('Workflow ID is required for execution')
    }
    return this.executeWorkflow(workflowData.id, inputText)
  }
}
