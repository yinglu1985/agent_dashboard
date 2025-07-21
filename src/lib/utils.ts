import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, subMonths } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatPercentage(num: number): string {
  return (num * 100).toFixed(1) + '%';
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return (current - previous) / previous;
}

export function generateMonthRange(months: number = 12): string[] {
  const result: string[] = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    result.push(format(date, 'yyyy-MM'));
  }
  
  return result;
}

export function formatMonthLabel(monthString: string): string {
  try {
    const date = parseISO(`${monthString}-01`);
    return format(date, 'MMM yyyy');
  } catch {
    return monthString;
  }
}

export function getMonthFromDate(date: Date): string {
  return format(date, 'yyyy-MM');
}