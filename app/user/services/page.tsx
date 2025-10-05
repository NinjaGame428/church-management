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
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceAssignment {
  id: string;
  role: string;
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED';
  service: {
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
  };
}

export default function UserServices() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<ServiceAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadUserServices();
    }
  }, [user?.id]);

  const loadUserServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/services?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du chargement des services');
      }
    } catch (error) {
      console.error('Error loading user services:', error);
      setError('Erreur lors du chargement des services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignmentAction = async (assignmentId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch(`/api/user/service-assignments/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setMessage(action === 'accept' ? 'Service accepté!' : 'Service décliné!');
        loadUserServices();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      setError('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 border-green-300 text-green-800';
      case 'DECLINED': return 'bg-red-100 border-red-300 text-red-800';
      case 'PENDING': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmé';
      case 'DECLINED': return 'Décliné';
      case 'PENDING': return 'En attente';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />;
      case 'DECLINED': return <XCircle className="h-4 w-4" />;
      case 'PENDING': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 border-green-300 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getServiceStatusText = (status: string) => {
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
        title="Mes Services"
        description="Services qui vous sont assignés"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement de vos services...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Mes Services"
      description="Services qui vous sont assignés"
    >
      <div className="space-y-6">
        {/* Messages */}
        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{message}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Services List */}
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service assigné</h3>
              <p className="text-muted-foreground">
                Vous n'avez pas encore de services assignés. Les administrateurs vous assigneront des services selon vos disponibilités.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {assignment.service.title}
                        <Badge className={getServiceStatusColor(assignment.service.status)}>
                          {getServiceStatusText(assignment.service.status)}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Rôle: {assignment.role}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(assignment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(assignment.status)}
                          {getStatusText(assignment.status)}
                        </div>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Service Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Date:</span>
                        <span>{format(new Date(assignment.service.date), 'dd MMMM yyyy', { locale: fr })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Heure:</span>
                        <span>{assignment.service.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Lieu:</span>
                        <span>{assignment.service.location}</span>
                      </div>
                    </div>

                    {assignment.service.description && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Description:</span> {assignment.service.description}
                        </p>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Église:</span> {assignment.service.church.name}
                    </div>

                    {/* Action Buttons for Pending Assignments */}
                    {assignment.status === 'PENDING' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          onClick={() => handleAssignmentAction(assignment.id, 'accept')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAssignmentAction(assignment.id, 'decline')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Décliner
                        </Button>
                      </div>
                    )}

                    {/* Status Message for Confirmed/Declined */}
                    {assignment.status === 'CONFIRMED' && (
                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                        <CheckCircle className="h-4 w-4" />
                        <span>Vous participez à ce service</span>
                      </div>
                    )}

                    {assignment.status === 'DECLINED' && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                        <XCircle className="h-4 w-4" />
                        <span>Vous avez décliné ce service</span>
                      </div>
                    )}
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