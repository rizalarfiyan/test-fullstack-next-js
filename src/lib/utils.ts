import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
