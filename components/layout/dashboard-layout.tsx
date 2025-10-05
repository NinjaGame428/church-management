"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import { cn } from "@/lib/utils";
import { NotificationProvider } from "@/components/notifications/notification-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function DashboardLayout({ 
  children, 
  title, 
  description 
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear any stored auth data
      localStorage.removeItem('auth-token');
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar 
          user={user} 
          onLogout={handleLogout}
        />
        
        {/* Main Content */}
        <div className="lg:ml-64 transition-all duration-300">
          <div className="min-h-screen">
            {/* Page Header */}
            {(title || description) && (
              <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  {title && (
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Page Content */}
            <main className="px-4 py-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}
