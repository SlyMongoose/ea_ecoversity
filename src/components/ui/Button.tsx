import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cultural' | 'coral' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  loadingText?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText = 'Loading...',
    disabled,
    children,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'

    const variants = {
      primary: 'bg-ocean-500 hover:bg-ocean-600 text-white hover:scale-105 shadow-ocean focus:ring-ocean-300',
      secondary: 'bg-forest-500 hover:bg-forest-600 text-white hover:scale-105 shadow-cultural focus:ring-forest-300',
      cultural: 'cultural-gradient text-white hover:opacity-90 hover:scale-105 shadow-cultural focus:ring-ocean-300',
      coral: 'bg-coral-500 hover:bg-coral-600 text-white hover:scale-105 shadow-cultural focus:ring-coral-300',
      outline: 'border-2 border-ocean-500 text-ocean-600 hover:bg-ocean-500 hover:text-white focus:ring-ocean-300',
      ghost: 'text-forest-600 hover:bg-forest-100 focus:ring-forest-300'
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-4 py-3 text-base rounded-xl',
      lg: 'px-6 py-4 text-lg rounded-xl',
      xl: 'px-8 py-5 text-xl rounded-2xl'
    }

    const isDisabled = disabled || isLoading

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }