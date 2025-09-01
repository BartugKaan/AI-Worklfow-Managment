import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createToken, verifyPassword } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    let username: string, password: string

    // Handle both JSON and FormData (to match existing frontend)
    if (contentType?.includes('application/json')) {
      const { username: user, password: pass } = await request.json()
      username = user
      password = pass
    } else {
      // Handle FormData (existing frontend sends FormData)
      const formData = await request.formData()
      username = formData.get('username') as string
      password = formData.get('password') as string
    }

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { detail: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Find user by email (username is email)
    const user = await prisma.user.findUnique({
      where: { email: username }
    })

    if (!user) {
      return NextResponse.json(
        { detail: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { detail: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email
    })

    // Return token in OAuth2 format (to match existing frontend expectations)
    return NextResponse.json({
      access_token: token,
      token_type: 'bearer'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
