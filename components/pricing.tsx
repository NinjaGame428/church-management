"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleHelp } from "lucide-react";
import { useState } from "react";

const tooltipContent = {
  services: "Nombre maximum de services que vous pouvez créer par mois.",
  users: "Nombre d'intervenants qui peuvent utiliser la plateforme.",
  support: "Niveau de support technique disponible.",
  storage: "Espace de stockage pour vos données et documents.",
};

const YEARLY_DISCOUNT = 20;
const plans = [
  {
    name: "Débutant",
    price: 0,
    description:
      "Parfait pour les petites églises qui commencent leur digitalisation.",
    features: [
      { title: "Jusqu'à 5 services par mois" },
      { title: "Jusqu'à 20 intervenants" },
      { title: "Calendrier de base" },
      { title: "Notifications email" },
      { title: "Support par email" },
    ],
    buttonText: "Commencer Gratuitement",
  },
  {
    name: "Professionnel",
    price: 29,
    isRecommended: true,
    description:
      "Idéal pour les églises moyennes avec une équipe active.",
    features: [
      { title: "Services illimités" },
      { title: "Jusqu'à 100 intervenants" },
      { title: "Toutes les fonctionnalités MVP" },
      { title: "Notifications avancées" },
      { title: "Support prioritaire" },
      { title: "Formation en ligne" },
    ],
    buttonText: "Essayer 14 jours",
    isPopular: true,
  },
  {
    name: "Église",
    price: 59,
    description:
      "Pour les grandes églises avec plusieurs départements.",
    features: [
      { title: "Tout du plan Professionnel" },
      { title: "Intervenants illimités" },
      { title: "Multi-départements" },
      { title: "Rapports avancés" },
      { title: "Support téléphonique" },
      { title: "Formation personnalisée" },
      { title: "Intégrations calendrier" },
    ],
    buttonText: "Contacter les Ventes",
  },
];

const Pricing = () => {
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("monthly");

  return (
    <div
      id="pricing"
      className="flex flex-col items-center justify-center py-12 xs:py-20 px-6"
    >
      <h1 className="text-3xl xs:text-4xl md:text-5xl font-bold text-center tracking-tight">
        Tarifs
      </h1>
      <p className="mt-4 text-lg text-muted-foreground text-center max-w-2xl">
        Choisissez le plan qui correspond à la taille de votre église
      </p>
      <Tabs
        value={selectedBillingPeriod}
        onValueChange={setSelectedBillingPeriod}
        className="mt-8"
      >
        <TabsList className="h-11 px-1.5 rounded-full bg-primary/5">
          <TabsTrigger value="monthly" className="py-1.5 rounded-full">
            Mensuel
          </TabsTrigger>
          <TabsTrigger value="yearly" className="py-1.5 rounded-full">
            Annuel (Économisez {YEARLY_DISCOUNT}%)
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-12 max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn("relative border rounded-xl p-6 bg-background/50", {
              "border-[2px] border-primary bg-background py-10": plan.isPopular,
            })}
          >
            {plan.isPopular && (
              <Badge className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                Plus Populaire
              </Badge>
            )}
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="mt-2 text-4xl font-bold">
              {plan.price === 0 ? (
                "Gratuit"
              ) : (
                <>
                  {selectedBillingPeriod === "monthly"
                    ? plan.price
                    : Math.round(plan.price * ((100 - YEARLY_DISCOUNT) / 100))}
                  €
                  <span className="ml-1.5 text-sm text-muted-foreground font-normal">
                    /mois
                  </span>
                </>
              )}
            </p>
            <p className="mt-4 font-medium text-muted-foreground">
              {plan.description}
            </p>

            <Button
              variant={plan.isPopular ? "default" : "outline"}
              size="lg"
              className="w-full mt-6 text-base"
            >
              {plan.buttonText}
            </Button>
            <Separator className="my-8" />
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature.title} className="flex items-start gap-1.5">
                  <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                  {feature.title}
                  {feature.tooltip && (
                    <Tooltip>
                      <TooltipTrigger className="cursor-help">
                        <CircleHelp className="h-4 w-4 mt-1 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>{feature.tooltip}</TooltipContent>
                    </Tooltip>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
