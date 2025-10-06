import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { emailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      role, 
      churchName, 
      churchAddress 
    } = await request.json()

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['ADMIN', 'USER'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Admin must provide church name
    if (role === 'ADMIN' && !churchName) {
      return NextResponse.json(
        { error: 'Church name is required for administrators' },
        { status: 400 }
      )
    }

    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      churchName,
      churchAddress
    })

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    console.error('Registration API error:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
