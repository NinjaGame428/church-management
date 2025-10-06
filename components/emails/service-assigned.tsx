import React from 'react';
import { BaseEmail } from './base-email';

interface ServiceAssignedEmailProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  service: {
    title: string;
    date: string;
    time: string;
    location: string;
    description?: string;
  };
  role: string;
}

export const ServiceAssignedEmail: React.FC<ServiceAssignedEmailProps> = ({
  user,
  service,
  role
}) => {
  return (
    <BaseEmail 
      title="Nouveau Service Assigné" 
      previewText={`Vous avez été assigné au service: ${service.title}`}
    >
      <div>
        <h1 style={{ color: '#2563eb', fontSize: '24px', marginBottom: '20px' }}>
          Nouveau Service Assigné
        </h1>
        
        <p>Bonjour {user.firstName} {user.lastName},</p>
        
        <p>Vous avez été assigné à un nouveau service. Voici les détails :</p>
        
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          borderLeft: '4px solid #2563eb'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e40af', fontSize: '18px' }}>
            {service.title}
          </h3>
          <p><strong>Rôle:</strong> {role}</p>
          <p><strong>Date:</strong> {new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> {service.time}</p>
          <p><strong>Lieu:</strong> {service.location}</p>
          {service.description && (
            <p><strong>Description:</strong> {service.description}</p>
          )}
        </div>
        
        <p>Veuillez confirmer votre participation ou décliner si vous n'êtes pas disponible.</p>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={`${process.env.NEXT_PUBLIC_APP_URL}/user/services`}
            style={{
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            Voir mes services
          </a>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Si vous avez des questions, n'hésitez pas à contacter l'administrateur.
        </p>
      </div>
    </BaseEmail>
  );
};
