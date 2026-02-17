// lib/types.ts

// ============================================
// ENUMS
// ============================================
export type UnitateBaza = 'g' | 'ml' | 'buc';
export type UnitateRaport = 'Buc' | 'L' | 'Kg';
export type CategorieReteta = 'mic_dejun' | 'gustare1' | 'ciorba' | 'fel_doi' | 'gustare2';

// ============================================
// INGREDIENTE
// ============================================
export interface Ingredient {
  id: number;
  denumire: string;
  unitate_baza: UnitateBaza;
  cantitate_ambalaj: number;
  unitate_raport: UnitateRaport;
  calorii_per_100: number;
  proteine: number;
  glucide: number;
  grasimi: number;
  created_at: string;
  updated_at: string;
}

export interface IngredientCreate {
  denumire: string;
  unitate_baza: UnitateBaza;
  cantitate_ambalaj: number;
  unitate_raport: UnitateRaport;
  calorii_per_100: number;
  proteine: number;
  glucide: number;
  grasimi: number;
}

// ============================================
// REȚETE
// ============================================
export interface Reteta {
  id: number;
  denumire: string;
  categorie: CategorieReteta;
  created_at: string;
  updated_at: string;
}

export interface RetetaCreate {
  denumire: string;
  categorie: CategorieReteta;
}

export interface RetetaIngredient {
  id: number;
  reteta_id: number;
  ingredient_id: number;
  cantitate_per_portie: number;
  ingrediente?: Ingredient; // Populated via join
}

export interface RetetaCuIngrediente extends Reteta {
  ingrediente: Array<{
    ingredient: Ingredient;
    cantitate_per_portie: number;
  }>;
}

// ============================================
// RAPOARTE
// ============================================
export interface Raport {
  id: number;
  data: string; // YYYY-MM-DD
  nume_bucatar: string;
  nr_portii: number;
  mic_dejun_id: number | null;
  gustare1_id: number | null;
  ciorba_id: number | null;
  fel_doi_id: number | null;
  gustare2_id: number | null;
  created_at: string;
}

export interface RaportCreate {
  data: string;
  nume_bucatar: string;
  nr_portii: number;
  mic_dejun_id: number | null;
  gustare1_id: number | null;
  ciorba_id: number | null;
  fel_doi_id: number | null;
  gustare2_id: number | null;
}

// ============================================
// REZULTATE CALCUL
// ============================================
export interface IngredientCalculat {
  ingredient: Ingredient;
  cantitate_totala: number; // În unitate_baza
  cantitate_raport: number; // Convertit în unitate_raport
  unitate_raport: UnitateRaport;
}

export interface MacronutrientiMasa {
  masa: string;
  denumire_reteta: string;
  calorii: number;
  proteine: number;
  glucide: number;
  grasimi: number;
}

export interface RezultatCalcul {
  ingrediente: IngredientCalculat[];
  macronutrienti: MacronutrientiMasa[];
  total_macronutrienti: {
    calorii: number;
    proteine: number;
    glucide: number;
    grasimi: number;
  };
}

// ============================================
// FORM STATE
// ============================================
export interface RaportFormState {
  data: string;
  nume_bucatar: string;
  nr_portii: number;
  mic_dejun_id: number | null;
  gustare1_id: number | null;
  ciorba_id: number | null;
  fel_doi_id: number | null;
  gustare2_id: number | null;
}

// ============================================
// CONSTANTE
// ============================================
export const CATEGORII_MESE: Record<CategorieReteta, string> = {
  mic_dejun: 'Mic Dejun',
  gustare1: 'Gustare 1',
  ciorba: 'Prânz - Ciorbă',
  fel_doi: 'Prânz - Fel Doi',
  gustare2: 'Gustare 2'
};

export const CATEGORII_EMOJI: Record<CategorieReteta, string> = {
  mic_dejun: '🌅',
  gustare1: '🍎',
  ciorba: '🥣',
  fel_doi: '🍗',
  gustare2: '🍪'
};
