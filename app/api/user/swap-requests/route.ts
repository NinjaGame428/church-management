import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    const swapRequests = await prisma.swapRequest.findMany({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId }
        ]
      },
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
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedRequests = swapRequests.map(req => ({
      id: req.id,
      fromUser: req.fromUser,
      toUser: req.toUser,
      serviceId: req.serviceId,
      serviceTitle: req.service?.title,
      date: req.date.toISOString().split('T')[0],
      status: req.status,
      message: req.message,
      createdAt: req.createdAt
    }))

    return NextResponse.json(formattedRequests)
  } catch (error) {
    console.error('Get swap requests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      fromUserId,
      toUserId,
      serviceId, 
      date, 
      message 
    } = await request.json()

    if (!fromUserId) {
      return NextResponse.json(
        { error: 'From user ID is required' },
        { status: 401 }
      )
    }

    // Find available users for the service
    if (!toUserId) {
      // Validate and parse the date
      const serviceDate = new Date(date);
      if (isNaN(serviceDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        )
      }

      const availableUsers = await prisma.user.findMany({
        where: {
          role: 'USER',
          id: { not: fromUserId },
          availability: {
            some: {
              date: serviceDate,
              status: 'available'
            }
          }
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          department: true
        }
      })

      return NextResponse.json({ availableUsers })
    }

    const swapRequest = await prisma.swapRequest.create({
      data: {
        fromUserId,
        toUserId,
        serviceId,
        date: new Date(date),
        message,
        status: 'pending'
      },
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

    // Send email notification to the target user
    try {
      await emailService.sendSwapRequestEmail(
        swapRequest.fromUser,
        swapRequest.toUser,
        {
          id: swapRequest.service.id,
          title: swapRequest.service.title,
          date: swapRequest.service.date,
          time: swapRequest.service.time,
          location: swapRequest.service.location,
          status: 'PUBLISHED'
        },
        message
      );
    } catch (emailError) {
      console.error('Failed to send swap request email:', emailError);
      // Don't fail the request if email fails
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
    console.error('Create swap request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
