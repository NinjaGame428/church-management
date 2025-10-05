"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import ServiceModal from "@/components/admin/service-modal";

interface Service {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  churchId?: string;
  assignments: {
    id: string;
    role: string;
    status: 'PENDING' | 'CONFIRMED' | 'DECLINED';
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  church: {
    id: string;
    name: string;
  };
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        setError('Erreur lors du chargement des services');
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setError('Erreur lors du chargement des services');
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service?')) return;

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Service supprimé avec succès');
        loadServices();
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete service error:', error);
      setError('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (serviceId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setMessage(`Service ${newStatus === 'PUBLISHED' ? 'publié' : 'dépublié'}`);
        loadServices();
      } else {
        setError('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const handleCreateService = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleSaveService = async (serviceData: Partial<Service>) => {
    try {
      const url = editingService 
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services';
      
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      });

      if (response.ok) {
        setMessage(editingService ? 'Service mis à jour!' : 'Service créé!');
        setShowModal(false);
        setEditingService(null);
        loadServices();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Save service error:', error);
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'Publié';
      case 'DRAFT': return 'Brouillon';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Gestion des Services"
        description="Gérez les services et leurs assignations"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des services...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Gestion des Services"
      description="Gérez les services et leurs assignations"
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
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          <Button onClick={handleCreateService}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un service
          </Button>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucun service trouvé</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Aucun service ne correspond à votre recherche' : 'Aucun service créé'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {service.title}
                      </CardTitle>
                      <CardDescription>
                        {service.church.name} • {new Date(service.date).toLocaleDateString('fr-FR')} à {service.time}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(service.status)}>
                        {getStatusText(service.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Service Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{service.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{service.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{service.assignments.length} intervenant{service.assignments.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {service.description && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    )}

                    {/* Assignments */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Assignations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {service.assignments.map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {assignment.status === 'CONFIRMED' && <CheckCircle className="h-4 w-4 text-green-600" />}
                                {assignment.status === 'PENDING' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                                {assignment.status === 'DECLINED' && <XCircle className="h-4 w-4 text-red-600" />}
                                <span className="text-sm font-medium">
                                  {assignment.user.firstName} {assignment.user.lastName}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">({assignment.role})</span>
                            </div>
                            <Badge 
                              variant={assignment.status === 'CONFIRMED' ? 'default' : 
                                      assignment.status === 'PENDING' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {assignment.status === 'CONFIRMED' ? 'Confirmé' :
                               assignment.status === 'PENDING' ? 'En attente' : 'Refusé'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(service.id, service.status)}
                      >
                        {service.status === 'PUBLISHED' ? 'Dépublier' : 'Publier'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        service={editingService}
      />
    </DashboardLayout>
  );
}
