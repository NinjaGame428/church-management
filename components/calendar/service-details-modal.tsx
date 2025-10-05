"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Clock, 
  MapPin, 
  User, 
  RefreshCw,
  Mail,
  Phone
} from "lucide-react";

interface ServiceUser {
  id: string;
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
}

interface ServiceDetails {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  users: ServiceUser[];
}

interface ServiceDetailsModalProps {
  service: ServiceDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onSwapRequest?: (userId: string) => void;
  currentUserId?: string;
}

export default function ServiceDetailsModal({ 
  service, 
  isOpen, 
  onClose, 
  onSwapRequest,
  currentUserId 
}: ServiceDetailsModalProps) {
  if (!isOpen || !service) return null;

  const handleSwapRequest = (userId: string) => {
    onSwapRequest?.(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{service.title}</CardTitle>
              <CardDescription>
                {new Date(service.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Service Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{service.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{service.location}</span>
            </div>
          </div>

          {service.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          )}

          {/* Assigned Users */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Intervenants Assignés ({service.users.length})
            </h4>
            
            <div className="space-y-3">
              {service.users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{user.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                      {user.department && (
                        <Badge variant="secondary" className="text-xs">
                          {user.department}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {user.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {currentUserId && user.id !== currentUserId && onSwapRequest && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSwapRequest(user.id)}
                      className="flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Demander échange
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
