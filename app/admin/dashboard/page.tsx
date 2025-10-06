"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  BarChart3,
  RefreshCw,
  Mail,
  Settings,
  Send
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useRouter } from "next/navigation";

interface DashboardStats {
  servicesThisMonth: number;
  activeUsers: number;
  scheduledServices: number;
  participationRate: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  message: string;
  user: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

interface UpcomingService {
  id: string;
  title: string;
  date: string;
  time: string;
  status: string;
  assignments: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    servicesThisMonth: 0,
    activeUsers: 0,
    scheduledServices: 0,
    participationRate: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingServices, setUpcomingServices] = useState<UpcomingService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    fromEmail: '',
    fromName: ''
  });
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats
      const statsResponse = await fetch('/api/admin/dashboard/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load recent activity
      const activityResponse = await fetch('/api/admin/dashboard/activity');
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
      }

      // Load upcoming services
      const servicesResponse = await fetch('/api/admin/dashboard/upcoming-services');
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setUpcomingServices(servicesData);
      }

      // Load email settings
      loadEmailSettings();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmailSettings = async () => {
    try {
      const response = await fetch('/api/admin/email-settings');
      if (response.ok) {
        const settings = await response.json();
        setEmailSettings(settings);
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    }
  };

  const handleEmailSettingsSave = async () => {
    try {
      setIsEmailLoading(true);
      setEmailMessage('');
      
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailSettings),
      });

      if (response.ok) {
        setEmailMessage('Paramètres email sauvegardés avec succès!');
      } else {
        const error = await response.json();
        setEmailMessage(`Erreur: ${error.error || 'Impossible de sauvegarder les paramètres'}`);
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      setEmailMessage('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setIsEmailLoading(true);
      setEmailMessage('');
      
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setEmailMessage('Email de test envoyé avec succès!');
      } else {
        const error = await response.json();
        setEmailMessage(`Erreur: ${error.error || 'Impossible d\'envoyer l\'email de test'}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setEmailMessage('Erreur lors de l\'envoi de l\'email de test');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleCreateService = () => {
    router.push('/admin/services');
  };

  const handleAddUser = () => {
    router.push('/admin/users');
  };

  const handleScheduleServices = () => {
    router.push('/admin/calendar');
  };

  return (
    <DashboardLayout 
      title="Tableau d'Administration"
      description="Gérez vos services et intervenants en toute simplicité"
    >
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Bonjour, Administrateur</h2>
          <p className="text-gray-600">Gérez vos services et intervenants en toute simplicité</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services ce mois</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <RefreshCw className="h-6 w-6 animate-spin" /> : stats.servicesThisMonth}
              </div>
              <p className="text-xs text-muted-foreground">Services créés ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Intervenants actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <RefreshCw className="h-6 w-6 animate-spin" /> : stats.activeUsers}
              </div>
              <p className="text-xs text-muted-foreground">Utilisateurs enregistrés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services planifiés</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <RefreshCw className="h-6 w-6 animate-spin" /> : stats.scheduledServices}
              </div>
              <p className="text-xs text-muted-foreground">Prochaines 2 semaines</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de participation</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <RefreshCw className="h-6 w-6 animate-spin" /> : `${stats.participationRate}%`}
              </div>
              <p className="text-xs text-muted-foreground">Services confirmés</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Gérez vos services et intervenants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={handleCreateService}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un nouveau service
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleAddUser}>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un intervenant
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleScheduleServices}>
                <Calendar className="h-4 w-4 mr-2" />
                Planifier les services
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services à venir</CardTitle>
              <CardDescription>Prochains services planifiés</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : upcomingServices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun service à venir</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">{service.title}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(service.date).toLocaleDateString('fr-FR')} - {service.time}
                        </p>
                        <p className="text-xs text-gray-500">{service.assignments} intervenant(s)</p>
                      </div>
                      <Badge 
                        variant={service.status === 'PUBLISHED' ? 'default' : 'secondary'}
                        className={
                          service.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 
                          service.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {service.status === 'PUBLISHED' ? 'Publié' : 
                         service.status === 'DRAFT' ? 'Brouillon' : service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>Dernières actions sur la plateforme</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={loadDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune activité récente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'service_assignment' ? 'bg-green-100' :
                      activity.type === 'service_confirmed' ? 'bg-blue-100' :
                      activity.type === 'service_declined' ? 'bg-red-100' :
                      activity.type === 'swap_request' ? 'bg-yellow-100' :
                      activity.type === 'user_registered' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'service_assignment' ? (
                        <Calendar className="h-4 w-4 text-green-600" />
                      ) : activity.type === 'service_confirmed' ? (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      ) : activity.type === 'service_declined' ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : activity.type === 'swap_request' ? (
                        <RefreshCw className="h-4 w-4 text-yellow-600" />
                      ) : activity.type === 'user_registered' ? (
                        <UserPlus className="h-4 w-4 text-purple-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {activity.user.firstName} {activity.user.lastName} - {new Date(activity.createdAt).toLocaleString('fr-FR')}
                      </p>
                      {activity.message && (
                        <p className="text-xs text-gray-600 mt-1">{activity.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Paramètres Email
                </CardTitle>
                <CardDescription>Configuration des notifications email</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={loadEmailSettings}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {emailMessage && (
              <div className={`mb-4 p-3 rounded-lg ${
                emailMessage.includes('succès') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  emailMessage.includes('succès') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {emailMessage}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Serveur SMTP</label>
                <input
                  type="text"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                  placeholder="smtp.gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Port SMTP</label>
                <input
                  type="number"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                  placeholder="587"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email d'envoi</label>
                <input
                  type="email"
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                  placeholder="votre@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mot de passe</label>
                <input
                  type="password"
                  value={emailSettings.smtpPass}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpPass: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom d'expéditeur</label>
                <input
                  type="text"
                  value={emailSettings.fromName}
                  onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                  placeholder="Impact Centre Chrétien"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email d'expéditeur</label>
                <input
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                  placeholder="noreply@impactcentrechretien.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={handleEmailSettingsSave}
                disabled={isEmailLoading}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {isEmailLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleTestEmail}
                disabled={isEmailLoading}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isEmailLoading ? 'Envoi...' : 'Tester Email'}
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Configuration recommandée pour Gmail:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Serveur SMTP: smtp.gmail.com</li>
                <li>• Port: 587 (TLS) ou 465 (SSL)</li>
                <li>• Utilisez un mot de passe d'application pour Gmail</li>
                <li>• Activez l'authentification à 2 facteurs sur votre compte Gmail</li>
              </ul>
            </div>
          </CardContent>
        </Card>
    </DashboardLayout>
  );
}
