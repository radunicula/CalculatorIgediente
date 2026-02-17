'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  getRetete,
  getRetetaCuIngrediente,
  createReteta,
  updateReteta,
  deleteReteta,
  getIngrediente,
  addIngredientToReteta,
  removeIngredientFromReteta,
  updateIngredientInReteta,
} from '@/lib/supabase';
import {
  Reteta,
  RetetaCreate,
  RetetaCuIngrediente,
  Ingredient,
  CategorieReteta,
  CATEGORII_MESE,
  CATEGORII_EMOJI,
} from '@/lib/types';

type DialogMode = 'add' | 'edit' | 'delete' | 'ingredients' | null;

export default function RecipesPage() {
  const [retete, setRetete] = useState<Reteta[]>([]);
  const [ingrediente, setIngrediente] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedReteta, setSelectedReteta] = useState<Reteta | null>(null);
  const [retetaCuIngrediente, setRetetaCuIngrediente] = useState<RetetaCuIngrediente | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<RetetaCreate>({
    denumire: '',
    categorie: 'mic_dejun',
  });

  const [newIngredient, setNewIngredient] = useState({
    ingredient_id: 0,
    cantitate_per_portie: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reteteData, ingredienteData] = await Promise.all([
        getRetete(),
        getIngrediente(),
      ]);
      setRetete(reteteData);
      setIngrediente(ingredienteData);
    } catch (err) {
      setError('Eroare la încărcarea datelor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setFormData({
      denumire: '',
      categorie: 'mic_dejun',
    });
    setDialogMode('add');
    setDialogOpen(true);
  };

  const openEditDialog = (reteta: Reteta) => {
    setFormData({
      denumire: reteta.denumire,
      categorie: reteta.categorie,
    });
    setSelectedReteta(reteta);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const openDeleteDialog = (reteta: Reteta) => {
    setSelectedReteta(reteta);
    setDialogMode('delete');
    setDialogOpen(true);
  };

  const openIngredientsDialog = async (reteta: Reteta) => {
    try {
      setSubmitting(true);
      const retetaData = await getRetetaCuIngrediente(reteta.id);
      setRetetaCuIngrediente(retetaData);
      setSelectedReteta(reteta);
      setNewIngredient({ ingredient_id: 0, cantitate_per_portie: 0 });
      setDialogMode('ingredients');
      setDialogOpen(true);
    } catch (err) {
      setError('Eroare la încărcarea ingredientelor rețetei');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (dialogMode === 'add') {
        await createReteta(formData);
      } else if (dialogMode === 'edit' && selectedReteta) {
        await updateReteta(selectedReteta.id, formData);
      }
      await loadData();
      setDialogOpen(false);
    } catch (err) {
      setError('Eroare la salvarea rețetei');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReteta) return;

    setSubmitting(true);
    setError(null);

    try {
      await deleteReteta(selectedReteta.id);
      await loadData();
      setDialogOpen(false);
    } catch (err) {
      setError('Eroare la ștergerea rețetei');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddIngredient = async () => {
    if (!selectedReteta || newIngredient.ingredient_id === 0 || newIngredient.cantitate_per_portie <= 0) {
      setError('Selectează un ingredient și introdu o cantitate validă');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await addIngredientToReteta(
        selectedReteta.id,
        newIngredient.ingredient_id,
        newIngredient.cantitate_per_portie
      );
      const updatedReteta = await getRetetaCuIngrediente(selectedReteta.id);
      setRetetaCuIngrediente(updatedReteta);
      setNewIngredient({ ingredient_id: 0, cantitate_per_portie: 0 });
    } catch (err) {
      setError('Eroare la adăugarea ingredientului');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveIngredient = async (ingredientId: number) => {
    if (!selectedReteta) return;

    setSubmitting(true);
    setError(null);

    try {
      await removeIngredientFromReteta(selectedReteta.id, ingredientId);
      const updatedReteta = await getRetetaCuIngrediente(selectedReteta.id);
      setRetetaCuIngrediente(updatedReteta);
    } catch (err) {
      setError('Eroare la ștergerea ingredientului');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateIngredient = async (ingredientId: number, cantitate: number) => {
    if (!selectedReteta || cantitate <= 0) return;

    setSubmitting(true);
    setError(null);

    try {
      await updateIngredientInReteta(selectedReteta.id, ingredientId, cantitate);
      const updatedReteta = await getRetetaCuIngrediente(selectedReteta.id);
      setRetetaCuIngrediente(updatedReteta);
    } catch (err) {
      setError('Eroare la actualizarea cantității');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const groupedRetete = retete.reduce((acc, reteta) => {
    if (!acc[reteta.categorie]) {
      acc[reteta.categorie] = [];
    }
    acc[reteta.categorie].push(reteta);
    return acc;
  }, {} as Record<CategorieReteta, Reteta[]>);

  const categorii: CategorieReteta[] = ['mic_dejun', 'gustare1', 'ciorba', 'fel_doi', 'gustare2'];

  const availableIngredients = useMemo(
    () => ingrediente.filter(
      (ing) => !retetaCuIngrediente?.ingrediente.some((ri) => ri.ingredient.id === ing.id)
    ),
    [ingrediente, retetaCuIngrediente]
  );

  const selectedIngredientUnit = useMemo(
    () => ingrediente.find(i => i.id === newIngredient.ingredient_id)?.unitate_baza || '...',
    [ingrediente, newIngredient.ingredient_id]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rețete</h1>
          <p className="text-gray-600 mt-2">Gestionează rețetele disponibile</p>
        </div>
        <Button onClick={openAddDialog} aria-label="Adaugă rețetă nouă">
          ➕ Adaugă rețetă
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Se încarcă...</div>
      ) : (
        <div className="space-y-6">
          {categorii.map((categorie) => {
            const reteteCategorie = groupedRetete[categorie] || [];
            if (reteteCategorie.length === 0) return null;

            return (
              <Card key={categorie}>
                <CardHeader>
                  <CardTitle>
                    {CATEGORII_EMOJI[categorie]} {CATEGORII_MESE[categorie]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Denumire</TableHead>
                        <TableHead>Categorie</TableHead>
                        <TableHead className="text-right">Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reteteCategorie.map((reteta) => (
                        <TableRow key={reteta.id}>
                          <TableCell className="font-medium">{reteta.denumire}</TableCell>
                          <TableCell>{CATEGORII_MESE[reteta.categorie]}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openIngredientsDialog(reteta)}
                                title="Gestionează ingrediente"
                              >
                                🥘 Ingrediente
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(reteta)}
                              >
                                ✏️ Editează
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteDialog(reteta)}
                              >
                                🗑️ Șterge
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}

          {retete.length === 0 && (
            <Card>
              <CardContent className="text-center py-8 text-gray-500">
                Nu există rețete în baza de date
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {dialogMode === 'delete' ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirmare ștergere</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                Ești sigur că vrei să ștergi rețeta <strong>{selectedReteta?.denumire}</strong>?
                Această acțiune nu poate fi anulată.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                  Anulează
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                  {submitting ? 'Se șterge...' : 'Șterge'}
                </Button>
              </DialogFooter>
            </>
          ) : dialogMode === 'ingredients' ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  Ingrediente - {selectedReteta?.denumire}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {retetaCuIngrediente && retetaCuIngrediente.ingrediente.length > 0 ? (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ingredient</TableHead>
                          <TableHead>Cantitate/porție</TableHead>
                          <TableHead>Unitate</TableHead>
                          <TableHead className="text-right">Acțiuni</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {retetaCuIngrediente.ingrediente.map(({ ingredient, cantitate_per_portie }) => (
                          <TableRow key={ingredient.id}>
                            <TableCell>{ingredient.denumire}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={cantitate_per_portie}
                                onChange={(e) =>
                                  handleUpdateIngredient(ingredient.id, parseFloat(e.target.value) || 0)
                                }
                                step="0.01"
                                min="0"
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>{ingredient.unitate_baza}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveIngredient(ingredient.id)}
                                disabled={submitting}
                              >
                                🗑️
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nu există ingrediente adăugate în această rețetă
                  </p>
                )}

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Adaugă ingredient</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ingredient
                      </label>
                      <Select
                        value={newIngredient.ingredient_id}
                        onChange={(e) =>
                          setNewIngredient((prev) => ({
                            ...prev,
                            ingredient_id: parseInt(e.target.value),
                          }))
                        }
                      >
                        <option value="0">Selectează...</option>
                        {availableIngredients.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.denumire}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantitate/porție ({selectedIngredientUnit})
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={newIngredient.cantitate_per_portie}
                          onChange={(e) =>
                            setNewIngredient((prev) => ({
                              ...prev,
                              cantitate_per_portie: parseFloat(e.target.value) || 0,
                            }))
                          }
                          step="0.01"
                          min="0"
                          placeholder="0"
                        />
                        <Button onClick={handleAddIngredient} disabled={submitting}>
                          ➕
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Închide</Button>
              </DialogFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {dialogMode === 'add' ? 'Adaugă rețetă nouă' : 'Editează rețetă'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Denumire *
                  </label>
                  <Input
                    name="denumire"
                    value={formData.denumire}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Lapte cu cereale"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie *
                  </label>
                  <Select name="categorie" value={formData.categorie} onChange={handleInputChange} required>
                    {categorii.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORII_EMOJI[cat]} {CATEGORII_MESE[cat]}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Anulează
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Se salvează...' : dialogMode === 'add' ? 'Adaugă' : 'Salvează'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
