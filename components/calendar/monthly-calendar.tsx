"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  User, 
  Plus,
  RefreshCw
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

interface ServiceSchedule {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  users: {
    id: string;
    name: string;
    role: string;
    department?: string;
  }[];
}

interface MonthlyCalendarProps {
  schedules: ServiceSchedule[];
  onDateClick?: (date: Date) => void;
  onServiceClick?: (service: ServiceSchedule) => void;
  showAddButton?: boolean;
}

export default function MonthlyCalendar({ 
  schedules, 
  onDateClick, 
  onServiceClick,
  showAddButton = true 
}: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
    onDateClick?.(date);
  };

  const getServicesForDate = (date: Date) => {
    return schedules.filter(schedule => 
      isSameDay(new Date(schedule.date), date)
    );
  };

  const getTotalUsersForDate = (date: Date) => {
    const services = getServicesForDate(date);
    return services.reduce((total, service) => total + service.users.length, 0);
  };

  return (
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
            const services = getServicesForDate(day);
            const totalUsers = getTotalUsersForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`h-24 border border-gray-200 rounded p-1 cursor-pointer transition-colors ${
                  isCurrentDay ? 'bg-blue-50 border-blue-300' : 
                  isSelected ? 'bg-blue-100 border-blue-400' : 
                  'hover:bg-gray-50'
                }`}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium ${
                    isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {totalUsers > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {totalUsers}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  {services.slice(0, 2).map((service) => (
                    <div
                      key={service.id}
                      className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 cursor-pointer hover:bg-blue-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onServiceClick?.(service);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {service.time}
                      </div>
                      <div className="truncate">{service.title}</div>
                    </div>
                  ))}
                  {services.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{services.length - 2} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">
              Services du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
            </h4>
            {getServicesForDate(selectedDate).length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun service programmé</p>
            ) : (
              <div className="space-y-2">
                {getServicesForDate(selectedDate).map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{service.title}</span>
                        <span className="text-sm text-muted-foreground">{service.time}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {service.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {service.users.length} intervenant{service.users.length > 1 ? 's' : ''}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onServiceClick?.(service)}
                      >
                        Voir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
