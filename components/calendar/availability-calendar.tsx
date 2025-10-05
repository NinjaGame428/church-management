"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Plus,
  Check,
  X
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, addDays } from "date-fns";
import { fr } from "date-fns/locale";

interface Availability {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'unavailable' | 'busy';
  notes?: string;
  serviceId?: string;
  serviceTitle?: string;
}

interface AvailabilityCalendarProps {
  availabilities: Availability[];
  onAddAvailability: (data: {
    date: string;
    status: 'available' | 'unavailable' | 'busy';
    notes?: string;
  }) => Promise<void>;
  onEditAvailability: (id: string, data: {
    date: string;
    status: 'available' | 'unavailable' | 'busy';
    notes?: string;
  }) => Promise<void>;
  onDeleteAvailability: (id: string) => Promise<void>;
}

export default function AvailabilityCalendar({ 
  availabilities, 
  onAddAvailability, 
  onEditAvailability,
  onDeleteAvailability 
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    status: 'available' as 'available' | 'unavailable' | 'busy',
    notes: ''
  });

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
    setShowAddForm(true);
    setEditingId(null);
    setFormData({
      status: 'available',
      notes: ''
    });
  };

  const handleEditAvailability = (availability: Availability) => {
    setSelectedDate(new Date(availability.date));
    setEditingId(availability.id);
    setFormData({
      status: availability.status,
      notes: availability.notes || ''
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const dateString = selectedDate.toISOString().split('T')[0];
    const availabilityData = {
      date: dateString,
      status: formData.status,
      notes: formData.notes
    };
    
    try {
      if (editingId) {
        await onEditAvailability(editingId, availabilityData);
      } else {
        await onAddAvailability(availabilityData);
      }
      
      setShowAddForm(false);
      setEditingId(null);
      setFormData({
        status: 'available',
        notes: ''
      });
    } catch (error) {
      console.error('Error saving availability:', error);
      // Don't close the form if there's an error
      throw error;
    }
  };

  const getAvailabilitiesForDate = (date: Date) => {
    return availabilities.filter(availability => 
      isSameDay(new Date(availability.date), date)
    );
  };

  const getAvailabilityStatus = (date: Date) => {
    const dayAvailabilities = getAvailabilitiesForDate(date);
    if (dayAvailabilities.length === 0) return null;
    
    // Return the most restrictive status
    if (dayAvailabilities.some(a => a.status === 'unavailable')) return 'unavailable';
    if (dayAvailabilities.some(a => a.status === 'busy')) return 'busy';
    return 'available';
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300 text-green-800';
      case 'unavailable': return 'bg-red-100 border-red-300 text-red-800';
      case 'busy': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendrier de Disponibilité
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
              const status = getAvailabilityStatus(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              const dayAvailabilities = getAvailabilitiesForDate(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`h-24 border rounded p-1 cursor-pointer transition-colors relative ${
                    isCurrentDay ? 'bg-blue-50 border-blue-300' : 
                    isSelected ? 'bg-blue-100 border-blue-400' : 
                    getStatusColor(status)
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
                        className="text-xs bg-white/80 text-gray-800 rounded px-1 py-0.5 cursor-pointer hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAvailability(availability);
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {availability.startTime}
                        </div>
                        <div className="truncate">
                          {availability.status === 'available' ? 'Disponible' :
                           availability.status === 'unavailable' ? 'Indisponible' : 'Occupé'}
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

      {/* Add/Edit Form */}
      {showAddForm && selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Modifier la disponibilité' : 'Ajouter une disponibilité'}
            </CardTitle>
            <CardDescription>
              {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut de disponibilité</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner votre statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="unavailable">Indisponible</SelectItem>
                    <SelectItem value="busy">Occupé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ajoutez des notes sur votre disponibilité..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  {editingId ? 'Mettre à jour' : 'Ajouter'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({
                      status: 'available',
                      notes: ''
                    });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Selected Date Details */}
      {selectedDate && !showAddForm && (
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
                <Button 
                  className="mt-4"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une disponibilité
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {getAvailabilitiesForDate(selectedDate).map((availability) => (
                  <div key={availability.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant={availability.status === 'available' ? 'default' : 
                                    availability.status === 'unavailable' ? 'destructive' : 'secondary'}
                          >
                            {availability.status === 'available' ? 'Disponible' :
                             availability.status === 'unavailable' ? 'Indisponible' : 'Occupé'}
                          </Badge>
                        </div>
                        <p className="font-medium">
                          {availability.startTime} - {availability.endTime}
                        </p>
                        {availability.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{availability.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditAvailability(availability)}
                        >
                          Modifier
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onDeleteAvailability(availability.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  className="w-full mt-4"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une autre disponibilité
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
