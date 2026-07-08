import { clsx, type ClassValue } from "clsx" // merges all css files
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
