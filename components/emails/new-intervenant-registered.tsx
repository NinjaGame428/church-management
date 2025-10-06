import React from 'react';
import { BaseEmail } from './base-email';

interface NewIntervenantRegisteredEmailProps {
  admin: {
    firstName: string;
    lastName: string;
    email: string;
  };
  newUser: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    department?: string;
  };
}

export const NewIntervenantRegisteredEmail: React.FC<NewIntervenantRegisteredEmailProps> = ({
  admin,
  newUser
}) => {
  return (
    <BaseEmail 
      title="Nouvel Intervenant Inscrit" 
      previewText={`${newUser.firstName} ${newUser.lastName} s'est inscrit`}
    >
      <div>
        <h1 style={{ color: '#2563eb', fontSize: '24px', marginBottom: '20px' }}>
          👤 Nouvel Intervenant Inscrit
        </h1>
        
        <p>Bonjour {admin.firstName} {admin.lastName},</p>
        
        <p>Un nouvel intervenant s'est inscrit dans le système :</p>
        
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          borderLeft: '4px solid #2563eb'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e40af', fontSize: '18px' }}>
            Informations du Nouvel Intervenant
          </h3>
          <p><strong>Nom:</strong> {newUser.firstName} {newUser.lastName}</p>
          <p><strong>Email:</strong> {newUser.email}</p>
          {newUser.phone && <p><strong>Téléphone:</strong> {newUser.phone}</p>}
          {newUser.department && <p><strong>Département:</strong> {newUser.department}</p>}
        </div>
        
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>📋 Actions recommandées :</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Vérifier les informations de l'intervenant</li>
            <li>Assigner des rôles et permissions appropriés</li>
            <li>Envoyer un email de bienvenue</li>
            <li>Programmer une formation si nécessaire</li>
          </ul>
        </div>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/users`}
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
            Gérer les utilisateurs
          </a>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Le nouvel intervenant a été ajouté au système et peut maintenant se connecter.
        </p>
      </div>
    </BaseEmail>
  );
};
