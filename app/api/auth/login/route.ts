import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log('Login attempt for email:', email)

    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await authenticateUser(email, password)
    console.log('Authentication result:', user ? 'Success' : 'Failed')

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Login successful for user:', user.email)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
