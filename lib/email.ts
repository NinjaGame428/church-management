import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

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

// Email templates
export const emailTemplates = {
  // User registration
  welcome: (user: User) => ({
    subject: 'Bienvenue dans ChurchManager',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Bienvenue dans ChurchManager!</h2>
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Votre compte a été créé avec succès dans notre système de gestion d'église.</p>
        <p>Vous pouvez maintenant :</p>
        <ul>
          <li>Consulter vos services assignés</li>
          <li>Gérer votre disponibilité</li>
          <li>Demander des échanges de services</li>
          <li>Recevoir des notifications importantes</li>
        </ul>
        <p>Connectez-vous à votre compte pour commencer à utiliser le système.</p>
        <p>Cordialement,<br>L'équipe ChurchManager</p>
      </div>
    `
  }),

  // Service assignment
  serviceAssigned: (user: User, service: Service, role: string) => ({
    subject: `Nouveau service assigné: ${service.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nouveau Service Assigné</h2>
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Vous avez été assigné à un nouveau service :</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">${service.title}</h3>
          <p><strong>Rôle:</strong> ${role}</p>
          <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${service.time}</p>
          <p><strong>Lieu:</strong> ${service.location}</p>
          ${service.description ? `<p><strong>Description:</strong> ${service.description}</p>` : ''}
        </div>
        <p>Veuillez confirmer votre participation ou décliner si vous n'êtes pas disponible.</p>
        <p>Cordialement,<br>L'équipe ChurchManager</p>
      </div>
    `
  }),

  // Service assignment declined
  serviceDeclined: (user: User, service: Service, reason: string) => ({
    subject: `Service décliné: ${service.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Service Décliné</h2>
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Vous avez décliné le service suivant :</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="margin-top: 0; color: #dc2626;">${service.title}</h3>
          <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${service.time}</p>
          <p><strong>Raison:</strong> ${reason}</p>
        </div>
        <p>L'administrateur a été notifié de votre indisponibilité.</p>
        <p>Cordialement,<br>L'équipe ChurchManager</p>
      </div>
    `
  }),

  // Swap request
  swapRequest: (fromUser: User, toUser: User, service: Service, message?: string) => ({
    subject: `Demande d'échange de service: ${service.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Demande d'Échange de Service</h2>
        <p>Bonjour ${toUser.firstName} ${toUser.lastName},</p>
        <p>${fromUser.firstName} ${fromUser.lastName} vous a envoyé une demande d'échange pour le service suivant :</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">${service.title}</h3>
          <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${service.time}</p>
          <p><strong>Lieu:</strong> ${service.location}</p>
          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        </div>
        <p>Veuillez vous connecter à votre compte pour accepter ou refuser cette demande.</p>
        <p>Cordialement,<br>L'équipe ChurchManager</p>
      </div>
    `
  }),

  // Swap request accepted
  swapAccepted: (fromUser: User, toUser: User, service: Service) => ({
    subject: `Échange accepté: ${service.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Échange Accepté</h2>
        <p>Bonjour ${fromUser.firstName} ${fromUser.lastName},</p>
        <p>${toUser.firstName} ${toUser.lastName} a accepté votre demande d'échange pour le service :</p>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="margin-top: 0; color: #16a34a;">${service.title}</h3>
          <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${service.time}</p>
          <p><strong>Lieu:</strong> ${service.location}</p>
        </div>
        <p>L'échange est en attente d'approbation par l'administrateur.</p>
        <p>Cordialement,<br>L'équipe ChurchManager</p>
      </div>
    `
  }),

  // Swap request rejected
  swapRejected: (fromUser: User, toUser: User, service: Service) => ({
    subject: `Échange refusé: ${service.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Échange Refusé</h2>
        <p>Bonjour ${fromUser.firstName} ${fromUser.lastName},</p>
        <p>${toUser.firstName} ${toUser.lastName} a refusé votre demande d'échange pour le service :</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="margin-top: 0; color: #dc2626;">${service.title}</h3>
          <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${service.time}</p>
          <p><strong>Lieu:</strong> ${service.location}</p>
        </div>
        <p>Vous pouvez essayer de demander un échange avec un autre utilisateur.</p>
        <p>Cordialement,<br>L'équipe ChurchManager</p>
      </div>
    `
  }),

  // Admin approval
  swapApproved: (fromUser: User, toUser: User, service: Service) => ({
    subject: `Échange approuvé: ${service.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Échange Approuvé</h2>
        <p>Bonjour,</p>
        <p>L'échange de service entre ${fromUser.firstName} ${fromUser.lastName} et ${toUser.firstName} ${toUser.lastName} a été approuvé :</p>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="margin-top: 0; color: #16a34a;">${service.title}</h3>
          <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${service.time}</p>
          <p><strong>Lieu:</strong> ${service.location}</p>
        </div>
        <p>L'échange est maintenant effectif.</p>
        <p>Cordialement,<br>L'équipe ChurchManager</p>
      </div>
    `
  }),

  // Service reminder
  serviceReminder: (user: User, service: Service, role: string) => ({
    subject: `Rappel: Service ${service.title} demain`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Rappel de Service</h2>
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Ceci est un rappel que vous avez un service demain :</p>
        <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #f59e0b;">${service.title}</h3>
          <p><strong>Rôle:</strong> ${role}</p>
          <p><strong>Date:</strong> ${new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${service.time}</p>
          <p><strong>Lieu:</strong> ${service.location}</p>
        </div>
        <p>Veuillez vous assurer d'être présent à l'heure.</p>
        <p>Cordialement,<br>L'équipe ChurchManager</p>
      </div>
    `
  }),

  // Availability change
  availabilityChanged: (user: User, date: string, status: string, notes?: string) => ({
    subject: `Disponibilité mise à jour`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Disponibilité Mise à Jour</h2>
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Votre disponibilité a été mise à jour :</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Statut:</strong> ${status === 'available' ? 'Disponible' : status === 'unavailable' ? 'Indisponible' : 'Occupé'}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        </div>
        <p>Cordialement,<br>L'équipe ChurchManager</p>
      </div>
    `
  })
};

// Send email function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"ChurchManager" <${emailConfig.auth.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', {
      to: options.to,
      subject: options.subject,
      messageId: result.messageId
    });
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

// Email service functions
export const emailService = {
  // Send welcome email
  sendWelcomeEmail: async (user: User) => {
    const template = emailTemplates.welcome(user);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send service assignment email
  sendServiceAssignmentEmail: async (user: User, service: Service, role: string) => {
    const template = emailTemplates.serviceAssigned(user, service, role);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send service declined email
  sendServiceDeclinedEmail: async (user: User, service: Service, reason: string) => {
    const template = emailTemplates.serviceDeclined(user, service, reason);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send swap request email
  sendSwapRequestEmail: async (fromUser: User, toUser: User, service: Service, message?: string) => {
    const template = emailTemplates.swapRequest(fromUser, toUser, service, message);
    return await sendEmail({
      to: toUser.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send swap accepted email
  sendSwapAcceptedEmail: async (fromUser: User, toUser: User, service: Service) => {
    const template = emailTemplates.swapAccepted(fromUser, toUser, service);
    return await sendEmail({
      to: fromUser.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send swap rejected email
  sendSwapRejectedEmail: async (fromUser: User, toUser: User, service: Service) => {
    const template = emailTemplates.swapRejected(fromUser, toUser, service);
    return await sendEmail({
      to: fromUser.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send swap approved email
  sendSwapApprovedEmail: async (fromUser: User, toUser: User, service: Service) => {
    const template = emailTemplates.swapApproved(fromUser, toUser, service);
    return await sendEmail({
      to: fromUser.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send service reminder email
  sendServiceReminderEmail: async (user: User, service: Service, role: string) => {
    const template = emailTemplates.serviceReminder(user, service, role);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  },

  // Send availability change email
  sendAvailabilityChangedEmail: async (user: User, date: string, status: string, notes?: string) => {
    const template = emailTemplates.availabilityChanged(user, date, status, notes);
    return await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  }
};
