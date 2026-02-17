// lib/utils.ts

/**
 * Parsează un date string (YYYY-MM-DD sau ISO format) într-un obiect Date
 * Ensures the date is parsed in local timezone
 */
export function parseDate(dateStr: string): Date {
  const datePortion = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  return new Date(datePortion + 'T00:00:00');
}

/**
 * Formatează data pentru afișare în română
 */
export function formatDateRomanian(dateStr: string): string {
  const date = parseDate(dateStr);
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formatează data pentru input/API (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
type ClassValue = string | undefined | null | false | Record<string, boolean>;

export function cn(...classes: ClassValue[]): string {
  return classes
    .flatMap(c => {
      if (typeof c === 'object' && c !== null) {
        return Object.keys(c).filter(key => c[key]);
      }
      return c;
    })
    .filter(Boolean)
    .join(' ');
}
