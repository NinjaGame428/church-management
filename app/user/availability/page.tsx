"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    status: 'available' as 'available' | 'unavailable' | 'busy',
    notes: '',
    serviceId: ''
  });

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
      const response = await fetch('/api/user/availability');
      if (response.ok) {
        const data = await response.json();
        setAvailabilities(data);
      }
    } catch (error) {
      console.error('Error loading availabilities:', error);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const url = editingId ? `/api/user/availability/${editingId}` : '/api/user/availability';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          ...formData
        }),
      });

      if (response.ok) {
        setMessage(editingId ? 'Disponibilité mise à jour!' : 'Disponibilité ajoutée!');
        setShowAddForm(false);
        setEditingId(null);
        setFormData({
          date: '',
          startTime: '',
          endTime: '',
          status: 'available',
          notes: '',
          serviceId: ''
        });
        loadAvailabilities();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Availability error:', error);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      date: dateString
    }));
    setShowAddForm(true);
  };

  const handleEdit = (availability: Availability) => {
    setFormData({
      date: availability.date,
      startTime: availability.startTime,
      endTime: availability.endTime,
      status: availability.status,
      notes: availability.notes || '',
      serviceId: availability.serviceId || ''
    });
    setEditingId(availability.id);
    setShowAddForm(true);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/user/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold">Gestion de Disponibilité</h1>
          <p className="text-muted-foreground">Gérez vos disponibilités et demandez des échanges</p>
        </div>

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
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendrier
                </CardTitle>
                <CardDescription>
                  Cliquez sur une date pour ajouter votre disponibilité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Calendrier interactif</p>
                  <p className="text-sm">Cliquez sur une date pour ajouter votre disponibilité</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Availability Management */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Mes Disponibilités
                    </CardTitle>
                    <CardDescription>
                      Gérez vos créneaux de disponibilité
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Chargement...</p>
                  </div>
                ) : availabilities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune disponibilité enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availabilities.map((availability) => (
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
                              {availability.serviceTitle && (
                                <Badge variant="outline">{availability.serviceTitle}</Badge>
                              )}
                            </div>
                            <p className="font-medium">{new Date(availability.date).toLocaleDateString('fr-FR')}</p>
                            <p className="text-sm text-muted-foreground">
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
                              onClick={() => handleEdit(availability)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSwapRequest(availability)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDelete(availability.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add/Edit Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingId ? 'Modifier la disponibilité' : 'Ajouter une disponibilité'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Statut</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value) => handleInputChange('status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Disponible</SelectItem>
                            <SelectItem value="unavailable">Indisponible</SelectItem>
                            <SelectItem value="busy">Occupé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Heure de début</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => handleInputChange('startTime', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">Heure de fin</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => handleInputChange('endTime', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (optionnel)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Ajoutez des notes sur votre disponibilité..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingId ? 'Mettre à jour' : 'Ajouter'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingId(null);
                          setFormData({
                            date: '',
                            startTime: '',
                            endTime: '',
                            status: 'available',
                            notes: '',
                            serviceId: ''
                          });
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
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
      </div>
    </div>
  );
}
