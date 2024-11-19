// Importing `clsx` for conditional className handling and its type definition
import { clsx, type ClassValue } from "clsx"
// Importing `twMerge` to merge Tailwind CSS class names and handle conflicts
import { twMerge } from "tailwind-merge"
// Utility function to combine and merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
