'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecipesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rețete</h1>
        <p className="text-gray-600 mt-2">
          Gestionează rețetele disponibile
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Rețete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">În curs de implementare...</p>
        </CardContent>
      </Card>
    </div>
  );
}
