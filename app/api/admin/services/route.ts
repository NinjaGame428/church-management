import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      include: {
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
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
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Get admin services error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      title,
      description,
      date,
      time,
      location,
      status = 'DRAFT',
      assignments = []
    } = await request.json()

    if (!title || !date || !time || !location) {
      return NextResponse.json(
        { error: 'Title, date, time, and location are required' },
        { status: 400 }
      )
    }

    // Get the first church (since it's a single church project)
    const church = await prisma.church.findFirst()
    if (!church) {
      return NextResponse.json(
        { error: 'No church found' },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        location,
        status: status as 'DRAFT' | 'PUBLISHED' | 'CANCELLED',
        churchId: church.id,
        assignments: {
          create: assignments.map((assignment: { userId: string; role: string }) => ({
            userId: assignment.userId,
            role: assignment.role,
            status: 'PENDING'
          }))
        }
      },
      include: {
        church: {
          select: {
            id: true,
            name: true
          }
        },
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Create service error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}