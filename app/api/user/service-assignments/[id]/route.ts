import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()

    const assignment = await prisma.serviceAssignment.update({
      where: { id: params.id },
      data: { status: status as 'PENDING' | 'CONFIRMED' | 'DECLINED' },
      include: {
        service: {
          select: {
            title: true,
            date: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Send notification to admin about the response
    if (status === 'CONFIRMED' || status === 'DECLINED') {
      await prisma.notification.create({
        data: {
          userId: assignment.userId,
          type: 'assignment_response',
          title: `Service ${status === 'CONFIRMED' ? 'confirmé' : 'refusé'}`,
          message: `Vous avez ${status === 'CONFIRMED' ? 'confirmé' : 'refusé'} votre participation au service "${assignment.service.title}"`,
          data: {
            serviceId: assignment.serviceId,
            serviceTitle: assignment.service.title,
            date: assignment.service.date,
            status: status
          }
        }
      })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Update service assignment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
