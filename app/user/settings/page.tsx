"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  Bell, 
  Shield, 
  Key,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/AuthContext";

export default function UserSettings() {
  const { user, updateUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
    bio: user?.bio || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      email: true,
      sms: false,
      push: true,
      services: true,
      availability: true,
      swaps: true
    }
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        bio: user.bio || ""
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          bio: formData.bio
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        setMessage('Profil mis à jour avec succès!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout 
      title="Paramètres"
      description="Gérez vos informations personnelles et préférences"
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
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Personnelles
            </CardTitle>
            <CardDescription>
              Mettez à jour vos informations de profil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleInputChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Louange">Louange</SelectItem>
                    <SelectItem value="Son">Son</SelectItem>
                    <SelectItem value="Lumières">Lumières</SelectItem>
                    <SelectItem value="Accueil">Accueil</SelectItem>
                    <SelectItem value="Enfants">Enfants</SelectItem>
                    <SelectItem value="Jeunesse">Jeunesse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Parlez-nous de vous..."
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Gérez votre mot de passe et la sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              />
            </div>

            <Button variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications par email
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.email}
                  onCheckedChange={(checked: boolean) => handleNotificationChange('email', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications par SMS
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.sms}
                  onCheckedChange={(checked: boolean) => handleNotificationChange('sms', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications push sur votre appareil
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.push}
                  onCheckedChange={(checked: boolean) => handleNotificationChange('push', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Types de notifications</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nouveaux services</Label>
                    <p className="text-sm text-muted-foreground">
                      Quand vous êtes assigné à un nouveau service
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.services}
                    onCheckedChange={(checked: boolean) => handleNotificationChange('services', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Changements de disponibilité</Label>
                    <p className="text-sm text-muted-foreground">
                      Quand votre disponibilité change
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.availability}
                    onCheckedChange={(checked: boolean) => handleNotificationChange('availability', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Demandes d'échange</Label>
                    <p className="text-sm text-muted-foreground">
                      Quand vous recevez une demande d'échange
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.swaps}
                    onCheckedChange={(checked: boolean) => handleNotificationChange('swaps', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}