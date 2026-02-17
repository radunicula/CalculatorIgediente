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
