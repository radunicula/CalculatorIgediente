'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getRetete, getRetetaCuIngrediente, saveRaport } from '@/lib/supabase';
import { calculeazaRaport } from '@/lib/calculations';
import { 
  Reteta, 
  RaportFormState, 
  RezultatCalcul, 
  CategorieReteta,
  CATEGORII_MESE,
  CATEGORII_EMOJI 
} from '@/lib/types';
import { RaportPDF } from '@/components/pdf/RaportPDF';
import { pdf } from '@react-pdf/renderer';

const CATEGORII: CategorieReteta[] = ['mic_dejun', 'gustare1', 'ciorba', 'fel_doi', 'gustare2'];

export default function Home() {
  const [retete, setRetete] = useState<Record<CategorieReteta, Reteta[]>>({
    mic_dejun: [],
    gustare1: [],
    ciorba: [],
    fel_doi: [],
    gustare2: []
  });
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<RaportFormState>({
    data: new Date().toISOString().split('T')[0],
    nume_bucatar: '',
    nr_portii: 1,
    mic_dejun_id: null,
    gustare1_id: null,
    ciorba_id: null,
    fel_doi_id: null,
    gustare2_id: null
  });

  const [rezultat, setRezultat] = useState<RezultatCalcul | null>(null);

  useEffect(() => {
    loadRetete();
  }, []);

  const loadRetete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const reteteListe = await Promise.all(
        CATEGORII.map(categorie => getRetete(categorie))
      );

      const newRetete: Record<CategorieReteta, Reteta[]> = {
        mic_dejun: reteteListe[0],
        gustare1: reteteListe[1],
        ciorba: reteteListe[2],
        fel_doi: reteteListe[3],
        gustare2: reteteListe[4]
      };

      setRetete(newRetete);
    } catch (err) {
      setError('Eroare la încărcarea rețetelor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nr_portii' ? (parseInt(value) || 1) : 
              name.endsWith('_id') ? (value === '' ? null : parseInt(value)) : 
              value
    }));
  };

  const handleCalculate = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!formData.nume_bucatar.trim()) {
      setError('Te rog introdu numele bucătarului');
      return;
    }

    if (formData.nr_portii < 1) {
      setError('Numărul de porții trebuie să fie minim 1');
      return;
    }

    const hasAtLeastOneRecipe = CATEGORII.some(
      cat => formData[`${cat}_id` as keyof RaportFormState] !== null
    );

    if (!hasAtLeastOneRecipe) {
      setError('Selectează cel puțin o rețetă');
      return;
    }

    try {
      setCalculating(true);
      
      const reteteMese = await Promise.all(
        CATEGORII.map(async (categorie) => {
          const retetaId = formData[`${categorie}_id` as keyof RaportFormState];
          if (retetaId === null) {
            return { categorie, reteta: null };
          }
          const reteta = await getRetetaCuIngrediente(retetaId as number);
          return { categorie, reteta };
        })
      );

      const rezultatCalcul = calculeazaRaport(reteteMese, formData.nr_portii);
      setRezultat(rezultatCalcul);
    } catch (err) {
      setError('Eroare la calcularea raportului');
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const handleSaveRaport = async () => {
    if (!rezultat) return;

    setError(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      await saveRaport({
        data: formData.data,
        nume_bucatar: formData.nume_bucatar,
        nr_portii: formData.nr_portii,
        mic_dejun_id: formData.mic_dejun_id,
        gustare1_id: formData.gustare1_id,
        ciorba_id: formData.ciorba_id,
        fel_doi_id: formData.fel_doi_id,
        gustare2_id: formData.gustare2_id
      });
      setSuccessMessage('Raport salvat cu succes!');
    } catch (err) {
      setError('Eroare la salvarea raportului');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!rezultat) return;

    try {
      const blob = await pdf(
        <RaportPDF
          data={formData.data}
          numeBucatar={formData.nume_bucatar}
          nrPortii={formData.nr_portii}
          rezultat={rezultat}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `raport-${formData.data}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Eroare la generarea PDF-ului');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Raport Zilnic Bucătărie</h1>
        <p className="text-gray-600 mt-2">
          Generează raportul zilnic cu ingredientele folosite și macronutrienții
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Formular Raport</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Se încarcă...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data *
                  </label>
                  <Input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume Bucătar *
                  </label>
                  <Input
                    type="text"
                    name="nume_bucatar"
                    value={formData.nume_bucatar}
                    onChange={handleInputChange}
                    placeholder="Numele bucătarului"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nr. Porții *
                  </label>
                  <Input
                    type="number"
                    name="nr_portii"
                    value={formData.nr_portii}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Selectează Rețetele</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CATEGORII.map((categorie) => (
                    <div key={categorie}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {CATEGORII_EMOJI[categorie]} {CATEGORII_MESE[categorie]}
                      </label>
                      <Select
                        name={`${categorie}_id`}
                        value={formData[`${categorie}_id` as keyof RaportFormState]?.toString() || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Nicio rețetă</option>
                        {retete[categorie].map((reteta) => (
                          <option key={reteta.id} value={reteta.id}>
                            {reteta.denumire}
                          </option>
                        ))}
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleCalculate}
                  disabled={calculating}
                  className="flex-1"
                >
                  {calculating ? 'Se calculează...' : '🧮 Calculează'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {rezultat && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Ingrediente Necesare</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Denumire</TableHead>
                    <TableHead className="text-right">Cantitate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rezultat.ingrediente.map((ing, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{ing.ingredient.denumire}</TableCell>
                      <TableCell className="text-right">
                        {ing.cantitate_raport} {ing.unitate_raport}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Macronutrienți per Porție</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Masă</TableHead>
                    <TableHead>Preparat</TableHead>
                    <TableHead className="text-right">Calorii</TableHead>
                    <TableHead className="text-right">Proteine (g)</TableHead>
                    <TableHead className="text-right">Glucide (g)</TableHead>
                    <TableHead className="text-right">Grăsimi (g)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rezultat.macronutrienti.map((masa, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{masa.masa}</TableCell>
                      <TableCell>{masa.denumire_reteta}</TableCell>
                      <TableCell className="text-right">{masa.calorii}</TableCell>
                      <TableCell className="text-right">{masa.proteine}</TableCell>
                      <TableCell className="text-right">{masa.glucide}</TableCell>
                      <TableCell className="text-right">{masa.grasimi}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-50">
                    <TableCell colSpan={2}>TOTAL</TableCell>
                    <TableCell className="text-right">{rezultat.total_macronutrienti.calorii}</TableCell>
                    <TableCell className="text-right">{rezultat.total_macronutrienti.proteine}</TableCell>
                    <TableCell className="text-right">{rezultat.total_macronutrienti.glucide}</TableCell>
                    <TableCell className="text-right">{rezultat.total_macronutrienti.grasimi}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              onClick={handleSaveRaport}
              disabled={saving}
              className="flex-1"
              variant="outline"
            >
              {saving ? 'Se salvează...' : '💾 Salvează Raport'}
            </Button>
            <Button
              onClick={handleGeneratePDF}
              className="flex-1"
            >
              📄 Generează PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
