'use client'

import { useUser, SignIn } from '@clerk/nextjs'
import { type ReactNode } from 'react'

const adminEmails = process.env.NEXT_PUBLIC_CLERK_ADMIN_EMAIL_ADDRESSES?.split(',').map((e) =>
  e.trim().toLowerCase()
) || []

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-brand-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-brand-bg px-4">
        <SignIn
          appearance={{
            elements: { rootBox: 'mx-auto', cardBox: 'shadow-xl shadow-brand-primary/5' },
          }}
        />
      </div>
    )
  }

  const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase()
  const isAdmin = userEmail && adminEmails.includes(userEmail)

  if (!isAdmin) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-brand-bg px-4 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl text-brand-primary mb-4">
          Access Denied
        </h1>
        <p className="text-brand-text-secondary max-w-md">
          You don&apos;t have permission to access the admin area. Please sign in with an authorized admin account.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
