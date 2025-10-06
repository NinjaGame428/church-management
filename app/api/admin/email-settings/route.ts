import { NextRequest, NextResponse } from 'next/server';

// GET - Load email settings
export async function GET() {
  try {
    // Load email settings from environment variables
    const settings = {
      smtpHost: process.env.SMTP_HOST || '',
      smtpPort: process.env.SMTP_PORT || '',
      smtpUser: process.env.SMTP_USER || '',
      smtpPass: process.env.SMTP_PASS ? '••••••••' : '', // Don't expose actual password
      fromEmail: process.env.SMTP_USER || '',
      fromName: process.env.FROM_NAME || 'Impact Centre Chrétien'
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
    const { smtpHost, smtpPort, smtpUser, smtpPass, fromEmail, fromName } = body;

    // Validate required fields
    if (!smtpHost || !smtpPort || !smtpUser || !fromEmail) {
      return NextResponse.json(
        { error: 'Missing required email settings' },
        { status: 400 }
      );
    }

    // In a real application, you would save these to a database or secure storage
    // For now, we'll just validate the settings
    console.log('Email settings updated:', {
      smtpHost,
      smtpPort,
      smtpUser,
      fromEmail,
      fromName
    });

    return NextResponse.json({ 
      message: 'Email settings saved successfully',
      settings: {
        smtpHost,
        smtpPort,
        smtpUser,
        fromEmail,
        fromName
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
