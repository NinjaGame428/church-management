"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  churchId?: string;
}

interface Church {
  id: string;
  name: string;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Partial<Service>) => Promise<void>;
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
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        status: 'DRAFT'
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSave(formData);
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
