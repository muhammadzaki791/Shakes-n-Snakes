import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-brand-bg px-4">
      <SignUp
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
