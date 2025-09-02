import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/workflows - Get all workflows
export async function GET() {
  try {
    const workflows = await prisma.workflow.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse JSON strings back to objects
    const parsedWorkflows = workflows.map((workflow: any) => ({
      ...workflow,
      nodes: JSON.parse(workflow.nodes),
      edges: JSON.parse(workflow.edges)
    }))

    return NextResponse.json(parsedWorkflows)
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

// POST /api/workflows - Create a new workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, nodes, edges, nodeCount, agentCount } = body

    if (!name || !nodes || !edges) {
      return NextResponse.json(
        { error: 'Missing required fields: name, nodes, edges' },
        { status: 400 }
      )
    }

    const workflow = await prisma.workflow.create({
      data: {
        name,
        description: description || null,
        nodeCount: nodeCount || 0,
        agentCount: agentCount || 0,
        nodes: JSON.stringify(nodes),
        edges: JSON.stringify(edges),
        userId: null as any // For now, not using user authentication
      } as any
    })

    // Return workflow with parsed JSON
    const responseWorkflow = {
      ...workflow,
      nodes: JSON.parse((workflow as any).nodes),
      edges: JSON.parse((workflow as any).edges)
    }

    return NextResponse.json(responseWorkflow, { status: 201 })
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}
