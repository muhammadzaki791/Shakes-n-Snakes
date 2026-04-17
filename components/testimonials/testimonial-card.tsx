import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  rating: number
  headline: string
  review: string
}

export function TestimonialCard({ name, rating, headline, review }: TestimonialCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-brand-card p-6 transition-all hover:border-brand-primary/20 hover:shadow-[var(--glow-pink)]">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-brand-yellow text-brand-yellow' : 'text-brand-text-muted'}`} />
        ))}
      </div>
      <h4 className="font-[family-name:var(--font-accent)] font-semibold text-brand-text mb-2">&ldquo;{headline}&rdquo;</h4>
      <p className="text-sm text-brand-text-secondary mb-4">{review}</p>
      <p className="text-sm font-[family-name:var(--font-accent)] text-brand-primary">{name}</p>
    </div>
  )
}
