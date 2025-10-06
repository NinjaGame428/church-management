import React from 'react';
import { BaseEmail } from './base-email';

interface SwapRequestReceivedEmailProps {
  toUser: {
    firstName: string;
    lastName: string;
    email: string;
  };
  fromUser: {
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
  message?: string;
}

export const SwapRequestReceivedEmail: React.FC<SwapRequestReceivedEmailProps> = ({
  toUser,
  fromUser,
  service,
  message
}) => {
  return (
    <BaseEmail 
      title="Demande d'Échange de Service" 
      previewText={`${fromUser.firstName} ${fromUser.lastName} demande un échange pour ${service.title}`}
    >
      <div>
        <h1 style={{ color: '#2563eb', fontSize: '24px', marginBottom: '20px' }}>
          Demande d'Échange de Service
        </h1>
        
        <p>Bonjour {toUser.firstName} {toUser.lastName},</p>
        
        <p><strong>{fromUser.firstName} {fromUser.lastName}</strong> vous a envoyé une demande d'échange pour le service suivant :</p>
        
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
          <p><strong>Date:</strong> {new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> {service.time}</p>
          <p><strong>Lieu:</strong> {service.location}</p>
        </div>
        
        {message && (
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '15px',
            borderRadius: '6px',
            margin: '20px 0'
          }}>
            <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>Message de {fromUser.firstName} :</h4>
            <p style={{ margin: '10px 0', fontStyle: 'italic' }}>"{message}"</p>
          </div>
        )}
        
        <p>Veuillez vous connecter à votre compte pour accepter ou refuser cette demande.</p>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={`${process.env.NEXT_PUBLIC_APP_URL}/user/swap`}
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
            Gérer les échanges
          </a>
        </div>
        
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#92400e' }}>ℹ️ Information :</h4>
          <p style={{ margin: '10px 0' }}>
            Si vous acceptez cette demande, elle sera soumise à l'approbation de l'administrateur.
          </p>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Vous avez 48 heures pour répondre à cette demande.
        </p>
      </div>
    </BaseEmail>
  );
};
