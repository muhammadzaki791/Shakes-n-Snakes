import { UtensilsCrossed, Zap, BadgeDollarSign, Users } from 'lucide-react'
import Link from 'next/link'

const values = [
  { icon: UtensilsCrossed, title: 'Made Fresh, Every Single Time', desc: 'No shortcuts. No pre-made batches. Every shake is blended, every fry is fried, every shawarma is rolled — when YOU order it.' },
  { icon: Zap, title: 'Speed Without Sacrifice', desc: 'Fast food doesn\'t have to mean lazy food. We move quick, but we never cut corners on taste or quality.' },
  { icon: BadgeDollarSign, title: 'Prices That Make Sense', desc: 'You shouldn\'t have to choose between delicious and affordable. At Shakes-n-Snacks, you get both. Always.' },
  { icon: Users, title: 'Community First', desc: 'We\'re not a faceless brand. We\'re your neighborhood food spot. We know our regulars by name — and we\'d love to know yours.' },
]

export default function AboutPage() {
  return (
    <div className="bg-brand-bg">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl text-brand-text mb-6">
                We Don&apos;t Just Serve Food.<br />
                <span className="text-brand-primary">We Serve Cravings.</span>
              </h1>
              <p className="text-lg text-brand-text-secondary mb-4">
                Every great food story starts with one thing: <strong className="text-brand-text">obsession</strong>.
              </p>
              <p className="text-brand-text-secondary mb-4">
                It started with shakes. Thick, overloaded, ridiculous shakes that made people stop mid-scroll and say, &ldquo;Wait, where is this from?&rdquo; Then came the fries — masala-loaded, crispy, impossible to stop eating. Then the shawarma. Then the biryani. Then the limca. Then the gola ganda.
              </p>
              <p className="text-brand-text-secondary mb-4">
                One thing led to another, and before we knew it, Shakes-n-Snacks wasn&apos;t just a food spot — it was a <strong className="text-brand-text">craving destination</strong>.
              </p>
              <p className="text-brand-text-secondary">
                We&apos;re not a franchise. We&apos;re not a chain. We&apos;re proudly local, proudly fresh, and proudly <em>extra</em>. Every single item is made to order — because you deserve food that was made for YOU, not made in advance and reheated.
              </p>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/10">
              <img src="https://placehold.co/600x600/1A1A1A/FF2D78?text=About+Us" alt="About Shakes-n-Snacks" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-brand-secondary">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-brand-text mb-4">Our Mission</h2>
          <p className="font-[family-name:var(--font-accent)] text-2xl text-brand-primary neon-text-pink">
            Fresh. Fast. Unapologetically Delicious.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-brand-text text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-brand-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
                  <v.icon className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="font-[family-name:var(--font-accent)] font-semibold text-brand-text mb-2">{v.title}</h3>
                <p className="text-sm text-brand-text-secondary">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-brand-secondary text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl text-brand-text mb-4">Hungry Yet?</h2>
        <p className="text-brand-text-secondary mb-8">Check out our menu or order directly on WhatsApp.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/menu" className="rounded-full bg-brand-primary px-8 py-3 font-[family-name:var(--font-accent)] font-semibold text-white hover:bg-brand-primary-hover transition-colors">
            View Menu
          </Link>
          <Link href="/contact" className="rounded-full border border-white/10 px-8 py-3 font-[family-name:var(--font-accent)] font-semibold text-brand-text hover:border-brand-primary hover:text-brand-primary transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
