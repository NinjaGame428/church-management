import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    const availabilities = await prisma.availability.findMany({
      where: { userId },
      include: {
        service: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { date: 'asc' }
    })

    const formattedAvailabilities = availabilities.map(av => ({
      id: av.id,
      date: av.date.toISOString().split('T')[0],
      startTime: av.startTime,
      endTime: av.endTime,
      status: av.status,
      notes: av.notes,
      serviceId: av.serviceId,
      serviceTitle: av.service?.title
    }))

    return NextResponse.json(formattedAvailabilities)
  } catch (error) {
    console.error('Get availability error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      userId,
      date, 
      startTime, 
      endTime, 
      status, 
      notes, 
      serviceId 
    } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    const availability = await prisma.availability.create({
      data: {
        userId,
        date: new Date(date),
        startTime,
        endTime,
        status: status as 'available' | 'unavailable' | 'busy',
        notes,
        serviceId: serviceId || null
      },
      include: {
        service: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json({
      id: availability.id,
      date: availability.date.toISOString().split('T')[0],
      startTime: availability.startTime,
      endTime: availability.endTime,
      status: availability.status,
      notes: availability.notes,
      serviceId: availability.serviceId,
      serviceTitle: availability.service?.title
    })
  } catch (error) {
    console.error('Create availability error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
