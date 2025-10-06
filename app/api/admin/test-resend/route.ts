import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// POST - Test Resend connection
export async function POST() {
  try {
    console.log('Testing Resend connection...');
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Resend API key is not configured',
          configured: false
        },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Test with a simple email using Resend's verified domain
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['test@example.com'], // This won't actually send, just test the connection
      subject: 'Test Connection',
      html: '<p>This is a test email to verify Resend connection.</p>'
    });

    console.log('Resend test result:', { data, error });

    if (error) {
      return NextResponse.json({
        error: 'Resend connection failed',
        details: error.message || 'Unknown error',
        errorCode: error.name || 'UnknownError',
        configured: true,
        working: false
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Resend connection successful',
      configured: true,
      working: true,
      apiKeyPrefix: process.env.RESEND_API_KEY.substring(0, 10) + '...'
    });

  } catch (error: any) {
    console.error('Resend connection test failed:', error);
    return NextResponse.json({
      error: 'Resend connection test failed',
      details: error.message || 'Unknown error',
      configured: !!process.env.RESEND_API_KEY,
      working: false
    }, { status: 500 });
  }
}
