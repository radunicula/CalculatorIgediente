# ✅ Checklist Implementare - Quick Reference

## 🎯 Ce Am Făcut Până Acum

### ✅ Fundație (100%)
- [x] Proiect Next.js 14 creat
- [x] Dependințe instalate (Supabase, PDF, date-fns)
- [x] Schema SQL completă (`database-schema.sql`)
- [x] TypeScript types (`lib/types.ts`)
- [x] Supabase client + CRUD (`lib/supabase.ts`)
- [x] Logică calcule (`lib/calculations.ts`)
- [x] Utilități (`lib/utils.ts`)
- [x] Componente UI (Button, Input, Card, Select, Table)
- [x] Layout + Header + Navigare
- [x] Structură pagini (/, /retete, /ingrediente, /istoric)
- [x] Date seed (ingrediente-initiale.json)
- [x] Documentație (README, DEPLOYMENT_GUIDE)

---

## 🚧 Ce Trebuie Făcut

### 1️⃣ DIALOG COMPONENT (Necesar primul!)
**Fișier**: `components/ui/dialog.tsx`

```typescript
// Componentă modal pentru adăugare/editare
// Folosit de toate paginile CRUD
```

**Estimat**: 30 min

---

### 2️⃣ CUSTOM HOOKS (Necesar al doilea!)

#### `hooks/useIngrediente.ts`
```typescript
export function useIngrediente() {
  const [ingrediente, setIngrediente] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // loadIngrediente()
  // addIngredient(data)
  // updateIngredient(id, data)
  // deleteIngredient(id)

  return { ingrediente, loading, error, ... };
}
```

**Estimat**: 1h (toate 3 hooks)

---

### 3️⃣ PAGINA INGREDIENTE (Prima funcțională!)

#### `app/ingrediente/page.tsx`
- [ ] Tabel cu ingrediente (folosind useIngrediente)
- [ ] Buton "Adaugă Ingredient" (deschide Dialog)
- [ ] Dialog Form cu validare
- [ ] Edit/Delete per ingredient

#### `components/ingrediente/IngredientForm.tsx`
- [ ] Form pentru create/edit
- [ ] Validare toate câmpurile
- [ ] Submit handler

**Estimat**: 2-3h

---

### 4️⃣ PAGINA REȚETE

#### `app/retete/page.tsx`
- [ ] Listă rețete (grupate pe categorii)
- [ ] Buton "Adaugă Rețetă"
- [ ] Link către editare rețetă
- [ ] Delete rețetă

**Estimat**: 1-2h

---

### 5️⃣ EDITARE REȚETĂ

#### `app/retete/[id]/page.tsx` (NOU!)
- [ ] Detalii rețetă
- [ ] Listă ingrediente din rețetă
- [ ] Form adăugare ingredient
- [ ] Cantitate per porție
- [ ] Preview macronutrienți
- [ ] Edit/Delete ingrediente din rețetă

**Estimat**: 2-3h

---

### 6️⃣ PAGINA RAPORT ZILNIC (CEA MAI COMPLEXĂ!)

#### `app/page.tsx`
- [ ] Form: data, bucătar, nr. porții
- [ ] 5 dropdown-uri pentru mese
- [ ] Buton "Calculează"
- [ ] Afișare rezultate:
  - Tabel ingrediente
  - Tabel macronutrienți
  - Total
- [ ] Buton "Generează PDF"
- [ ] Buton "Salvează Raport"

#### `components/raport/*.tsx`
- [ ] RaportForm.tsx
- [ ] MealSelector.tsx
- [ ] RezultatCalcul.tsx
- [ ] MacronutrientiTable.tsx

**Estimat**: 3-4h

---

### 7️⃣ GENERARE PDF

#### `components/pdf/RaportPDF.tsx` (NOU!)
```typescript
import { Document, Page, Text, View } from '@react-pdf/renderer';

export function RaportPDF({ formData, rezultat, reteteDenumiri }) {
  return (
    <Document>
      <Page>
        {/* Template conform specificațiilor */}
      </Page>
    </Document>
  );
}
```

#### `lib/pdf-utils.ts` (NOU!)
```typescript
import { pdf } from '@react-pdf/renderer';

export async function downloadRaportPDF(...) {
  const blob = await pdf(<RaportPDF ... />).toBlob();
  // Download logic
}
```

**Estimat**: 2-3h

---

### 8️⃣ PAGINA ISTORIC

#### `app/istoric/page.tsx`
- [ ] Tabel ultimele 7 rapoarte
- [ ] Coloane: Data, Bucătar, Porții, Mese
- [ ] Buton "Descarcă PDF" per raport
- [ ] Buton "Șterge" per raport

**Estimat**: 1-2h

---

## 📊 Estimări Timp

| Componentă | Prioritate | Timp Estimat |
|-----------|-----------|--------------|
| Dialog Component | 🔴 CRITICĂ | 30 min |
| Custom Hooks | 🔴 CRITICĂ | 1h |
| Ingrediente Page | 🟠 MARE | 2-3h |
| Rețete Page | 🟠 MARE | 1-2h |
| Editare Rețetă | 🟠 MARE | 2-3h |
| Raport Zilnic | 🟡 MEDIE | 3-4h |
| Generare PDF | 🟡 MEDIE | 2-3h |
| Istoric Page | 🟢 MICĂ | 1-2h |

**TOTAL ESTIMAT: 13-20 ore**

---

## 🏃 Quick Start Guide

### Pentru Dezvoltare Locală

```bash
# 1. Setup
cd bucatarie-cresa
npm install

# 2. Configurare Supabase
# - Creează proiect în supabase.com
# - Rulează database-schema.sql
# - Copiază keys în .env.local

# 3. Pornește dev server
npm run dev
```

### Pentru Implementare Features

**Ordinea recomandată**:
1. Dialog → 2. Hooks → 3. Ingrediente → 4. Rețete → 5. Editare → 6. Raport → 7. PDF → 8. Istoric

### Pentru Testing

```bash
# Build test
npm run build

# Verifică TypeScript
npm run type-check # (dacă există script)

# Rulează local production build
npm run build && npm start
```

---

## 💾 Template Code Snippets

### Dialog Component Template
```typescript
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
```

### Custom Hook Template
```typescript
'use client';

import { useState, useEffect } from 'react';
import { getIngrediente, createIngredient, updateIngredient, deleteIngredient } from '@/lib/supabase';
import type { Ingredient, IngredientCreate } from '@/lib/types';

export function useIngrediente() {
  const [ingrediente, setIngrediente] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIngrediente = async () => {
    try {
      setLoading(true);
      const data = await getIngrediente();
      setIngrediente(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngrediente();
  }, []);

  const addIngredient = async (data: IngredientCreate) => {
    try {
      const newIngredient = await createIngredient(data);
      setIngrediente(prev => [...prev, newIngredient]);
      return newIngredient;
    } catch (err) {
      throw err;
    }
  };

  return {
    ingrediente,
    loading,
    error,
    loadIngrediente,
    addIngredient,
    // ... etc
  };
}
```

---

## 🐛 Common Issues & Solutions

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
- Verifică că toate import-urile au `@/` prefix
- Verifică că toate type-urile sunt definite în `lib/types.ts`

### Supabase Connection
- Verifică `.env.local` există și e completat
- Verifică că variabilele încep cu `NEXT_PUBLIC_`
- Repornește dev server după modificare `.env.local`

---

## 📝 Notes

- Toate componentele sunt `'use client'` (folosesc hooks)
- Folosește `try-catch` pentru toate API calls
- Adaugă `loading` state pentru toate operațiuni async
- Validează input-uri înainte de submit
- Folosește TypeScript strict mode

---

**Ready to implement? Start with Dialog Component! 🚀**
