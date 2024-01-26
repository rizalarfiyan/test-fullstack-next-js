import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/DropdownMenu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Column, Table } from '@tanstack/react-table'
import { useMemo } from 'react'

interface DataTableViewProps {
  table?: Table<any>
  children?: React.ReactNode
}

export function DataTableView({ table, children }: DataTableViewProps) {
  const column = useMemo(() => {
    return (
      table?.getAllColumns().filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()) || []
    )
  }, [table])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[180px]'>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {column.map((col) => {
          return (
            <DropdownMenuCheckboxItem
              key={col.id}
              className='capitalize'
              checked={col.getIsVisible()}
              onCheckedChange={(value) => col.toggleVisibility(!!value)}
            >
              {col.columnDef.header?.toString() || col.id}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
