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
