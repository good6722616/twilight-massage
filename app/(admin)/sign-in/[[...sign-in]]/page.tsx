import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            footerActionLink: "text-blue-600 hover:text-blue-700",
          },
        }}
        fallbackRedirectUrl="/admin/daily-log"
        signUpUrl="/admin/sign-up"
      />
    </div>
  )
}
