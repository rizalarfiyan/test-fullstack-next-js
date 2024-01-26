'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { PaginationButtonProps } from './Pagination'
import Button from '../Button'

const PaginationButton = forwardRef<React.ElementRef<typeof Button>, PaginationButtonProps>(
  ({ size = 'icon', variant = 'outline', state = 'secondary', isActive, className, ...props }, ref) => {
    if (isActive) {
      variant = 'solid'
      state = 'primary'
    }

    return (
      <Button
        ref={ref}
        className={cn(className, !isActive && 'border-secondary-300')}
        size={size}
        variant={variant}
        state={state}
        {...props}
      />
    )
  }
)

PaginationButton.displayName = 'PaginationButton'

export default PaginationButton
