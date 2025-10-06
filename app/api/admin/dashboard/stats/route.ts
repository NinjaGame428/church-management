import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const twoWeeksFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));

    // Services this month
    const servicesThisMonth = await prisma.service.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Active users (all users except admins)
    const activeUsers = await prisma.user.count({
      where: {
        role: 'USER'
      }
    });

    // Scheduled services (next 2 weeks)
    const scheduledServices = await prisma.service.count({
      where: {
        date: {
          gte: now,
          lte: twoWeeksFromNow
        },
        status: 'PUBLISHED'
      }
    });

    // Participation rate (confirmed assignments / total assignments)
    const totalAssignments = await prisma.serviceAssignment.count();
    const confirmedAssignments = await prisma.serviceAssignment.count({
      where: {
        status: 'CONFIRMED'
      }
    });

    const participationRate = totalAssignments > 0 
      ? Math.round((confirmedAssignments / totalAssignments) * 100)
      : 0;

    return NextResponse.json({
      servicesThisMonth,
      activeUsers,
      scheduledServices,
      participationRate
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
