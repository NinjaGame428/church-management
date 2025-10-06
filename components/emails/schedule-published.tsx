import React from 'react';
import { BaseEmail } from './base-email';

interface SchedulePublishedEmailProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  services: Array<{
    title: string;
    date: string;
    time: string;
    location: string;
    role: string;
  }>;
  period: string;
}

export const SchedulePublishedEmail: React.FC<SchedulePublishedEmailProps> = ({
  user,
  services,
  period
}) => {
  return (
    <BaseEmail 
      title="Planning Publié" 
      previewText={`Le planning ${period} a été publié`}
    >
      <div>
        <h1 style={{ color: '#16a34a', fontSize: '24px', marginBottom: '20px' }}>
          Planning Publié
        </h1>
        
        <p>Bonjour {user.firstName} {user.lastName},</p>
        
        <p>Le planning pour {period} a été publié. Voici vos services assignés :</p>
        
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          borderLeft: '4px solid #16a34a'
        }}>
          <h3 style={{ marginTop: 0, color: '#16a34a', fontSize: '18px' }}>
            Vos Services Assignés
          </h3>
          
          {services.map((service, index) => (
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
              <p style={{ margin: '5px 0' }}><strong>Rôle:</strong> {service.role}</p>
              <p style={{ margin: '5px 0' }}><strong>Date:</strong> {new Date(service.date).toLocaleDateString('fr-FR')}</p>
              <p style={{ margin: '5px 0' }}><strong>Heure:</strong> {service.time}</p>
              <p style={{ margin: '5px 0' }}><strong>Lieu:</strong> {service.location}</p>
            </div>
          ))}
        </div>
        
        <p>Veuillez vérifier vos disponibilités et confirmer votre participation pour chaque service.</p>
        
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
            Voir mon planning
          </a>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Si vous avez des conflits ou des questions, contactez l'administrateur dès que possible.
        </p>
      </div>
    </BaseEmail>
  );
};
