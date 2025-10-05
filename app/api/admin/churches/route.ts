import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const churches = await prisma.church.findMany({
      select: {
        id: true,
        name: true,
        address: true
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(churches)
  } catch (error) {
    console.error('Get churches error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
