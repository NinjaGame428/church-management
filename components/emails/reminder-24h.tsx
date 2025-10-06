import React from 'react';
import { BaseEmail } from './base-email';

interface Reminder24hEmailProps {
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

export const Reminder24hEmail: React.FC<Reminder24hEmailProps> = ({
  user,
  service,
  role
}) => {
  return (
    <BaseEmail 
      title="Rappel de Service - Demain" 
      previewText={`Rappel: Service ${service.title} demain`}
    >
      <div>
        <h1 style={{ color: '#f59e0b', fontSize: '24px', marginBottom: '20px' }}>
          ⏰ Rappel de Service
        </h1>
        
        <p>Bonjour {user.firstName} {user.lastName},</p>
        
        <p>Ceci est un rappel que vous avez un service <strong>demain</strong> :</p>
        
        <div style={{
          backgroundColor: '#fffbeb',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          borderLeft: '4px solid #f59e0b'
        }}>
          <h3 style={{ marginTop: 0, color: '#f59e0b', fontSize: '18px' }}>
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
        
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#92400e' }}>📋 Préparation :</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Vérifiez votre disponibilité</li>
            <li>Préparez votre matériel si nécessaire</li>
            <li>Arrivez 15 minutes avant l'heure prévue</li>
            <li>Contactez l'administrateur si vous avez un empêchement</li>
          </ul>
        </div>
        
        <p><strong>Veuillez vous assurer d'être présent à l'heure.</strong></p>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={`${process.env.NEXT_PUBLIC_APP_URL}/user/services`}
            style={{
              display: 'inline-block',
              backgroundColor: '#f59e0b',
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
          Si vous ne pouvez pas vous présenter, contactez immédiatement l'administrateur.
        </p>
      </div>
    </BaseEmail>
  );
};
