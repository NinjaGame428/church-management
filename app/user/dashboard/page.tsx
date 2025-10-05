"use client";

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
  LogOut,
  Phone,
  Mail
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UserDashboard() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    // Handle logout logic here
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary-foreground"
                >
                  <path
                    d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold">ChurchManager</h1>
                <p className="text-sm text-muted-foreground">Mon tableau de bord</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/user/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading}>
                <LogOut className="h-4 w-4 mr-2" />
                {isLoading ? "Déconnexion..." : "Déconnexion"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Bonjour, Jean Dupont</h2>
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
                  <p className="font-medium">Jean Dupont</p>
                  <p className="text-sm text-gray-500">Intervenant</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>jean.dupont@email.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>+33 1 23 45 67 89</span>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Départements</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">Louange</Badge>
                  <Badge variant="outline">Son</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Services ce mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Services assignés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Prochain service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2j</div>
                <p className="text-xs text-muted-foreground">Dimanche 15 Oct</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Disponibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Disponible</div>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Mes Prochains Services</CardTitle>
              <CardDescription>Services auxquels vous êtes assigné</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Dimanche 15 Octobre</p>
                      <p className="text-sm text-gray-600">Service du matin - 10h00</p>
                      <p className="text-xs text-blue-600">Rôle: Louange</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Confirmé</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Mercredi 18 Octobre</p>
                      <p className="text-sm text-gray-600">Réunion de prière - 19h00</p>
                      <p className="text-xs text-yellow-600">Rôle: Son</p>
                    </div>
                  </div>
                  <Badge variant="outline">En attente</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Dimanche 22 Octobre</p>
                      <p className="text-sm text-gray-600">Service du soir - 18h00</p>
                      <p className="text-xs text-green-600">Rôle: Louange</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmé</Badge>
                </div>
              </div>
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
            <CardTitle>Notifications récentes</CardTitle>
            <CardDescription>Dernières informations importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouveau service assigné</p>
                  <p className="text-xs text-gray-600">Vous avez été assigné au service du dimanche 15 octobre</p>
                  <p className="text-xs text-gray-400">Il y a 2 heures</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Service confirmé</p>
                  <p className="text-xs text-gray-600">Le service de mercredi a été confirmé</p>
                  <p className="text-xs text-gray-400">Il y a 1 jour</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mt-1">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Rappel de service</p>
                  <p className="text-xs text-gray-600">N'oubliez pas le service de dimanche à 10h00</p>
                  <p className="text-xs text-gray-400">Il y a 2 jours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
