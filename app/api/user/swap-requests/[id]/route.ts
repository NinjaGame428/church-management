import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const swapRequest = await prisma.swapRequest.update({
      where: { id: params.id },
      data: { status: status as 'accepted' | 'rejected' },
      include: {
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        toUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        service: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    // If accepted, update the service assignments
    if (status === 'accepted') {
      // Update the service assignment to swap users
      await prisma.serviceAssignment.updateMany({
        where: {
          serviceId: swapRequest.serviceId,
          userId: swapRequest.fromUserId
        },
        data: {
          userId: swapRequest.toUserId
        }
      })

      // Update availability for both users
      await prisma.availability.updateMany({
        where: {
          userId: swapRequest.fromUserId,
          date: swapRequest.date
        },
        data: {
          status: 'available'
        }
      })

      await prisma.availability.updateMany({
        where: {
          userId: swapRequest.toUserId,
          date: swapRequest.date
        },
        data: {
          status: 'busy'
        }
      })
    }

    return NextResponse.json({
      id: swapRequest.id,
      fromUser: swapRequest.fromUser,
      toUser: swapRequest.toUser,
      serviceId: swapRequest.serviceId,
      serviceTitle: swapRequest.service?.title,
      date: swapRequest.date.toISOString().split('T')[0],
      status: swapRequest.status,
      message: swapRequest.message
    })
  } catch (error) {
    console.error('Update swap request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
