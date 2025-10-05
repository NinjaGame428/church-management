import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const period = request.nextUrl.searchParams.get('period') || 'month'
    
    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Get basic counts
    const totalUsers = await prisma.user.count()
    const totalServices = await prisma.service.count()
    
    // Get active users (users with recent activity)
    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: startDate
        }
      }
    })

    // Get services this month
    const servicesThisMonth = await prisma.service.count({
      where: {
        date: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      }
    })

    // Get services next month
    const servicesNextMonth = await prisma.service.count({
      where: {
        date: {
          gte: new Date(now.getFullYear(), now.getMonth() + 1, 1),
          lt: new Date(now.getFullYear(), now.getMonth() + 2, 1)
        }
      }
    })

    // Get department statistics
    const departmentStats = await prisma.user.groupBy({
      by: ['department'],
      where: {
        department: {
          not: null
        }
      },
      _count: {
        department: true
      }
    })

    const topDepartments = departmentStats
      .map(dept => ({
        name: dept.department || 'Non spécifié',
        count: dept._count.department,
        percentage: Math.round((dept._count.department / totalUsers) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate participation rate (simplified)
    const participationRate = Math.round((activeUsers / totalUsers) * 100)

    // Get recent activity (simplified)
    const recentActivity = await prisma.notification.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    const formattedActivity = recentActivity.map(activity => ({
      type: activity.type,
      description: activity.title,
      date: activity.createdAt.toISOString(),
      user: `${activity.user.firstName} ${activity.user.lastName}`
    }))

    const reportData = {
      totalUsers,
      totalServices,
      activeUsers,
      participationRate,
      servicesThisMonth,
      servicesNextMonth,
      topDepartments,
      recentActivity: formattedActivity
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Get admin reports error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
