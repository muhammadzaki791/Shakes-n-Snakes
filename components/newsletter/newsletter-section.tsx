'use client'

import { FadeIn } from '@/lib/animations'
import { NewsletterForm } from './newsletter-form'
import { Mail } from 'lucide-react'

interface NewsletterSectionProps {
  variant?: 'default' | 'hero' | 'footer'
}

export function NewsletterSection({ variant = 'default' }: NewsletterSectionProps) {
  return (
    <section className="py-16 px-4">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
            <Mail className="h-6 w-6 text-brand-primary" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-brand-text mb-2">
            Get Exclusive Deals & New Menu Drops!
          </h2>
          <p className="text-sm text-brand-text-secondary mb-6">
            Subscribe and be the first to know about new items, special offers, and secret menu drops.
          </p>
          <div className="mx-auto max-w-md">
            <NewsletterForm variant={variant} source="Homepage" />
          </div>
          <p className="mt-3 text-xs text-brand-text-muted">No spam, ever. Max 2 emails per week. Unsubscribe anytime.</p>
        </div>
      </FadeIn>
    </section>
  )
}
