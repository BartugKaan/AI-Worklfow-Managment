import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/workflows/[id] - Get specific workflow
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id }
    })

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Parse JSON strings back to objects
    const parsedWorkflow = {
      ...workflow,
      nodes: JSON.parse((workflow as any).nodes),
      edges: JSON.parse((workflow as any).edges)
    }

    return NextResponse.json(parsedWorkflow)
  } catch (error) {
    console.error('Error fetching workflow:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    )
  }
}

// PUT /api/workflows/[id] - Update workflow
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, nodes, edges, nodeCount, agentCount } = body

    const workflow = await prisma.workflow.update({
      where: { id: params.id },
      data: {
        name: name || undefined,
        description: description || undefined,
        nodeCount: nodeCount || undefined,
        agentCount: agentCount || undefined,
        nodes: nodes ? JSON.stringify(nodes) : undefined,
        edges: edges ? JSON.stringify(edges) : undefined,
        updatedAt: new Date()
      } as any
    })

    // Return workflow with parsed JSON
    const responseWorkflow = {
      ...workflow,
      nodes: JSON.parse((workflow as any).nodes),
      edges: JSON.parse((workflow as any).edges)
    }

    return NextResponse.json(responseWorkflow)
  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    )
  }
}

// DELETE /api/workflows/[id] - Delete workflow
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.workflow.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    )
  }
}
