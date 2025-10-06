import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { template, email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const testUser = {
      id: 'test-user-id',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: email,
      role: 'USER'
    };

    const testService = {
      id: 'test-service-id',
      title: 'Service du Dimanche Matin',
      description: 'Culte principal avec louange et prédication',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
      time: '10:00',
      location: 'Salle principale',
      status: 'PUBLISHED'
    };

    const testFromUser = {
      id: 'test-from-user-id',
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      role: 'USER'
    };

    const testToUser = {
      id: 'test-to-user-id',
      firstName: 'Pierre',
      lastName: 'Durand',
      email: 'pierre.durand@example.com',
      role: 'USER'
    };

    let result = false;

    switch (template) {
      case 'service-assigned':
        result = await emailService.sendServiceAssignmentEmail(testUser, testService, 'Chantre');
        break;

      case 'service-modified':
        result = await emailService.sendServiceModifiedEmail(
          testUser, 
          testService, 
          'Chantre', 
          ['Heure modifiée de 10:00 à 10:30', 'Lieu changé pour la salle annexe']
        );
        break;

      case 'service-cancelled':
        result = await emailService.sendServiceCancelledEmail(
          testUser, 
          testService, 
          'Chantre', 
          'Service annulé en raison de circonstances exceptionnelles'
        );
        break;

      case 'schedule-published':
        result = await emailService.sendSchedulePublishedEmail(
          testUser,
          [
            { title: 'Service du Dimanche', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), time: '10:00', location: 'Salle principale', role: 'Chantre' },
            { title: 'Réunion de Prière', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), time: '19:00', location: 'Salle de prière', role: 'Animateur' }
          ],
          'Semaine du 15 au 21 Janvier 2024'
        );
        break;

      case 'reminder-24h':
        result = await emailService.sendReminder24hEmail(testUser, testService, 'Chantre');
        break;

      case 'intervenant-removed':
        result = await emailService.sendIntervenantRemovedEmail(
          testUser, 
          testService, 
          'Chantre', 
          'Réassignation nécessaire'
        );
        break;

      case 'password-reset':
        result = await emailService.sendPasswordResetEmail(
          testUser, 
          'reset-token-123', 
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        );
        break;

      case 'email-verification':
        result = await emailService.sendEmailVerificationEmail(
          testUser, 
          'verification-token-123', 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        );
        break;

      case 'swap-request-received':
        result = await emailService.sendSwapRequestReceivedEmail(
          testToUser, 
          testFromUser, 
          testService, 
          'Je ne peux pas être présent ce dimanche, pourriez-vous me remplacer ?'
        );
        break;

      case 'swap-accepted':
        result = await emailService.sendSwapAcceptedEmail(testFromUser, testToUser, testService);
        break;

      case 'swap-approved':
        result = await emailService.sendSwapApprovedEmail(testFromUser, testToUser, testService);
        break;

      case 'swap-rejected':
        result = await emailService.sendSwapRejectedEmail(
          testFromUser, 
          testToUser, 
          testService, 
          'Je ne suis pas disponible ce dimanche'
        );
        break;

      case 'availability-reminder':
        result = await emailService.sendAvailabilityReminderEmail(
          testUser,
          [
            { title: 'Service du Dimanche', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), time: '10:00', location: 'Salle principale' },
            { title: 'Réunion de Prière', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), time: '19:00', location: 'Salle de prière' }
          ],
          'Semaine du 15 au 21 Janvier 2024'
        );
        break;

      case 'new-intervenant-registered':
        result = await emailService.sendNewIntervenantRegisteredEmail(
          { ...testUser, role: 'ADMIN' },
          { ...testToUser, phone: '+33 1 23 45 67 89', department: 'Louange' }
        );
        break;

      case 'welcome-new-intervenant':
        result = await emailService.sendWelcomeNewIntervenantEmail(
          testToUser,
          'Pasteur Jean Dupont',
          'Impact Centre Chrétien'
        );
        break;

      default:
        return NextResponse.json({ error: 'Template not found' }, { status: 400 });
    }

    if (result) {
      return NextResponse.json({ 
        success: true, 
        message: `Email template '${template}' sent successfully to ${email}` 
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to send email' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error testing email template:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
