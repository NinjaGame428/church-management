"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AvailabilityCalendar from "@/components/calendar/availability-calendar";
import DashboardLayout from "@/components/layout/dashboard-layout";

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

interface SwapRequest {
  id: string;
  fromUser: string;
  toUser: string;
  serviceId: string;
  serviceTitle: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
}

export default function AvailabilityPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load availabilities and swap requests
  useEffect(() => {
    if (user) {
      loadAvailabilities();
      loadSwapRequests();
    }
  }, [user]);

  const loadAvailabilities = async () => {
    try {
      const response = await fetch(`/api/user/availability?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setAvailabilities(data);
      } else {
        const errorData = await response.json();
        console.error('Error loading availabilities:', errorData);
        setError(errorData.error || 'Erreur lors du chargement des disponibilités');
      }
    } catch (error) {
      console.error('Error loading availabilities:', error);
      setError('Erreur lors du chargement des disponibilités');
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadSwapRequests = async () => {
    try {
      const response = await fetch('/api/user/swap-requests');
      if (response.ok) {
        const data = await response.json();
        setSwapRequests(data);
      }
    } catch (error) {
      console.error('Error loading swap requests:', error);
    }
  };

  const handleAddAvailability = async (data: {
    date: string;
    status: 'available' | 'unavailable' | 'busy';
    startTime: string;
    endTime: string;
    notes?: string;
  }) => {
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/user/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          ...data
        }),
      });
      
      if (response.ok) {
        setMessage('Disponibilité ajoutée!');
        loadAvailabilities();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la sauvegarde');
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Availability error:', error);
      setError('Erreur lors de la sauvegarde');
      throw error;
    }
  };

  const handleEditAvailability = async (id: string, data: {
    date: string;
    status: 'available' | 'unavailable' | 'busy';
    startTime: string;
    endTime: string;
    notes?: string;
  }) => {
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/user/availability/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          ...data
        }),
      });

      if (response.ok) {
        setMessage('Disponibilité mise à jour!');
        loadAvailabilities();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la mise à jour');
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Availability error:', error);
      setError('Erreur lors de la mise à jour');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette disponibilité?')) return;

    try {
      const response = await fetch(`/api/user/availability/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Disponibilité supprimée!');
        loadAvailabilities();
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Erreur lors de la suppression');
    }
  };

  const handleSwapRequest = async (availability: Availability) => {
    if (!confirm('Voulez-vous demander un échange pour cette disponibilité?')) return;

    try {
      const response = await fetch('/api/user/swap-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: user?.id,
          serviceId: availability.serviceId,
          date: availability.date,
          message: 'Demande d\'échange de service'
        }),
      });

      if (response.ok) {
        setMessage('Demande d\'échange envoyée!');
        loadSwapRequests();
      } else {
        setError('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Swap request error:', error);
      setError('Erreur lors de l\'envoi de la demande');
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
        setMessage(`Demande d'échange ${response === 'accepted' ? 'acceptée' : 'rejetée'}!`);
        loadSwapRequests();
        loadAvailabilities();
      } else {
        setError('Erreur lors de la réponse');
      }
    } catch (error) {
      console.error('Swap response error:', error);
      setError('Erreur lors de la réponse');
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
    <DashboardLayout 
      title="Gestion de Disponibilité"
      description="Gérez vos disponibilités et demandez des échanges"
    >

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{message}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
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
              <AvailabilityCalendar
                availabilities={availabilities}
                onAddAvailability={handleAddAvailability}
                onEditAvailability={handleEditAvailability}
                onDeleteAvailability={handleDelete}
              />
            )}
          </div>

          {/* Swap Requests */}
          <div className="space-y-6">
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
                {swapRequests.length === 0 ? (
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
                                        request.status === 'accepted' ? 'default' : 'destructive'}
                              >
                                {request.status === 'pending' ? 'En attente' :
                                 request.status === 'accepted' ? 'Acceptée' : 'Rejetée'}
                              </Badge>
                            </div>
                            <p className="font-medium">{request.serviceTitle}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.date).toLocaleDateString('fr-FR')}
                            </p>
                            {request.message && (
                              <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                            )}
                          </div>
                          {request.status === 'pending' && (
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
                                variant="outline"
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
        </div>
    </DashboardLayout>
  );
}
