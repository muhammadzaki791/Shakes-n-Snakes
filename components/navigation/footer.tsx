'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { FadeIn } from '@/lib/animations'
import { NewsletterForm } from '@/components/newsletter/newsletter-form'

const menuLinks = [
  { href: '/menu/savoury', label: 'Savoury' },
  { href: '/menu/shakes', label: 'Shakes' },
  { href: '/menu/tea-coffee', label: 'Tea & Coffee' },
  { href: '/menu/limca', label: 'Limca' },
  { href: '/menu/gola-ganda', label: 'Gola Ganda' },
  { href: '/menu/others', label: 'Others' },
]

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/faqs', label: 'FAQs' },
]

export function Footer() {
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  return (
    <footer className="bg-brand-secondary border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl text-brand-primary mb-4">Shakes-n-Snacks</h3>
              <p className="text-sm text-brand-text-secondary mb-4">
                Crave It. Order It. Love It. Your favorite shakes, fries, and snacks — made fresh, delivered fast.
              </p>
              <div className="space-y-2 text-sm text-brand-text-secondary">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-primary" /><span>{process.env.NEXT_PUBLIC_PHONE_NUMBER || '+92 335 7494658'}</span></div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-primary" /><span>hello@shakesnsnacks.pk</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-primary" /><span>Karachi, Pakistan</span></div>
              </div>
            </div>

            {/* Menu */}
            <div>
              <h4 className="font-[family-name:var(--font-accent)] text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Menu</h4>
              <ul className="space-y-2">
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-[family-name:var(--font-accent)] text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opening Hours + Newsletter */}
            <div>
              <h4 className="font-[family-name:var(--font-accent)] text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Opening Hours</h4>
              <div className="space-y-1 text-sm text-brand-text-secondary mb-6">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-yellow" /><span>Mon-Thu: 4:00 PM - 12:00 AM</span></div>
                <div className="pl-6"><span>Fri-Sun: 2:00 PM - 1:00 AM</span></div>
              </div>
              {!isHomepage && (
                <div>
                  <h4 className="font-[family-name:var(--font-accent)] text-sm font-semibold text-brand-text mb-2">Stay Updated</h4>
                  <NewsletterForm variant="footer" />
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-text-muted">&copy; {new Date().getFullYear()} Shakes-n-Snacks. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-brand-text-muted hover:text-brand-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-brand-text-muted hover:text-brand-primary transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
