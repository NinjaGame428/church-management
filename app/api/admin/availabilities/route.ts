import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    const whereClause = userId && userId !== 'all' 
      ? { userId } 
      : {}

    const availabilities = await prisma.availability.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: true
          }
        }
      },
      orderBy: { date: 'asc' }
    })

    const formattedAvailabilities = availabilities.map((av: any) => ({
      id: av.id,
      date: av.date.toISOString().split('T')[0],
      startTime: av.startTime,
      endTime: av.endTime,
      status: av.status,
      notes: av.notes,
      user: av.user
    }))

    return NextResponse.json(formattedAvailabilities)
  } catch (error) {
    console.error('Get admin availabilities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
