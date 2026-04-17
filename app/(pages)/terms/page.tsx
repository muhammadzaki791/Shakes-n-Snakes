export default function TermsPage() {
  return (
    <div className="bg-brand-bg py-20 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl text-brand-text mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-brand-text-muted mb-8">Last updated: April 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-brand-text-secondary">
          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              1. Ordering
            </h2>
            <p>
              Orders are placed via WhatsApp, phone call, or our order form. All orders are subject
              to availability. We reserve the right to refuse or cancel orders at our discretion.
              Order confirmations are sent via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              2. Pricing
            </h2>
            <p>
              All prices are listed in Pakistani Rupees (PKR/Rs.). Prices may change without prior
              notice. The price at the time of your order is the price you pay. Delivery charges, if
              applicable, are communicated separately.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              3. Payment
            </h2>
            <p>
              We currently accept Cash on Delivery (COD) only. Payment is due upon delivery of your
              order. Please ensure you have the exact amount or close to it.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              4. Delivery &amp; Pickup
            </h2>
            <p>
              Delivery times are estimates and may vary based on location, order volume, and weather
              conditions. We are not liable for delays caused by circumstances beyond our control.
              Pickup orders are available — just let us know when placing your order.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              5. Food Safety &amp; Allergens
            </h2>
            <p>
              All our food is 100% halal. Our kitchen handles common allergens including dairy,
              gluten, nuts, and eggs. If you have specific allergies, please inform us when ordering.
              While we take precautions, we cannot guarantee a completely allergen-free environment.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              6. Refunds &amp; Complaints
            </h2>
            <p>
              If there&apos;s an issue with your order, contact us on WhatsApp within 1 hour of
              delivery with a photo of the issue. We&apos;ll offer a replacement or refund at our
              discretion. Refunds are not available for correctly fulfilled orders based on personal
              taste preferences.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              7. Website Content
            </h2>
            <p>
              Images on this website are for illustration purposes. Actual food presentation may vary
              slightly. Menu items and availability are subject to change. We make every effort to
              ensure accuracy but do not guarantee that all information is error-free.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-accent)] text-xl text-brand-text">
              8. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, images, logos, and design, is the property
              of Shakes-n-Snacks. Unauthorized reproduction or distribution is prohibited.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
