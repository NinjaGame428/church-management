"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Save, Plus, Trash2, User, Users } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  churchId?: string;
  assignments?: any[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  role: string;
}

interface UserAssignment {
  userId: string;
  role: string;
}

interface Church {
  id: string;
  name: string;
}

interface ServiceFormData {
  id?: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  assignments?: { userId: string; role: string }[];
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: ServiceFormData) => Promise<void>;
  service?: Service | null;
}

export default function ServiceModal({ 
  isOpen, 
  onClose, 
  onSave, 
  service
}: ServiceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'CANCELLED'
  });
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    userId: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description || '',
        date: service.date.split('T')[0], // Convert to YYYY-MM-DD format
        time: service.time,
        location: service.location,
        status: service.status
      });
      // Convert existing assignments to the new format
      if (service.assignments) {
        setAssignments(service.assignments.map((assignment: any) => ({
          userId: assignment.user.id,
          role: assignment.role
        })));
      }
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        status: 'DRAFT'
      });
      setAssignments([]);
    }
  }, [service]);

  // Load users when modal opens
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSave({
        ...formData,
        assignments
      } as ServiceFormData);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAssignment = () => {
    if (newAssignment.userId && newAssignment.role) {
      // Check if user is already assigned
      const isAlreadyAssigned = assignments.some(assignment => assignment.userId === newAssignment.userId);
      if (isAlreadyAssigned) {
        setError('Cet utilisateur est déjà assigné à ce service');
        return;
      }

      setAssignments(prev => [...prev, { ...newAssignment }]);
      setNewAssignment({ userId: '', role: '' });
      setError('');
    }
  };

  const handleRemoveAssignment = (userId: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.userId !== userId));
  };

  const getAvailableUsers = () => {
    const assignedUserIds = assignments.map(assignment => assignment.userId);
    return users.filter(user => !assignedUserIds.includes(user.id));
  };

  const getAssignedUser = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {service ? 'Modifier le service' : 'Créer un nouveau service'}
              </CardTitle>
              <CardDescription>
                {service ? 'Modifiez les informations du service' : 'Remplissez les informations du nouveau service'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Titre du service *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Service du dimanche matin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description du service..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Heure *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
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
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="PUBLISHED">Publié</SelectItem>
                    <SelectItem value="CANCELLED">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lieu *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ex: Salle principale, Église Saint-Pierre"
                required
              />
            </div>

            {/* User Assignments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <Label className="text-base font-medium">Assignation des intervenants</Label>
              </div>

              {/* Add New Assignment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="userSelect">Sélectionner un utilisateur</Label>
                  <Select 
                    value={newAssignment.userId} 
                    onValueChange={(value) => setNewAssignment(prev => ({ ...prev, userId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableUsers().map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roleSelect">Rôle</Label>
                  <Select 
                    value={newAssignment.role} 
                    onValueChange={(value) => setNewAssignment(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prédicateur">Prédicateur</SelectItem>
                      <SelectItem value="Musicien">Musicien</SelectItem>
                      <SelectItem value="Chantre">Chantre</SelectItem>
                      <SelectItem value="Accueil">Accueil</SelectItem>
                      <SelectItem value="Technique">Technique</SelectItem>
                      <SelectItem value="Enfants">Enfants</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    type="button" 
                    onClick={handleAddAssignment}
                    disabled={!newAssignment.userId || !newAssignment.role}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>

              {/* Current Assignments */}
              {assignments.length > 0 && (
                <div className="space-y-2">
                  <Label>Intervenants assignés</Label>
                  <div className="space-y-2">
                    {assignments.map((assignment) => {
                      const user = getAssignedUser(assignment.userId);
                      return (
                        <div key={assignment.userId} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="font-medium">
                                {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu'}
                              </span>
                              <Badge variant="secondary" className="ml-2">
                                {assignment.role}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAssignment(assignment.userId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Sauvegarde...' : (service ? 'Mettre à jour' : 'Créer')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
