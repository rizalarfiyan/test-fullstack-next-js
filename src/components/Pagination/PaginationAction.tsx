'use client'

import { PaginationActionProps } from './Pagination'
import PaginationButton from './PaginationButton'

const PaginationAction: React.FC<PaginationActionProps> = ({ pageNumber, currentPage, onPageChange }) => {
  const isDisable = currentPage === pageNumber
  const handlePagination = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange?.(pageNumber)
    event.preventDefault()
  }

  return (
    <li>
      <PaginationButton onClick={handlePagination} isActive={isDisable} disabled={isDisable} className='rounded-none'>
        {pageNumber}
      </PaginationButton>
    </li>
  )
}

export default PaginationAction
