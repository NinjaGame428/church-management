import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="relative">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <div className="absolute inset-0 w-8 h-8 border-2 border-blue-200 rounded-full animate-pulse"></div>
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Chargement en cours...
            </h3>
            <p className="text-sm text-blue-700">
              Veuillez patienter pendant que nous préparons votre contenu.
            </p>
          </div>
          
          <div className="mt-6 w-full">
            <div className="bg-blue-50 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
