'use client'

import Link from 'next/link'
import { StaggerContainer, StaggerItem, FadeIn } from '@/lib/animations'
import { TestimonialCard } from '@/components/testimonials/testimonial-card'

const testimonials = [
  {
    name: 'Ahmed R.',
    rating: 5,
    headline: 'The Oreo Shake alone is worth the drive',
    review:
      "Thick, creamy, and loaded with real Oreo chunks. This isn't your average shake — it's a full experience. I drive 20 minutes just for this.",
  },
  {
    name: 'Fatima K.',
    rating: 5,
    headline: 'Pizza Fries that changed my life',
    review:
      "The cheese, the sauce, the perfectly crispy fries underneath — I've been ordering every weekend since I discovered them. Absolutely addictive.",
  },
  {
    name: 'Hassan M.',
    rating: 5,
    headline: 'Fastest delivery in the area, hands down',
    review:
      'Ordered at 9 PM, food was at my door by 9:20. The Chicken Chowmein was hot, fresh, and packed with flavor. Impressed every single time.',
  },
  {
    name: 'Ayesha T.',
    rating: 4,
    headline: 'My go-to for late night cravings',
    review:
      'Whenever midnight hunger hits, Shakes-n-Snacks saves the day. The Shawarma + Lemon Mint Limca combo is elite. Only wish they had a loyalty card!',
  },
  {
    name: 'Omar S.',
    rating: 5,
    headline: 'The Biryani hit different',
    review:
      "Perfectly cooked rice, tender chicken, and just the right amount of masala. For the price, you won't find better biryani anywhere nearby.",
  },
  {
    name: 'Zara N.',
    rating: 5,
    headline: 'Best Gola Ganda in the city',
    review:
      'The flavors are vibrant, it\'s made fresh right in front of you, and it takes me straight back to childhood summers. A must-try in the heat.',
  },
  {
    name: 'Bilal A.',
    rating: 5,
    headline: 'Masala Fries > everything else',
    review:
      'Rs. 200 for fries this good? The masala seasoning is addictive — salty, spicy, and perfectly crispy. Best value snack in the city.',
  },
  {
    name: 'Maryam H.',
    rating: 4,
    headline: 'Strawberry Shake is perfection',
    review:
      'Thick, cold, and you can taste the real strawberry — not that artificial syrup nonsense. My daughter and I are hooked.',
  },
  {
    name: 'Danish F.',
    rating: 5,
    headline: 'Nuggets that actually taste like chicken',
    review:
      "Crispy on the outside, juicy on the inside, and the portions are generous. Finally, nuggets done right. My kids won't eat nuggets from anywhere else now.",
  },
  {
    name: 'Sana W.',
    rating: 5,
    headline: 'WhatsApp ordering is a game changer',
    review:
      'No downloading apps, no creating accounts — just text your order and it shows up. The Mayo Garlic Fries are unreal. Shakes-n-Snacks gets it.',
  },
  {
    name: 'Kamran I.',
    rating: 5,
    headline: 'Late night savior',
    review:
      'When everything else is closed, these guys are still serving hot, fresh food. The Chicken Haleem at midnight hits different. Thank you for existing.',
  },
  {
    name: 'Nida Q.',
    rating: 5,
    headline: 'Perfect for gatherings',
    review:
      'Ordered for a birthday party — mix of shakes, fries, and shawarmas. Everyone loved it. Great portions, great prices, and they delivered right on time.',
  },
]

export default function TestimonialsPage() {
  return (
    <div className="bg-brand-bg py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl text-brand-text mb-2">
              Customer Reviews
            </h1>
            <p className="text-brand-text-secondary">
              Don&apos;t just take our word for it — hear from the people who crave us
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <TestimonialCard {...t} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <FadeIn>
          <div className="mt-16 text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl text-brand-text mb-4">
              Ready to Try It Yourself?
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/menu"
                className="rounded-full bg-brand-primary px-8 py-3 font-[family-name:var(--font-accent)] font-semibold text-white hover:bg-brand-primary-hover transition-colors"
              >
                Order Now
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/10 px-8 py-3 font-[family-name:var(--font-accent)] font-semibold text-brand-text hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
