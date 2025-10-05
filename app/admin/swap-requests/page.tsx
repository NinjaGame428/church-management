"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Calendar,
  MapPin
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";

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
  service: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
  };
  date: string;
  status: string;
  message?: string;
  createdAt: string;
}

export default function AdminSwapRequests() {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadSwapRequests();
  }, []);

  const loadSwapRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/swap-requests');
      if (response.ok) {
        const data = await response.json();
        setSwapRequests(data);
      } else {
        setError('Erreur lors du chargement des demandes d\'échange');
      }
    } catch (error) {
      console.error('Error loading swap requests:', error);
      setError('Erreur lors du chargement des demandes d\'échange');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSwap = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/swap-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'admin_approved' })
      });

      if (response.ok) {
        setMessage('Échange approuvé avec succès');
        loadSwapRequests();
      } else {
        setError('Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('Approve swap error:', error);
      setError('Erreur lors de l\'approbation');
    }
  };

  const handleRejectSwap = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/swap-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'admin_rejected' })
      });

      if (response.ok) {
        setMessage('Échange rejeté');
        loadSwapRequests();
      } else {
        setError('Erreur lors du rejet');
      }
    } catch (error) {
      console.error('Reject swap error:', error);
      setError('Erreur lors du rejet');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-yellow-100 text-yellow-800';
      case 'admin_approved': return 'bg-green-100 text-green-800';
      case 'admin_rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'En attente d\'approbation admin';
      case 'admin_approved': return 'Approuvé par l\'admin';
      case 'admin_rejected': return 'Rejeté par l\'admin';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Demandes d'Échange"
        description="Gérez les demandes d'échange de services"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des demandes d'échange...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Demandes d'Échange"
      description="Gérez les demandes d'échange de services"
    >
      <div className="space-y-6">
        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{message}</p>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Demandes d'Échange en Attente</h2>
            <p className="text-sm text-muted-foreground">
              {swapRequests.length} demande{swapRequests.length > 1 ? 's' : ''} en attente d'approbation
            </p>
          </div>
          <Button onClick={loadSwapRequests} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Swap Requests List */}
        <div className="space-y-4">
          {swapRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucune demande d'échange</h3>
                <p className="text-muted-foreground">
                  Aucune demande d'échange en attente d'approbation
                </p>
              </CardContent>
            </Card>
          ) : (
            swapRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5" />
                        Demande d'Échange
                      </CardTitle>
                      <CardDescription>
                        {request.service.title} • {new Date(request.service.date).toLocaleDateString('fr-FR')}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusText(request.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Service Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.service.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.service.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(request.service.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {/* User Exchange Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-red-600">Utilisateur qui demande l'échange</h4>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {request.fromUser.firstName} {request.fromUser.lastName}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{request.fromUser.email}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-green-600">Utilisateur qui accepte l'échange</h4>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {request.toUser.firstName} {request.toUser.lastName}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{request.toUser.email}</p>
                      </div>
                    </div>

                    {request.message && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Message</h4>
                        <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                          {request.message}
                        </p>
                      </div>
                    )}

                    {/* Admin Actions */}
                    {request.status === 'accepted' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          onClick={() => handleApproveSwap(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approuver l'échange
                        </Button>
                        <Button
                          onClick={() => handleRejectSwap(request.id)}
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rejeter l'échange
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
