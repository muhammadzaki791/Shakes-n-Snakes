'use client'

import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'

interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-all hover:text-brand-primary"
      >
        {title}
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-brand-text-muted transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', isOpen ? 'max-h-96 pb-4' : 'max-h-0')}>
        <div className="text-sm text-brand-text-secondary">{children}</div>
      </div>
    </div>
  )
}

interface AccordionProps {
  children: ReactNode
  className?: string
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn('w-full', className)}>{children}</div>
}
