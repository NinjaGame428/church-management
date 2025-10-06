import React from 'react';
import { BaseEmail } from './base-email';

interface WelcomeNewIntervenantEmailProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  adminName: string;
  churchName: string;
}

export const WelcomeNewIntervenantEmail: React.FC<WelcomeNewIntervenantEmailProps> = ({
  user,
  adminName,
  churchName
}) => {
  return (
    <BaseEmail 
      title="Bienvenue dans l'Équipe" 
      previewText={`Bienvenue dans l'équipe de ${churchName}`}
    >
      <div>
        <h1 style={{ color: '#16a34a', fontSize: '24px', marginBottom: '20px' }}>
          🎉 Bienvenue dans l'Équipe !
        </h1>
        
        <p>Bonjour {user.firstName} {user.lastName},</p>
        
        <p>Bienvenue dans l'équipe de <strong>{churchName}</strong> ! Nous sommes ravis de vous compter parmi nous.</p>
        
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          borderLeft: '4px solid #16a34a'
        }}>
          <h3 style={{ marginTop: 0, color: '#16a34a', fontSize: '18px' }}>
            Votre Compte est Prêt
          </h3>
          <p>Votre compte a été créé avec succès. Vous pouvez maintenant :</p>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Consulter vos services assignés</li>
            <li>Gérer votre disponibilité</li>
            <li>Demander des échanges de services</li>
            <li>Recevoir des notifications importantes</li>
          </ul>
        </div>
        
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>🚀 Prochaines étapes :</h4>
          <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Connectez-vous à votre compte</li>
            <li>Mettez à jour votre profil</li>
            <li>Marquez vos disponibilités</li>
            <li>Explorez les fonctionnalités disponibles</li>
          </ol>
        </div>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}
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
            Se connecter
          </a>
        </div>
        
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '15px',
          borderRadius: '6px',
          margin: '20px 0'
        }}>
          <h4 style={{ marginTop: 0, color: '#92400e' }}>📞 Besoin d'aide ?</h4>
          <p style={{ margin: '10px 0' }}>
            Si vous avez des questions, n'hésitez pas à contacter {adminName} ou l'équipe d'administration.
          </p>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Nous sommes impatients de travailler avec vous dans cette mission commune !
        </p>
      </div>
    </BaseEmail>
  );
};
