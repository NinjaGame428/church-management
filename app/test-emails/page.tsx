'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const emailTemplates = [
  { id: 'service-assigned', name: 'Service Assigné', description: 'Notification d\'assignation à un service' },
  { id: 'service-modified', name: 'Service Modifié', description: 'Notification de modification d\'un service' },
  { id: 'service-cancelled', name: 'Service Annulé', description: 'Notification d\'annulation d\'un service' },
  { id: 'schedule-published', name: 'Planning Publié', description: 'Notification de publication du planning' },
  { id: 'reminder-24h', name: 'Rappel 24h', description: 'Rappel 24h avant un service' },
  { id: 'intervenant-removed', name: 'Intervenant Retiré', description: 'Notification de suppression d\'assignation' },
  { id: 'password-reset', name: 'Réinitialisation Mot de Passe', description: 'Email de réinitialisation de mot de passe' },
  { id: 'email-verification', name: 'Vérification Email', description: 'Email de vérification d\'adresse email' },
  { id: 'swap-request-received', name: 'Demande d\'Échange Reçue', description: 'Notification de demande d\'échange' },
  { id: 'swap-accepted', name: 'Échange Accepté', description: 'Notification d\'acceptation d\'échange' },
  { id: 'swap-approved', name: 'Échange Approuvé', description: 'Notification d\'approbation d\'échange' },
  { id: 'swap-rejected', name: 'Échange Refusé', description: 'Notification de refus d\'échange' },
  { id: 'availability-reminder', name: 'Rappel Disponibilité', description: 'Rappel de mise à jour de disponibilité' },
  { id: 'new-intervenant-registered', name: 'Nouvel Intervenant Inscrit', description: 'Notification admin d\'inscription' },
  { id: 'welcome-new-intervenant', name: 'Bienvenue Nouvel Intervenant', description: 'Email de bienvenue pour nouvel intervenant' }
];

export default function TestEmailsPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  const handleTestEmail = async (templateId: string) => {
    if (!email) {
      alert('Veuillez entrer une adresse email');
      return;
    }

    setLoading(templateId);
    setResults(prev => ({ ...prev, [templateId]: '' }));

    try {
      const response = await fetch('/api/test-email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: templateId,
          email: email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(prev => ({ 
          ...prev, 
          [templateId]: `✅ ${data.message}` 
        }));
      } else {
        setResults(prev => ({ 
          ...prev, 
          [templateId]: `❌ ${data.error}` 
        }));
      }
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [templateId]: `❌ Erreur: ${error}` 
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Test des Templates d'Email</h1>
          <p className="text-muted-foreground mb-6">
            Testez tous les templates d'email avec Resend. Entrez votre adresse email et cliquez sur les boutons pour envoyer des emails de test.
          </p>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Adresse Email de Test
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {emailTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{template.name}</span>
                  <Button
                    onClick={() => handleTestEmail(template.id)}
                    disabled={loading === template.id}
                    size="sm"
                  >
                    {loading === template.id ? 'Envoi...' : 'Tester'}
                  </Button>
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {results[template.id] && (
                  <div className={`p-3 rounded-md text-sm ${
                    results[template.id].startsWith('✅') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {results[template.id]}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">📧 Configuration Resend</h3>
          <p className="text-blue-800 text-sm mb-2">
            Assurez-vous d'avoir configuré votre clé API Resend dans les variables d'environnement :
          </p>
          <code className="text-xs bg-blue-100 px-2 py-1 rounded">
            RESEND_API_KEY=re_...
          </code>
          <p className="text-blue-800 text-sm mt-2">
            <strong>Note:</strong> Cette application utilise uniquement Resend pour l'envoi d'emails. 
            Aucune configuration SMTP n'est nécessaire.
          </p>
        </div>
      </div>
    </div>
  );
}
