import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single agent
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await prisma.agent.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    )
  }
}

// PUT update agent
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      systemPrompt,
      queryPrompt,
      isActive,
      toolConfig = {},
    } = body

    const agent = await prisma.agent.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        systemPrompt,
        queryPrompt,
        isActive,
        tool_selection_checkboxes_tool1: toolConfig.tool1 || false,
        tool_selection_checkboxes_webSearch: toolConfig.webSearch || false,
        tool_selection_checkboxes_codeExecution:
          toolConfig.codeExecution || false,
        tool_selection_checkboxes_fileAnalysis:
          toolConfig.fileAnalysis || false,
      },
    })

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    )
  }
}

// DELETE agent
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.agent.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Agent deleted successfully' })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    )
  }
}
