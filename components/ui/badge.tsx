import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-[family-name:var(--font-accent)] transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand-elevated text-brand-text-secondary',
        bestseller: 'bg-[#FFD60A] text-[#0D0D0D]',
        new: 'bg-[#39FF14] text-[#0D0D0D]',
        spicy: 'bg-[#FF3333] text-white',
        vegan: 'bg-[#00C853] text-white',
        hot: 'bg-[#FF6B35] text-white',
        cold: 'bg-[#00E5FF] text-[#0D0D0D]',
        "chefs-special": 'bg-[#FF2D78] text-white',
        seasonal: 'bg-[#FFD60A] text-[#0D0D0D]',
        unavailable: 'bg-red-900/50 text-red-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export function getTagVariant(tag: string): BadgeProps['variant'] {
  const lower = tag.toLowerCase()
  if (lower === 'bestseller') return 'bestseller'
  if (lower === 'new') return 'new'
  if (lower === 'spicy') return 'spicy'
  if (lower === 'vegan') return 'vegan'
  if (lower === 'hot') return 'hot'
  if (lower === 'cold') return 'cold'
  if (lower === "chef's special") return 'chefs-special'
  if (lower === 'seasonal') return 'seasonal'
  return 'default'
}
