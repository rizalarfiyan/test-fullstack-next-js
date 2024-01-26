'use client'

import { Button } from '@/components/Button'
import { LIMIT_PERPAGE_DEFAULT, LIST_LIMIT_PERPAGE } from '@/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'
import { ChevronDown, Eye, FileBarChart, PlusCircle, Recycle, Trash } from 'lucide-react'
import React, { useRef, useState } from 'react'
import DataTable, { DataTableColumn, DataTableHandle, DataTableView } from '@/components/Datatable'
import { getAll } from '@/service/student'
import FormFilter from './FormFilter'

const columns: DataTableColumn = [
  {
    accessorKey: 'sequence',
    header: 'No',
    enableSorting: true,
  },
  {
    accessorKey: 'nim',
    header: 'NIM',
    enableSorting: true,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'university_name',
    header: 'University Name',
    enableSorting: true,
  },
]

export default function Student() {
  const tableRef = useRef<DataTableHandle>(null)

  const [limit, setLimit] = useState(LIMIT_PERPAGE_DEFAULT)
  const [filter, setFilter] = useState<object>({})

  const onChangeLimit = (value: string) => {
    setLimit(parseInt(value))
  }

  return (
    <div className='m-10 p-5 rounded-md bg-white flex flex-col gap-6 w-full'>
      <DataTable
        tableRef={tableRef}
        columns={columns}
        apiController={getAll}
        perPage={limit}
        hasSelection
        buttonActions={(table) => {
          return (
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Button state='primary' variant='solid'>
                  Active
                </Button>
                <Button variant='outline' leftIcon={<Recycle className='mr-2' />}>
                  Recycle Bin (1)
                </Button>
                <Button variant='outline' leftIcon={<PlusCircle className='mr-2' />}>
                  Create
                </Button>
                <Button variant='outline' leftIcon={<Trash className='mr-2' />}>
                  Bulk Delete
                </Button>
                <Button
                  variant='outline'
                  leftIcon={<FileBarChart className='mr-2' />}
                  rightIcon={<ChevronDown className='ml-2' />}
                >
                  Export
                </Button>
                <DataTableView table={table}>
                  <Button
                    variant='outline'
                    leftIcon={<Eye className='mr-2' />}
                    rightIcon={<ChevronDown className='ml-2' />}
                  >
                    Show
                  </Button>
                </DataTableView>
                <FormFilter onFilterChange={setFilter} />
              </div>
              <div className='flex items-center gap-4'>
                <span>Display</span>
                <Select onValueChange={onChangeLimit} defaultValue={`${LIMIT_PERPAGE_DEFAULT}`}>
                  <SelectTrigger className='w-20'>
                    <SelectValue placeholder={`${LIMIT_PERPAGE_DEFAULT}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {LIST_LIMIT_PERPAGE.map((limit, key) => {
                      return (
                        <SelectItem value={`${limit}`} key={key}>
                          {limit}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )
        }}
        query={{
          ...filter,
        }}
        actions={(idx, res: any) => <div>ok</div>}
      />
    </div>
  )
}
