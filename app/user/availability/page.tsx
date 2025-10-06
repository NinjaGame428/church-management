"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
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


export default function AvailabilityPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load availabilities
  useEffect(() => {
    if (user) {
      loadAvailabilities();
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

        <div className="grid grid-cols-1 gap-6">
          {/* Calendar View */}
          <div>
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
        </div>
    </DashboardLayout>
  );
}
