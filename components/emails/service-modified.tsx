import React from 'react';
import { BaseEmail } from './base-email';

interface ServiceModifiedEmailProps {
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
  changes: string[];
}

export const ServiceModifiedEmail: React.FC<ServiceModifiedEmailProps> = ({
  user,
  service,
  role,
  changes
}) => {
  return (
    <BaseEmail 
      title="Service Modifié" 
      previewText={`Le service ${service.title} a été modifié`}
    >
      <div>
        <h1 style={{ color: '#f59e0b', fontSize: '24px', marginBottom: '20px' }}>
          Service Modifié
        </h1>
        
        <p>Bonjour {user.firstName} {user.lastName},</p>
        
        <p>Le service auquel vous êtes assigné a été modifié. Voici les détails mis à jour :</p>
        
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
          backgroundColor: '#f0f9ff',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>Modifications apportées :</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {changes.map((change, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{change}</li>
            ))}
          </ul>
        </div>
        
        <p>Veuillez prendre note de ces modifications.</p>
        
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
          Si vous avez des questions concernant ces modifications, contactez l'administrateur.
        </p>
      </div>
    </BaseEmail>
  );
};
