import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

// POST create new agent
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      systemPrompt,
      queryPrompt,
      toolConfig = {},
    } = body

    // Validate required fields
    if (!name || !description || !systemPrompt || !queryPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create agent with tool selection checkboxes
    const agent = await prisma.agent.create({
      data: {
        name,
        description,
        systemPrompt,
        queryPrompt,
        tool_selection_checkboxes_tool1: toolConfig.tool1 || false,
        tool_selection_checkboxes_webSearch: toolConfig.webSearch || false,
        tool_selection_checkboxes_codeExecution:
          toolConfig.codeExecution || false,
        tool_selection_checkboxes_fileAnalysis:
          toolConfig.fileAnalysis || false,
      },
    })

    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}
