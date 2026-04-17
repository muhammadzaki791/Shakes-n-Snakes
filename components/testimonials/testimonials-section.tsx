'use client'

import { StaggerContainer, StaggerItem } from '@/lib/animations'
import { TestimonialCard } from './testimonial-card'

const testimonials = [
  { name: 'Ahmed R.', rating: 5, headline: 'The Oreo Shake alone is worth the drive', review: 'Thick, creamy, and loaded with real Oreo chunks. This isn\'t your average shake — it\'s a full experience. I drive 20 minutes just for this.' },
  { name: 'Fatima K.', rating: 5, headline: 'Pizza Fries that changed my life', review: 'The cheese, the sauce, the perfectly crispy fries underneath — I\'ve been ordering every weekend since I discovered them. Absolutely addictive.' },
  { name: 'Hassan M.', rating: 5, headline: 'Fastest delivery in the area, hands down', review: 'Ordered at 9 PM, food was at my door by 9:20. The Chicken Chowmein was hot, fresh, and packed with flavor. Impressed every single time.' },
  { name: 'Ayesha T.', rating: 4, headline: 'My go-to for late night cravings', review: 'Whenever midnight hunger hits, Shakes-n-Snacks saves the day. The Shawarma + Lemon Mint Limca combo is elite. Only wish they had a loyalty card!' },
  { name: 'Omar S.', rating: 5, headline: 'The Biryani hit different', review: 'Perfectly cooked rice, tender chicken, and just the right amount of masala. For the price, you won\'t find better biryani anywhere nearby.' },
  { name: 'Zara N.', rating: 5, headline: 'Best Gola Ganda in the city', review: 'The flavors are vibrant, it\'s made fresh right in front of you, and it takes me straight back to childhood summers. A must-try in the heat.' },
  { name: 'Bilal A.', rating: 5, headline: 'Masala Fries > everything else', review: 'Rs. 200 for fries this good? The masala seasoning is addictive — salty, spicy, and perfectly crispy. Best value snack in the city.' },
  { name: 'Maryam H.', rating: 4, headline: 'Strawberry Shake is perfection', review: 'Thick, cold, and you can taste the real strawberry — not that artificial syrup nonsense. My daughter and I are hooked.' },
  { name: 'Danish F.', rating: 5, headline: 'Nuggets that actually taste like chicken', review: 'Crispy on the outside, juicy on the inside, and the portions are generous. Finally, nuggets done right. My kids won\'t eat nuggets from anywhere else now.' },
  { name: 'Sana W.', rating: 5, headline: 'WhatsApp ordering is a game changer', review: 'No downloading apps, no creating accounts — just text your order and it shows up. The Mayo Garlic Fries are unreal. Shakes-n-Snacks gets it.' },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-brand-text mb-2">What Our Customers Say</h2>
          <p className="text-brand-text-secondary">Real reviews from real food lovers</p>
        </div>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <TestimonialCard {...t} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
