import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const requestData = await request.json()
    const { name, description, color, isActive } = requestData

    // If only isActive is provided, just update status
    if (isActive !== undefined && Object.keys(requestData).length === 1) {
      const role = await prisma.serviceRole.update({
        where: { id },
        data: { isActive }
      })

      return NextResponse.json(role)
    }

    // Full role update
    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      )
    }

    // Check if role name already exists (excluding current role)
    const existingRole = await prisma.serviceRole.findFirst({
      where: { 
        name,
        id: { not: id }
      }
      }
    })

    if (existingRole) {
      return NextResponse.json(
        { error: 'A role with this name already exists' },
        { status: 400 }
      )
    }

    const role = await prisma.serviceRole.update({
      where: { id },
      data: {
        name,
        description,
        color: color || '#3B82F6'
      }
    })

    return NextResponse.json(role)
  } catch (error) {
    console.error('Update role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if role is being used in any assignments
    const assignmentsCount = await prisma.serviceAssignment.count({
      where: { role: { contains: id } }
    })

    if (assignmentsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role that is being used in service assignments' },
        { status: 400 }
      )
    }

    await prisma.serviceRole.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
