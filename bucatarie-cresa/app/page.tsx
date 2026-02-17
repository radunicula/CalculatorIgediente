'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Raport Zilnic Bucătărie</h1>
        <p className="text-gray-600 mt-2">
          Generează raportul zilnic cu ingredientele folosite și macronutrienții
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formular Raport</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">În curs de implementare...</p>
        </CardContent>
      </Card>
    </div>
  );
}
