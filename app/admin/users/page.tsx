"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  Shield,
  UserCheck,
  UserX
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import UserModal from "@/components/admin/user-modal";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  lastLogin?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Utilisateur supprimé avec succès');
        loadUsers();
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      setError('Erreur lors de la suppression');
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        setMessage(`Rôle mis à jour vers ${newRole === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}`);
        loadUsers();
      } else {
        setError('Erreur lors de la mise à jour du rôle');
      }
    } catch (error) {
      console.error('Toggle role error:', error);
      setError('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleSaveUser = async (userData: Partial<User> & { password?: string }) => {
    try {
      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        setMessage(editingUser ? 'Utilisateur mis à jour!' : 'Utilisateur créé!');
        setShowModal(false);
        setEditingUser(null);
        loadUsers();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Save user error:', error);
      throw error;
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Gestion des Utilisateurs"
        description="Gérez les utilisateurs et leurs rôles"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Gestion des Utilisateurs"
      description="Gérez les utilisateurs et leurs rôles"
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
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          <Button onClick={handleCreateUser}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Utilisateurs ({filteredUsers.length})
            </CardTitle>
            <CardDescription>
              Liste de tous les utilisateurs de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucun utilisateur trouvé</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Aucun utilisateur ne correspond à votre recherche' : 'Aucun utilisateur enregistré'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">
                            {user.firstName} {user.lastName}
                          </h4>
                          <Badge 
                            variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                          >
                            {user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                          {user.department && (
                            <span>{user.department}</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          {user.lastLogin && (
                            <span> • Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleRole(user.id, user.role)}
                      >
                        {user.role === 'ADMIN' ? (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Rétrograder
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Promouvoir
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </DashboardLayout>
  );
}
