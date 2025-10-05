"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  Users, 
  Search,
  Eye,
  User
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import DashboardLayout from "@/components/layout/dashboard-layout";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
}

interface Availability {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'unavailable' | 'busy';
  notes?: string;
  user: User;
}

export default function AdminAvailabilities() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
    loadAvailabilities();
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadAvailabilities = async () => {
    try {
      setIsLoading(true);
      const url = selectedUser === 'all' 
        ? '/api/admin/availabilities'
        : `/api/admin/availabilities?userId=${selectedUser}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAvailabilities(data);
      }
    } catch (error) {
      console.error('Error loading availabilities:', error);
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

  const getAvailabilitiesForDate = (date: Date) => {
    return availabilities.filter(availability => 
      isSameDay(new Date(availability.date), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300 text-green-800';
      case 'unavailable': return 'bg-red-100 border-red-300 text-red-800';
      case 'busy': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'unavailable': return 'Indisponible';
      case 'busy': return 'Occupé';
      default: return status;
    }
  };

  const filteredAvailabilities = availabilities.filter(availability => {
    if (searchTerm) {
      const userFullName = `${availability.user.firstName} ${availability.user.lastName}`.toLowerCase();
      return userFullName.includes(searchTerm.toLowerCase()) ||
             availability.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Disponibilités des Utilisateurs"
        description="Consultez les disponibilités de tous les utilisateurs"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des disponibilités...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Disponibilités des Utilisateurs"
      description="Consultez les disponibilités de tous les utilisateurs"
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Utilisateur</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rechercher</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendrier des Disponibilités
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
                  ←
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
                  →
                </Button>
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
                const dayAvailabilities = getAvailabilitiesForDate(day);
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
                      {dayAvailabilities.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {dayAvailabilities.length}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayAvailabilities.slice(0, 2).map((availability) => (
                        <div
                          key={availability.id}
                          className={`text-xs rounded px-1 py-0.5 cursor-pointer hover:opacity-80 ${getStatusColor(availability.status)}`}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {availability.startTime}
                          </div>
                          <div className="truncate font-medium">
                            {availability.user.firstName} {availability.user.lastName}
                          </div>
                          <div className="text-xs opacity-75">
                            {getStatusText(availability.status)}
                          </div>
                        </div>
                      ))}
                      {dayAvailabilities.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayAvailabilities.length - 2} autres
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
                Disponibilités du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getAvailabilitiesForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune disponibilité enregistrée</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getAvailabilitiesForDate(selectedDate).map((availability) => (
                    <div key={availability.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4" />
                            <h4 className="font-medium">
                              {availability.user.firstName} {availability.user.lastName}
                            </h4>
                            <Badge className={getStatusColor(availability.status)}>
                              {getStatusText(availability.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {availability.startTime} - {availability.endTime}
                            </div>
                            {availability.user.department && (
                              <span>{availability.user.department}</span>
                            )}
                          </div>
                          {availability.notes && (
                            <p className="text-sm text-muted-foreground">{availability.notes}</p>
                          )}
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
