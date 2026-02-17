# 📋 PLAN TEHNIC COMPLET

## Aplicație Bucătărie Creșă - Raport Zilnic

---

## 📑 CUPRINS

1. [Descriere Generală](#1-descriere-generală)
2. [Stack Tehnologic](#2-stack-tehnologic)
3. [Structura Proiectului](#3-structura-proiectului)
4. [Baza de Date](#4-baza-de-date)
5. [API Endpoints](#5-api-endpoints)
6. [Componente Frontend](#6-componente-frontend)
7. [Logica de Business](#7-logica-de-business)
8. [Generare PDF](#8-generare-pdf)
9. [Fluxuri de Utilizare](#9-fluxuri-de-utilizare)
10. [Date Inițiale](#10-date-inițiale)
11. [Deployment](#11-deployment)
12. [Instrucțiuni Implementare](#12-instrucțiuni-implementare)

---

## 1. DESCRIERE GENERALĂ

### 1.1 Scopul Aplicației

Aplicație web pentru bucătăria unei creșe care permite:

- Generarea rapoartelor zilnice cu ingredientele folosite
- Calculul automat al cantităților pe baza numărului de porții
- Calculul macronutrienților per porție pentru fiecare masă
- Gestionarea rețetelor și ingredientelor
- Exportul rapoartelor în format PDF

### 1.2 Utilizatori

- Bucătarii creșei (fără autentificare necesară)
- Acces de pe multiple dispozitive cu date partajate

### 1.3 Funcționalități Principale

| ID  | Funcționalitate               | Prioritate |
| --- | ----------------------------- | ---------- |
| F1  | Creare raport zilnic          | CRITICĂ    |
| F2  | Calcul automat ingrediente    | CRITICĂ    |
| F3  | Calcul macronutrienți         | CRITICĂ    |
| F4  | Generare PDF                  | CRITICĂ    |
| F5  | Gestionare rețete (CRUD)      | ÎNALTĂ     |
| F6  | Gestionare ingrediente (CRUD) | ÎNALTĂ     |
| F7  | Istoric rapoarte (7 zile)     | MEDIE      |

---

## 2. STACK TEHNOLOGIC

### 2.1 Frontend

Framework: Next.js 14 (App Router)
Limbaj: TypeScript
Styling: Tailwind CSS
Componente UI: shadcn/ui
State: React hooks (useState, useEffect)
HTTP Client: fetch API (built-in)
PDF: @react-pdf/renderer

### 2.2 Backend & Database

Platform: Supabase (PostgreSQL + REST API)
Database: PostgreSQL (hosted by Supabase)
API: Supabase auto-generated REST API

### 2.3 Deployment

Frontend: Vercel (gratuit)
Backend/DB: Supabase (gratuit - 500MB)

### 2.4 Dependențe NPM

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@react-pdf/renderer": "^3.1.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "lucide-react": "^0.300.0",
    "date-fns": "^3.0.0"
  }
}


3. STRUCTURA PROIECTULUI
bucatarie-cresa/
├── app/
│   ├── layout.tsx                 # Layout principal
│   ├── page.tsx                   # Pagina principală (Raport Zilnic)
│   ├── globals.css                # Stiluri globale + Tailwind
│   ├── retete/
│   │   ├── page.tsx               # Lista rețete
│   │   └── [id]/
│   │       └── page.tsx           # Editare rețetă
│   ├── ingrediente/
│   │   └── page.tsx               # Lista ingrediente + CRUD
│   └── istoric/
│       └── page.tsx               # Istoric rapoarte
│
├── components/
│   ├── ui/                        # Componente shadcn/ui
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── card.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx             # Header cu navigare
│   │   └── Navigation.tsx         # Meniu navigare
│   │
│   ├── raport/
│   │   ├── RaportForm.tsx         # Formular raport zilnic
│   │   ├── MealSelector.tsx       # Selector preparate per masă
│   │   ├── RezultatCalcul.tsx     # Afișare rezultate calcul
│   │   └── MacronutrientiTable.tsx # Tabel macronutrienți
│   │
│   ├── retete/
│   │   ├── RetetaList.tsx         # Lista rețete
│   │   ├── RetetaForm.tsx         # Formular adăugare/editare
│   │   └── RetetaCard.tsx         # Card rețetă
│   │
│   ├── ingrediente/
│   │   ├── IngredientList.tsx     # Lista ingrediente
│   │   ├── IngredientForm.tsx     # Formular adăugare/editare
│   │   └── IngredientRow.tsx      # Rând tabel ingredient
│   │
│   └── pdf/
│       └── RaportPDF.tsx          # Template PDF raport
│
├── lib/
│   ├── supabase.ts                # Client Supabase
│   ├── types.ts                   # TypeScript interfaces
│   ├── utils.ts                   # Funcții utilitare
│   └── calculations.ts            # Logica de calcul
│
├── hooks/
│   ├── useIngrediente.ts          # Hook CRUD ingrediente
│   ├── useRetete.ts               # Hook CRUD rețete
│   └── useRapoarte.ts             # Hook CRUD rapoarte
│
├── data/
│   └── ingrediente-initiale.json  # Date seed ingrediente
│
├── .env.local                     # Variabile mediu (Supabase keys)
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── package.json


4. BAZA DE DATE
4.1 Diagrama ERD
┌─────────────────┐       ┌─────────────────────┐       ┌─────────────────┐
│   ingrediente   │       │  reteta_ingrediente │       │     retete      │
├─────────────────┤       ├─────────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ ingredient_id (FK)  │       │ id (PK)         │
│ denumire        │       │ reteta_id (FK)      │──────►│ denumire        │
│ unitate_baza    │       │ cantitate_per_portie│       │ categorie       │
│ cantitate_ambalaj│       │ id (PK)             │       │ created_at      │
│ unitate_raport  │       └─────────────────────┘       │ updated_at      │
│ calorii_per_100 │                                     └─────────────────┘
│ proteine        │                                              │
│ glucide         │                                              │
│ grasimi         │       ┌─────────────────────┐                │
│ created_at      │       │      rapoarte       │                │
└─────────────────┘       ├─────────────────────┤                │
                          │ id (PK)             │                │
                          │ data                │                │
                          │ nume_bucatar        │                │
                          │ nr_portii           │                │
                          │ mic_dejun_id (FK)   │────────────────┤
                          │ gustare1_id (FK)    │────────────────┤
                          │ ciorba_id (FK)      │────────────────┤
                          │ fel_doi_id (FK)     │────────────────┤
                          │ gustare2_id (FK)    │────────────────┘
                          │ created_at          │
                          └─────────────────────┘

4.2 SQL Schema
-- ============================================
-- TABEL: ingrediente
-- Descriere: Stochează toate ingredientele disponibile
-- ============================================
CREATE TABLE ingrediente (
    id SERIAL PRIMARY KEY,
    denumire VARCHAR(255) NOT NULL UNIQUE,

    -- Unitatea în care se măsoară în rețete (g, ml, buc)
    unitate_baza VARCHAR(10) NOT NULL CHECK (unitate_baza IN ('g', 'ml', 'buc')),

    -- Câte unități de bază conține un ambalaj
    -- Ex: 360 (grame per borcan), 1000 (ml per litru), 1 (pentru ouă)
    cantitate_ambalaj DECIMAL(10,2) NOT NULL,

    -- Cum apare în raportul final (Buc, L, Kg)
    unitate_raport VARCHAR(10) NOT NULL CHECK (unitate_raport IN ('Buc', 'L', 'Kg')),

    -- Macronutrienți per 100 unități de bază (100g sau 100ml)
    -- Pentru 'buc' (ex: ouă), valorile sunt per 1 bucată
    calorii_per_100 DECIMAL(10,2) NOT NULL DEFAULT 0,
    proteine DECIMAL(10,2) NOT NULL DEFAULT 0,
    glucide DECIMAL(10,2) NOT NULL DEFAULT 0,
    grasimi DECIMAL(10,2) NOT NULL DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABEL: retete
-- Descriere: Stochează rețetele disponibile
-- ============================================
CREATE TABLE retete (
    id SERIAL PRIMARY KEY,
    denumire VARCHAR(255) NOT NULL,

    -- Categoria mesei
    categorie VARCHAR(20) NOT NULL CHECK (
        categorie IN ('mic_dejun', 'gustare1', 'ciorba', 'fel_doi', 'gustare2')
    ),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABEL: reteta_ingrediente
-- Descriere: Relația many-to-many între rețete și ingrediente
-- ============================================
CREATE TABLE reteta_ingrediente (
    id SERIAL PRIMARY KEY,
    reteta_id INTEGER NOT NULL REFERENCES retete(id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES ingrediente(id) ON DELETE RESTRICT,

    -- Cantitatea de ingredient necesară pentru O SINGURĂ PORȚIE
    -- Exprimată în unitate_baza a ingredientului (g, ml, sau buc)
    cantitate_per_portie DECIMAL(10,3) NOT NULL,

    UNIQUE(reteta_id, ingredient_id)
);

-- ============================================
-- TABEL: rapoarte
-- Descriere: Stochează rapoartele zilnice generate
-- ============================================
CREATE TABLE rapoarte (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    nume_bucatar VARCHAR(255) NOT NULL,
    nr_portii INTEGER NOT NULL CHECK (nr_portii > 0),

    -- Referințe către rețetele selectate pentru fiecare masă
    mic_dejun_id INTEGER REFERENCES retete(id) ON DELETE SET NULL,
    gustare1_id INTEGER REFERENCES retete(id) ON DELETE SET NULL,
    ciorba_id INTEGER REFERENCES retete(id) ON DELETE SET NULL,
    fel_doi_id INTEGER REFERENCES retete(id) ON DELETE SET NULL,
    gustare2_id INTEGER REFERENCES retete(id) ON DELETE SET NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Un singur raport per zi
    UNIQUE(data)
);

-- ============================================
-- INDEXURI pentru performanță
-- ============================================
CREATE INDEX idx_retete_categorie ON retete(categorie);
CREATE INDEX idx_rapoarte_data ON rapoarte(data);
CREATE INDEX idx_reteta_ingrediente_reteta ON reteta_ingrediente(reteta_id);

-- ============================================
-- FUNCȚIE: Ștergere automată rapoarte vechi (> 7 zile)
-- ============================================
CREATE OR REPLACE FUNCTION delete_old_rapoarte()
RETURNS void AS $$
BEGIN
    DELETE FROM rapoarte WHERE data < CURRENT_DATE - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Actualizare updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ingrediente_updated
    BEFORE UPDATE ON ingrediente
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_retete_updated
    BEFORE UPDATE ON retete
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

4.3 Row Level Security (RLS) - Supabase
-- Dezactivăm RLS pentru acces public (fără autentificare)
ALTER TABLE ingrediente ENABLE ROW LEVEL SECURITY;
ALTER TABLE retete ENABLE ROW LEVEL SECURITY;
ALTER TABLE reteta_ingrediente ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapoarte ENABLE ROW LEVEL SECURITY;

-- Politici pentru acces public complet
CREATE POLICY "Allow all access to ingrediente" ON ingrediente FOR ALL USING (true);
CREATE POLICY "Allow all access to retete" ON retete FOR ALL USING (true);
CREATE POLICY "Allow all access to reteta_ingrediente" ON reteta_ingrediente FOR ALL USING (true);
CREATE POLICY "Allow all access to rapoarte" ON rapoarte FOR ALL USING (true);


5. API ENDPOINTS
5.1 Ingrediente



Metodă
Endpoint
Descriere
Request Body
Response



GET
/ingrediente
Lista toate ingredientele
-
Ingredient[]


GET
/ingrediente?id=eq.{id}
Un ingredient
-
Ingredient


POST
/ingrediente
Adaugă ingredient
IngredientCreate
Ingredient


PATCH
/ingrediente?id=eq.{id}
Actualizează ingredient
IngredientUpdate
Ingredient


DELETE
/ingrediente?id=eq.{id}
Șterge ingredient
-
-


5.2 Rețete



Metodă
Endpoint
Descriere
Request Body
Response



GET
/retete
Lista toate rețetele
-
Reteta[]


GET
/retete?categorie=eq.{cat}
Rețete per categorie
-
Reteta[]


GET
/retete?id=eq.{id}
O rețetă
-
Reteta


POST
/retete
Adaugă rețetă
RetetaCreate
Reteta


PATCH
/retete?id=eq.{id}
Actualizează rețetă
RetetaUpdate
Reteta


DELETE
/retete?id=eq.{id}
Șterge rețetă
-
-


5.3 Rețetă-Ingrediente



Metodă
Endpoint
Descriere



GET
/reteta_ingrediente?reteta_id=eq.{id}&select=*,ingrediente(*)
Ingrediente pentru o rețetă


POST
/reteta_ingrediente
Adaugă ingredient la rețetă


DELETE
/reteta_ingrediente?reteta_id=eq.{id}&ingredient_id=eq.{id}
Șterge ingredient din rețetă


5.4 Rapoarte



Metodă
Endpoint
Descriere



GET
/rapoarte?order=data.desc&limit=7
Ultimele 7 rapoarte


GET
/rapoarte?data=eq.{date}
Raport pentru o dată


POST
/rapoarte
Creează/actualizează raport


DELETE
/rapoarte?id=eq.{id}
Șterge raport



6. COMPONENTE FRONTEND
6.1 TypeScript Interfaces
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

6.2 Supabase Client
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


7. LOGICA DE BUSINESS
7.1 Funcții de Calcul
// lib/calculations.ts

import {
  Ingredient,
  RetetaCuIngrediente,
  IngredientCalculat,
  MacronutrientiMasa,
  RezultatCalcul,
  CategorieReteta,
  CATEGORII_MESE
} from './types';

/**
 * Calculează cantitatea totală de ingrediente necesare
 * și convertește în unitatea de raport
 */
export function calculeazaIngrediente(
  retete: (RetetaCuIngrediente | null)[],
  nrPortii: number
): IngredientCalculat[] {
  const ingredienteMap = new Map<number, IngredientCalculat>();

  for (const reteta of retete) {
    if (!reteta) continue;

    for (const { ingredient, cantitate_per_portie } of reteta.ingrediente) {
      const cantitateTotala = cantitate_per_portie * nrPortii;

      if (ingredienteMap.has(ingredient.id)) {
        const existing = ingredienteMap.get(ingredient.id)!;
        existing.cantitate_totala += cantitateTotala;
        existing.cantitate_raport = convertToRaport(
          existing.cantitate_totala,
          ingredient
        );
      } else {
        ingredienteMap.set(ingredient.id, {
          ingredient,
          cantitate_totala: cantitateTotala,
          cantitate_raport: convertToRaport(cantitateTotala, ingredient),
          unitate_raport: ingredient.unitate_raport
        });
      }
    }
  }

  return Array.from(ingredienteMap.values())
    .sort((a, b) => a.ingredient.denumire.localeCompare(b.ingredient.denumire));
}

/**
 * Convertește cantitatea din unitate_baza în unitate_raport
 */
function convertToRaport(cantitate: number, ingredient: Ingredient): number {
  const { cantitate_ambalaj, unitate_raport } = ingredient;

  const nrAmbalaje = cantitate / cantitate_ambalaj;

  if (unitate_raport === 'Buc') {
    return Math.ceil(nrAmbalaje);
  } else {
    return Math.round(nrAmbalaje * 100) / 100;
  }
}

/**
 * Calculează macronutrienții per porție pentru fiecare masă
 */
export function calculeazaMacronutrienti(
  retete: { categorie: CategorieReteta; reteta: RetetaCuIngrediente | null }[]
): MacronutrientiMasa[] {
  const rezultat: MacronutrientiMasa[] = [];

  for (const { categorie, reteta } of retete) {
    if (!reteta) {
      rezultat.push({
        masa: CATEGORII_MESE[categorie],
        denumire_reteta: '-',
        calorii: 0,
        proteine: 0,
        glucide: 0,
        grasimi: 0
      });
      continue;
    }

    let calorii = 0;
    let proteine = 0;
    let glucide = 0;
    let grasimi = 0;

    for (const { ingredient, cantitate_per_portie } of reteta.ingrediente) {
      let factor: number;

      if (ingredient.unitate_baza === 'buc') {
        factor = cantitate_per_portie;
      } else {
        factor = cantitate_per_portie / 100;
      }

      calorii += ingredient.calorii_per_100 * factor;
      proteine += ingredient.proteine * factor;
      glucide += ingredient.glucide * factor;
      grasimi += ingredient.grasimi * factor;
    }

    rezultat.push({
      masa: CATEGORII_MESE[categorie],
      denumire_reteta: reteta.denumire,
      calorii: Math.round(calorii),
      proteine: Math.round(proteine * 10) / 10,
      glucide: Math.round(glucide * 10) / 10,
      grasimi: Math.round(grasimi * 10) / 10
    });
  }

  return rezultat;
}

/**
 * Calculează totalul macronutrienților pentru întreaga zi
 */
export function calculeazaTotalMacro(macronutrienti: MacronutrientiMasa[]) {
  return macronutrienti.reduce(
    (acc, masa) => ({
      calorii: acc.calorii + masa.calorii,
      proteine: Math.round((acc.proteine + masa.proteine) * 10) / 10,
      glucide: Math.round((acc.glucide + masa.glucide) * 10) / 10,
      grasimi: Math.round((acc.grasimi + masa.grasimi) * 10) / 10
    }),
    { calorii: 0, proteine: 0, glucide: 0, grasimi: 0 }
  );
}

/**
 * Funcție principală care calculează tot
 */
export function calculeazaRaport(
  reteteMese: { categorie: CategorieReteta; reteta: RetetaCuIngrediente | null }[],
  nrPortii: number
): RezultatCalcul {
  const reteteNonNull = reteteMese
    .map(r => r.reteta)
    .filter((r): r is RetetaCuIngrediente => r !== null);

  const ingrediente = calculeazaIngrediente(reteteNonNull, nrPortii);
  const macronutrienti = calculeazaMacronutrienti(reteteMese);
  const total_macronutrienti = calculeazaTotalMacro(macronutrienti);

  return {
    ingrediente,
    macronutrienti,
    total_macronutrienti
  };
}

7.2 Utilități
// lib/utils.ts

import { format, parseISO } from 'date-fns';
import { ro } from 'date-fns/locale';

/**
 * Formatează data pentru afișare
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'd MMMM yyyy', { locale: ro });
}

/**
 * Formatează data pentru input/API (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Obține data curentă în format ISO
 */
export function getTodayISO(): string {
  return formatDateISO(new Date());
}

/**
 * Formatează numărul pentru afișare
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return num.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Clasă utilă pentru Tailwind (merge class names)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}


8. GENERARE PDF
8.1 Template PDF
// components/pdf/RaportPDF.tsx

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from '@react-pdf/renderer';
import {
  RezultatCalcul,
  RaportFormState,
  CATEGORII_MESE,
  CategorieReteta
} from '@/lib/types';
import { formatDate } from '@/lib/utils';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 11
  },
  header: {
    textAlign: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  infoSection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  infoLabel: {
    width: 100,
    fontWeight: 'bold'
  },
  infoValue: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 10
  },
  menuLabel: {
    width: 120,
    color: '#666'
  },
  menuValue: {
    flex: 1
  },
  table: {
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333',
    color: '#fff',
    padding: 8,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8
  },
  tableRowAlt: {
    backgroundColor: '#f9f9f9'
  },
  colDenumire: {
    flex: 2
  },
  colUM: {
    width: 60,
    textAlign: 'center'
  },
  colCantitate: {
    width: 80,
    textAlign: 'right'
  },
  colMacro: {
    width: 60,
    textAlign: 'right'
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#333',
    color: '#fff',
    padding: 8,
    fontWeight: 'bold',
    marginTop: 5
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40
  },
  footerLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
    marginTop: 20
  },
  signature: {
    width: 200
  },
  signatureLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 30
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  timestamp: {
    fontSize: 9,
    color: '#999',
    textAlign: 'right'
  }
});

interface RaportPDFProps {
  formData: RaportFormState;
  rezultat: RezultatCalcul;
  reteteDenumiri: Record<CategorieReteta, string>;
  numeCresa?: string;
}

export function RaportPDF({
  formData,
  rezultat,
  reteteDenumiri,
  numeCresa = 'CREȘA'
}: RaportPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{numeCresa}</Text>
          <Text style={styles.subtitle}>RAPORT ZILNIC BUCĂTĂRIE</Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data:</Text>
            <Text style={styles.infoValue}>{formatDate(formData.data)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bucătar:</Text>
            <Text style={styles.infoValue}>{formData.nume_bucatar}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nr. porții:</Text>
            <Text style={styles.infoValue}>{formData.nr_portii}</Text>
          </View>
        </View>

        {/* Meniul Zilei */}
        <Text style={styles.sectionTitle}>MENIUL ZILEI</Text>
        {(['mic_dejun', 'gustare1', 'ciorba', 'fel_doi', 'gustare2'] as CategorieReteta[]).map(cat => (
          <View key={cat} style={styles.menuItem}>
            <Text style={styles.menuLabel}>{CATEGORII_MESE[cat]}:</Text>
            <Text style={styles.menuValue}>{reteteDenumiri[cat] || '-'}</Text>
          </View>
        ))}

        {/* Ingrediente Folosite */}
        <Text style={styles.sectionTitle}>INGREDIENTE FOLOSITE</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDenumire}>Denumire</Text>
            <Text style={styles.colUM}>U.M.</Text>
            <Text style={styles.colCantitate}>Cantitate</Text>
          </View>
          {rezultat.ingrediente.map((ing, index) => (
            <View
              key={ing.ingredient.id}
              style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
            >
              <Text style={styles.colDenumire}>{ing.ingredient.denumire}</Text>
              <Text style={styles.colUM}>{ing.unitate_raport}</Text>
              <Text style={styles.colCantitate}>{ing.cantitate_raport}</Text>
            </View>
          ))}
        </View>

        {/* Macronutrienți */}
        <Text style={styles.sectionTitle}>VALORI NUTRIȚIONALE PER PORȚIE</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDenumire}>Masă</Text>
            <Text style={styles.colMacro}>Kcal</Text>
            <Text style={styles.colMacro}>Prot.</Text>
            <Text style={styles.colMacro}>Gluc.</Text>
            <Text style={styles.colMacro}>Gras.</Text>
          </View>
          {rezultat.macronutrienti.map((macro, index) => (
            <View
              key={macro.masa}
              style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
            >
              <Text style={styles.colDenumire}>{macro.masa}</Text>
              <Text style={styles.colMacro}>{macro.calorii}</Text>
              <Text style={styles.colMacro}>{macro.proteine}g</Text>
              <Text style={styles.colMacro}>{macro.glucide}g</Text>
              <Text style={styles.colMacro}>{macro.grasimi}g</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.colDenumire}>TOTAL ZILNIC</Text>
            <Text style={styles.colMacro}>{rezultat.total_macronutrienti.calorii}</Text>
            <Text style={styles.colMacro}>{rezultat.total_macronutrienti.proteine}g</Text>
            <Text style={styles.colMacro}>{rezultat.total_macronutrienti.glucide}g</Text>
            <Text style={styles.colMacro}>{rezultat.total_macronutrienti.grasimi}g</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLine}>
            <View style={styles.signature}>
              <Text style={styles.signatureLabel}>Semnătură bucătar:</Text>
              <View style={styles.signatureLine} />
            </View>
            <Text style={styles.timestamp}>
              Generat la: {new Date().toLocaleString('ro-RO')}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

8.2 Funcție Download PDF
// lib/pdf-utils.ts

import { pdf } from '@react-pdf/renderer';
import { RaportPDF } from '@/components/pdf/RaportPDF';
import { RezultatCalcul, RaportFormState, CategorieReteta } from './types';

export async function downloadRaportPDF(
  formData: RaportFormState,
  rezultat: RezultatCalcul,
  reteteDenumiri: Record<CategorieReteta, string>,
  numeCresa?: string
): Promise<void> {
  const blob = await pdf(
    <RaportPDF
      formData={formData}
      rezultat={rezultat}
      reteteDenumiri={reteteDenumiri}
      numeCresa={numeCresa}
    />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `raport-bucatarie-${formData.data}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


9. FLUXURI DE UTILIZARE
9.1 Flux: Creare Raport Zilnic
[START]
    │
    ▼
┌─────────────────────────────────────┐
│ 1. Bucătarul deschide aplicația     │
│    (pagina principală /)            │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 2. Sistemul afișează formularul     │
│    - Data: automat (azi)            │
│    - Verifică dacă există raport    │
│      pentru azi → pre-populează     │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 3. Bucătarul completează:           │
│    - Numele său                     │
│    - Numărul de porții              │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 4. Pentru fiecare masă:             │
│    - Selectează preparat din listă  │
│    - Lista e filtrată pe categorie  │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 5. Click "CALCULEAZĂ"               │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 6. Sistemul:                        │
│    a) Încarcă ingredientele pentru  │
│       fiecare rețetă selectată      │
│    b) Calculează cantități totale   │
│    c) Convertește în unități raport │
│    d) Calculează macronutrienți     │
│    e) Afișează rezultatele          │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 7. Bucătarul verifică rezultatele   │
│    - Poate modifica selecțiile      │
│    - Poate recalcula                │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 8. Click "GENEREAZĂ PDF"            │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 9. Sistemul:                        │
│    a) Salvează raportul în DB       │
│    b) Generează PDF                 │
│    c) Descarcă automat PDF          │
└─────────────────────────────────────┘
    │
    ▼
[END]

9.2 Flux: Adăugare Rețetă
[START]
    │
    ▼
┌─────────────────────────────────────┐
│ 1. Navigare la /retete              │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 2. Click "Adaugă Rețetă"            │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 3. Completează:                     │
│    - Denumire rețetă                │
│    - Categorie (dropdown)           │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 4. Click "Salvează"                 │
│    → Rețeta e creată în DB          │
│    → Redirect la editare            │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 5. Adaugă ingrediente:              │
│    - Selectează ingredient          │
│    - Introduce cantitate/porție     │
│    - Click "Adaugă"                 │
│    - Repetă pentru toate            │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 6. Sistemul afișează:               │
│    - Lista ingrediente adăugate     │
│    - Preview macronutrienți/porție  │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 7. Click "Finalizează"              │
│    → Redirect la lista rețete       │
└─────────────────────────────────────┘
    │
    ▼
[END]

9.3 Flux: Adăugare Ingredient
[START]
    │
    ▼
┌─────────────────────────────────────┐
│ 1. Navigare la /ingrediente         │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 2. Click "Adaugă Ingredient"        │
│    → Se deschide modal              │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 3. Completează:                     │
│    - Denumire                       │
│    - Unitate bază (g/ml/buc)        │
│    - Cantitate per ambalaj          │
│    - Unitate raport (Buc/L/Kg)      │
│    - Macronutrienți per 100         │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 4. Click "Salvează"                 │
│    → Validare date                  │
│    → Salvare în DB                  │
│    → Închide modal                  │
│    → Refresh listă                  │
└─────────────────────────────────────┘
    │
    ▼
[END]


10. DATE INIȚIALE
10.1 Ingrediente Predefinite (Seed Data)
[
  {
    "denumire": "Lapte integral 3.5%",
    "unitate_baza": "ml",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "L",
    "calorii_per_100": 64,
    "proteine": 3.2,
    "glucide": 4.8,
    "grasimi": 3.5
  },
  {
    "denumire": "Ouă",
    "unitate_baza": "buc",
    "cantitate_ambalaj": 1,
    "unitate_raport": "Buc",
    "calorii_per_100": 155,
    "proteine": 13,
    "glucide": 1.1,
    "grasimi": 11
  },
  {
    "denumire": "Făină albă",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 364,
    "proteine": 10,
    "glucide": 76,
    "grasimi": 1
  },
  {
    "denumire": "Piept de pui",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 165,
    "proteine": 31,
    "glucide": 0,
    "grasimi": 3.6
  },
  {
    "denumire": "Cartofi",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 77,
    "proteine": 2,
    "glucide": 17,
    "grasimi": 0.1
  },
  {
    "denumire": "Morcovi",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 41,
    "proteine": 0.9,
    "glucide": 10,
    "grasimi": 0.2
  },
  {
    "denumire": "Ceapă",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 40,
    "proteine": 1.1,
    "glucide": 9,
    "grasimi": 0.1
  },
  {
    "denumire": "Roșii",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 18,
    "proteine": 0.9,
    "glucide": 3.9,
    "grasimi": 0.2
  },
  {
    "denumire": "Orez",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 130,
    "proteine": 2.7,
    "glucide": 28,
    "grasimi": 0.3
  },
  {
    "denumire": "Paste făinoase",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 131,
    "proteine": 5,
    "glucide": 25,
    "grasimi": 1.1
  },
  {
    "denumire": "Unt 82%",
    "unitate_baza": "g",
    "cantitate_ambalaj": 200,
    "unitate_raport": "Buc",
    "calorii_per_100": 717,
    "proteine": 0.9,
    "glucide": 0.1,
    "grasimi": 81
  },
  {
    "denumire": "Brânză telemea",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 250,
    "proteine": 17,
    "glucide": 1,
    "grasimi": 20
  },
  {
    "denumire": "Smântână 20%",
    "unitate_baza": "g",
    "cantitate_ambalaj": 200,
    "unitate_raport": "Buc",
    "calorii_per_100": 206,
    "proteine": 2.8,
    "glucide": 3.4,
    "grasimi": 20
  },
  {
    "denumire": "Iaurt natural",
    "unitate_baza": "g",
    "cantitate_ambalaj": 140,
    "unitate_raport": "Buc",
    "calorii_per_100": 61,
    "proteine": 3.5,
    "glucide": 4.7,
    "grasimi": 3.3
  },
  {
    "denumire": "Cașcaval",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 350,
    "proteine": 25,
    "glucide": 1.3,
    "grasimi": 27
  },
  {
    "denumire": "Carne tocată vită",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 254,
    "proteine": 17,
    "glucide": 0,
    "grasimi": 20
  },
  {
    "denumire": "Carne tocată porc",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 263,
    "proteine": 16,
    "glucide": 0,
    "grasimi": 22
  },
  {
    "denumire": "Pulpe de pui",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 209,
    "proteine": 26,
    "glucide": 0,
    "grasimi": 11
  },
  {
    "denumire": "Pește file",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 82,
    "proteine": 18,
    "glucide": 0,
    "grasimi": 0.7
  },
  {
    "denumire": "Ulei floarea soarelui",
    "unitate_baza": "ml",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "L",
    "calorii_per_100": 884,
    "proteine": 0,
    "glucide": 0,
    "grasimi": 100
  },
  {
    "denumire": "Zahăr",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 387,
    "proteine": 0,
    "glucide": 100,
    "grasimi": 0
  },
  {
    "denumire": "Sare",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 0,
    "proteine": 0,
    "glucide": 0,
    "grasimi": 0
  },
  {
    "denumire": "Pâine albă",
    "unitate_baza": "g",
    "cantitate_ambalaj": 500,
    "unitate_raport": "Buc",
    "calorii_per_100": 265,
    "proteine": 9,
    "glucide": 49,
    "grasimi": 3.2
  },
  {
    "denumire": "Mere",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 52,
    "proteine": 0.3,
    "glucide": 14,
    "grasimi": 0.2
  },
  {
    "denumire": "Banane",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 89,
    "proteine": 1.1,
    "glucide": 23,
    "grasimi": 0.3
  },
  {
    "denumire": "Sfeclă roșie (borcan)",
    "unitate_baza": "g",
    "cantitate_ambalaj": 360,
    "unitate_raport": "Buc",
    "calorii_per_100": 43,
    "proteine": 1.7,
    "glucide": 7.6,
    "grasimi": 0.1
  },
  {
    "denumire": "Mazăre conservă",
    "unitate_baza": "g",
    "cantitate_ambalaj": 400,
    "unitate_raport": "Buc",
    "calorii_per_100": 68,
    "proteine": 5,
    "glucide": 11,
    "grasimi": 0.4
  },
  {
    "denumire": "Porumb conservă",
    "unitate_baza": "g",
    "cantitate_ambalaj": 340,
    "unitate_raport": "Buc",
    "calorii_per_100": 86,
    "proteine": 3.2,
    "glucide": 19,
    "grasimi": 1.2
  },
  {
    "denumire": "Ton conservă",
    "unitate_baza": "g",
    "cantitate_ambalaj": 160,
    "unitate_raport": "Buc",
    "calorii_per_100": 116,
    "proteine": 26,
    "glucide": 0,
    "grasimi": 1
  },
  {
    "denumire": "Pastă de tomate",
    "unitate_baza": "g",
    "cantitate_ambalaj": 200,
    "unitate_raport": "Buc",
    "calorii_per_100": 82,
    "proteine": 4.3,
    "glucide": 19,
    "grasimi": 0.5
  },
  {
    "denumire": "Biscuiți simpli",
    "unitate_baza": "g",
    "cantitate_ambalaj": 200,
    "unitate_raport": "Buc",
    "calorii_per_100": 433,
    "proteine": 6.5,
    "glucide": 74,
    "grasimi": 13
  },
  {
    "denumire": "Griș",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 360,
    "proteine": 11,
    "glucide": 73,
    "grasimi": 1
  },
  {
    "denumire": "Fulgi de ovăz",
    "unitate_baza": "g",
    "cantitate_ambalaj": 500,
    "unitate_raport": "Buc",
    "calorii_per_100": 389,
    "proteine": 17,
    "glucide": 66,
    "grasimi": 7
  },
  {
    "denumire": "Mălai",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 362,
    "proteine": 8.1,
    "glucide": 79,
    "grasimi": 1.2
  },
  {
    "denumire": "Cacao pudră",
    "unitate_baza": "g",
    "cantitate_ambalaj": 100,
    "unitate_raport": "Buc",
    "calorii_per_100": 228,
    "proteine": 20,
    "glucide": 58,
    "grasimi": 14
  },
  {
    "denumire": "Gem/Dulceață",
    "unitate_baza": "g",
    "cantitate_ambalaj": 370,
    "unitate_raport": "Buc",
    "calorii_per_100": 250,
    "proteine": 0.4,
    "glucide": 60,
    "grasimi": 0.1
  },
  {
    "denumire": "Miere",
    "unitate_baza": "g",
    "cantitate_ambalaj": 400,
    "unitate_raport": "Buc",
    "calorii_per_100": 304,
    "proteine": 0.3,
    "glucide": 82,
    "grasimi": 0
  },
  {
    "denumire": "Varză albă",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 25,
    "proteine": 1.3,
    "glucide": 6,
    "grasimi": 0.1
  },
  {
    "denumire": "Fasole boabe",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 333,
    "proteine": 21,
    "glucide": 60,
    "grasimi": 1.2
  },
  {
    "denumire": "Dovlecei",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 17,
    "proteine": 1.2,
    "glucide": 3.1,
    "grasimi": 0.3
  },
  {
    "denumire": "Spanac",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 23,
    "proteine": 2.9,
    "glucide": 3.6,
    "grasimi": 0.4
  },
  {
    "denumire": "Broccoli",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 34,
    "proteine": 2.8,
    "glucide": 7,
    "grasimi": 0.4
  },
  {
    "denumire": "Conopidă",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 25,
    "proteine": 1.9,
    "glucide": 5,
    "grasimi": 0.3
  },
  {
    "denumire": "Țelină rădăcină",
    "unitate_baza": "g",
    "cantitate_ambalaj": 1000,
    "unitate_raport": "Kg",
    "calorii_per_100": 42,
    "proteine": 1.5,
    "glucide": 9,
    "grasimi": 0.3
  },
  {
    "denumire": "Pătrunjel verde",
    "unitate_baza": "g",
    "cantitate_ambalaj": 100,
    "unitate_raport": "Buc",
    "calorii_per_100": 36,
    "proteine": 3,
    "glucide": 6,
    "grasimi": 0.8
  }
]


11. DEPLOYMENT
11.1 Variabile de Mediu
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Nume creșă pentru PDF
NEXT_PUBLIC_NUME_CRESA="Creșa Soarele"

11.2 Pași Deployment
1. SUPABASE SETUP
   ├── Creează cont pe supabase.com
   ├── Creează proiect nou
   ├── Rulează SQL schema (din secțiunea 4.2)
   ├── Copiază URL și anon key
   └── Configurează RLS policies

2. VERCEL SETUP
   ├── Creează cont pe vercel.com
   ├── Conectează repository GitHub
   ├── Adaugă variabilele de mediu
   └── Deploy

3. SEED DATABASE
   ├── Rulează scriptul de seed
   └── Verifică datele în Supabase dashboard

4. TESTARE
   ├── Testează pe URL-ul Vercel
   ├── Verifică funcționalitățile
   └── Testează generarea PDF


12. INSTRUCȚIUNI IMPLEMENTARE
12.1 Pentru GitHub Copilot
# INSTRUCȚIUNI PENTRU GITHUB COPILOT

## Context
Implementează o aplicație web pentru bucătăria unei creșe care generează
rapoarte zilnice cu ingredientele folosite și calculează macronutrienții.

## Stack Tehnologic
- Next.js 14 (App Router) cu TypeScript
- Tailwind CSS + shadcn/ui pentru UI
- Supabase pentru backend și bază de date PostgreSQL
- @react-pdf/renderer pentru generare PDF

## Ordinea Implementării

### Faza 1: Setup Proiect
1. Creează proiect Next.js: `npx create-next-app@latest bucatarie-cresa --typescript --tailwind --app`
2. Instalează dependențe: `npm install @supabase/supabase-js @react-pdf/renderer date-fns`
3. Configurează shadcn/ui: `npx shadcn-ui@latest init`
4. Adaugă componente shadcn: button, input, select, dialog, table, card
5. Creează structura de foldere conform secțiunii 3

### Faza 2: Baza de Date
1. Creează tabelele în Supabase conform SQL din secțiunea 4.2
2. Configurează RLS policies
3. Creează fișierul lib/supabase.ts cu clientul și funcțiile CRUD
4. Creează lib/types.ts cu toate interfețele TypeScript

### Faza 3: Logica de Business
1. Implementează lib/calculations.ts cu funcțiile de calcul
2. Implementează lib/utils.ts cu funcțiile utilitare
3. Testează calculele cu date mock

### Faza 4: Componente UI
1. Implementează layout-ul principal (Header, Navigation)
2. Implementează pagina principală (/) cu formularul de raport
3. Implementează componentele pentru selectare mese
4. Implementează afișarea rezultatelor

### Faza 5: CRUD Rețete și Ingrediente
1. Implementează /ingrediente cu listă și formular CRUD
2. Implementează /retete cu listă și formular CRUD
3. Implementează editarea rețetelor cu adăugare ingrediente

### Faza 6: Generare PDF
1. Implementează components/pdf/RaportPDF.tsx
2. Implementează funcția de download PDF
3. Testează generarea și descărcarea

### Faza 7: Istoric și Finalizare
1. Implementează /istoric cu lista rapoartelor
2. Adaugă funcția de cleanup pentru rapoarte vechi
3. Seed database cu ingrediente inițiale
4. Testare completă

## Reguli de Cod
- Folosește TypeScript strict
- Folosește async/await pentru operații asincrone
- Tratează erorile cu try/catch
- Folosește componente funcționale React
- Folosește hooks pentru state management
- Comentează funcțiile complexe
- Folosește convenții de denumire consistente

12.2 Checklist Implementare
## ✅ CHECKLIST IMPLEMENTARE

### Setup
- [ ] Proiect Next.js creat
- [ ] Dependențe instalate
- [ ] shadcn/ui configurat
- [ ] Structura foldere creată
- [ ] Variabile mediu configurate

### Baza de Date
- [ ] Tabele create în Supabase
- [ ] RLS policies configurate
- [ ] Client Supabase funcțional
- [ ] Funcții CRUD implementate

### Tipuri TypeScript
- [ ] Interfețe ingrediente
- [ ] Interfețe rețete
- [ ] Interfețe rapoarte
- [ ] Interfețe rezultate calcul
- [ ] Enums și constante

### Pagini
- [ ] Layout principal cu navigare
- [ ] Pagina raport zilnic (/)
- [ ] Pagina ingrediente (/ingrediente)
- [ ] Pagina rețete (/retete)
- [ ] Pagina editare rețetă (/retete/[id])
- [ ] Pagina istoric (/istoric)

### Funcționalități
- [ ] Selectare preparate per masă
- [ ] Calcul cantități ingrediente
- [ ] Calcul macronutrienți
- [ ] Conversie unități raport
- [ ] CRUD ingrediente
- [ ] CRUD rețete
- [ ] Adăugare ingrediente la rețete
- [ ] Generare PDF
- [ ] Descărcare PDF
- [ ] Salvare raport în DB
- [ ] Afișare istoric 7 zile
- [ ] Cleanup rapoarte vechi

### Testare
- [ ] Testare calcule
- [ ] Testare CRUD
- [ ] Testare PDF
- [ ] Testare responsive
- [ ] Testare pe multiple dispozitive

### Deployment
- [ ] Seed database cu ingrediente
- [ ] Deploy pe Vercel
- [ ] Verificare funcționalități în producție


📝 NOTE FINALE
Extensii Viitoare Posibile

Autentificare - dacă se dorește în viitor
Planificare săptămânală - meniu pe întreaga săptămână
Rapoarte lunare - statistici și consumuri
Notificări - alertă stocuri scăzute
Import/Export - backup date

Limitări Hosting Gratuit

Supabase Free: 500MB storage, 2 proiecte
Vercel Free: 100GB bandwidth/lună

```
