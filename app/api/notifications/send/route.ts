import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { 
      type, 
      targetUserId, 
      fromUserId, 
      serviceId, 
      serviceTitle, 
      date, 
      message 
    } = await request.json()

    // Get target user details
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      )
    }

    // Get from user details
    const fromUser = await prisma.user.findUnique({
      where: { id: fromUserId },
      select: {
        firstName: true,
        lastName: true,
        email: true
      }
    })

    if (!fromUser) {
      return NextResponse.json(
        { error: 'From user not found' },
        { status: 404 }
      )
    }

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: type,
        title: 'Demande d\'échange de service',
        message: message,
        data: {
          fromUser: fromUser,
          serviceId: serviceId,
          serviceTitle: serviceTitle,
          date: date
        }
      }
    })

    // Send email notification
    await sendEmailNotification({
      to: targetUser.email,
      fromName: `${fromUser.firstName} ${fromUser.lastName}`,
      serviceTitle: serviceTitle,
      date: date,
      message: message
    })

    // Send SMS notification if phone number exists
    if (targetUser.phone) {
      await sendSMSNotification({
        to: targetUser.phone,
        fromName: `${fromUser.firstName} ${fromUser.lastName}`,
        serviceTitle: serviceTitle,
        date: date
      })
    }

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendEmailNotification({ to, fromName, serviceTitle, date, message }: {
  to: string;
  fromName: string;
  serviceTitle: string;
  date: string;
  message: string;
}) {
  try {
    // In a real implementation, you would use an email service like SendGrid, Nodemailer, etc.
    console.log('📧 Email notification sent:', {
      to,
      subject: 'Demande d\'échange de service',
      body: `
        Bonjour,
        
        ${fromName} vous a envoyé une demande d'échange pour le service "${serviceTitle}" prévu le ${new Date(date).toLocaleDateString('fr-FR')}.
        
        Message: ${message}
        
        Veuillez vous connecter à ChurchManager pour répondre à cette demande.
        
        Cordialement,
        L'équipe ChurchManager
      `
    });

    // Here you would implement actual email sending
    // await emailService.send({
    //   to,
    //   subject: 'Demande d\'échange de service',
    //   html: emailTemplate
    // });

  } catch (error) {
    console.error('Email notification error:', error);
  }
}

async function sendSMSNotification({ to, fromName, serviceTitle, date }: {
  to: string;
  fromName: string;
  serviceTitle: string;
  date: string;
}) {
  try {
    // In a real implementation, you would use an SMS service like Twilio, etc.
    console.log('📱 SMS notification sent:', {
      to,
      message: `ChurchManager: ${fromName} vous a envoyé une demande d'échange pour le service "${serviceTitle}" du ${new Date(date).toLocaleDateString('fr-FR')}. Connectez-vous pour répondre.`
    });

    // Here you would implement actual SMS sending
    // await smsService.send({
    //   to,
    //   message: smsMessage
    // });

  } catch (error) {
    console.error('SMS notification error:', error);
  }
}
