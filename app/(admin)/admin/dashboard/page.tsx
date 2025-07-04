"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { Calendar, FileText, TrendingUp, Users, Settings } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { H1, P } from "@/components/ui/typography"
import { getTodaysDailyLogs } from "@/services/dailyLogService"

export default function DashboardPage() {
  const { getToken } = useAuth()

  // Query to fetch today's records for summary
  const { data: todayRecords = [] } = useQuery({
    queryKey: ["dailyLogs", "today"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return getTodaysDailyLogs(token)
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  })

  const todayStats = {
    totalClients: todayRecords.length,
    totalRevenue: todayRecords.reduce(
      (sum, record) => sum + (record.income || 0),
      0
    ),
    averagePrice:
      todayRecords.length > 0
        ? todayRecords.reduce((sum, record) => sum + (record.income || 0), 0) /
          todayRecords.length
        : 0,
  }

  return (
    <div className="space-y-8">
      <div>
        <H1 className="text-3xl font-bold text-gray-900">Dashboard</H1>
        <P className="mt-2 text-base text-gray-600">
          Welcome to Twilight Massage admin portal
        </P>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Total appointments today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${todayStats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total earnings today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${todayStats.averagePrice.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per appointment today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Log Management
            </CardTitle>
            <CardDescription>
              Track and manage daily massage appointments and revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                You have {todayStats.totalClients} appointments logged for
                today.
              </p>
              <Link href="/admin/daily-log">
                <Button className="w-full">Go to Daily Log</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>
              Configure application settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Manage your admin portal settings and configurations.
              </p>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full">
                  Go to Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {todayRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest appointments from today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayRecords.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{record.staff}</p>
                    <p className="text-sm text-gray-600">
                      {record.service_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${record.income?.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {record.duration}min
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {todayRecords.length > 5 && (
              <div className="mt-4 border-t pt-4">
                <Link href="/admin/daily-log">
                  <Button variant="ghost" className="w-full">
                    View all {todayRecords.length} appointments
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
