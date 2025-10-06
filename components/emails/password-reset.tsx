import React from 'react';
import { BaseEmail } from './base-email';

interface PasswordResetEmailProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  resetToken: string;
  expiresAt: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  user,
  resetToken,
  expiresAt
}) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  
  return (
    <BaseEmail 
      title="Réinitialisation de Mot de Passe" 
      previewText="Réinitialisez votre mot de passe"
    >
      <div>
        <h1 style={{ color: '#2563eb', fontSize: '24px', marginBottom: '20px' }}>
          Réinitialisation de Mot de Passe
        </h1>
        
        <p>Bonjour {user.firstName} {user.lastName},</p>
        
        <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Impact Centre Chrétien.</p>
        
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          borderLeft: '4px solid #0ea5e9'
        }}>
          <h3 style={{ marginTop: 0, color: '#0ea5e9', fontSize: '18px' }}>
            Instructions de Réinitialisation
          </h3>
          <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
        </div>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={resetUrl}
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
            Réinitialiser mon mot de passe
          </a>
        </div>
        
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#92400e' }}>⚠️ Important :</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Ce lien expire le {new Date(expiresAt).toLocaleString('fr-FR')}</li>
            <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
            <li>Ne partagez jamais ce lien avec d'autres personnes</li>
          </ul>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br/>
          <a href={resetUrl} style={{ color: '#2563eb', wordBreak: 'break-all' }}>
            {resetUrl}
          </a>
        </p>
      </div>
    </BaseEmail>
  );
};
