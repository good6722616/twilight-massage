"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { H1, P } from "@/components/ui/typography"
import Link from "next/link"
import { Home, Calendar, Settings } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()

  // Redirect to dashboard after a brief moment
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/admin/dashboard")
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="space-y-8">
      <div>
        <H1 className="text-3xl font-bold text-gray-900">Admin Portal</H1>
        <P className="mt-2 text-base text-gray-600">
          Welcome to Twilight Massage administration
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/admin/dashboard" className="group">
          <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                  Dashboard
                </h3>
                <p className="text-sm text-gray-600">
                  View overview and statistics
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/daily-log" className="group">
          <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-green-300 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600">
                  Daily Log
                </h3>
                <p className="text-sm text-gray-600">
                  Manage appointments and records
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/settings" className="group">
          <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-orange-300 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-200">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">
                  Settings
                </h3>
                <p className="text-sm text-gray-600">
                  Configure system preferences
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="text-center">
        <P className="text-sm text-gray-500">Redirecting to dashboard...</P>
      </div>
    </div>
  )
}
