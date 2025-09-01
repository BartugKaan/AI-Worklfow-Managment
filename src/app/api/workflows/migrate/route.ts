import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/workflows/migrate - Migrate localStorage workflows to database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workflows } = body

    if (!workflows || !Array.isArray(workflows)) {
      return NextResponse.json(
        { error: 'Invalid workflows data' },
        { status: 400 }
      )
    }

    const migratedWorkflows = []

    for (const workflow of workflows) {
      try {
        // Check if workflow already exists by name (to avoid duplicates)
        const existingWorkflow = await prisma.workflow.findFirst({
          where: { name: workflow.name }
        })

        if (existingWorkflow) {
          console.log(`Workflow "${workflow.name}" already exists, skipping...`)
          migratedWorkflows.push(existingWorkflow)
          continue
        }

        const migratedWorkflow = await prisma.workflow.create({
          data: {
            name: workflow.name,
            description: workflow.description || null,
            nodeCount: workflow.nodeCount || 0,
            agentCount: workflow.agentCount || 0,
            nodes: JSON.stringify(workflow.nodes || []),
            edges: JSON.stringify(workflow.edges || []),
            createdAt: workflow.createdAt ? new Date(workflow.createdAt) : new Date(),
            updatedAt: workflow.updatedAt ? new Date(workflow.updatedAt) : new Date(),
            userId: null as any // For now, not using user authentication
          } as any
        })

        migratedWorkflows.push(migratedWorkflow)
      } catch (workflowError) {
        console.error(`Error migrating workflow "${workflow.name}":`, workflowError)
        // Continue with other workflows even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      migratedCount: migratedWorkflows.length,
      totalAttempted: workflows.length,
      workflows: migratedWorkflows.map((workflow: any) => ({
        ...workflow,
        nodes: JSON.parse(workflow.nodes),
        edges: JSON.parse(workflow.edges)
      }))
    })
  } catch (error) {
    console.error('Error migrating workflows:', error)
    return NextResponse.json(
      { error: 'Failed to migrate workflows' },
      { status: 500 }
    )
  }
}
