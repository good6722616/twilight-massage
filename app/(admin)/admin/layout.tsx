import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { Sidebar } from "@/components/admin/sidebar"
import { QueryProvider } from "@/components/providers/query-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SignedIn>
        <QueryProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </QueryProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  )
}
