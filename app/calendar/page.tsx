"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import MonthlyCalendar from "@/components/calendar/monthly-calendar";
import ServiceDetailsModal from "@/components/calendar/service-details-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  Plus,
  RefreshCw,
  Bell
} from "lucide-react";
import Link from "next/link";

interface ServiceSchedule {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  users: {
    id: string;
    name: string;
    role: string;
    department?: string;
    email?: string;
    phone?: string;
  }[];
}

export default function CalendarPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState<ServiceSchedule[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceSchedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load schedules
  useEffect(() => {
    if (user) {
      loadSchedules();
    }
  }, [user]);

  const loadSchedules = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch('/api/calendar/schedules');
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDateClick = (date: Date) => {
    // You can add logic here to show availability for the selected date
    console.log('Date clicked:', date);
  };

  const handleServiceClick = (service: ServiceSchedule) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleSwapRequest = async (targetUserId: string) => {
    if (!selectedService || !user) return;

    try {
      const response = await fetch('/api/user/swap-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: user.id,
          toUserId: targetUserId,
          serviceId: selectedService.id,
          date: selectedService.date,
          message: `Demande d'échange pour le service "${selectedService.title}"`
        }),
      });

      if (response.ok) {
        alert('Demande d\'échange envoyée!');
        // Send notifications
        await sendSwapNotification(targetUserId, selectedService);
      } else {
        alert('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Swap request error:', error);
      alert('Erreur lors de l\'envoi de la demande');
    }
  };

  const sendSwapNotification = async (targetUserId: string, service: ServiceSchedule) => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'swap_request',
          targetUserId,
          fromUserId: user?.id,
          serviceId: service.id,
          serviceTitle: service.title,
          date: service.date,
          message: `Nouvelle demande d'échange pour le service "${service.title}"`
        }),
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold">Calendrier des Services</h1>
              <p className="text-muted-foreground">Consultez les services programmés et gérez vos disponibilités</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/user/availability">
                  <Plus className="h-4 w-4 mr-2" />
                  Ma Disponibilité
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/user/dashboard">
                  <User className="h-4 w-4 mr-2" />
                  Mon Tableau de Bord
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            {isLoadingData ? (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Chargement du calendrier...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <MonthlyCalendar
                schedules={schedules}
                onDateClick={handleDateClick}
                onServiceClick={handleServiceClick}
                showAddButton={true}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Services ce mois</span>
                  <Badge variant="secondary">{schedules.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Intervenants actifs</span>
                  <Badge variant="secondary">
                    {new Set(schedules.flatMap(s => s.users.map(u => u.id))).size}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prochains Services</CardTitle>
                <CardDescription>Services à venir</CardDescription>
              </CardHeader>
              <CardContent>
                {schedules.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun service programmé</p>
                ) : (
                  <div className="space-y-3">
                    {schedules.slice(0, 3).map((service) => (
                      <div key={service.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{service.title}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(service.date).toLocaleDateString('fr-FR')} à {service.time}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {service.users.length} intervenant{service.users.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </CardTitle>
                <CardDescription>Dernières activités</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Les notifications d'échange apparaîtront ici
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Details Modal */}
        <ServiceDetailsModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          onSwapRequest={handleSwapRequest}
          currentUserId={user.id}
        />
      </div>
    </div>
  );
}
