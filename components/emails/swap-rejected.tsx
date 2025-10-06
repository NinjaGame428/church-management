import React from 'react';
import { BaseEmail } from './base-email';

interface SwapRejectedEmailProps {
  fromUser: {
    firstName: string;
    lastName: string;
    email: string;
  };
  toUser: {
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
  reason?: string;
}

export const SwapRejectedEmail: React.FC<SwapRejectedEmailProps> = ({
  fromUser,
  toUser,
  service,
  reason
}) => {
  return (
    <BaseEmail 
      title="Échange Refusé" 
      previewText={`${toUser.firstName} ${toUser.lastName} a refusé votre demande d'échange`}
    >
      <div>
        <h1 style={{ color: '#dc2626', fontSize: '24px', marginBottom: '20px' }}>
          ❌ Échange Refusé
        </h1>
        
        <p>Bonjour {fromUser.firstName} {fromUser.lastName},</p>
        
        <p><strong>{toUser.firstName} {toUser.lastName}</strong> a refusé votre demande d'échange pour le service suivant :</p>
        
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
            <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>Raison du refus :</h4>
            <p style={{ margin: '10px 0', fontStyle: 'italic' }}>"{reason}"</p>
          </div>
        )}
        
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>🔄 Options disponibles :</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Demander un échange avec un autre intervenant</li>
            <li>Contacter l'administrateur pour une réassignation</li>
            <li>Marquer votre indisponibilité si nécessaire</li>
          </ul>
        </div>
        
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
            Demander un autre échange
          </a>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Vous pouvez essayer de demander un échange avec un autre utilisateur disponible.
        </p>
      </div>
    </BaseEmail>
  );
};
