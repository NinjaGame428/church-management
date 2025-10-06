"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Clock,
  User,
  Trash2
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useNotifications } from "@/components/notifications/notification-provider";

export default function UserNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    await markAllAsRead();
    setIsLoading(false);
  };

  const handleRemoveNotification = async (id: string) => {
    await removeNotification(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'swap_request':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'service_assignment':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'service_update':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'assignment_response':
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'swap_request':
        return 'bg-blue-50 border-blue-200';
      case 'service_assignment':
        return 'bg-green-50 border-green-200';
      case 'service_update':
        return 'bg-yellow-50 border-yellow-200';
      case 'assignment_response':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    // Show exact date and time for all notifications
    const formattedDate = date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedTime = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Add relative time for context
    let relativeTime = '';
    if (diffInMinutes < 1) {
      relativeTime = ' (à l\'instant)';
    } else if (diffInMinutes < 60) {
      relativeTime = ` (il y a ${diffInMinutes} min)`;
    } else if (diffInMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      relativeTime = ` (il y a ${hours}h)`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      relativeTime = ` (il y a ${days} jour${days > 1 ? 's' : ''})`;
    }
    
    return `${formattedDate} à ${formattedTime}${relativeTime}`;
  };

  return (
    <DashboardLayout 
      title="Notifications"
      description="Gérez vos notifications et alertes"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">
              {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes les notifications sont lues'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {notifications.length} notification{notifications.length > 1 ? 's' : ''} au total
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              onClick={handleMarkAllAsRead}
              disabled={isLoading}
              variant="outline"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isLoading ? 'Marquage...' : 'Tout marquer comme lu'}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Aucune notification</h3>
              <p className="text-muted-foreground">
                Vous n'avez pas encore de notifications. Elles apparaîtront ici quand vous en recevrez.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all duration-200 ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="font-mono cursor-help">{formatDate(notification.createdAt)}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Notification envoyée le {new Date(notification.createdAt).toLocaleString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                  })}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-4">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveNotification(notification.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
