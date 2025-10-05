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

    const services = await prisma.service.findMany({
      where: {
        assignments: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        church: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Get user services error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
