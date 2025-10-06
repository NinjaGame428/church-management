'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  Settings, 
  Bell, 
  Clock, 
  CheckCircle,
  User,
  Shield,
  Smartphone
} from "lucide-react";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const DashboardPreview = () => {
  const { t } = useLanguage();
  
  return (
    <div id="dashboards" className="w-full py-8 sm:py-12 lg:py-20 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
            Tableaux de Bord Intuitifs
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Deux interfaces optimisées : une pour les administrateurs et une pour les intervenants
          </p>
        </div>

        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger value="admin" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Tableau Admin</span>
              <span className="sm:hidden">Admin</span>
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Tableau Intervenant</span>
              <span className="sm:hidden">User</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Admin Dashboard Preview */}
              <div className="bg-background border rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Vue d'ensemble Admin</h3>
                  <Badge variant="secondary">Administrateur</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Services</span>
                      </div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs text-muted-foreground">Ce mois</p>
                    </div>
                    <div className="p-4 bg-green-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Intervenants</span>
                      </div>
                      <p className="text-2xl font-bold">45</p>
                      <p className="text-xs text-muted-foreground">Actifs</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Actions Rapides</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Nouveau Service
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Gérer Intervenants
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Features */}
              <div className="space-y-4">
                <div className="bg-background border rounded-xl p-6">
                  <h4 className="font-semibold mb-3">Fonctionnalités Admin</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Créer et modifier les services</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Gérer tous les intervenants</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Assigner les rôles</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Publier les horaires</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Voir toutes les disponibilités</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="user" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* User Dashboard Preview */}
              <div className="bg-background border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Mon Tableau de Bord</h3>
                  <Badge variant="outline">Intervenant</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Mes Prochains Services</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Dimanche 15 Oct</span>
                        <Badge variant="secondary">Louange</Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Mercredi 18 Oct</span>
                        <Badge variant="secondary">Son</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Actions Disponibles</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Ma Disponibilité
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Bell className="h-3 w-3 mr-1" />
                        Notifications
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Features */}
              <div className="space-y-4">
                <div className="bg-background border rounded-xl p-6">
                  <h4 className="font-semibold mb-3">Fonctionnalités Intervenant</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Voir mes services assignés</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Marquer ma disponibilité</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Recevoir les notifications</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Accès mobile optimisé</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Mettre à jour mon profil</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Mobile Responsive Note */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full">
            <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">Interface 100% Mobile Responsive</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Optimisé pour smartphone avec navigation tactile intuitive
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
