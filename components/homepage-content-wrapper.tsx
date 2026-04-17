'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2, UtensilsCrossed, Zap, BadgeDollarSign, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/lib/animations'
import { client } from '@/lib/client'
import { getHomepageContentQuery } from '@/lib/client/queries'
import { MenuItemGrid } from '@/components/menu-item/menu-item-grid'
import { CategoryShowcaseWrapper } from '@/components/category-showcase-wrapper'
import { TestimonialsSection } from '@/components/testimonials/testimonials-section'
import { NewsletterSection } from '@/components/newsletter/newsletter-section'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import type { HomepageContent } from '@/types/menu-types'

const heroImages = [
  'https://placehold.co/1920x1080/111111/FF2D78?text=The+Shake+Shot',
  'https://placehold.co/1920x1080/111111/FFD60A?text=The+Burger+Spread',
  'https://placehold.co/1920x1080/111111/00E5FF?text=The+Fizz+Moment',
  'https://placehold.co/1920x1080/111111/FF6B35?text=Street+Food+Hero',
]

const whyUs = [
  { icon: UtensilsCrossed, title: 'Fresh Ingredients', desc: 'Every dish made from scratch with the freshest ingredients. No shortcuts.' },
  { icon: Zap, title: 'Fast Service', desc: 'Lightning-fast delivery. Most orders at your door in 15-25 minutes.' },
  { icon: BadgeDollarSign, title: 'Best Prices', desc: 'Delicious food that doesn\'t empty your wallet. Quality at prices that make sense.' },
  { icon: Heart, title: 'Made with Love', desc: 'Every order is prepared with passion. We treat every meal like it\'s for family.' },
]

const miniFaqs = [
  { q: 'How do I order?', a: 'Just tap the WhatsApp button or call us directly. No app needed!' },
  { q: 'Do you deliver?', a: 'Yes! We deliver within our area. Delivery details are shared on WhatsApp.' },
  { q: 'What payment methods do you accept?', a: 'Cash on delivery only. Simple and hassle-free.' },
  { q: 'Is your food halal?', a: 'Yes, 100%. All our ingredients are halal certified.' },
]

export function HomepageContentWrapper() {
  const [content, setContent] = useState<HomepageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    client.fetch(getHomepageContentQuery)
      .then(setContent)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
      </div>
    )
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  return (
    <div className="bg-brand-bg">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img src={heroImages[heroIndex]} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/60 to-[#0D0D0D]/95" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl text-white mb-4 neon-text-pink"
          >
            Crave It. Order It. Love It.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 mb-8 font-[family-name:var(--font-accent)]"
          >
            Where Every Bite Hits Different
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/menu" className="rounded-full bg-brand-primary px-8 py-4 font-[family-name:var(--font-accent)] font-bold text-white text-lg transition-all hover:bg-brand-primary-hover hover:shadow-[var(--glow-pink)]">
              View Menu
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to order from Shakes-n-Snacks!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-[#25D366] px-8 py-4 font-[family-name:var(--font-accent)] font-bold text-[#25D366] text-lg transition-all hover:bg-[#25D366] hover:text-white"
            >
              Order on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Items */}
      {content?.featuredItems && content.featuredItems.length > 0 && (
        <section className="py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-brand-text mb-2">Fresh Off the Menu</h2>
                <p className="text-brand-text-secondary">Our latest and most popular items</p>
              </div>
            </FadeIn>
            <MenuItemGrid items={content.featuredItems} />
          </div>
        </section>
      )}

      {/* Category Showcase */}
      <section className="py-16 px-4 bg-brand-secondary">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-brand-text mb-2">Explore Our Menu</h2>
              <p className="text-brand-text-secondary">Pick a category and dive in</p>
            </div>
          </FadeIn>
          <CategoryShowcaseWrapper />
        </div>
      </section>

      {/* About/Brand Story */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-brand-text mb-4">We Don&apos;t Just Serve Food.</h2>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl text-brand-primary mb-6">We Serve Cravings.</h3>
                <p className="text-brand-text-secondary mb-4">
                  Every great food story starts with one thing: obsession. We started with shakes — thick, overloaded, ridiculous shakes. Then came the fries. Then the shawarma, biryani, limca, gola ganda...
                </p>
                <p className="text-brand-text-secondary mb-6">
                  We&apos;re not a franchise. We&apos;re not a chain. We&apos;re your local food obsession — made fresh, made fast, and made with love.
                </p>
                <Link href="/about" className="inline-block rounded-full border border-brand-primary px-6 py-3 font-[family-name:var(--font-accent)] text-brand-primary transition-all hover:bg-brand-primary hover:text-white">
                  Our Full Story
                </Link>
              </div>
            </FadeIn>
            <ScaleIn>
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/10">
                <img src="https://placehold.co/600x600/1A1A1A/FF2D78?text=Our+Story" alt="Our Story" className="h-full w-full object-cover" />
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-brand-secondary">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-brand-text mb-2">Why Choose Us</h2>
              <p className="text-brand-text-secondary">Fresh. Fast. Unapologetically Delicious.</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <StaggerItem key={i}>
                <div className="rounded-xl border border-white/10 bg-brand-card p-6 text-center hover:border-brand-primary/20 transition-all hover:shadow-[var(--glow-pink)]">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
                    <item.icon className="h-6 w-6 text-brand-primary" />
                  </div>
                  <h3 className="font-[family-name:var(--font-accent)] font-semibold text-brand-text mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-text-secondary">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center mb-8">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl text-brand-text mb-2">Quick Questions</h2>
            </div>
            <Accordion>
              {miniFaqs.map((faq, i) => (
                <AccordionItem key={i} title={faq.q}>{faq.a}</AccordionItem>
              ))}
            </Accordion>
            <div className="mt-6 text-center">
              <Link href="/faqs" className="text-sm text-brand-primary hover:underline font-[family-name:var(--font-accent)]">
                View all FAQs →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <div className="bg-brand-secondary">
        <TestimonialsSection />
      </div>

      {/* Newsletter */}
      <NewsletterSection variant="hero" />
    </div>
  )
}
