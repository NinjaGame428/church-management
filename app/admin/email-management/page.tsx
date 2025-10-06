"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Send,
  TestTube,
  Server,
  Bell,
  Save,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function EmailManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    resendApiKey: '••••••••', // Masked for security
    fromEmail: '',
    fromName: 'Impact Centre Chrétien',
    replyTo: '',
    enableEmailNotifications: true,
    enableServiceReminders: true,
    enableAvailabilityReminders: true,
    enableSwapNotifications: true,
    reminderTime: '24', // hours before service
    testEmail: ''
  });

  const [emailStatus, setEmailStatus] = useState<'loading' | 'configured' | 'error'>('loading');
  const [connectionTest, setConnectionTest] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const handleEmailChange = (field: string, value: string | boolean) => {
    setEmailSettings(prev => ({ ...prev, [field]: value }));
  };

  // Load email settings on component mount
  useEffect(() => {
    const loadEmailSettings = async () => {
      try {
        const response = await fetch('/api/admin/email-settings');
        if (response.ok) {
          const settings = await response.json();
          setEmailSettings(prev => ({
            ...prev,
            resendApiKey: settings.resendApiKey || '••••••••',
            fromEmail: settings.fromEmail || '',
            fromName: settings.fromName || 'Impact Centre Chrétien',
            replyTo: settings.replyTo || '',
            enableEmailNotifications: settings.enableEmailNotifications ?? true,
            enableServiceReminders: settings.enableServiceReminders ?? true,
            enableAvailabilityReminders: settings.enableAvailabilityReminders ?? true,
            enableSwapNotifications: settings.enableSwapNotifications ?? true,
            reminderTime: settings.reminderTime || '24'
          }));
          setEmailStatus('configured');
        } else {
          setEmailStatus('error');
        }
      } catch (error) {
        console.error('Error loading email settings:', error);
        setEmailStatus('error');
      }
    };

    loadEmailSettings();
  }, []);

  const handleSaveEmailSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailSettings),
      });

      if (response.ok) {
        setMessage('Paramètres email mis à jour!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la mise à jour des paramètres email');
      }
    } catch (error) {
      console.error('Error updating email settings:', error);
      setError('Erreur lors de la mise à jour des paramètres email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!emailSettings.testEmail) {
      setError('Veuillez entrer une adresse email de test');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          to: emailSettings.testEmail,
          fromEmail: emailSettings.fromEmail,
          fromName: emailSettings.fromName
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Email de test envoyé avec succès! ID: ${result.messageId || 'N/A'}`);
        setTimeout(() => setMessage(''), 5000);
      } else {
        const errorData = await response.json();
        setError(`${errorData.error || 'Erreur lors de l\'envoi de l\'email de test'}${errorData.details ? ` - ${errorData.details}` : ''}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setError('Erreur lors de l\'envoi de l\'email de test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setConnectionTest({ status: 'testing', message: 'Test de connexion en cours...' });
    
    try {
      const response = await fetch('/api/admin/test-resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setConnectionTest({ 
          status: 'success', 
          message: `Connexion réussie! Clé API: ${result.apiKeyPrefix}` 
        });
      } else {
        const errorData = await response.json();
        setConnectionTest({ 
          status: 'error', 
          message: `Erreur: ${errorData.details || errorData.error}` 
        });
      }
    } catch (error) {
      setConnectionTest({ 
        status: 'error', 
        message: 'Erreur lors du test de connexion' 
      });
    }
  };

  return (
    <DashboardLayout 
      title="Gestion des Emails"
      description="Configurez et gérez les paramètres d'envoi d'emails"
    >
      <div className="space-y-6">
        {/* Messages */}
        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{message}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Email Configuration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Statut de Configuration
            </CardTitle>
            <CardDescription>
              Vérifiez l'état de votre configuration email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`border rounded-lg p-4 ${
              emailStatus === 'configured' 
                ? 'bg-green-50 border-green-200' 
                : emailStatus === 'error' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center gap-3">
                {emailStatus === 'configured' && <CheckCircle className="h-5 w-5 text-green-600" />}
                {emailStatus === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                {emailStatus === 'loading' && <AlertCircle className="h-5 w-5 text-blue-600" />}
                
                <div>
                  <h5 className={`font-medium ${
                    emailStatus === 'configured' 
                      ? 'text-green-900' 
                      : emailStatus === 'error' 
                      ? 'text-red-900' 
                      : 'text-blue-900'
                  }`}>
                    Configuration Resend
                    {emailStatus === 'configured' && ' - Opérationnelle'}
                    {emailStatus === 'error' && ' - Erreur'}
                    {emailStatus === 'loading' && ' - Chargement...'}
                  </h5>
                  <p className={`text-sm ${
                    emailStatus === 'configured' 
                      ? 'text-green-800' 
                      : emailStatus === 'error' 
                      ? 'text-red-800' 
                      : 'text-blue-800'
                  }`}>
                    {emailStatus === 'configured' && 'Votre configuration email est prête à être utilisée.'}
                    {emailStatus === 'error' && 'Erreur lors du chargement de la configuration. Vérifiez vos paramètres.'}
                    {emailStatus === 'loading' && 'Chargement de la configuration en cours...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Connection Test */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h6 className="font-medium">Test de Connexion Resend</h6>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={connectionTest.status === 'testing'}
                >
                  {connectionTest.status === 'testing' ? 'Test en cours...' : 'Tester la connexion'}
                </Button>
              </div>
              
              {connectionTest.status !== 'idle' && (
                <div className={`text-sm ${
                  connectionTest.status === 'success' 
                    ? 'text-green-600' 
                    : connectionTest.status === 'error' 
                    ? 'text-red-600' 
                    : 'text-blue-600'
                }`}>
                  {connectionTest.message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Configuration Resend
            </CardTitle>
            <CardDescription>
              Configurez les paramètres de votre service Resend. Pour les tests, utilisez "onboarding@resend.dev"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveEmailSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resendApiKey">Clé API Resend</Label>
                  <Input
                    id="resendApiKey"
                    type="password"
                    value={emailSettings.resendApiKey}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    ✅ Clé API configurée dans les variables d'environnement
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Email d'expéditeur</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => handleEmailChange('fromEmail', e.target.value)}
                    placeholder="onboarding@resend.dev"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Utilisez un domaine vérifié avec Resend. Pour les tests, utilisez "onboarding@resend.dev"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromName">Nom d'expéditeur</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => handleEmailChange('fromName', e.target.value)}
                    placeholder="Impact Centre Chrétien"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="replyTo">Email de réponse</Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={emailSettings.replyTo}
                    onChange={(e) => handleEmailChange('replyTo', e.target.value)}
                    placeholder="contact@impactcentrechretien.com"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Préférences d'Email
            </CardTitle>
            <CardDescription>
              Configurez les types d'emails à envoyer automatiquement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveEmailSettings} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer l'envoi d'emails automatiques
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.enableEmailNotifications}
                    onCheckedChange={(checked: boolean) => handleEmailChange('enableEmailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rappels de service</Label>
                    <p className="text-sm text-muted-foreground">
                      Envoyer des rappels pour les services assignés
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.enableServiceReminders}
                    onCheckedChange={(checked: boolean) => handleEmailChange('enableServiceReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rappels de disponibilité</Label>
                    <p className="text-sm text-muted-foreground">
                      Envoyer des rappels pour les disponibilités
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.enableAvailabilityReminders}
                    onCheckedChange={(checked: boolean) => handleEmailChange('enableAvailabilityReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications d'échange</Label>
                    <p className="text-sm text-muted-foreground">
                      Envoyer des notifications pour les demandes d'échange
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.enableSwapNotifications}
                    onCheckedChange={(checked: boolean) => handleEmailChange('enableSwapNotifications', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderTime">Délai de rappel (heures)</Label>
                <Select 
                  value={emailSettings.reminderTime} 
                  onValueChange={(value) => handleEmailChange('reminderTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 heure avant</SelectItem>
                    <SelectItem value="6">6 heures avant</SelectItem>
                    <SelectItem value="12">12 heures avant</SelectItem>
                    <SelectItem value="24">24 heures avant</SelectItem>
                    <SelectItem value="48">48 heures avant</SelectItem>
                    <SelectItem value="72">72 heures avant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Test Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test d'Email
            </CardTitle>
            <CardDescription>
              Testez votre configuration email en envoyant un email de test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Email de test</Label>
                <div className="flex gap-2">
                  <Input
                    id="testEmail"
                    type="email"
                    value={emailSettings.testEmail}
                    onChange={(e) => handleEmailChange('testEmail', e.target.value)}
                    placeholder="test@example.com"
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleTestEmail}
                    disabled={isLoading || !emailSettings.testEmail}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Tester
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Envoie un email de test pour vérifier la configuration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
