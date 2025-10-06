import React from 'react';
import { BaseEmail } from './base-email';

interface IntervenantRemovedEmailProps {
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
  };
  role: string;
  reason?: string;
}

export const IntervenantRemovedEmail: React.FC<IntervenantRemovedEmailProps> = ({
  user,
  service,
  role,
  reason
}) => {
  return (
    <BaseEmail 
      title="Suppression d'Assignation" 
      previewText={`Vous avez été retiré du service ${service.title}`}
    >
      <div>
        <h1 style={{ color: '#dc2626', fontSize: '24px', marginBottom: '20px' }}>
          Assignation Supprimée
        </h1>
        
        <p>Bonjour {user.firstName} {user.lastName},</p>
        
        <p>Nous vous informons que votre assignation au service suivant a été supprimée :</p>
        
        <div style={{
          backgroundColor: '#fef2f2',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          borderLeft: '4px solid #dc2626'
        }}>
          <h3 style={{ marginTop: 0, color: '#dc2626', fontSize: '18px' }}>
            {service.title}
          </h3>
          <p><strong>Rôle:</strong> {role}</p>
          <p><strong>Date:</strong> {new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> {service.time}</p>
          <p><strong>Lieu:</strong> {service.location}</p>
        </div>
        
        {reason && (
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '15px',
            borderRadius: '6px',
            margin: '20px 0'
          }}>
            <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>Raison de la suppression :</h4>
            <p style={{ margin: '10px 0' }}>{reason}</p>
          </div>
        )}
        
        <p>Vous n'êtes plus assigné à ce service. Vous pouvez maintenant marquer cette date comme disponible pour d'autres services.</p>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={`${process.env.NEXT_PUBLIC_APP_URL}/user/availability`}
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
            Gérer ma disponibilité
          </a>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Si vous avez des questions concernant cette suppression, contactez l'administrateur.
        </p>
      </div>
    </BaseEmail>
  );
};
