import { Column, Table } from '@tanstack/react-table'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { validate } from 'uuid'

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

export function filterValidUUIDs(arr: string[]): string[] {
  const uniqueIDs: string[] = []
  for (const item of arr) {
    if (validate(item)) {
      const uuid = item.toLowerCase()
      if (!uniqueIDs.includes(uuid)) {
        uniqueIDs.push(uuid)
      }
    }
  }
  return uniqueIDs
}

export function stringUndefined(value?: string): string | undefined {
  if (!value || value.trim() === '') return undefined
  return value
}

export function getAvailableColumn(table?: Table<any>): Column<any, unknown>[] {
  return (
    table?.getAllColumns().filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()) || []
  )
}

export function downloadFile(blob: Blob, fileName: string, extension: string) {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = getFileName(fileName, extension)
  link.click()
  window.URL.revokeObjectURL(link.href)
}

export function getFileName(fileName: string, extension: string) {
  return `${fileName}-${+new Date()}.${extension}`
}
