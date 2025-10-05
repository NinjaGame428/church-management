import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { role } = await request.json()

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role: role as 'ADMIN' | 'USER' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Update user role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
