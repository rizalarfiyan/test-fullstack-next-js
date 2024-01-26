'use client'

import { Button } from '@/components/Button'
import { LIMIT_PERPAGE_DEFAULT, LIST_LIMIT_PERPAGE } from '@/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'
import { AlertCircle, ChevronDown, Eye, FileBarChart, PlusCircle, Recycle, RotateCcw, Trash2 } from 'lucide-react'
import React, { useRef, useState } from 'react'
import DataTable, { DataTableColumn, DataTableHandle, DataTableView } from '@/components/Datatable'
import { getAll } from '@/service/student'
import FormFilter from './FormFilter'
import DeleteConfirmation from './DeleteConfirmation'
import RestoreConfirmation from './RestoreConfirmation'

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

enum StateActiveAction {
  ACTIVE = 'active',
  RECYCLE_BIN = 'recycle-bin',
}

export default function Student() {
  const tableRef = useRef<DataTableHandle>(null)

  const [limit, setLimit] = useState(LIMIT_PERPAGE_DEFAULT)
  const [filter, setFilter] = useState<object>({})

  const onChangeLimit = (value: string) => {
    setLimit(parseInt(value))
  }

  const [stateActive, setStateActive] = useState<StateActiveAction>(StateActiveAction.ACTIVE)
  const onButtonClickState = (state: StateActiveAction) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setStateActive(state)
  }

  return (
    <div className='m-10 p-5 rounded-md bg-white flex flex-col gap-6 w-full'>
      <DataTable
        tableRef={tableRef}
        columns={columns}
        apiController={getAll}
        perPage={limit}
        hasSelection
        buttonActions={(table, selectedData, data) => {
          return (
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='flex items-center overflow-hidden rounded-md'>
                  <Button
                    variant={stateActive === StateActiveAction.ACTIVE ? 'solid' : 'outline'}
                    onClick={onButtonClickState(StateActiveAction.ACTIVE)}
                    className='rounded-l-md rounded-r-none'
                  >
                    Active
                  </Button>
                  <Button
                    variant={stateActive === StateActiveAction.RECYCLE_BIN ? 'solid' : 'outline'}
                    leftIcon={<Recycle className='mr-2' />}
                    onClick={onButtonClickState(StateActiveAction.RECYCLE_BIN)}
                    className='rounded-l-none rounded-r-md'
                  >
                    Recycle Bin ({data?.metadata?.total?.deleted || 0})
                  </Button>
                </div>
                <div className='flex items-center overflow-hidden rounded-md'>
                  {stateActive === StateActiveAction.RECYCLE_BIN ? (
                    <RestoreConfirmation tableRef={tableRef} data={selectedData}>
                      <Button
                        variant='outline'
                        leftIcon={<RotateCcw className='mr-2' />}
                        className='rounded-l-md rounded-r-none'
                      >
                        Bulk Restore
                      </Button>
                    </RestoreConfirmation>
                  ) : (
                    <Button
                      variant='outline'
                      leftIcon={<PlusCircle className='mr-2' />}
                      className='rounded-l-md rounded-r-none'
                    >
                      Create
                    </Button>
                  )}
                  <DeleteConfirmation
                    tableRef={tableRef}
                    data={selectedData}
                    isSoftDelete={stateActive === StateActiveAction.ACTIVE}
                  >
                    <Button variant='outline' leftIcon={<Trash2 className='mr-2' />} rounded='none'>
                      Bulk Delete
                    </Button>
                  </DeleteConfirmation>
                  <Button
                    variant='outline'
                    leftIcon={<FileBarChart className='mr-2' />}
                    rightIcon={<ChevronDown className='ml-2' />}
                    rounded='none'
                  >
                    Export
                  </Button>
                  <DataTableView table={table}>
                    <Button
                      variant='outline'
                      leftIcon={<Eye className='mr-2' />}
                      rightIcon={<ChevronDown className='ml-2' />}
                      rounded='none'
                    >
                      Show
                    </Button>
                  </DataTableView>
                  <FormFilter onFilterChange={setFilter} />
                </div>
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
          is_deleted: stateActive === StateActiveAction.RECYCLE_BIN ? true : undefined,
        }}
        actions={(idx, res: any) => <div>ok</div>}
      />
    </div>
  )
}
