import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestData = await request.json();
    const { 
      title,
      description,
      date,
      time,
      location,
      status,
      assignments = []
    } = requestData;

    // If only status is provided, just update status
    if (status && Object.keys(requestData).length === 1) {
      const service = await prisma.service.update({
        where: { id: params.id },
        data: { status: status as 'DRAFT' | 'PUBLISHED' | 'CANCELLED' },
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
        }
      })

      return NextResponse.json(service)
    }

    // Full service update
    const service = await prisma.$transaction(async (tx) => {
      // Delete existing assignments
      await tx.serviceAssignment.deleteMany({
        where: { serviceId: params.id }
      })

      // Update service
      const updatedService = await tx.service.update({
        where: { id: params.id },
        data: {
          title,
          description,
          date: new Date(date),
          time,
          location,
          status: status as 'DRAFT' | 'PUBLISHED' | 'CANCELLED',
          assignments: {
            create: assignments.map((assignment: { userId: string; role: string }) => ({
              userId: assignment.userId,
              role: assignment.role,
              status: 'PENDING'
            }))
          }
        },
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
        }
      })

      return updatedService
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Update service error:', error)
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
    await prisma.service.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
