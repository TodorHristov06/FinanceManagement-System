import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

// Utility function to merge class names using Tailwind's merge function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Converts an amount from miliunits to base units (USD)
export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

// Converts an amount from base units (USD) to miliunits
export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

// Formats a numeric value into currency format (USD)
export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

// Calculates the percentage change between two values
export function calculatePercentageChange(
  current: number, 
  previous: number,
) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }
  return ((current - previous) / previous) * 100;
}

// Fills in missing days with zero values for income and expenses within a given date range
export function fillMissingDays (
  activeDays: {
    date: Date,
    income: number,
    expenses: number,
  }[],
  startDate: Date,
  endDate: Date,
) {
  if(activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Map over all the days in the range and fill missing data with zeros
  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) {
      return found;
    }else {
      return {
        date: day,
        income: 0,
        expenses: 0,
      }
    }
  })

  return transactionsByDay
}

// Type definition for a date range period
type Period = {
  from: string | Date | undefined
  to: string | Date | undefined
}

// Formats a date range for display, e.g., 'Jan 01 - Feb 01, 2025'
export function formatDateRange (period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if(!period?.from){
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  if(period.to){
    return `${format(period.from, "LLL dd")} - ${format(period.to, "LLL dd, y")}`;
  }

  return format(period.from, "LLL dd, y");
}

// Formats a percentage value with an optional prefix
export function formatPercentage (
  value: number,
  options: { addPrefix?: boolean} = {
    addPrefix: false
  },
) {
  const result = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(value / 100);

  // Optionally adds a plus sign if the value is positive and addPrefix is true
  if (options.addPrefix && value > 0) {
    return `+${result}`;  
  }

  return result;
}