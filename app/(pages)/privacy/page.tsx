export default function PrivacyPage() {
  return (
    <div className="bg-brand-bg py-20 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl text-brand-text mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-brand-text-muted mb-8">Last updated: April 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-brand-text-secondary">
          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              1. What We Collect
            </h2>
            <p>
              When you interact with Shakes-n-Snacks, we may collect: your name, email address,
              and phone number (when you subscribe to our newsletter or contact us via WhatsApp),
              and basic usage data (pages visited, time on site, browser type).
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information to: process and deliver your orders via WhatsApp, send
              newsletter emails (only if you subscribed), improve our menu and website experience,
              and communicate order-related updates.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              3. Third-Party Services
            </h2>
            <p>
              We use trusted third-party services to operate this website: Clerk (for admin
              authentication), Sanity (content management), and Vercel (website hosting). These
              services may process your data in accordance with their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              4. Newsletter
            </h2>
            <p>
              If you subscribe to our newsletter, you&apos;ll receive a maximum of 2 emails per
              week. These may include new menu items, promotions, and exclusive deals. You can
              unsubscribe at any time by contacting us on WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              5. Cookies
            </h2>
            <p>
              We use minimal cookies required for authentication and website functionality. We do not
              use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              6. Data Security
            </h2>
            <p>
              We take reasonable measures to protect your personal information. However, no method of
              transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              7. Your Rights
            </h2>
            <p>
              You have the right to: request access to your personal data, request deletion of your
              data, opt out of newsletter communications, and contact us with any privacy concerns.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              8. Contact Us
            </h2>
            <p>
              For any privacy-related questions, reach out to us via WhatsApp or email at
              hello@shakesnsnacks.pk.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
