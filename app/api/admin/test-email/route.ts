import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

// POST - Send test email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, fromEmail, fromName } = body;

    if (!to) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Resend API key is not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    console.log('Sending test email to:', to);
    console.log('Resend API key configured:', !!process.env.RESEND_API_KEY);
    console.log('Resend API key starts with:', process.env.RESEND_API_KEY?.substring(0, 10));
    console.log('From email:', process.env.FROM_EMAIL);

    // Create test email content
    const testEmailContent = `
      <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 20px;">✅ Test Email Réussi</h1>
      
      <p>Bonjour,</p>
      
      <p>Ceci est un email de test pour vérifier la configuration Resend de votre système de gestion des services.</p>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
        <h3 style="margin-top: 0; color: #2563eb; font-size: 18px;">Configuration Testée</h3>
        <p><strong>Expéditeur:</strong> ${fromName || 'Impact Centre Chrétien'}</p>
        <p><strong>Email:</strong> ${fromEmail || 'noreply@impactcentrechretien.com'}</p>
        <p><strong>Destinataire:</strong> ${to}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
      </div>
      
      <p>Si vous recevez cet email, votre configuration Resend fonctionne correctement !</p>
      
      <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #16a34a;">🎉 Félicitations !</h4>
        <p style="margin: 10px 0;">Votre système d'email est maintenant configuré et prêt à envoyer des notifications automatiques.</p>
      </div>
    `;

    // Send test email using a simpler approach
    console.log('Attempting to send email...');
    
    // Try using Resend directly with a verified domain
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's verified domain for testing
      to: [to],
      subject: 'Test Email - Configuration Resend',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0;">
              <div style="font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px;">Impact Centre Chrétien</div>
              <p style="margin: 0; color: #64748b;">Test de Configuration Email</p>
            </div>
            
            <div>
              ${testEmailContent}
            </div>
            
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
              <p>Impact Centre Chrétien - Système de Gestion des Services</p>
              <p>Cet email a été envoyé automatiquement pour tester la configuration.</p>
            </div>
          </div>
        </div>
      `
    });

    console.log('Resend response:', { data, error });
    
    const success = !error && data;

    console.log('Email send result:', success);

    if (success) {
      return NextResponse.json({ 
        message: 'Test email sent successfully',
        recipient: to,
        messageId: data?.id
      });
    } else {
      console.error('Resend error details:', error);
      return NextResponse.json(
        { 
          error: 'Failed to send test email. Please check your Resend API key and configuration.',
          details: error?.message || 'Unknown error',
          errorCode: error?.name || 'UnknownError'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email. Please check your Resend configuration.',
        details: error?.message || 'Unknown error',
        errorCode: error?.name || 'UnknownError'
      },
      { status: 500 }
    );
  }
}
