import React from 'react';
import { BaseEmail } from './base-email';

interface SwapAcceptedEmailProps {
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
}

export const SwapAcceptedEmail: React.FC<SwapAcceptedEmailProps> = ({
  fromUser,
  toUser,
  service
}) => {
  return (
    <BaseEmail 
      title="Échange Accepté" 
      previewText={`${toUser.firstName} ${toUser.lastName} a accepté votre demande d'échange`}
    >
      <div>
        <h1 style={{ color: '#16a34a', fontSize: '24px', marginBottom: '20px' }}>
          ✅ Échange Accepté
        </h1>
        
        <p>Bonjour {fromUser.firstName} {fromUser.lastName},</p>
        
        <p><strong>{toUser.firstName} {toUser.lastName}</strong> a accepté votre demande d'échange pour le service suivant :</p>
        
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          borderLeft: '4px solid #16a34a'
        }}>
          <h3 style={{ marginTop: 0, color: '#16a34a', fontSize: '18px' }}>
            {service.title}
          </h3>
          <p><strong>Date:</strong> {new Date(service.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> {service.time}</p>
          <p><strong>Lieu:</strong> {service.location}</p>
        </div>
        
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>📋 Prochaines étapes :</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>L'échange est en attente d'approbation par l'administrateur</li>
            <li>Vous recevrez une notification une fois l'échange approuvé</li>
            <li>En attendant, préparez-vous pour le service</li>
          </ul>
        </div>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={`${process.env.NEXT_PUBLIC_APP_URL}/user/swap`}
            style={{
              display: 'inline-block',
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            Voir mes échanges
          </a>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          L'administrateur sera notifié de cet échange et le validera sous peu.
        </p>
      </div>
    </BaseEmail>
  );
};
