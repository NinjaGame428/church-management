import React from 'react';
import { BaseEmail } from './base-email';

interface AvailabilityReminderEmailProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  upcomingServices: Array<{
    title: string;
    date: string;
    time: string;
    location: string;
  }>;
  period: string;
}

export const AvailabilityReminderEmail: React.FC<AvailabilityReminderEmailProps> = ({
  user,
  upcomingServices,
  period
}) => {
  return (
    <BaseEmail 
      title="Rappel de Disponibilité" 
      previewText={`Mettez à jour votre disponibilité pour ${period}`}
    >
      <div>
        <h1 style={{ color: '#f59e0b', fontSize: '24px', marginBottom: '20px' }}>
          📅 Rappel de Disponibilité
        </h1>
        
        <p>Bonjour {user.firstName} {user.lastName},</p>
        
        <p>Nous vous rappelons de mettre à jour votre disponibilité pour {period}. Voici les services à venir :</p>
        
        <div style={{
          backgroundColor: '#fffbeb',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          borderLeft: '4px solid #f59e0b'
        }}>
          <h3 style={{ marginTop: 0, color: '#f59e0b', fontSize: '18px' }}>
            Services à Venir
          </h3>
          
          {upcomingServices.map((service, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '6px',
              margin: '10px 0',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>
                {service.title}
              </h4>
              <p style={{ margin: '5px 0' }}><strong>Date:</strong> {new Date(service.date).toLocaleDateString('fr-FR')}</p>
              <p style={{ margin: '5px 0' }}><strong>Heure:</strong> {service.time}</p>
              <p style={{ margin: '5px 0' }}><strong>Lieu:</strong> {service.location}</p>
            </div>
          ))}
        </div>
        
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>📋 Actions requises :</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Marquez vos dates de disponibilité</li>
            <li>Indiquez vos indisponibilités (vacances, rendez-vous, etc.)</li>
            <li>Ajoutez des notes si nécessaire</li>
          </ul>
        </div>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={`${process.env.NEXT_PUBLIC_APP_URL}/user/availability`}
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
            Mettre à jour ma disponibilité
          </a>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Une disponibilité à jour nous aide à mieux planifier les services et à vous assigner aux bons moments.
        </p>
      </div>
    </BaseEmail>
  );
};
