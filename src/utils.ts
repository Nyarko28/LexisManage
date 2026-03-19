import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = 'GHS') {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format large numbers for chart Y-axis (e.g. GHS 1.2k, GHS 500, GHS 1.2M) */
export function formatChartValue(value: number, currency: string = 'GHS'): string {
  if (value >= 1_000_000) return `${currency} ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${currency} ${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}k`;
  return `${currency} ${value}`;
}
