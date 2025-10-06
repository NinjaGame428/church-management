import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar, Users, Shield } from "lucide-react";
import React from "react";
import LogoCloud from "./logo-cloud";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center py-12 sm:py-20 px-4 sm:px-6">
      <div className="md:mt-6 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <Badge className="bg-primary rounded-full py-1 border-none text-xs sm:text-sm">
            {t('common.success')} Version Disponible! ⭐
          </Badge>
          <h1 className="mt-4 sm:mt-6 max-w-[20ch] text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold !leading-[1.2] tracking-tight">
            Impact Intervenant
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg max-w-[60ch] mx-auto">
            {t('dashboard.welcome')} au système de gestion des modérateurs. 
            Gérez les intervenants, planifiez les services et coordonnez votre équipe 
            en toute simplicité.
          </p>
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center sm:justify-center gap-3 sm:gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full text-sm sm:text-base"
              asChild
            >
              <Link href="/signup">
                {t('auth.createAccount')} <ArrowUpRight className="!h-4 !w-4 sm:!h-5 sm:!w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-sm sm:text-base shadow-none"
              asChild
            >
              <Link href="#dashboards">
                <Calendar className="!h-4 !w-4 sm:!h-5 sm:!w-5" /> {t('calendar.title')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Feature highlights */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
        <div className="text-center p-4 sm:p-6 bg-background border rounded-xl">
          <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4 text-primary" />
          <h3 className="font-semibold mb-2 text-sm sm:text-base">{t('services.title')}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('services.createService')} en quelques clics
          </p>
        </div>
        <div className="text-center p-4 sm:p-6 bg-background border rounded-xl">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4 text-primary" />
          <h3 className="font-semibold mb-2 text-sm sm:text-base">{t('users.title')}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('users.userManagement')} efficace
          </p>
        </div>
        <div className="text-center p-4 sm:p-6 bg-background border rounded-xl sm:col-span-2 lg:col-span-1">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4 text-primary" />
          <h3 className="font-semibold mb-2 text-sm sm:text-base">{t('users.admin')}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('users.userManagement')} sécurisé
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
