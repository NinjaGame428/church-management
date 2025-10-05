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

    // Get service assignments for the user
    const assignments = await prisma.serviceAssignment.findMany({
      where: {
        userId: userId
      },
      include: {
        service: {
          include: {
            church: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { 
        service: {
          date: 'asc'
        }
      }
    })

    // Transform the data to match the expected structure
    const transformedAssignments = assignments.map((assignment: any) => ({
      id: assignment.id,
      role: assignment.role,
      status: assignment.status,
      service: {
        id: assignment.service.id,
        title: assignment.service.title,
        description: assignment.service.description,
        date: assignment.service.date,
        time: assignment.service.time,
        location: assignment.service.location,
        status: assignment.service.status,
        church: {
          id: assignment.service.church.id,
          name: assignment.service.church.name
        }
      }
    }))

    return NextResponse.json(transformedAssignments)
  } catch (error) {
    console.error('Get user services error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
