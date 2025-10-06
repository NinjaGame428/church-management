"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  RefreshCw, 
  Search, 
  User, 
  Calendar, 
  Clock, 
  MapPin,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";

interface Service {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  status: string;
}

interface AvailableUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
}

interface SwapRequest {
  id: string;
  fromUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  toUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  serviceId: string;
  serviceTitle: string;
  date: string;
  status: string;
  message?: string;
  createdAt: string;
}

export default function SwapPage() {
  const { user, isLoading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadUserServices();
      loadSwapRequests();
    }
  }, [user]);

  const loadUserServices = async () => {
    try {
      const response = await fetch(`/api/user/services?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadSwapRequests = async () => {
    try {
      const response = await fetch(`/api/user/swap-requests?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setSwapRequests(data);
      }
    } catch (error) {
      console.error('Error loading swap requests:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadAvailableUsers = async (serviceId: string, date: string) => {
    try {
      // Load all users instead of just available ones
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        // Filter out the current user and only show regular users
        const otherUsers = data.filter((u: any) => u.id !== user?.id && u.role === 'USER');
        setAvailableUsers(otherUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      loadAvailableUsers(serviceId, service.date);
    }
  };

  const handleSwapRequest = async () => {
    if (!selectedService || !selectedUser || !user) {
      setErrorMessage('Veuillez sélectionner un service et un utilisateur');
      return;
    }

    try {
      const response = await fetch('/api/user/swap-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: user.id,
          toUserId: selectedUser,
          serviceId: selectedService.id,
          date: selectedService.date,
          message: message || `Demande d'échange pour le service "${selectedService.title}"`
        }),
      });

      if (response.ok) {
        setSuccessMessage('Demande d\'échange envoyée avec succès!');
        setSelectedService(null);
        setSelectedUser('');
        setMessage('');
        loadSwapRequests();
        
        // Send notification
        await fetch('/api/notifications/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'swap_request',
            targetUserId: selectedUser,
            fromUserId: user.id,
            serviceId: selectedService.id,
            serviceTitle: selectedService.title,
            date: selectedService.date,
            message: `Nouvelle demande d'échange pour le service "${selectedService.title}"`
          }),
        });
      } else {
        setErrorMessage('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Swap request error:', error);
      setErrorMessage('Erreur lors de l\'envoi de la demande');
    }
  };

  const handleSwapResponse = async (requestId: string, response: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/user/swap-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: response }),
      });

      if (res.ok) {
        setSuccessMessage(`Demande d'échange ${response === 'accepted' ? 'acceptée' : 'rejetée'}!`);
        loadSwapRequests();
      } else {
        setErrorMessage('Erreur lors de la réponse');
      }
    } catch (error) {
      console.error('Swap response error:', error);
      setErrorMessage('Erreur lors de la réponse');
    }
  };

  const filteredUsers = availableUsers.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Échanges de Services" 
        description="Demandez des échanges avec d'autres utilisateurs"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Échanges de Services" 
      description="Demandez des échanges avec d'autres utilisateurs"
    >
      <div className="space-y-6">
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        {/* Create Swap Request */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Nouvelle Demande d'Échange
            </CardTitle>
            <CardDescription>
              Sélectionnez un service et un utilisateur disponible pour demander un échange
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service à échanger</Label>
                <Select onValueChange={handleServiceSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{service.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(service.date).toLocaleDateString('fr-FR')} à {service.time}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedService && (
                <div className="space-y-2">
                  <Label htmlFor="user">Utilisateur pour l'échange</Label>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez un utilisateur pour demander un échange. Note: Vérifiez la disponibilité de l'utilisateur avant d'envoyer la demande.
                  </p>
                  <div className="space-y-2">
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un utilisateur" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{user.firstName} {user.lastName}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                {user.department && (
                                  <div className="text-xs text-muted-foreground">{user.department}</div>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {selectedService && (
              <div className="space-y-2">
                <Label htmlFor="message">Message (optionnel)</Label>
                <Textarea
                  id="message"
                  placeholder="Expliquez pourquoi vous souhaitez échanger ce service..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {selectedService && selectedUser && (
              <Button onClick={handleSwapRequest} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Envoyer la Demande d'Échange
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Swap Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Demandes d'Échange
            </CardTitle>
            <CardDescription>
              Gérez vos demandes d'échange de services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Chargement des demandes...</p>
              </div>
            ) : swapRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune demande d'échange</p>
              </div>
            ) : (
              <div className="space-y-3">
                {swapRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant={request.status === 'pending' ? 'secondary' :
                                    request.status === 'accepted' ? 'default' : 
                                    request.status === 'admin_approved' ? 'default' :
                                    request.status === 'admin_rejected' ? 'destructive' : 'destructive'}
                          >
                            {request.status === 'pending' ? 'En attente' :
                             request.status === 'accepted' ? 'Acceptée - En attente admin' :
                             request.status === 'admin_approved' ? 'Approuvée par admin' :
                             request.status === 'admin_rejected' ? 'Rejetée par admin' : 'Rejetée'}
                          </Badge>
                        </div>
                        <p className="font-medium">{request.serviceTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.date).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.fromUserId === user?.id ? 
                            `Vers: ${request.toUser.firstName} ${request.toUser.lastName}` :
                            `De: ${request.fromUser.firstName} ${request.fromUser.lastName}`
                          }
                        </p>
                        {request.message && (
                          <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                        )}
                      </div>
                      {request.status === 'pending' && request.fromUserId !== user?.id && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSwapResponse(request.id, 'accepted')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleSwapResponse(request.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
