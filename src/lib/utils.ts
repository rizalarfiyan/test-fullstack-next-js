import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

export function queryNumber(defaultValue: number, value?: string | null): number {
  if (!value) return defaultValue
  const parsedValue = Number(value)
  return isNaN(parsedValue) ? defaultValue : parsedValue
}

export function queryString(value?: string | null, defaultValue: string | null = null): string | null {
  if (!value) return defaultValue
  return value
}

export function queryInArray(
  array: string[],
  value?: string | null,
  defaultValue: string | null = null
): string | null {
  value = value?.toLowerCase()?.trim()
  if (!value || !array.includes(value)) return defaultValue
  return value
}

export function queryBoolean(value?: string | null, defaultValue: boolean = false): boolean {
  if (!value) return defaultValue
  return value === 'true'
}
