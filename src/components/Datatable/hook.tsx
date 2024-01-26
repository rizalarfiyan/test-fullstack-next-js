import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { useCallback, useImperativeHandle, useMemo, useState } from 'react'
import { Box } from 'lucide-react'
import { DataTableProps, DataTableStatus } from './DataTable'
import useDebounce from '@/hooks/useDebounce'
import Spinner from '@/components/Spinner'
import Checkbox from '@/components/Checkbox'

const useDataTable = (props: DataTableProps) => {
  const {
    tableRef,
    apiController,
    columns,
    keyId = 'id',
    perPage = 10,
    debounceSorting = 400,
    actions,
    query,
    defaultSort,
    hasSelection = false,
  } = props
  const [rowSelection, setRowSelection] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])
  const [prevQuery, setPrevQuery] = useState<any>(null)

  const sortingCallback = useCallback(() => {
    if (sorting.length < 1) return {}
    return {
      sort_by: sorting[0].desc ? 'desc' : 'asc',
      sort_order: sorting[0].id,
    }
  }, [sorting])

  const sortingValue = useDebounce(sortingCallback, debounceSorting)

  const condition = useMemo(() => {
    if (query !== prevQuery) {
      setCurrentPage(1)
      setPrevQuery(query)
    }

    return {
      page: currentPage,
      limit: perPage,
      ...(query || {}),
      ...defaultSort,
      ...sortingValue,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage, query, defaultSort, sortingValue])

  const { data, isFetching, isError, error, refetch, isLoading } = useQuery({
    queryKey: [apiController.name, condition],
    queryFn: () => apiController(condition),
  })

  const memoizedData = useMemo(() => {
    return data?.data?.content || []
  }, [data])

  const memoizedColumns = useMemo(
    () => [
      ...(hasSelection
        ? [
            {
              id: 'select',
              header: ({ table }: any) => (
                <Checkbox
                  checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label='Select all'
                />
              ),
              cell: ({ row }: any) => (
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label='Select row'
                />
              ),
              enableSorting: false,
              enableHiding: false,
            },
          ]
        : []),
      ...columns,
      ...(actions
        ? [
            {
              header: 'Action',
              cell: (value: any) => {
                const idx = value?.row?.original?.[keyId] || ''
                return actions?.(idx, value?.row?.original)
              },
            },
          ]
        : []),
    ],
    [hasSelection, columns, actions, keyId]
  )

  const pageCount: number = data?.data?.metadata?.total?.data || 0
  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: {
      enableSorting: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount,
    manualSorting: true,
  })

  useImperativeHandle(tableRef, () => ({
    update: () => {
      refetch()
    },
    resetSelection: () => {
      setRowSelection({})
    },
  }))

  const selectedData = useMemo(() => {
    const newData = []
    for (let index in rowSelection) {
      const idx = parseInt(index)
      if (isNaN(idx) || !memoizedData[idx]) {
        continue
      }
      newData.push(memoizedData[idx])
    }
    return newData
  }, [memoizedData, rowSelection])

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
    getHeaderGroups: table.getHeaderGroups,
    getRowModel: table.getRowModel,
    currentPage,
    pageCount,
    perPage,
    onPageChange,
    table,
    selectedData,
    data: data?.data,
  }
}

export default useDataTable
