// Importing `clsx` for conditional className handling and its type definition
import { clsx, type ClassValue } from "clsx"
// Importing `twMerge` to merge Tailwind CSS class names and handle conflicts
import { twMerge } from "tailwind-merge"
// Utility function to combine and merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function formatCurrency(value: number) {
  const finalValue = convertAmountFromMiliunits(value);
  
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(finalValue);
}

export function calculatePercentageChange(
  current: number, 
  previous: number,
) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}