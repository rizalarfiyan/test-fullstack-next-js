import Button from '@/components/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandSeparator } from '@/components/Command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover'
import useDebounce from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { BaseApiResponse, BaseError, BaseResponse, BaseResponseList, QueryParams } from '@/types/api'
import { useQuery } from '@tanstack/react-query'
import { CheckIcon, ChevronDown } from 'lucide-react'
import React, { useMemo } from 'react'

export type SelectData = {
  id: string
  name: string
}

type SelectComponentProps = {
  apiController: (params?: any) => BaseResponse<BaseResponseList<any>, BaseError<BaseApiResponse<any>>>
  query?: QueryParams
  initialValue?: SelectData
  onChange?: (value?: string) => void
  disabled?: boolean
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  apiController,
  query,
  initialValue,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<SelectData | null>(initialValue || null)

  const condition = useMemo(() => {
    return {
      page: 1,
      limit: 10,
      ...(query || {}),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const { data, isFetching, isError, error, isLoading } = useQuery({
    queryKey: ['university', condition],
    queryFn: () => apiController(),
  })

  const memoizedData = React.useMemo(() => {
    return data?.data?.content || []
  }, [data])

  const StatusData = useMemo((): React.ReactNode => {
    if (isError) {
      return <CommandItem className='justify-center py-4'>{error.message}</CommandItem>
    }
    if (!isFetching && memoizedData.length === 0) {
      return <CommandItem className='justify-center py-4'>No data found.</CommandItem>
    }
    if (isFetching || isLoading) {
      return <CommandItem className='justify-center py-4'>Loading...</CommandItem>
    }
    return null
  }, [error, isError, isFetching, memoizedData, isLoading])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-label='Select university...'
          aria-expanded={open}
          className='flex-1 justify-between w-full'
          disabled={disabled}
        >
          {selected ? selected.name : 'Select university...'}
          <ChevronDown className='w-5 h-5 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Search university...' />
          <CommandEmpty>No university found.</CommandEmpty>
          {StatusData ? (
            StatusData
          ) : (
            <CommandGroup>
              {memoizedData.map((value) => (
                <CommandItem
                  key={value.id}
                  onSelect={() => {
                    setSelected(value)
                    onChange?.(value.id)
                    setOpen(false)
                  }}
                >
                  {value.name}
                  <CheckIcon
                    className={cn('ml-auto h-4 w-4', selected?.id === value.id ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SelectComponent
