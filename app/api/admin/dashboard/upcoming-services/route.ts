import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const twoWeeksFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));

    // Get upcoming services with their assignment counts
    const upcomingServices = await prisma.service.findMany({
      where: {
        date: {
          gte: now,
          lte: twoWeeksFromNow
        },
        status: 'PUBLISHED'
      },
      include: {
        _count: {
          select: {
            assignments: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: 10
    });

    // Transform the data to match our interface
    const services = upcomingServices.map(service => ({
      id: service.id,
      title: service.title,
      date: service.date.toISOString(),
      time: service.time,
      status: service.status,
      assignments: service._count.assignments
    }));

    return NextResponse.json(services);
  } catch (error) {
    console.error('Dashboard upcoming services error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
