import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const swapRequests = await prisma.swapRequest.findMany({
      where: {
        status: 'accepted' // Only show requests that have been accepted by users
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
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedRequests = swapRequests.map(req => ({
      id: req.id,
      fromUser: req.fromUser,
      toUser: req.toUser,
      serviceId: req.serviceId,
      service: req.service,
      date: req.date.toISOString().split('T')[0],
      status: req.status,
      message: req.message,
      createdAt: req.createdAt
    }))

    return NextResponse.json(formattedRequests)
  } catch (error) {
    console.error('Get admin swap requests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
