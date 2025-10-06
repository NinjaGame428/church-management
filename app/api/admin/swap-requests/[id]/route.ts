import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json()
    const { id } = await params

    if (!['admin_approved', 'admin_rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be admin_approved or admin_rejected' },
        { status: 400 }
      )
    }

    const swapRequest = await prisma.swapRequest.update({
      where: { id },
      data: { status: status as 'admin_approved' | 'admin_rejected' },
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

    // If admin approves, execute the swap
    if (status === 'admin_approved') {
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

      // Create notifications for both users about the approved swap
      await prisma.notification.createMany({
        data: [
          {
            userId: swapRequest.fromUserId,
            type: 'swap_approved',
            title: 'Échange approuvé',
            message: `Votre demande d'échange avec ${swapRequest.toUser.firstName} ${swapRequest.toUser.lastName} a été approuvée par l'administrateur.`,
            data: {
              swapRequestId: swapRequest.id,
              serviceId: swapRequest.serviceId,
              serviceTitle: swapRequest.service?.title,
              date: swapRequest.date.toISOString().split('T')[0]
            }
          },
          {
            userId: swapRequest.toUserId,
            type: 'swap_approved',
            title: 'Échange approuvé',
            message: `L'échange avec ${swapRequest.fromUser.firstName} ${swapRequest.fromUser.lastName} a été approuvé par l'administrateur.`,
            data: {
              swapRequestId: swapRequest.id,
              serviceId: swapRequest.serviceId,
              serviceTitle: swapRequest.service?.title,
              date: swapRequest.date.toISOString().split('T')[0]
            }
          }
        ]
      })
    } else if (status === 'admin_rejected') {
      // Create notifications for both users about the rejected swap
      await prisma.notification.createMany({
        data: [
          {
            userId: swapRequest.fromUserId,
            type: 'swap_rejected',
            title: 'Échange rejeté',
            message: `Votre demande d'échange avec ${swapRequest.toUser.firstName} ${swapRequest.toUser.lastName} a été rejetée par l'administrateur.`,
            data: {
              swapRequestId: swapRequest.id,
              serviceId: swapRequest.serviceId,
              serviceTitle: swapRequest.service?.title,
              date: swapRequest.date.toISOString().split('T')[0]
            }
          },
          {
            userId: swapRequest.toUserId,
            type: 'swap_rejected',
            title: 'Échange rejeté',
            message: `L'échange avec ${swapRequest.fromUser.firstName} ${swapRequest.fromUser.lastName} a été rejeté par l'administrateur.`,
            data: {
              swapRequestId: swapRequest.id,
              serviceId: swapRequest.serviceId,
              serviceTitle: swapRequest.service?.title,
              date: swapRequest.date.toISOString().split('T')[0]
            }
          }
        ]
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
    console.error('Update admin swap request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
