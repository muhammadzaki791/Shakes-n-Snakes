'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({ email: z.string().email('Please enter a valid email') })
type FormData = z.infer<typeof schema>

interface NewsletterFormProps {
  variant?: 'default' | 'hero' | 'footer'
  source?: string
}

export function NewsletterForm({ variant = 'default', source = 'Footer' }: NewsletterFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, source }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong')
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-brand-success text-sm">
        <CheckCircle className="h-5 w-5" /> You're subscribed!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('flex gap-2', variant === 'footer' ? 'flex-col' : 'flex-row')}>
      <div className="flex-1">
        <input
          {...register('email')}
          type="email"
          placeholder="your@email.com"
          className="w-full rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm text-brand-text placeholder:text-brand-text-muted focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
        {errors.email && <p className="mt-1 text-xs text-brand-error">{errors.email.message}</p>}
        {error && <p className="mt-1 text-xs text-brand-error">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="shrink-0 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
      </button>
    </form>
  )
}
