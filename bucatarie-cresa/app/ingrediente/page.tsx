'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getIngrediente, createIngredient, updateIngredient, deleteIngredient } from '@/lib/supabase';
import { Ingredient, IngredientCreate } from '@/lib/types';

type DialogMode = 'add' | 'edit' | 'delete' | null;

const NUMERIC_FIELDS = ['cantitate_ambalaj', 'calorii_per_100', 'proteine', 'glucide', 'grasimi'] as const;

export default function IngredientePage() {
  const [ingrediente, setIngrediente] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<IngredientCreate>({
    denumire: '',
    unitate_baza: 'g',
    cantitate_ambalaj: 0,
    unitate_raport: 'Kg',
    calorii_per_100: 0,
    proteine: 0,
    glucide: 0,
    grasimi: 0,
  });

  useEffect(() => {
    loadIngrediente();
  }, []);

  const loadIngrediente = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIngrediente();
      setIngrediente(data);
    } catch (err) {
      setError('Eroare la încărcarea ingredientelor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setFormData({
      denumire: '',
      unitate_baza: 'g',
      cantitate_ambalaj: 0,
      unitate_raport: 'Kg',
      calorii_per_100: 0,
      proteine: 0,
      glucide: 0,
      grasimi: 0,
    });
    setDialogMode('add');
    setDialogOpen(true);
  };

  const openEditDialog = (ingredient: Ingredient) => {
    setFormData({
      denumire: ingredient.denumire,
      unitate_baza: ingredient.unitate_baza,
      cantitate_ambalaj: ingredient.cantitate_ambalaj,
      unitate_raport: ingredient.unitate_raport,
      calorii_per_100: ingredient.calorii_per_100,
      proteine: ingredient.proteine,
      glucide: ingredient.glucide,
      grasimi: ingredient.grasimi,
    });
    setSelectedIngredient(ingredient);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const openDeleteDialog = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setDialogMode('delete');
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (dialogMode === 'add') {
        await createIngredient(formData);
      } else if (dialogMode === 'edit' && selectedIngredient) {
        await updateIngredient(selectedIngredient.id, formData);
      }
      await loadIngrediente();
      setDialogOpen(false);
    } catch (err) {
      setError('Eroare la salvarea ingredientului');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedIngredient) return;

    setSubmitting(true);
    setError(null);

    try {
      await deleteIngredient(selectedIngredient.id);
      await loadIngrediente();
      setDialogOpen(false);
    } catch (err) {
      setError('Eroare la ștergerea ingredientului');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = (NUMERIC_FIELDS as readonly string[]).includes(name);
    setFormData(prev => ({
      ...prev,
      [name]: isNumeric ? (parseFloat(value) || 0) : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ingrediente</h1>
          <p className="text-muted-foreground mt-2">
            Gestionează baza de date cu ingrediente
          </p>
        </div>
        <Button onClick={openAddDialog} aria-label="Adaugă ingredient nou">
          ➕ Adaugă ingredient
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista Ingrediente</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Se încarcă...
            </div>
          ) : ingrediente.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nu există ingrediente în baza de date
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Denumire</TableHead>
                  <TableHead>Unitate Bază</TableHead>
                  <TableHead>Cantitate Ambalaj</TableHead>
                  <TableHead>Unitate Raport</TableHead>
                  <TableHead>Calorii/100</TableHead>
                  <TableHead>Proteine</TableHead>
                  <TableHead>Glucide</TableHead>
                  <TableHead>Grăsimi</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingrediente.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.denumire}</TableCell>
                    <TableCell>{ingredient.unitate_baza}</TableCell>
                    <TableCell>{ingredient.cantitate_ambalaj}</TableCell>
                    <TableCell>{ingredient.unitate_raport}</TableCell>
                    <TableCell>{ingredient.calorii_per_100}</TableCell>
                    <TableCell>{ingredient.proteine}</TableCell>
                    <TableCell>{ingredient.glucide}</TableCell>
                    <TableCell>{ingredient.grasimi}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(ingredient)}
                        >
                          ✏️ Editează
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(ingredient)}
                        >
                          🗑️ Șterge
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {dialogMode === 'delete' ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirmare ștergere</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground">
                Ești sigur că vrei să ștergi ingredientul <strong>{selectedIngredient?.denumire}</strong>?
                Această acțiune nu poate fi anulată.
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Anulează
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  {submitting ? 'Se șterge...' : 'Șterge'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {dialogMode === 'add' ? 'Adaugă ingredient nou' : 'Editează ingredient'}
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
                    placeholder="Ex: Lapte"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unitate Bază *
                    </label>
                    <Select
                      name="unitate_baza"
                      value={formData.unitate_baza}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="buc">buc</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantitate Ambalaj *
                    </label>
                    <Input
                      type="number"
                      name="cantitate_ambalaj"
                      value={formData.cantitate_ambalaj}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unitate Raport *
                  </label>
                  <Select
                    name="unitate_raport"
                    value={formData.unitate_raport}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Kg">Kg</option>
                    <option value="L">L</option>
                    <option value="Buc">Buc</option>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3">
                    Valori nutriționale (per 100g/ml)
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Calorii *
                      </label>
                      <Input
                        type="number"
                        name="calorii_per_100"
                        value={formData.calorii_per_100}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Proteine (g) *
                      </label>
                      <Input
                        type="number"
                        name="proteine"
                        value={formData.proteine}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Glucide (g) *
                      </label>
                      <Input
                        type="number"
                        name="glucide"
                        value={formData.glucide}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Grăsimi (g) *
                      </label>
                      <Input
                        type="number"
                        name="grasimi"
                        value={formData.grasimi}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        min="0"
                      />
                    </div>
                  </div>
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
