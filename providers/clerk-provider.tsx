'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { type ReactNode } from 'react'

export default function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#FF2D78',
          colorBackground: '#1A1A1A',
          colorText: '#FFFFFF',
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
