import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const availability = await prisma.availability.update({
      where: { 
        id: params.id,
        userId // Ensure user can only update their own availability
      },
      data: {
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
    console.error('Update availability error:', error)
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
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    await prisma.availability.delete({
      where: { 
        id: params.id,
        userId // Ensure user can only delete their own availability
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete availability error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
