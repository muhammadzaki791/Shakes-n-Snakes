'use client'

import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { FadeIn } from '@/lib/animations'

const contactInfo = [
  { icon: Phone, label: 'Phone', value: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+92 335 7494658' },
  { icon: Mail, label: 'Email', value: 'hello@shakesnsnacks.pk' },
  { icon: MapPin, label: 'Location', value: 'Karachi, Pakistan' },
  { icon: Clock, label: 'Hours', value: 'Mon-Thu 4PM-12AM, Fri-Sun 2PM-1AM' },
]

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || ''

  return (
    <div className="bg-brand-bg py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl text-brand-text mb-2">
              Get in Touch
            </h1>
            <p className="text-brand-text-secondary">
              We&apos;d love to hear from you. Reach out on WhatsApp or give us a call!
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <FadeIn>
            <div className="space-y-6">
              {contactInfo.map((info, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-brand-card p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                    <info.icon className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-accent)] font-semibold text-brand-text">
                      {info.label}
                    </h3>
                    <p className="text-sm text-brand-text-secondary">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* WhatsApp & Call CTA */}
          <FadeIn delay={0.2}>
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-brand-card p-12 text-center space-y-6">
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl text-brand-text mb-2">
                  Message Us Directly
                </h3>
                <p className="text-brand-text-secondary text-sm">
                  The fastest way to reach us — whether it&apos;s a question, feedback, or a craving
                  you need sorted out.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to get in touch regarding...")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-[family-name:var(--font-accent)] font-semibold text-white transition-all hover:bg-[#128C7E]"
                >
                  <MessageCircle className="h-5 w-5" /> WhatsApp
                </a>
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 font-[family-name:var(--font-accent)] font-semibold text-brand-text transition-all hover:border-brand-primary hover:text-brand-primary"
                >
                  <Phone className="h-5 w-5" /> Call Us
                </a>
              </div>

              <p className="text-xs text-brand-text-muted">
                We typically respond within minutes during business hours.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
