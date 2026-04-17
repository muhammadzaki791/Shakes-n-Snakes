'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/search/search-bar'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-brand-secondary/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="font-[family-name:var(--font-heading)] text-xl text-brand-primary">
              Shakes-n-Snacks
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-[family-name:var(--font-accent)] text-brand-text-secondary hover:text-brand-text transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-brand-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop search + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <SearchBar />
            <Link
              href="/menu"
              className="flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2 text-sm font-[family-name:var(--font-accent)] font-semibold text-white transition-all hover:bg-brand-primary-hover hover:shadow-[var(--glow-pink)]"
            >
              <ShoppingBag className="h-4 w-4" />
              Order Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-brand-text"
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-secondary/95 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              <SearchBar />
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block py-2 text-sm font-[family-name:var(--font-accent)] text-brand-text-secondary hover:text-brand-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/menu"
                onClick={() => setIsMobileOpen(false)}
                className="block w-full rounded-full bg-brand-primary py-3 text-center text-sm font-semibold text-white"
              >
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
