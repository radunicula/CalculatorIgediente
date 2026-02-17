'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Istoric Rapoarte</h1>
        <p className="text-gray-600 mt-2">
          Vezi rapoartele generate în ultimele 7 zile
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rapoarte Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">În curs de implementare...</p>
        </CardContent>
      </Card>
    </div>
  );
}
