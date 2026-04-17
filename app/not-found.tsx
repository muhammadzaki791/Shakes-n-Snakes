"use client";

import Link from "next/link";
import { Home, UtensilsCrossed } from "lucide-react";
import { FadeIn } from "@/lib/animations";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-brand-bg px-4">
      <FadeIn>
        <div className="text-center max-w-lg">
          {/* Big 404 */}
          <h1 className="font-[family-name:var(--font-heading)] text-[8rem] sm:text-[10rem] leading-none text-brand-primary/20 select-none">
            404
          </h1>

          {/* Message */}
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-brand-text -mt-6 mb-4">
            Oops! This Page Got Eaten.
          </h2>
          <p className="text-brand-text-secondary mb-8 text-lg">
            Looks like someone was hungrier than expected. The page you&apos;re
            looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-8 py-3 font-[family-name:var(--font-accent)] font-semibold text-white hover:bg-brand-primary-hover transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-3 font-[family-name:var(--font-accent)] font-semibold text-brand-text hover:border-brand-primary hover:text-brand-primary transition-colors"
            >
              <UtensilsCrossed className="h-4 w-4" />
              View Menu
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
