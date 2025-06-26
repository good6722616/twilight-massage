import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="flex h-16 items-center justify-end gap-4 p-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      {children}
    </>
  )
}
