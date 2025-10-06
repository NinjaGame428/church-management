import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Impact Intervenant - Système de gestion des modérateurs",
  description:
    "Plateforme complète de gestion des modérateurs et intervenants. Gérez les services, planifiez les interventions et coordonnez votre équipe en toute simplicité.",
  keywords: [
    "Impact Intervenant",
    "Gestion Modérateurs",
    "Système Gestion",
    "Intervenants",
    "Modérateurs",
    "Planification Services",
    "Gestion Équipe",
    "Calendrier",
    "Organisation",
    "Administration",
    "Plateforme Digitale",
    "Outils Gestion"
  ],
  openGraph: {
    type: "website",
    siteName: "Impact Intervenant",
    locale: "fr_FR",
    url: "https://impact-intervenant.vercel.app",
    title: "Impact Intervenant - Système de gestion des modérateurs",
    description:
      "Plateforme complète de gestion des modérateurs et intervenants pour une organisation optimale de vos services.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Impact Intervenant - Système de gestion des modérateurs",
      },
    ],
  },
  authors: [
    {
      name: "Impact Intervenant",
      url: "https://impact-intervenant.vercel.app",
    },
  ],
  creator: "Impact Intervenant",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-32x32.png",
      sizes: "32x32",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-16x16.png",
      sizes: "16x16",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/android-chrome-512x512.png",
      sizes: "512x512",
    },
  ],
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <AuthProvider>
              <NotificationProvider>
                <TooltipProvider>
                  {children}
                  <Toaster />
                </TooltipProvider>
              </NotificationProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
