'use client';

import {
  Calendar,
  Users,
  UserCheck,
  Clock,
  User,
  Shield,
  Bell,
  Smartphone,
} from "lucide-react";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const features = [
  {
    icon: Calendar,
    title: "Gestion des Services/Quarts",
    description:
      "Créez des services (dimanche matin, mercredi soir, etc.) avec date, heure, lieu et rôles nécessaires. Modifiez et supprimez facilement.",
    priority: "⭐⭐⭐",
  },
  {
    icon: Calendar,
    title: "Calendrier Visuel",
    description:
      "Vue hebdomadaire et mensuelle avec codage couleur par département. Navigation simple entre les dates.",
    priority: "⭐⭐⭐",
  },
  {
    icon: Users,
    title: "Attribution des Intervenants",
    description:
      "Glisser-déposer des intervenants vers les services. Détection de conflits et gestion des attributions.",
    priority: "⭐⭐⭐",
  },
  {
    icon: UserCheck,
    title: "Gestion de Disponibilité",
    description:
      "Les intervenants marquent leurs disponibilités. Dates indisponibles (vacances) avec indicateurs visuels.",
    priority: "⭐⭐⭐",
  },
  {
    icon: User,
    title: "Profils Intervenants",
    description:
      "Nom, prénom, email, téléphone, départements (louange, son, enfants), compétences et contact d'urgence.",
    priority: "⭐⭐",
  },
  {
    icon: Shield,
    title: "Contrôle d'Accès",
    description:
      "Admin : Peut tout gérer. Intervenant : Voit son horaire, met à jour sa disponibilité. Connexion sécurisée.",
    priority: "⭐⭐⭐",
  },
  {
    icon: Bell,
    title: "Notifications de Base",
    description:
      "Notification quand assigné à un service, quand l'horaire est publié, et rappel 24h avant le service.",
    priority: "⭐⭐",
  },
  {
    icon: Smartphone,
    title: "Interface Mobile Responsive",
    description:
      "Fonctionne parfaitement sur smartphone avec tableau de bord simple et navigation tactile facile.",
    priority: "⭐⭐⭐",
  },
];

const Features = () => {
  const { t } = useLanguage();
  
  return (
    <div id="features" className="w-full py-8 sm:py-12 lg:py-20 px-4 sm:px-6">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
          Les 8 Fonctionnalités Essentielles
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Notre MVP comprend toutes les fonctionnalités indispensables pour une gestion efficace de vos services
        </p>
      </div>
      
      <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col bg-background border rounded-xl py-4 sm:py-6 px-4 sm:px-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center bg-primary/10 rounded-full">
                <feature.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-primary">{feature.priority}</span>
            </div>
            <span className="text-base sm:text-lg font-semibold mb-2">{feature.title}</span>
            <p className="text-foreground/80 text-sm sm:text-[15px] leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      
      {/* Nice to have section */}
      <div className="mt-16 sm:mt-20 text-center">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Fonctionnalités "Nice to Have" (Phase 2)</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
          À ajouter après le MVP : Publication automatisée, échange de quarts, intégration calendrier, 
          pointage, rapports et tableau d'annonces.
        </p>
      </div>
    </div>
  );
};

export default Features;
