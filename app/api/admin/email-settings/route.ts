import { NextRequest, NextResponse } from 'next/server';

// GET - Load email settings
export async function GET() {
  try {
    // Load email settings from environment variables
    const settings = {
      resendApiKey: process.env.RESEND_API_KEY ? '••••••••' : '', // Don't expose actual API key
      fromEmail: process.env.FROM_EMAIL || '',
      fromName: 'Impact Centre Chrétien',
      replyTo: process.env.FROM_EMAIL || '',
      enableEmailNotifications: true,
      enableServiceReminders: true,
      enableAvailabilityReminders: true,
      enableSwapNotifications: true,
      reminderTime: '24'
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error loading email settings:', error);
    return NextResponse.json(
      { error: 'Failed to load email settings' },
      { status: 500 }
    );
  }
}

// POST - Save email settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      resendApiKey, 
      fromEmail, 
      fromName, 
      replyTo,
      enableEmailNotifications,
      enableServiceReminders,
      enableAvailabilityReminders,
      enableSwapNotifications,
      reminderTime
    } = body;

    // Validate required fields
    if (!fromEmail) {
      return NextResponse.json(
        { error: 'From email is required' },
        { status: 400 }
      );
    }

    // In a real application, you would save these to a database or secure storage
    // For now, we'll just validate the settings and log them
    console.log('Email settings updated:', {
      fromEmail,
      fromName,
      replyTo,
      enableEmailNotifications,
      enableServiceReminders,
      enableAvailabilityReminders,
      enableSwapNotifications,
      reminderTime
    });

    return NextResponse.json({ 
      message: 'Email settings saved successfully',
      settings: {
        fromEmail,
        fromName,
        replyTo,
        enableEmailNotifications,
        enableServiceReminders,
        enableAvailabilityReminders,
        enableSwapNotifications,
        reminderTime
      }
    });
  } catch (error) {
    console.error('Error saving email settings:', error);
    return NextResponse.json(
      { error: 'Failed to save email settings' },
      { status: 500 }
    );
  }
}
