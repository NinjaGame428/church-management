import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()

    if (!['accepted', 'rejected', 'admin_approved', 'admin_rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const swapRequest = await prisma.swapRequest.update({
      where: { id: params.id },
      data: { status: status as 'accepted' | 'rejected' | 'admin_approved' | 'admin_rejected' },
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
            title: true,
            date: true,
            time: true,
            location: true
          }
        }
      }
    })

    // Only execute the swap when admin approves
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

      // Send email notifications for approved swap
      try {
        await emailService.sendSwapApprovedEmail(
          swapRequest.fromUser,
          swapRequest.toUser,
          {
            id: swapRequest.service.id,
            title: swapRequest.service.title,
            date: swapRequest.service.date,
            time: swapRequest.service.time,
            location: swapRequest.service.location,
            status: 'PUBLISHED'
          }
        );
      } catch (emailError) {
        console.error('Failed to send swap approved email:', emailError);
      }
    }

    // Send email notifications for accepted/rejected swap requests
    if (status === 'accepted') {
      try {
        await emailService.sendSwapAcceptedEmail(
          swapRequest.fromUser,
          swapRequest.toUser,
          {
            id: swapRequest.service.id,
            title: swapRequest.service.title,
            date: swapRequest.service.date,
            time: swapRequest.service.time,
            location: swapRequest.service.location,
            status: 'PUBLISHED'
          }
        );
      } catch (emailError) {
        console.error('Failed to send swap accepted email:', emailError);
      }
    } else if (status === 'rejected') {
      try {
        await emailService.sendSwapRejectedEmail(
          swapRequest.fromUser,
          swapRequest.toUser,
          {
            id: swapRequest.service.id,
            title: swapRequest.service.title,
            date: swapRequest.service.date,
            time: swapRequest.service.time,
            location: swapRequest.service.location,
            status: 'PUBLISHED'
          }
        );
      } catch (emailError) {
        console.error('Failed to send swap rejected email:', emailError);
      }
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
