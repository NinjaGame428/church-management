import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { action, reason } = await request.json()
    const { id } = await params

    // Validate action
    if (!action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "accept" or "decline"' },
        { status: 400 }
      )
    }

    // If declining, require a reason
    if (action === 'decline' && !reason?.trim()) {
      return NextResponse.json(
        { error: 'Reason is required when declining a service' },
        { status: 400 }
      )
    }

    const status = action === 'accept' ? 'CONFIRMED' : 'DECLINED'

    const updateData: any = { 
      status: status as 'PENDING' | 'CONFIRMED' | 'DECLINED'
    }
    
    if (action === 'decline' && reason) {
      updateData.declineReason = reason
    }

    const assignment = await prisma.serviceAssignment.update({
      where: { id },
      data: updateData,
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
          message: `Vous avez ${status === 'CONFIRMED' ? 'confirmé' : 'refusé'} votre participation au service "${assignment.service.title}"${reason ? ` - Raison: ${reason}` : ''}`,
          data: {
            serviceId: assignment.serviceId,
            serviceTitle: assignment.service.title,
            date: assignment.service.date,
            status: status,
            ...(reason && { reason })
          }
        }
      })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Update service assignment error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
