'use client'

import { HelpCircle, MessageCircle } from 'lucide-react'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { FadeIn } from '@/lib/animations'

const faqs = [
  {
    q: 'How do I place an order?',
    a: "It's super easy! Just tap the WhatsApp button on any page (green button, bottom-right corner) or call us directly. Tell us what you want, where you are, and we'll handle the rest. No app downloads, no account creation needed.",
  },
  {
    q: 'What areas do you deliver to, and are there delivery charges?',
    a: "We deliver within our local area — exact coverage and any delivery charges are communicated when you order on WhatsApp. Pickup is always free! Just let us know you're coming and we'll have it ready.",
  },
  {
    q: 'How long does delivery take?',
    a: "Most orders arrive within 15-25 minutes, depending on your location and how busy we are. We'll give you a time estimate when you place your order on WhatsApp.",
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Currently, we accept Cash on Delivery (COD) only. Pay when your food arrives — simple and hassle-free. We may add more payment options in the future.',
  },
  {
    q: 'Can I customize my order?',
    a: "Absolutely! Want extra cheese on your fries? No onions in your shawarma? Just mention it in the special instructions when ordering on WhatsApp. We'll do our best to accommodate your preferences.",
  },
  {
    q: 'Is your food halal?',
    a: 'Yes, 100%. All our ingredients are halal certified. We take this very seriously — you can enjoy every bite with complete peace of mind.',
  },
  {
    q: 'What about food allergies?',
    a: "Please inform us about any allergies when placing your order. While our kitchen handles common allergens (dairy, gluten, nuts), we'll take extra care with your order. Your safety is our priority.",
  },
  {
    q: 'Do you offer catering for events or parties?',
    a: "Yes! We love catering for events, parties, and gatherings. Contact us on WhatsApp with details about your event (date, number of guests, preferred menu) and we'll put together a custom package for you.",
  },
  {
    q: 'What are your opening hours?',
    a: "We're open 7 days a week! Monday to Thursday: 4:00 PM - 12:00 AM. Friday to Sunday: 2:00 PM - 1:00 AM. We sometimes have extended hours on holidays — check our WhatsApp for updates.",
  },
  {
    q: 'What if something is wrong with my order?',
    a: "We want you to be 100% happy. If there's an issue, WhatsApp us within 1 hour of delivery with a photo, and we'll make it right — whether that's a replacement or a refund. No drama, no hassle.",
  },
]

export default function FAQsPage() {
  return (
    <div className="bg-brand-bg py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl text-brand-text mb-2">
              Frequently Asked Questions
            </h1>
            <p className="text-brand-text-secondary">Got questions? We&apos;ve got answers.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <FadeIn>
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="rounded-xl border border-white/10 bg-brand-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="h-6 w-6 text-brand-primary" />
                  <h3 className="font-[family-name:var(--font-accent)] font-semibold text-brand-text">
                    Need More Help?
                  </h3>
                </div>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Can&apos;t find what you&apos;re looking for? Reach out directly!
                </p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}?text=${encodeURIComponent('Hi! I have a question about Shakes-n-Snacks.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#128C7E] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </FadeIn>

          {/* FAQ List */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.2}>
              <div className="rounded-xl border border-white/10 bg-brand-card p-6">
                <Accordion>
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} title={faq.q}>
                      {faq.a}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}
