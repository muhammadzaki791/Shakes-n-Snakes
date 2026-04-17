import type { Metadata } from 'next'
import { Lilita_One, Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import ClerkProviderWrapper from '@/providers/clerk-provider'
import { Header } from '@/components/navigation/header'
import { Footer } from '@/components/navigation/footer'
import { WhatsAppButton } from '@/components/whatsapp-button/whatsapp-button'

const lilitaOne = Lilita_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-accent',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Shakes-n-Snacks | Crave It. Order It. Love It.',
    template: '%s | Shakes-n-Snacks',
  },
  description:
    'Your favorite shakes, fries, and snacks — made fresh, delivered fast. Order via WhatsApp or call.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${lilitaOne.variable} ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen bg-brand-bg font-[family-name:var(--font-body)] text-brand-text antialiased">
        <ClerkProviderWrapper>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
          <WhatsAppButton />
        </ClerkProviderWrapper>
      </body>
    </html>
  )
}
