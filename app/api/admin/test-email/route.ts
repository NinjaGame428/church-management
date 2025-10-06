import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

// POST - Send test email
export async function POST(request: NextRequest) {
  try {
    // Get admin user email from request or use a default
    const body = await request.json();
    const testEmail = body.email || 'admin@impactcentrechretien.com';

    // Send test email
    await emailService.sendWelcomeEmail(
      testEmail,
      'Test Email',
      'Test Email from Impact Centre Chrétien',
      'Ceci est un email de test pour vérifier la configuration SMTP.'
    );

    return NextResponse.json({ 
      message: 'Test email sent successfully',
      recipient: testEmail
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email. Please check your SMTP configuration.' },
      { status: 500 }
    );
  }
}
