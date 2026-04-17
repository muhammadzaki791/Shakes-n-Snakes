import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-brand-bg px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            cardBox: 'shadow-xl shadow-brand-primary/5',
          },
        }}
      />
    </div>
  )
}
