'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { nanoid } from 'nanoid'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'
import Button from '../Button'
import PaginationButton from './PaginationButton'
import PaginationAction from './PaginationAction'
import usePagination, { DOTS } from './hook'

export type PaginationProps = React.HTMLProps<HTMLUListElement> & {
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange?: (page: number) => void
  siblingCount?: number
  className?: string
  isFlat?: boolean
}

export type PaginationActionProps = Pick<PaginationProps, 'currentPage' | 'onPageChange'> & {
  pageNumber: number
}

export type PaginationButtonProps = React.ComponentPropsWithoutRef<typeof Button> & {
  isActive?: boolean
}

export interface UsePaginationProps {
  totalCount: number
  pageSize: number
  siblingCount: number
  currentPage: number
}

export type UsePaginationArray = (string | number)[]

export const Pagination = forwardRef<HTMLUListElement, PaginationProps>((props, ref) => {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, className, isFlat, ...rest } = props

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  })

  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }

  const onNext = () => {
    onPageChange?.(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange?.(currentPage - 1)
  }

  const lastPage = paginationRange[paginationRange.length - 1]

  return (
    <ul ref={ref} className={cn('pagination inline-flex -space-x-px', isFlat && 'flat-style', className)} {...rest}>
      <li>
        <PaginationButton onClick={onPrevious} disabled={currentPage === 1} className='rounded-r-none'>
          <ChevronLeft className='h-5 w-5' />
        </PaginationButton>
      </li>
      {paginationRange.map((pageNumber) => {
        const key = nanoid()
        if (pageNumber === DOTS) {
          return (
            <li key={key}>
              <PaginationButton className='rounded-none' asChild>
                <div>{DOTS}</div>
              </PaginationButton>
            </li>
          )
        }

        return (
          <PaginationAction
            key={key}
            {...{
              pageNumber: pageNumber as number,
              currentPage,
              onPageChange,
            }}
          />
        )
      })}
      <li>
        <PaginationButton onClick={onNext} disabled={currentPage === lastPage} className='rounded-l-none'>
          <ChevronRight className='h-5 w-5' />
        </PaginationButton>
      </li>
    </ul>
  )
})

Pagination.displayName = 'Pagination'

export default Pagination
