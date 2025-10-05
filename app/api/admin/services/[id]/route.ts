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
    const service = await prisma.$transaction(async (tx: any) => {
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
              role: assignment.role || 'Intervenant',
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

      // Create notifications for newly assigned users
      if (assignments.length > 0) {
        await tx.notification.createMany({
          data: assignments.map((assignment: { userId: string; role: string }) => ({
            userId: assignment.userId,
            type: 'service_assignment',
            title: 'Service mis à jour',
            message: `Vous avez été assigné au service "${title}" le ${new Date(date).toLocaleDateString('fr-FR')} à ${time} en tant que ${assignment.role || 'Intervenant'}`,
            data: {
              serviceId: updatedService.id,
              serviceTitle: title,
              date: date,
              time: time,
              location: location,
              role: assignment.role || 'Intervenant'
            }
          }))
        });
      }

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
