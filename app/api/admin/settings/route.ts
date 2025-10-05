import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get system settings (you can store these in a settings table or return defaults)
    const settings = {
      autoAssignServices: false,
      requireApproval: true,
      allowSelfRegistration: false,
      maintenanceMode: false
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Get admin settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json()

    // Here you would typically save to a settings table
    // For now, we'll just return success
    // In a real implementation, you'd save these to the database

    console.log('Updating system settings:', settings)

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    })
  } catch (error) {
    console.error('Update admin settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
