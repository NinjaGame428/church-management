"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Eye
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import DashboardLayout from "@/components/layout/dashboard-layout";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  church: {
    id: string;
    name: string;
  };
  assignments: {
    id: string;
    role: string;
    status: 'PENDING' | 'CONFIRMED' | 'DECLINED';
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
}

export default function AdminCalendar() {
  const [services, setServices] = useState<Service[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week for proper calendar layout
  const firstDayOfWeek = monthStart.getDay();
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const getServicesForDate = (date: Date) => {
    return services.filter(service => 
      isSameDay(new Date(service.date), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 border-green-300 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'Publié';
      case 'DRAFT': return 'Brouillon';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Calendrier des Services"
        description="Vue d'ensemble de tous les services"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement du calendrier...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Calendrier des Services"
      description="Vue d'ensemble de tous les services"
    >
      <div className="space-y-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendrier des Services
                </CardTitle>
                <CardDescription>
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Aujourd'hui
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Link href="/admin/services">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un service
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="h-24 border border-gray-200 rounded"></div>
              ))}
              
              {daysInMonth.map((day) => {
                const dayServices = getServicesForDate(day);
                const isCurrentDay = isToday(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <div
                    key={day.toISOString()}
                    className={`h-24 border rounded p-1 cursor-pointer transition-colors relative ${
                      isCurrentDay ? 'bg-blue-50 border-blue-300' : 
                      isSelected ? 'bg-blue-100 border-blue-400' : 
                      'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-medium ${
                        isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {dayServices.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {dayServices.length}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayServices.slice(0, 2).map((service) => (
                        <div
                          key={service.id}
                          className={`text-xs rounded px-1 py-0.5 cursor-pointer hover:opacity-80 ${getStatusColor(service.status)}`}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.time}
                          </div>
                          <div className="truncate font-medium">
                            {service.title}
                          </div>
                          <div className="text-xs opacity-75">
                            {service.church.name}
                          </div>
                        </div>
                      ))}
                      {dayServices.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayServices.length - 2} autres
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle>
                Services du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getServicesForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun service programmé</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getServicesForDate(selectedDate).map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{service.title}</h4>
                            <Badge className={getStatusColor(service.status)}>
                              {getStatusText(service.status)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {service.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {service.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {service.assignments.length} intervenant{service.assignments.length > 1 ? 's' : ''}
                            </div>
                          </div>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                          )}
                          <div className="text-sm">
                            <span className="font-medium">Église:</span> {service.church.name}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Link href={`/admin/services`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
