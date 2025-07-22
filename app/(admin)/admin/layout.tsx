"use client"
import type React from "react"
import { useState, useEffect } from "react"
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/nextjs"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { QueryProvider } from "@/components/providers/query-provider"
import { H3 } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ""
    }
  }, [sidebarOpen])

  return (
    <>
      <SignedIn>
        <QueryProvider>
          <div className="flex min-h-screen">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar - Fixed width on desktop, overlay on mobile */}
            <div
              className={`
              fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-gray-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
            >
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 lg:hidden">
                  <span className="text-lg font-semibold text-gray-900">
                    Admin
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <AppSidebar />
              </div>
            </div>

            {/* Main content - Takes remaining width */}
            <div className="flex min-w-0 flex-1 flex-col overflow-auto">
              <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  <div>
                    <H3 className="text-lg font-semibold text-gray-900">
                      Twilight Massage
                    </H3>
                  </div>
                </div>
                <UserButton />
              </header>

              <main className="flex-1 bg-gray-50 p-6">
                <div className="max-w-8xl mx-auto">{children}</div>
              </main>
            </div>
          </div>
        </QueryProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
