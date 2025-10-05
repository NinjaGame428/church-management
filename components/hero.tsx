import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar, Users, Shield } from "lucide-react";
import React from "react";
import LogoCloud from "./logo-cloud";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center py-20 px-6">
      <div className="md:mt-6 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <Badge className="bg-primary rounded-full py-1 border-none">
            MVP Version Available! ⭐
          </Badge>
          <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
            Gestion Intelligente des Services d'Église
          </h1>
          <p className="mt-6 max-w-[60ch] xs:text-lg">
            Simplifiez la planification de vos services avec notre plateforme complète. 
            Gérez les intervenants, planifiez les services et coordonnez votre équipe 
            en toute simplicité.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full text-base"
            >
              Commencer <ArrowUpRight className="!h-5 !w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-base shadow-none"
            >
              <Calendar className="!h-5 !w-5" /> Voir le Calendrier
            </Button>
          </div>
        </div>
      </div>
      
      {/* Feature highlights */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="text-center p-6 bg-background border rounded-xl">
          <Calendar className="h-8 w-8 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Planification Simple</h3>
          <p className="text-sm text-muted-foreground">
            Créez et gérez vos services en quelques clics
          </p>
        </div>
        <div className="text-center p-6 bg-background border rounded-xl">
          <Users className="h-8 w-8 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Gestion des Intervenants</h3>
          <p className="text-sm text-muted-foreground">
            Assignez facilement les bonnes personnes aux bons services
          </p>
        </div>
        <div className="text-center p-6 bg-background border rounded-xl">
          <Shield className="h-8 w-8 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Sécurité & Accès</h3>
          <p className="text-sm text-muted-foreground">
            Contrôle d'accès sécurisé pour administrateurs et intervenants
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
