"use client";

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
  BarChart3
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

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
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 depuis le mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Intervenants actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+3 nouveaux cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services planifiés</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Prochaines 2 semaines</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de participation</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">+5% depuis le mois dernier</p>
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
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Dimanche 15 Octobre</p>
                    <p className="text-sm text-gray-600">Service du matin - 10h00</p>
                  </div>
                  <Badge variant="secondary">Complet</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">Mercredi 18 Octobre</p>
                    <p className="text-sm text-gray-600">Réunion de prière - 19h00</p>
                  </div>
                  <Badge variant="outline">En attente</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Dimanche 22 Octobre</p>
                    <p className="text-sm text-gray-600">Service du soir - 18h00</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmé</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Service du dimanche confirmé</p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouvel intervenant ajouté</p>
                  <p className="text-xs text-gray-500">Il y a 4 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Rappel: Service de mercredi</p>
                  <p className="text-xs text-gray-500">Il y a 6 heures</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </DashboardLayout>
  );
}
