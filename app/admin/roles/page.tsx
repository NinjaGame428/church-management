"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Palette,
  Save,
  X
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";

interface ServiceRole {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminRoles() {
  const [roles, setRoles] = useState<ServiceRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<ServiceRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      } else {
        setError('Erreur lors du chargement des rôles');
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      setError('Erreur lors du chargement des rôles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setShowModal(true);
  };

  const handleEditRole = (role: ServiceRole) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      color: role.color
    });
    setShowModal(true);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingRole 
        ? `/api/admin/roles/${editingRole.id}`
        : '/api/admin/roles';
      
      const method = editingRole ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(editingRole ? 'Rôle mis à jour!' : 'Rôle créé!');
        setShowModal(false);
        setEditingRole(null);
        loadRoles();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Save role error:', error);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rôle?')) return;

    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Rôle supprimé avec succès');
        loadRoles();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete role error:', error);
      setError('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (roleId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setMessage(`Rôle ${!currentStatus ? 'activé' : 'désactivé'}`);
        loadRoles();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      setError('Erreur lors de la mise à jour');
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Gestion des Rôles"
        description="Créez et gérez les rôles pour les services"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des rôles...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Gestion des Rôles"
      description="Créez et gérez les rôles pour les services"
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
              <Input
                placeholder="Rechercher un rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
          <Button onClick={handleCreateRole}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un rôle
          </Button>
        </div>

        {/* Roles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucun rôle trouvé</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Aucun rôle ne correspond à votre recherche' : 'Aucun rôle créé'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: role.color }}
                      />
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                    </div>
                    <Badge variant={role.isActive ? "default" : "secondary"}>
                      {role.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  {role.description && (
                    <CardDescription>{role.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(role.id, role.isActive)}
                    >
                      {role.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Role Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    {editingRole ? 'Modifier le rôle' : 'Créer un nouveau rôle'}
                  </CardTitle>
                  <CardDescription>
                    {editingRole ? 'Modifiez les informations du rôle' : 'Remplissez les informations du nouveau rôle'}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveRole} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nom du rôle *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Louange, Son, Accueil"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description du rôle..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Couleur</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingRole ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
