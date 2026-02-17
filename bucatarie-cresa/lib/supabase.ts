// lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
import {
  Ingredient,
  IngredientCreate,
  Reteta,
  RetetaCreate,
  RetetaCuIngrediente,
  Raport,
  RaportCreate,
  CategorieReteta
} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// INGREDIENTE
// ============================================
export async function getIngrediente(): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingrediente')
    .select('*')
    .order('denumire');

  if (error) throw error;
  return data;
}

export async function createIngredient(ingredient: IngredientCreate): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingrediente')
    .insert(ingredient)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIngredient(id: number, ingredient: Partial<IngredientCreate>): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingrediente')
    .update(ingredient)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteIngredient(id: number): Promise<void> {
  const { error } = await supabase
    .from('ingrediente')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// REȚETE
// ============================================
export async function getRetete(categorie?: CategorieReteta): Promise<Reteta[]> {
  let query = supabase
    .from('retete')
    .select('*')
    .order('denumire');

  if (categorie) {
    query = query.eq('categorie', categorie);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getRetetaCuIngrediente(id: number): Promise<RetetaCuIngrediente> {
  const { data: reteta, error: retetaError } = await supabase
    .from('retete')
    .select('*')
    .eq('id', id)
    .single();

  if (retetaError) throw retetaError;

  const { data: ingrediente, error: ingError } = await supabase
    .from('reteta_ingrediente')
    .select('*, ingrediente(*)')
    .eq('reteta_id', id);

  if (ingError) throw ingError;

  return {
    ...reteta,
    ingrediente: ingrediente.map(ri => ({
      ingredient: ri.ingrediente,
      cantitate_per_portie: ri.cantitate_per_portie
    }))
  };
}

export async function createReteta(reteta: RetetaCreate): Promise<Reteta> {
  const { data, error } = await supabase
    .from('retete')
    .insert(reteta)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateReteta(id: number, reteta: Partial<RetetaCreate>): Promise<Reteta> {
  const { data, error } = await supabase
    .from('retete')
    .update(reteta)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReteta(id: number): Promise<void> {
  const { error } = await supabase
    .from('retete')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// REȚETĂ INGREDIENTE
// ============================================
export async function addIngredientToReteta(
  reteta_id: number,
  ingredient_id: number,
  cantitate_per_portie: number
): Promise<void> {
  const { error } = await supabase
    .from('reteta_ingrediente')
    .insert({ reteta_id, ingredient_id, cantitate_per_portie });

  if (error) throw error;
}

export async function removeIngredientFromReteta(
  reteta_id: number,
  ingredient_id: number
): Promise<void> {
  const { error } = await supabase
    .from('reteta_ingrediente')
    .delete()
    .eq('reteta_id', reteta_id)
    .eq('ingredient_id', ingredient_id);

  if (error) throw error;
}

export async function updateIngredientInReteta(
  reteta_id: number,
  ingredient_id: number,
  cantitate_per_portie: number
): Promise<void> {
  const { error } = await supabase
    .from('reteta_ingrediente')
    .update({ cantitate_per_portie })
    .eq('reteta_id', reteta_id)
    .eq('ingredient_id', ingredient_id);

  if (error) throw error;
}

// ============================================
// RAPOARTE
// ============================================
export async function getRapoarte(limit: number = 7): Promise<Raport[]> {
  const { data, error } = await supabase
    .from('rapoarte')
    .select(`
      *,
      mic_dejun:retete!mic_dejun_id(denumire),
      gustare1:retete!gustare1_id(denumire),
      ciorba:retete!ciorba_id(denumire),
      fel_doi:retete!fel_doi_id(denumire),
      gustare2:retete!gustare2_id(denumire)
    `)
    .order('data', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getRaportByDate(data: string): Promise<Raport | null> {
  const { data: raport, error } = await supabase
    .from('rapoarte')
    .select('*')
    .eq('data', data)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return raport;
}

export async function saveRaport(raport: RaportCreate): Promise<Raport> {
  const { data, error } = await supabase
    .from('rapoarte')
    .upsert(raport, { onConflict: 'data' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRaport(id: number): Promise<void> {
  const { error } = await supabase
    .from('rapoarte')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function cleanupOldRapoarte(): Promise<void> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { error } = await supabase
    .from('rapoarte')
    .delete()
    .lt('data', sevenDaysAgo.toISOString().split('T')[0]);

  if (error) throw error;
}
