import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Using Resend as the primary email service

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  status: string;
}

export interface SwapRequest {
  id: string;
  fromUser: User;
  toUser: User;
  service: Service;
  date: string;
  message?: string;
  status: string;
}

// Base email template
const getBaseEmailTemplate = (content: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0;">
        <div style="font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px;">Impact Centre Chrétien</div>
        <p style="margin: 0; color: #64748b;">Gestion des Services</p>
      </div>
      
      <div>
        ${content}
      </div>
      
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
        <p>Impact Centre Chrétien - Système de Gestion des Services</p>
        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    </div>
  </div>
`;

// Email template functions using HTML strings
export const emailTemplates = {
  // Service assignment
  serviceAssigned: async (user: User, service: Service, role: string) => {
    const content = `
      <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 20px;">Nouveau Service Assigné</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Vous avez été assigné à un nouveau service. Voici les détails :</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
        <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">${service.title}</h3>
        <p><strong>Rôle:</strong> ${role}</p>
        <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure:</strong> ${service.time}</p>
        <p><strong>Lieu:</strong> ${service.location}</p>
        ${service.description ? `<p><strong>Description:</strong> ${service.description}</p>` : ''}
      </div>
      
      <p>Veuillez confirmer votre participation ou décliner si vous n'êtes pas disponible.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user/services" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Voir mes services</a>
      </div>
      
      <p style="color: #64748b; font-size: 14px;">Si vous avez des questions, n'hésitez pas à contacter l'administrateur.</p>
    `;
    
    return {
      subject: `Nouveau service assigné: ${service.title}`,
      html: getBaseEmailTemplate(content)
    };
  },

  // Service modified
  serviceModified: async (user: User, service: Service, role: string, changes: string[]) => {
    const content = `
      <h1 style="color: #f59e0b; font-size: 24px; margin-bottom: 20px;">Service Modifié</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Le service auquel vous êtes assigné a été modifié. Voici les détails mis à jour :</p>
      
      <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <h3 style="margin-top: 0; color: #f59e0b; font-size: 18px;">${service.title}</h3>
        <p><strong>Rôle:</strong> ${role}</p>
        <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure:</strong> ${service.time}</p>
        <p><strong>Lieu:</strong> ${service.location}</p>
        ${service.description ? `<p><strong>Description:</strong> ${service.description}</p>` : ''}
      </div>
      
      <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #0ea5e9;">Modifications apportées :</h4>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${changes.map(change => `<li style="margin-bottom: 5px;">${change}</li>`).join('')}
        </ul>
      </div>
      
      <p>Veuillez prendre note de ces modifications.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user/services" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Voir mes services</a>
      </div>
      
      <p style="color: #64748b; font-size: 14px;">Si vous avez des questions concernant ces modifications, contactez l'administrateur.</p>
    `;
    
    return {
      subject: `Service modifié: ${service.title}`,
      html: getBaseEmailTemplate(content)
    };
  },

  // Service cancelled
  serviceCancelled: async (user: User, service: Service, role: string, reason?: string) => {
    const content = `
      <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 20px;">Service Annulé</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Nous vous informons que le service auquel vous étiez assigné a été annulé :</p>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <h3 style="margin-top: 0; color: #dc2626; font-size: 18px;">${service.title}</h3>
        <p><strong>Rôle:</strong> ${role}</p>
        <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure:</strong> ${service.time}</p>
        <p><strong>Lieu:</strong> ${service.location}</p>
      </div>
      
      ${reason ? `
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #0ea5e9;">Raison de l'annulation :</h4>
          <p style="margin: 10px 0;">${reason}</p>
        </div>
      ` : ''}
      
      <p>Vous n'avez plus besoin de vous présenter pour ce service.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user/services" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Voir mes services</a>
      </div>
      
      <p style="color: #64748b; font-size: 14px;">Si vous avez des questions, n'hésitez pas à contacter l'administrateur.</p>
    `;
    
    return {
      subject: `Service annulé: ${service.title}`,
      html: getBaseEmailTemplate(content)
    };
  },

  // Schedule published
  schedulePublished: async (user: User, services: Array<{title: string, date: string, time: string, location: string, role: string}>, period: string) => {
    const content = `
      <h1 style="color: #16a34a; font-size: 24px; margin-bottom: 20px;">Planning Publié</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Le planning pour ${period} a été publié. Voici vos services assignés :</p>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
        <h3 style="margin-top: 0; color: #16a34a; font-size: 18px;">Vos Services Assignés</h3>
        
        ${services.map(service => `
          <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 10px 0; border: 1px solid #e5e7eb;">
            <h4 style="margin: 0 0 10px 0; color: #1f2937;">${service.title}</h4>
            <p style="margin: 5px 0;"><strong>Rôle:</strong> ${service.role}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
            <p style="margin: 5px 0;"><strong>Heure:</strong> ${service.time}</p>
            <p style="margin: 5px 0;"><strong>Lieu:</strong> ${service.location}</p>
          </div>
        `).join('')}
      </div>
      
      <p>Veuillez vérifier vos disponibilités et confirmer votre participation pour chaque service.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user/services" style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Voir mon planning</a>
      </div>
      
      <p style="color: #64748b; font-size: 14px;">Si vous avez des conflits ou des questions, contactez l'administrateur dès que possible.</p>
    `;
    
    return {
      subject: `Planning publié: ${period}`,
      html: getBaseEmailTemplate(content)
    };
  },

  // 24h reminder
  reminder24h: async (user: User, service: Service, role: string) => {
    const content = `
      <h1 style="color: #f59e0b; font-size: 24px; margin-bottom: 20px;">⏰ Rappel de Service</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Ceci est un rappel que vous avez un service <strong>demain</strong> :</p>
      
      <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <h3 style="margin-top: 0; color: #f59e0b; font-size: 18px;">${service.title}</h3>
        <p><strong>Rôle:</strong> ${role}</p>
        <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure:</strong> ${service.time}</p>
        <p><strong>Lieu:</strong> ${service.location}</p>
        ${service.description ? `<p><strong>Description:</strong> ${service.description}</p>` : ''}
      </div>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #92400e;">📋 Préparation :</h4>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Vérifiez votre disponibilité</li>
          <li>Préparez votre matériel si nécessaire</li>
          <li>Arrivez 15 minutes avant l'heure prévue</li>
          <li>Contactez l'administrateur si vous avez un empêchement</li>
        </ul>
      </div>
      
      <p><strong>Veuillez vous assurer d'être présent à l'heure.</strong></p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user/services" style="display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Voir mes services</a>
      </div>
      
      <p style="color: #64748b; font-size: 14px;">Si vous ne pouvez pas vous présenter, contactez immédiatement l'administrateur.</p>
    `;
    
    return {
      subject: `Rappel: Service ${service.title} demain`,
      html: getBaseEmailTemplate(content)
    };
  },

  // Password reset
  passwordReset: async (user: User, resetToken: string, expiresAt: string) => {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    const content = `
      <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 20px;">Réinitialisation de Mot de Passe</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Impact Centre Chrétien.</p>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
        <h3 style="margin-top: 0; color: #0ea5e9; font-size: 18px;">Instructions de Réinitialisation</h3>
        <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Réinitialiser mon mot de passe</a>
      </div>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #92400e;">⚠️ Important :</h4>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Ce lien expire le ${new Date(expiresAt).toLocaleString('fr-FR')}</li>
          <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
          <li>Ne partagez jamais ce lien avec d'autres personnes</li>
        </ul>
      </div>
      
      <p style="color: #64748b; font-size: 14px;">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br/>
        <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
      </p>
    `;
    
    return {
      subject: 'Réinitialisation de mot de passe',
      html: getBaseEmailTemplate(content)
    };
  },

  // Email verification
  emailVerification: async (user: User, verificationToken: string, expiresAt: string) => {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    
    const content = `
      <h1 style="color: #16a34a; font-size: 24px; margin-bottom: 20px;">Vérification d'Email</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Bienvenue dans le système de gestion des services d'Impact Centre Chrétien !</p>
      
      <p>Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
        <h3 style="margin-top: 0; color: #16a34a; font-size: 18px;">Vérification Requise</h3>
        <p>Cette étape est nécessaire pour sécuriser votre compte et vous permettre d'accéder à toutes les fonctionnalités.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Vérifier mon email</a>
      </div>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #92400e;">📧 Informations :</h4>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Ce lien expire le ${new Date(expiresAt).toLocaleString('fr-FR')}</li>
          <li>Une fois vérifié, vous pourrez vous connecter à votre compte</li>
          <li>Vous recevrez des notifications pour vos services assignés</li>
        </ul>
      </div>
      
      <p style="color: #64748b; font-size: 14px;">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br/>
        <a href="${verificationUrl}" style="color: #16a34a; word-break: break-all;">${verificationUrl}</a>
      </p>
    `;
    
    return {
      subject: 'Vérification d\'email',
      html: getBaseEmailTemplate(content)
    };
  }
};

// Send email function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not configured');
      return false;
    }

    const { data, error } = await resend.emails.send({
      from: `Impact Centre Chrétien <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw error;
    }

    console.log('📧 Email sent successfully via Resend:', {
      to: options.to,
      subject: options.subject,
      messageId: data?.id
    });
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

// Email service functions
export const emailService = {
  // Send service assignment email
  sendServiceAssignmentEmail: async (user: User, service: Service, role: string) => {
    const template = await emailTemplates.serviceAssigned(user, service, role);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send service modified email
  sendServiceModifiedEmail: async (user: User, service: Service, role: string, changes: string[]) => {
    const template = await emailTemplates.serviceModified(user, service, role, changes);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send service cancelled email
  sendServiceCancelledEmail: async (user: User, service: Service, role: string, reason?: string) => {
    const template = await emailTemplates.serviceCancelled(user, service, role, reason);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send schedule published email
  sendSchedulePublishedEmail: async (user: User, services: Array<{title: string, date: string, time: string, location: string, role: string}>, period: string) => {
    const template = await emailTemplates.schedulePublished(user, services, period);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send 24h reminder email
  sendReminder24hEmail: async (user: User, service: Service, role: string) => {
    const template = await emailTemplates.reminder24h(user, service, role);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send password reset email
  sendPasswordResetEmail: async (user: User, resetToken: string, expiresAt: string) => {
    const template = await emailTemplates.passwordReset(user, resetToken, expiresAt);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send email verification email
  sendEmailVerificationEmail: async (user: User, verificationToken: string, expiresAt: string) => {
    const template = await emailTemplates.emailVerification(user, verificationToken, expiresAt);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send availability changed email
  sendAvailabilityChangedEmail: async (user: User, date: string, status: string) => {
    const content = `
      <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 20px;">Disponibilité Modifiée</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Votre disponibilité a été mise à jour :</p>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Statut:</strong> ${status}</p>
      </div>
      
      <p>Merci de maintenir vos disponibilités à jour.</p>
    `;
    
    return await sendEmail({
      to: user.email,
      subject: 'Disponibilité modifiée',
      html: getBaseEmailTemplate(content)
    });
  },

  // Send service declined email
  sendServiceDeclinedEmail: async (user: User, service: Service, reason?: string) => {
    const content = `
      <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 20px;">Service Décliné</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Vous avez décliné le service suivant :</p>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <h3 style="margin-top: 0; color: #dc2626; font-size: 18px;">${service.title}</h3>
        <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure:</strong> ${service.time}</p>
        <p><strong>Lieu:</strong> ${service.location}</p>
        ${reason ? `<p><strong>Raison:</strong> ${reason}</p>` : ''}
      </div>
      
      <p>L'administrateur sera informé de votre indisponibilité.</p>
    `;
    
    return await sendEmail({
      to: user.email,
      subject: `Service décliné: ${service.title}`,
      html: getBaseEmailTemplate(content)
    });
  },

  // Send swap approved email
  sendSwapApprovedEmail: async (user: User, service: Service, fromUser: User) => {
    const content = `
      <h1 style="color: #16a34a; font-size: 24px; margin-bottom: 20px;">Échange Approuvé</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Votre demande d'échange a été approuvée :</p>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
        <h3 style="margin-top: 0; color: #16a34a; font-size: 18px;">${service.title}</h3>
        <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure:</strong> ${service.time}</p>
        <p><strong>Lieu:</strong> ${service.location}</p>
        <p><strong>Échangé avec:</strong> ${fromUser.firstName} ${fromUser.lastName}</p>
      </div>
      
      <p>L'échange est maintenant effectif.</p>
    `;
    
    return await sendEmail({
      to: user.email,
      subject: `Échange approuvé: ${service.title}`,
      html: getBaseEmailTemplate(content)
    });
  },

  // Send swap accepted email
  sendSwapAcceptedEmail: async (user: User, service: Service, toUser: User) => {
    const content = `
      <h1 style="color: #16a34a; font-size: 24px; margin-bottom: 20px;">Échange Accepté</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Votre demande d'échange a été acceptée :</p>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
        <h3 style="margin-top: 0; color: #16a34a; font-size: 18px;">${service.title}</h3>
        <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure:</strong> ${service.time}</p>
        <p><strong>Lieu:</strong> ${service.location}</p>
        <p><strong>Accepté par:</strong> ${toUser.firstName} ${toUser.lastName}</p>
      </div>
      
      <p>L'échange est maintenant effectif.</p>
    `;
    
    return await sendEmail({
      to: user.email,
      subject: `Échange accepté: ${service.title}`,
      html: getBaseEmailTemplate(content)
    });
  },

  // Send swap rejected email
  sendSwapRejectedEmail: async (user: User, service: Service, toUser: User, reason?: string) => {
    const content = `
      <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 20px;">Échange Rejeté</h1>
      
      <p>Bonjour ${user.firstName} ${user.lastName},</p>
      
      <p>Votre demande d'échange a été rejetée :</p>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <h3 style="margin-top: 0; color: #dc2626; font-size: 18px;">${service.title}</h3>
        <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure:</strong> ${service.time}</p>
        <p><strong>Lieu:</strong> ${service.location}</p>
        <p><strong>Rejeté par:</strong> ${toUser.firstName} ${toUser.lastName}</p>
        ${reason ? `<p><strong>Raison:</strong> ${reason}</p>` : ''}
      </div>
      
      <p>Vous restez assigné à ce service.</p>
    `;
    
    return await sendEmail({
      to: user.email,
      subject: `Échange rejeté: ${service.title}`,
      html: getBaseEmailTemplate(content)
    });
  }
};
