import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm text-brand-text placeholder:text-brand-text-muted focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
