import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const roles = await prisma.serviceRole.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(roles)
  } catch (error) {
    console.error('Get roles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, color } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      )
    }

    // Check if role already exists
    const existingRole = await prisma.serviceRole.findUnique({
      where: { name }
    })

    if (existingRole) {
      return NextResponse.json(
        { error: 'A role with this name already exists' },
        { status: 400 }
      )
    }

    const role = await prisma.serviceRole.create({
      data: {
        name,
        description,
        color: color || '#3B82F6'
      }
    })

    return NextResponse.json(role)
  } catch (error) {
    console.error('Create role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
