import React from 'react';
import { BaseEmail } from './base-email';

interface SwapApprovedEmailProps {
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

export const SwapApprovedEmail: React.FC<SwapApprovedEmailProps> = ({
  fromUser,
  toUser,
  service
}) => {
  return (
    <BaseEmail 
      title="Échange Approuvé" 
      previewText={`L'échange pour ${service.title} a été approuvé`}
    >
      <div>
        <h1 style={{ color: '#16a34a', fontSize: '24px', marginBottom: '20px' }}>
          ✅ Échange Approuvé
        </h1>
        
        <p>Bonjour,</p>
        
        <p>L'échange de service entre <strong>{fromUser.firstName} {fromUser.lastName}</strong> et <strong>{toUser.firstName} {toUser.lastName}</strong> a été approuvé par l'administrateur :</p>
        
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
          <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>🔄 Échange effectif :</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li><strong>{toUser.firstName} {toUser.lastName}</strong> remplace <strong>{fromUser.firstName} {fromUser.lastName}</strong></li>
            <li>L'échange est maintenant officiel</li>
            <li>Les deux parties ont été notifiées</li>
          </ul>
        </div>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={`${process.env.NEXT_PUBLIC_APP_URL}/user/services`}
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
            Voir mes services
          </a>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Cet échange est maintenant effectif. Merci de votre collaboration !
        </p>
      </div>
    </BaseEmail>
  );
};
