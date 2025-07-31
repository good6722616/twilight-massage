"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {
  Calendar,
  Users,
  BarChart,
  Settings,
  Home,
  FileText,
  TrendingUp,
  Shield,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Daily Log", href: "/admin/daily-log", icon: Calendar },
  { name: "Staff", href: "/admin/staff", icon: Users },
]

const adminTools = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U"
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U"
  }

  // Get display name
  const getDisplayName = () => {
    if (!user) return "User"
    return (
      user.fullName ||
      user.firstName ||
      user.emailAddresses[0]?.emailAddress ||
      "User"
    )
  }

  // Get email
  const getEmail = () => {
    if (!user) return "user@example.com"
    return user.emailAddresses[0]?.emailAddress || "user@example.com"
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
            <BarChart className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
              Admin Portal
            </span>
            <span className="text-xs text-gray-500">Management Dashboard</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-6 p-4">
        {/* Main Navigation */}
        <div>
          <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Main Navigation
          </h3>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Admin Tools */}
        <div>
          <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Administration
          </h3>
          <nav className="space-y-1">
            {adminTools.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <div
                  key={item.name}
                  className={`group flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 opacity-50 transition-all duration-200 ${
                    isActive
                      ? "bg-orange-50 text-orange-700 shadow-sm"
                      : "text-gray-700"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600" />
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shadow-lg ring-2 ring-gray-200">
            <AvatarImage src={user?.imageUrl} alt={getDisplayName()} />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 font-semibold text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-gray-900">
                {isLoaded ? getDisplayName() : "Loading..."}
              </span>
              <Badge
                variant="secondary"
                className="border-green-200 bg-green-100 px-2 py-0.5 text-xs text-green-700"
              >
                Online
              </Badge>
            </div>
            <span className="block truncate text-xs text-gray-500">
              {isLoaded ? getEmail() : "loading@example.com"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
