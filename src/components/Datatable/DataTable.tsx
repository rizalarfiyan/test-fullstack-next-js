'use client'

import { Column, Table, flexRender } from '@tanstack/react-table'
import { ArrowDownAZ, ArrowDownUp, ArrowUpZA } from 'lucide-react'

import useDataTable from './hook'
// import Pagination from '../Pagination'

import { BaseApiResponse, BaseError, BaseResponse, BaseResponseList, QueryParams, QuerySorting } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Ref } from 'react'
import { DataTableView } from '.'
import { table } from 'console'

export interface DataTableProps {
  tableRef?: Ref<DataTableHandle> | null
  apiController: (params?: any) => BaseResponse<BaseResponseList<any>, BaseError<BaseApiResponse<any>>>
  keyId?: string
  perPage?: number
  debounceSorting?: number
  query?: QueryParams
  columns: ColumnDef<any>[]
  defaultSort?: QuerySorting
  className?: string
  actions?: (idx: string, row: any) => React.ReactNode
  rowClassName?: (row: any) => string
  hasSelection?: boolean
  onSelectionChange?: (selection: any[]) => void
  buttonActions?: (table: Table<any>) => React.ReactNode
}

export interface DataTableHandle {
  update: () => void
}

export type DataTableColumn = ColumnDef<any>[]

export type DataTableStatus = { icon: React.ReactNode; message: string } | null | undefined

export const DataTable = (props: DataTableProps) => {
  const { table, getHeaderGroups, getRowModel, status, currentPage, pageCount, perPage, onPageChange } =
    useDataTable(props)

  return (
    <>
      {props.buttonActions?.(table)}
      <div className={cn('relative flex min-h-[580px] flex-col overflow-hidden rounded-md bg-white', props.className)}>
        {status ? (
          <div className='flex min-h-[580px] w-full flex-col items-center justify-center text-stone-500'>
            {status.icon}
            <h3 className='mt-1 font-semibold'>{status.message}</h3>
          </div>
        ) : (
          <div className='flex min-h-[490px] items-start overflow-x-auto border-b border-b-stone-200'>
            <table className='min-w-full table-fixed divide-y divide-stone-200'>
              <thead>
                {getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <td
                        key={header.id}
                        className='w-0 overflow-hidden whitespace-nowrap px-6 py-3 text-left text-base font-bold tracking-wider'
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn([
                              'flex items-center justify-between',
                              header.column.getCanSort() && 'cursor-pointer select-none',
                            ])}
                            role='presentation'
                            {...{
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                            <div>
                              {{
                                asc: <ArrowDownAZ className='h-5 w-5 text-stone-600' />,
                                desc: <ArrowUpZA className='h-5 w-5 text-stone-600' />,
                              }[header.column.getIsSorted() as string] ??
                                (header.column.getCanSort() ? (
                                  <ArrowDownUp className='h-5 w-5 text-stone-300' />
                                ) : null)}
                            </div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className='divide-y divide-stone-200 bg-white text-stone-800'>
                {getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn('hover:bg-slate-100 active:bg-slate-200', props?.rowClassName?.(row.original))}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td aria-hidden='true' className='px-6 py-4' key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!status && (
          <div className='flex flex-col items-center justify-center px-4 py-6 md:flex-row md:justify-between md:px-6'>
            <div>
              Showing <b>{pageCount === 0 ? 0 : currentPage}</b> to <b>{Math.ceil(pageCount / perPage)}</b> of{' '}
              <b>{pageCount}</b> entries
            </div>
            <nav aria-label='Pagination' className='mt-4 md:m-0'>
              {/* <Pagination
              className='pagination'
              currentPage={currentPage}
              totalCount={pageCount}
              pageSize={perPage}
              onPageChange={onPageChange}
            /> */}
            </nav>
          </div>
        )}
      </div>
    </>
  )
}

DataTable.displayName = 'DataTable'

export default DataTable
