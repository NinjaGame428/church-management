import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'

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

    const service = await prisma.$transaction(async (tx: any) => {
      // Create the service
      const newService = await tx.service.create({
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
              role: assignment.role || 'Intervenant',
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
      });

      // Create notifications for assigned users
      if (assignments.length > 0) {
        await tx.notification.createMany({
          data: assignments.map((assignment: { userId: string; role: string }) => ({
            userId: assignment.userId,
            type: 'service_assignment',
            title: 'Nouveau service assigné',
            message: `Vous avez été assigné au service "${title}" le ${new Date(date).toLocaleDateString('fr-FR')} à ${time} en tant que ${assignment.role || 'Intervenant'}`,
            data: {
              serviceId: newService.id,
              serviceTitle: title,
              date: date,
              time: time,
              location: location,
              role: assignment.role || 'Intervenant'
            }
          }))
        });

        // Send email notifications to assigned users
        for (const assignment of assignments) {
          try {
            const user = await tx.user.findUnique({
              where: { id: assignment.userId },
              select: { id: true, firstName: true, lastName: true, email: true }
            });

            if (user) {
              await emailService.sendServiceAssignmentEmail(
                user,
                {
                  id: newService.id,
                  title: newService.title,
                  description: newService.description,
                  date: newService.date,
                  time: newService.time,
                  location: newService.location,
                  status: newService.status
                },
                assignment.role || 'Intervenant'
              );
            }
          } catch (emailError) {
            console.error('Failed to send service assignment email:', emailError);
            // Don't fail the transaction if email fails
          }
        }
      }

      return newService;
    });

    return NextResponse.json(service)
  } catch (error) {
    console.error('Create service error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}