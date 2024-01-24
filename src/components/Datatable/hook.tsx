import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { Box } from 'lucide-react'
import { useCallback, useImperativeHandle, useMemo, useState } from 'react'

import useDebounce from '@/hooks/useDebounce'

import { DataTableProps, DataTableStatus } from './DataTable.types'
import Spinner from '../Spinner'

const useDataTable = (props: DataTableProps) => {
  const {
    tableRef,
    apiController,
    columns,
    keyId = 'id',
    perPage = 10,
    debounceSorting = 400,
    hasAutoNumber = false,
    actions,
    query,
    defaultSort,
  } = props

  const [currentPage, setCurrentPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])

  const sortingCallback = useCallback(() => {
    if (sorting.length < 1) return {}
    return {
      order: sorting[0].desc ? 'desc' : 'asc',
      order_by: sorting[0].id,
    }
  }, [sorting])

  const sortingValue = useDebounce(sortingCallback, debounceSorting)

  const condition = useMemo(() => {
    return {
      page: currentPage,
      limit: perPage,
      ...(query || {}),
      ...defaultSort,
      ...sortingValue,
    }
  }, [currentPage, perPage, query, defaultSort, sortingValue])

  const { data, isFetching, isError, error, refetch, isLoading } = useQuery({
    queryKey: [apiController.name, condition],
    queryFn: () => apiController(condition),
  })

  useImperativeHandle(tableRef, () => ({
    update: () => {
      refetch()
    },
  }))

  const memoizedData = useMemo(() => {
    const getData = data?.data.content || []
    if (!hasAutoNumber) return getData
    return getData.map((val, idx) => ({
      ...val,
      ...(hasAutoNumber && {
        autoNumber: idx + 1 + (currentPage - 1) * perPage,
      }),
    }))
  }, [data, currentPage, perPage, hasAutoNumber])

  const memoizedColumns = useMemo(
    () => [
      ...(hasAutoNumber
        ? [
            {
              accessorKey: 'autoNumber',
              header: 'No',
            },
          ]
        : []),
      ...columns,
      ...(actions
        ? [
            {
              header: 'Action',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cell: (value: any) => {
                const idx = value?.row?.original?.[keyId] || ''
                return actions?.(idx, value?.row?.original)
              },
            },
          ]
        : []),
    ],
    [columns, hasAutoNumber, actions, keyId]
  )

  const pageCount = data?.data?.metadata?.total || 0
  const { getHeaderGroups, getRowModel } = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: {
      enableSorting: false,
    },
    manualPagination: true,
    pageCount,
    manualSorting: true,
  })

  const status: DataTableStatus = useMemo(() => {
    if (isError) {
      return {
        icon: <Box className='h-12 w-12' />,
        message: error.message,
      }
    }
    if (!isFetching && memoizedData.length === 0) {
      return {
        icon: <Box className='h-12 w-12' />,
        message: 'No Data Found',
      }
    }
    if (isFetching || isLoading) {
      return {
        icon: <Spinner className='mb-2 h-8 w-8' />,
        message: 'Loading...',
      }
    }
    return null
  }, [error, isError, isFetching, memoizedData, isLoading])

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  return {
    status,
    getHeaderGroups,
    getRowModel,
    currentPage,
    pageCount,
    perPage,
    onPageChange,
  }
}

export default useDataTable
