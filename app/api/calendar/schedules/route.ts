import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const schedules = await prisma.service.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                department: true
              }
            }
          }
        }
      },
      orderBy: { date: 'asc' }
    })

    const formattedSchedules = schedules.map(service => ({
      id: service.id,
      title: service.title,
      date: service.date.toISOString().split('T')[0],
      time: service.time,
      location: service.location,
      description: service.description,
      users: service.assignments.map(assignment => ({
        id: assignment.user.id,
        name: `${assignment.user.firstName} ${assignment.user.lastName}`,
        role: assignment.role,
        department: assignment.user.department,
        email: assignment.user.email,
        phone: assignment.user.phone
      }))
    }))

    return NextResponse.json(formattedSchedules)
  } catch (error) {
    console.error('Get schedules error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
