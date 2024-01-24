import React, { forwardRef } from 'react'
import { cn, getProperty } from '@/lib/utils'

export const sizes: SpinnerSizeMap<string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

export const SpinnerSize = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const

export type SpinnerSize = (typeof SpinnerSize)[keyof typeof SpinnerSize]

export type SpinnerSizeMap<T> = {
  [size in keyof typeof SpinnerSize]: T
}

export type SpinnerProps = React.HTMLAttributes<SVGSVGElement> & ISpinnerProps

export interface ISpinnerProps {
  size?: SpinnerSize
}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>((props, ref): JSX.Element => {
  const { size, className, ...rest } = props
  const classes = cn('animate-spin', getProperty(sizes, props?.size || SpinnerSize.md))

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      stroke='currentColor'
      className={cn(classes, className)}
      fill='none'
      viewBox='0 0 66 66'
      ref={ref}
      {...rest}
    >
      <circle cx='33' cy='33' fill='none' r='28' stroke='currentColor' strokeWidth='10' className='opacity-30' />
      <circle
        cx='33'
        cy='33'
        fill='none'
        r='28'
        stroke='currentColor'
        strokeDasharray='40, 134'
        strokeDashoffset='325'
        strokeLinecap='round'
        strokeWidth='10'
        className='opacity-70'
      />
    </svg>
  )
})

Spinner.displayName = 'Spinner'

export default Spinner
