"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Bell, 
  Settings,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/AuthContext";

interface UserService {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  role: string;
  status: string;
  church: {
    name: string;
  };
}

interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface UserStats {
  servicesThisMonth: number;
  nextServiceDays: number;
  availabilityStatus: string;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [userServices, setUserServices] = useState<UserService[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [stats, setStats] = useState<UserStats>({
    servicesThisMonth: 0,
    nextServiceDays: 0,
    availabilityStatus: 'Disponible'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load user services
      const servicesResponse = await fetch('/api/user/services');
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setUserServices(servicesData);
      }

      // Load notifications
      const notificationsResponse = await fetch(`/api/notifications?userId=${user?.id}`);
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData.slice(0, 5)); // Show only 5 recent notifications
      }

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const servicesThisMonth = userServices.filter(service => {
        const serviceDate = new Date(service.date);
        return serviceDate >= startOfMonth && serviceDate <= endOfMonth;
      }).length;

      const upcomingServices = userServices.filter(service => 
        new Date(service.date) > now
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const nextServiceDays = upcomingServices.length > 0 
        ? Math.ceil((new Date(upcomingServices[0].date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      setStats({
        servicesThisMonth,
        nextServiceDays,
        availabilityStatus: 'Disponible'
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout 
      title="Tableau de bord"
      description="Vue d'ensemble de vos services et disponibilités"
    >
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Bonjour, {user?.firstName || 'Utilisateur'}
          </h2>
          <p className="text-gray-600">Voici vos prochains services et informations importantes</p>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mon Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-500">{user?.role === 'ADMIN' ? 'Administrateur' : 'Intervenant'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>

              {user?.department && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Département</h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">{user.department}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Services ce mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? <RefreshCw className="h-6 w-6 animate-spin" /> : stats.servicesThisMonth}
                </div>
                <p className="text-xs text-muted-foreground">Services assignés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Prochain service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? <RefreshCw className="h-6 w-6 animate-spin" /> : stats.nextServiceDays > 0 ? `${stats.nextServiceDays}j` : 'Aucun'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.nextServiceDays > 0 ? 'Jours restants' : 'Aucun service'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Disponibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {isLoading ? <RefreshCw className="h-6 w-6 animate-spin" /> : stats.availabilityStatus}
                </div>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Mes Prochains Services</CardTitle>
                  <CardDescription>Services auxquels vous êtes assigné</CardDescription>
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
              ) : userServices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun service assigné</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userServices.slice(0, 3).map((service) => (
                    <div key={service.id} className={`flex items-center justify-between p-4 rounded-lg ${
                      service.status === 'CONFIRMED' ? 'bg-green-50' :
                      service.status === 'PENDING' ? 'bg-yellow-50' :
                      service.status === 'DECLINED' ? 'bg-red-50' :
                      'bg-blue-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          service.status === 'CONFIRMED' ? 'bg-green-100' :
                          service.status === 'PENDING' ? 'bg-yellow-100' :
                          service.status === 'DECLINED' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          {service.status === 'CONFIRMED' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : service.status === 'PENDING' ? (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          ) : service.status === 'DECLINED' ? (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <Calendar className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{service.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(service.date).toLocaleDateString('fr-FR')} - {service.time}
                          </p>
                          <p className="text-xs text-gray-500">{service.location}</p>
                          <p className="text-xs text-blue-600">Rôle: {service.role}</p>
                        </div>
                      </div>
                      <Badge 
                        className={
                          service.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          service.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          service.status === 'DECLINED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {service.status === 'CONFIRMED' ? 'Confirmé' :
                         service.status === 'PENDING' ? 'En attente' :
                         service.status === 'DECLINED' ? 'Refusé' : service.status}
                      </Badge>
                    </div>
                  ))}
                  {userServices.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/user/services">
                          Voir tous les services ({userServices.length})
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ma Disponibilité</CardTitle>
              <CardDescription>Gérez vos disponibilités</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Cette semaine</span>
                  </div>
                  <p className="text-sm text-green-700">Disponible pour tous les services</p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Semaine prochaine</span>
                  </div>
                  <p className="text-sm text-yellow-700">Indisponible mercredi 25 octobre</p>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/user/availability">
                    <Calendar className="h-4 w-4 mr-2" />
                    Mettre à jour ma disponibilité
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Notifications récentes</CardTitle>
                <CardDescription>Dernières informations importantes</CardDescription>
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
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune notification récente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg ${
                    notification.type === 'service_assignment' ? 'bg-blue-50' :
                    notification.type === 'service_confirmed' ? 'bg-green-50' :
                    notification.type === 'service_declined' ? 'bg-red-50' :
                    notification.type === 'swap_request' ? 'bg-yellow-50' :
                    'bg-gray-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                      notification.type === 'service_assignment' ? 'bg-blue-100' :
                      notification.type === 'service_confirmed' ? 'bg-green-100' :
                      notification.type === 'service_declined' ? 'bg-red-100' :
                      notification.type === 'swap_request' ? 'bg-yellow-100' :
                      'bg-gray-100'
                    }`}>
                      {notification.type === 'service_assignment' ? (
                        <Calendar className="h-4 w-4 text-blue-600" />
                      ) : notification.type === 'service_confirmed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : notification.type === 'service_declined' ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : notification.type === 'swap_request' ? (
                        <RefreshCw className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <Bell className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
                {notifications.length >= 5 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/user/notifications">
                        Voir toutes les notifications
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
    </DashboardLayout>
  );
}
