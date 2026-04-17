'use client'

import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const message = encodeURIComponent('Hi! I\'d like to place an order from Shakes-n-Snacks.')

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg animate-pulse-glow transition-transform hover:scale-110"
      aria-label="Order on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
