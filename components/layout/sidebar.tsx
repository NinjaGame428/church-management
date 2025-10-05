"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Settings, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  FileText,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/components/notifications/notification-provider";

interface SidebarProps {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department?: string;
  };
  onLogout?: () => void;
}

const getNavigationItems = (unreadCount: number) => [
  {
    title: "Tableau de bord",
    href: "/user/dashboard",
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: "Calendrier",
    href: "/calendar",
    icon: Calendar,
    badge: null
  },
  {
    title: "Ma Disponibilité",
    href: "/user/availability",
    icon: Clock,
    badge: null
  },
  {
    title: "Mes Services",
    href: "/user/services",
    icon: FileText,
    badge: null
  },
  {
    title: "Notifications",
    href: "/user/notifications",
    icon: Bell,
    badge: unreadCount > 0 ? unreadCount.toString() : null
  },
  {
    title: "Paramètres",
    href: "/user/settings",
    icon: Settings,
    badge: null
  }
];

const adminNavigationItems = [
  {
    title: "Administration",
    href: "/admin/dashboard",
    icon: BarChart3,
    badge: null
  },
  {
    title: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
    badge: null
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Calendar,
    badge: null
  },
  {
    title: "Calendrier",
    href: "/admin/calendar",
    icon: Calendar,
    badge: null
  },
  {
    title: "Disponibilités",
    href: "/admin/availabilities",
    icon: Clock,
    badge: null
  },
  {
    title: "Demandes d'Échange",
    href: "/admin/swap-requests",
    icon: RefreshCw,
    badge: null
  },
  {
    title: "Rapports",
    href: "/admin/reports",
    icon: BarChart3,
    badge: null
  },
  {
    title: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
    badge: null
  }
];

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  const isAdmin = user?.role === 'ADMIN';
  const navigation = isAdmin ? adminNavigationItems : getNavigationItems(unreadCount);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary-foreground"
                  >
                    <path
                      d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">ChurchManager</h1>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin ? "Administration" : "Tableau de bord"}
                  </p>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              {!isCollapsed ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                    {user.department && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {user.department}
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-gray-100",
                    isActive 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "text-gray-700"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={isActive ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full justify-start text-gray-700 hover:bg-gray-100",
                isCollapsed && "justify-center px-2"
              )}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Déconnexion</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
