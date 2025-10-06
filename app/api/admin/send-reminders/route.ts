import { NextRequest, NextResponse } from 'next/server';
import { triggerServiceReminders } from '@/lib/reminder-service';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Manual reminder trigger requested');
    
    const result = await triggerServiceReminders();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        remindersSent: result.remindersSent
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        remindersSent: result.remindersSent
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Manual reminder trigger error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        remindersSent: 0
      },
      { status: 500 }
    );
  }
}
