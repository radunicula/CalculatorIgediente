'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getRapoarte, getRetetaCuIngrediente } from '@/lib/supabase';
import { calculeazaRaport } from '@/lib/calculations';
import { Raport, RezultatCalcul, CategorieReteta, CATEGORII_MESE, CATEGORII_EMOJI } from '@/lib/types';
import { RaportPDF } from '@/components/pdf/RaportPDF';
import { pdf } from '@react-pdf/renderer';

const CATEGORII: CategorieReteta[] = ['mic_dejun', 'gustare1', 'ciorba', 'fel_doi', 'gustare2'];

export default function HistoryPage() {
  const [rapoarte, setRapoarte] = useState<Raport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRaport, setSelectedRaport] = useState<Raport | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rezultatCalcul, setRezultatCalcul] = useState<RezultatCalcul | null>(null);
  const [loadingCalcul, setLoadingCalcul] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState<number | null>(null);

  useEffect(() => {
    loadRapoarte();
  }, []);

  const loadRapoarte = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRapoarte(7);
      setRapoarte(data);
    } catch (err) {
      setError('Eroare la încărcarea rapoartelor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRetetaName = (raport: Raport, categorie: CategorieReteta): string => {
    const key = `${categorie}` as keyof Raport;
    const retetaData = raport[key];
    
    if (retetaData && typeof retetaData === 'object' && 'denumire' in retetaData) {
      return (retetaData as { denumire: string }).denumire;
    }
    return '-';
  };

  const handleViewDetails = async (raport: Raport) => {
    setSelectedRaport(raport);
    setModalOpen(true);
    setLoadingCalcul(true);
    setRezultatCalcul(null);

    try {
      const reteteMese = await Promise.all(
        CATEGORII.map(async (categorie) => {
          const retetaId = raport[`${categorie}_id`];
          if (retetaId === null) {
            return { categorie, reteta: null };
          }
          const reteta = await getRetetaCuIngrediente(retetaId as number);
          return { categorie, reteta };
        })
      );

      const rezultat = calculeazaRaport(reteteMese, raport.nr_portii);
      setRezultatCalcul(rezultat);
    } catch (err) {
      console.error('Eroare la calcularea raportului:', err);
      setError('Eroare la încărcarea detaliilor raportului');
    } finally {
      setLoadingCalcul(false);
    }
  };

  const handleGeneratePDF = async (raport: Raport) => {
    setGeneratingPDF(raport.id);

    try {
      const reteteMese = await Promise.all(
        CATEGORII.map(async (categorie) => {
          const retetaId = raport[`${categorie}_id`];
          if (retetaId === null) {
            return { categorie, reteta: null };
          }
          const reteta = await getRetetaCuIngrediente(retetaId as number);
          return { categorie, reteta };
        })
      );

      const rezultat = calculeazaRaport(reteteMese, raport.nr_portii);

      const blob = await pdf(
        <RaportPDF
          data={raport.data}
          numeBucatar={raport.nume_bucatar}
          nrPortii={raport.nr_portii}
          rezultat={rezultat}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `raport-${raport.data}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Eroare la generarea PDF-ului:', err);
      setError('Eroare la generarea PDF-ului');
    } finally {
      setGeneratingPDF(null);
    }
  };

  const handleDownloadPDFFromModal = async () => {
    if (!selectedRaport || !rezultatCalcul) return;

    try {
      const blob = await pdf(
        <RaportPDF
          data={selectedRaport.data}
          numeBucatar={selectedRaport.nume_bucatar}
          nrPortii={selectedRaport.nr_portii}
          rezultat={rezultatCalcul}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `raport-${selectedRaport.data}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Eroare la generarea PDF-ului:', err);
      setError('Eroare la generarea PDF-ului');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Istoric Rapoarte</h1>
        <p className="text-gray-600 mt-2">
          Vezi rapoartele generate în ultimele 7 zile
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rapoarte Recente</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Se încarcă rapoartele...
            </div>
          ) : rapoarte.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-2">📋 Nu există rapoarte</p>
              <p className="text-gray-400 text-sm">
                Rapoartele generate vor apărea aici pentru următoarele 7 zile
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rapoarte.map((raport) => (
                <Card key={raport.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📅</span>
                          <h3 className="text-lg font-semibold">
                            {formatDate(raport.data)}
                          </h3>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 ml-9">
                          <p>
                            <span className="font-medium">Bucătar:</span> {raport.nume_bucatar}
                          </p>
                          <p>
                            <span className="font-medium">Nr. Porții:</span> {raport.nr_portii}
                          </p>
                        </div>
                        <div className="ml-9 mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Rețete selectate:</p>
                          <div className="space-y-1">
                            {CATEGORII.map((categorie) => {
                              const nume = getRetetaName(raport, categorie);
                              if (nume === '-') return null;
                              return (
                                <div key={categorie} className="text-sm text-gray-600">
                                  <span className="mr-2">{CATEGORII_EMOJI[categorie]}</span>
                                  <span className="font-medium">{CATEGORII_MESE[categorie]}:</span>{' '}
                                  {nume}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:min-w-[200px]">
                        <Button
                          onClick={() => handleViewDetails(raport)}
                          variant="outline"
                          className="w-full"
                        >
                          👁️ Vezi Detalii
                        </Button>
                        <Button
                          onClick={() => handleGeneratePDF(raport)}
                          disabled={generatingPDF === raport.id}
                          className="w-full"
                        >
                          {generatingPDF === raport.id ? 'Se generează...' : '📄 Descarcă PDF'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalii Raport</DialogTitle>
          </DialogHeader>

          {selectedRaport && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Data</p>
                  <p className="text-gray-900">{formatDate(selectedRaport.data)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Bucătar</p>
                  <p className="text-gray-900">{selectedRaport.nume_bucatar}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Nr. Porții</p>
                  <p className="text-gray-900">{selectedRaport.nr_portii}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Rețete</h3>
                <div className="space-y-1 text-sm">
                  {CATEGORII.map((categorie) => (
                    <div key={categorie} className="flex items-start gap-2">
                      <span>{CATEGORII_EMOJI[categorie]}</span>
                      <span className="font-medium min-w-[140px]">{CATEGORII_MESE[categorie]}:</span>
                      <span className="text-gray-700">{getRetetaName(selectedRaport, categorie)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {loadingCalcul ? (
                <div className="text-center py-8 text-gray-500">
                  Se calculează ingredientele și macronutrienții...
                </div>
              ) : rezultatCalcul ? (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Ingrediente Necesare</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Denumire</TableHead>
                            <TableHead className="text-right">Cantitate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rezultatCalcul.ingrediente.map((ing, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{ing.ingredient.denumire}</TableCell>
                              <TableCell className="text-right">
                                {ing.cantitate_raport} {ing.unitate_raport}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Macronutrienți per Porție</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Masă</TableHead>
                            <TableHead>Preparat</TableHead>
                            <TableHead className="text-right">Calorii</TableHead>
                            <TableHead className="text-right">Prot. (g)</TableHead>
                            <TableHead className="text-right">Gluc. (g)</TableHead>
                            <TableHead className="text-right">Grăs. (g)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rezultatCalcul.macronutrienti.map((masa, idx) => (
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
                            <TableCell className="text-right">{rezultatCalcul.total_macronutrienti.calorii}</TableCell>
                            <TableCell className="text-right">{rezultatCalcul.total_macronutrienti.proteine}</TableCell>
                            <TableCell className="text-right">{rezultatCalcul.total_macronutrienti.glucide}</TableCell>
                            <TableCell className="text-right">{rezultatCalcul.total_macronutrienti.grasimi}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Închide
            </Button>
            <Button onClick={handleDownloadPDFFromModal} disabled={!rezultatCalcul}>
              📄 Descarcă PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
