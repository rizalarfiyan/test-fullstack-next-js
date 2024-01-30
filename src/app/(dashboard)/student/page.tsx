'use client'

import { Button } from '@/components/Button'
import { LIMIT_PERPAGE_DEFAULT, LIST_LIMIT_PERPAGE } from '@/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'
import { ChevronDown, Eye, FileBarChart, Pencil, PlusCircle, Recycle, RotateCcw, Trash2 } from 'lucide-react'
import React, { useRef, useState } from 'react'
import DataTable, { DataTableColumn, DataTableHandle, DataTableView } from '@/components/Datatable'
import { getAll } from '@/service/student'
import FormFilter from './FormFilter'
import DeleteConfirmation from './DeleteConfirmation'
import RestoreConfirmation from './RestoreConfirmation'
import ExportData from './ExportData'
import FormInput from './FormInput'
import { StudentResponse } from '@/types/api/student'

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
    <div className='p-5 rounded-md bg-white flex flex-col gap-6 w-full'>
      <DataTable
        tableRef={tableRef}
        columns={columns}
        apiController={getAll}
        perPage={limit}
        hasSelection
        buttonActions={(table, selectedData, data) => {
          return (
            <div className='flex items-center justify-between flex-col xl:flex-row gap-4'>
              <div className='flex items-center gap-4 flex-col lg:flex-row lg:gap-2'>
                <div className='flex items-center'>
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
                <div className='flex items-center justify-center flex-wrap gap-2 md:gap-0 md:flex-nowrap'>
                  {stateActive === StateActiveAction.RECYCLE_BIN ? (
                    <RestoreConfirmation tableRef={tableRef} data={selectedData}>
                      <Button
                        variant='outline'
                        leftIcon={<RotateCcw className='mr-2' />}
                        className='rounded-md md:rounded-l-md md:rounded-r-none'
                      >
                        Bulk Restore
                      </Button>
                    </RestoreConfirmation>
                  ) : (
                    <FormInput tableRef={tableRef}>
                      <Button
                        variant='outline'
                        leftIcon={<PlusCircle className='mr-2' />}
                        className='rounded-md md:rounded-l-md md:rounded-r-none'
                      >
                        Create
                      </Button>
                    </FormInput>
                  )}
                  <DeleteConfirmation
                    tableRef={tableRef}
                    data={selectedData}
                    isSoftDelete={stateActive === StateActiveAction.ACTIVE}
                  >
                    <Button
                      variant='outline'
                      leftIcon={<Trash2 className='mr-2' />}
                      className='rounded-md md:rounded-none'
                    >
                      Bulk Delete
                    </Button>
                  </DeleteConfirmation>
                  <ExportData
                    data={selectedData}
                    header={['ID', 'No', 'NIM', 'Name', 'University Name']}
                    keys={['id', 'sequence', 'nim', 'name', 'university_name']}
                  >
                    <Button
                      variant='outline'
                      leftIcon={<FileBarChart className='mr-2' />}
                      rightIcon={<ChevronDown className='ml-2' />}
                      className='rounded-md md:rounded-none'
                    >
                      Export
                    </Button>
                  </ExportData>
                  <DataTableView table={table}>
                    <Button
                      variant='outline'
                      leftIcon={<Eye className='mr-2' />}
                      rightIcon={<ChevronDown className='ml-2' />}
                      className='rounded-md md:rounded-none'
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
        actions={(idx, res: StudentResponse) => (
          <div className='flex items-center gap-1.5'>
            <FormInput isDetail uuid={idx} data={res} tableRef={tableRef}>
              <Button variant='outline' size='smicon'>
                <Eye className='w-5 h-5' />
              </Button>
            </FormInput>
            <FormInput uuid={idx} data={res} tableRef={tableRef}>
              <Button variant='outline' size='smicon'>
                <Pencil className='w-5 h-5' />
              </Button>
            </FormInput>
            <DeleteConfirmation
              tableRef={tableRef}
              data={[res]}
              isSoftDelete={stateActive === StateActiveAction.ACTIVE}
            >
              <Button variant='outline' size='smicon'>
                <Trash2 className='w-5 h-5' />
              </Button>
            </DeleteConfirmation>
          </div>
        )}
      />
    </div>
  )
}
