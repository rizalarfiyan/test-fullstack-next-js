import { cn } from '@/lib/utils'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  rightIcon?: React.ReactElement
  leftIcon?: React.ReactElement
  isLoading?: boolean
  isFluid?: boolean
}

const variantState = {
  primary: {
    solid: 'bg-sky-600 text-white hover:bg-sky-600/90',
    outline: 'bg-white text-sky-800 border border-sky-600 hover:bg-sky-600/10',
    ghost: 'bg-transparent text-sky-800 hover:bg-sky-600/10',
    subtle: 'bg-transparent text-sky-800 bg-sky-50 hover:bg-sky-100',
  },
  secondary: {
    solid: 'bg-slate-600 text-white hover:bg-slate-600/90',
    outline: 'bg-white text-slate-800 border border-slate-600 hover:bg-slate-600/10',
    ghost: 'bg-transparent text-slate-800 hover:bg-slate-600/10',
    subtle: 'bg-transparent text-slate-800 bg-slate-50 hover:bg-slate-100',
  },
  success: {
    solid: 'bg-emerald-600 text-white hover:bg-emerald-600/90',
    outline: 'bg-white text-emerald-800 border border-emerald-600 hover:bg-emerald-600/10',
    ghost: 'bg-transparent text-emerald-800 hover:bg-emerald-600/10',
    subtle: 'bg-transparent text-emerald-800 bg-emerald-50 hover:bg-emerald-100',
  },
  info: {
    solid: 'bg-blue-600 text-white hover:bg-blue-600/90',
    outline: 'bg-white text-blue-800 border border-blue-600 hover:bg-blue-600/10',
    ghost: 'bg-transparent text-blue-800 hover:bg-blue-600/10',
    subtle: 'bg-transparent text-blue-800 bg-blue-50 hover:bg-blue-100',
  },
  warning: {
    solid: 'bg-amber-600 text-white hover:bg-amber-600/90',
    outline: 'bg-white text-amber-800 border border-amber-600 hover:bg-amber-600/10',
    ghost: 'bg-transparent text-amber-800 hover:bg-amber-600/10',
    subtle: 'bg-transparent text-amber-800 bg-amber-50 hover:bg-amber-100',
  },
  danger: {
    solid: 'bg-red-600 text-white hover:bg-red-600/90',
    outline: 'bg-white text-red-800 border border-red-600 hover:bg-red-600/10',
    ghost: 'bg-transparent text-red-800 hover:bg-red-600/10',
    subtle: 'bg-transparent text-red-800 bg-red-50 hover:bg-red-100',
  },
}

type CompoundVariant = {
  variant: keyof typeof variantState.primary
  state: keyof typeof variantState
  className: string
}

const compoundVariants: CompoundVariant[] = []
for (const [state, variants] of Object.entries(variantState)) {
  for (const [variant, className] of Object.entries(variants)) {
    compoundVariants.push({
      variant: variant as keyof typeof variantState.primary,
      state: state as keyof typeof variantState,
      className,
    })
  }
}

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium ring-offset-white focus-visible:outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:opacity-50',
  {
    variants: {
      variant: {
        solid: '',
        outline: '',
        ghost: '',
        subtle: '',
      },
      state: {
        primary: '',
        secondary: '',
        success: '',
        info: '',
        warning: '',
        danger: '',
      },
      size: {
        md: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
      rounded: {
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    compoundVariants,
    defaultVariants: {
      variant: 'solid',
      state: 'primary',
      size: 'md',
      rounded: 'md',
    },
  }
)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      state,
      isLoading,
      isFluid,
      rightIcon,
      leftIcon,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const classNames = cn(
      isLoading && 'cursor-progress',
      isFluid && 'w-full',
      disabled && 'cursor-not-allowed',
      buttonVariants({ variant, size, rounded, state, className })
    )

    if (isLoading && Comp === 'button') {
      return (
        <Comp className={classNames} disabled={disabled || isLoading} ref={ref} {...props}>
          <Loader2 className='mr-2 animate-spin' />
          <span>Loading</span>
        </Comp>
      )
    }

    return (
      <Comp className={classNames} disabled={disabled || isLoading} ref={ref} {...props}>
        {leftIcon ?? leftIcon}
        <Slottable>{children}</Slottable>
        {rightIcon ?? rightIcon}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
export default Button
