import React from 'react';
import { BaseEmail } from './base-email';

interface EmailVerificationEmailProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  verificationToken: string;
  expiresAt: string;
}

export const EmailVerificationEmail: React.FC<EmailVerificationEmailProps> = ({
  user,
  verificationToken,
  expiresAt
}) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
  
  return (
    <BaseEmail 
      title="Vérification d'Email" 
      previewText="Vérifiez votre adresse email"
    >
      <div>
        <h1 style={{ color: '#16a34a', fontSize: '24px', marginBottom: '20px' }}>
          Vérification d'Email
        </h1>
        
        <p>Bonjour {user.firstName} {user.lastName},</p>
        
        <p>Bienvenue dans le système de gestion des services d'Impact Centre Chrétien !</p>
        
        <p>Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
        
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          borderLeft: '4px solid #16a34a'
        }}>
          <h3 style={{ marginTop: 0, color: '#16a34a', fontSize: '18px' }}>
            Vérification Requise
          </h3>
          <p>Cette étape est nécessaire pour sécuriser votre compte et vous permettre d'accéder à toutes les fonctionnalités.</p>
        </div>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={verificationUrl}
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
            Vérifier mon email
          </a>
        </div>
        
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#92400e' }}>📧 Informations :</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Ce lien expire le {new Date(expiresAt).toLocaleString('fr-FR')}</li>
            <li>Une fois vérifié, vous pourrez vous connecter à votre compte</li>
            <li>Vous recevrez des notifications pour vos services assignés</li>
          </ul>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br/>
          <a href={verificationUrl} style={{ color: '#16a34a', wordBreak: 'break-all' }}>
            {verificationUrl}
          </a>
        </p>
      </div>
    </BaseEmail>
  );
};
