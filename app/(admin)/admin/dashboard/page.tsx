"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { Calendar } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { H1 } from "@/components/ui/typography"
import { getDailyLogsByDate } from "@/services/dailyLogService"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Calendar as DatePicker } from "@/components/ui/calendar"
import { format } from "date-fns"
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats"
import { calculateStoreIncome } from "@/lib/types/massage"

export default function DashboardPage() {
  const { getToken } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const formattedDate = format(selectedDate, "yyyy-MM-dd")

  // Query to fetch records for the selected date
  const { data: records = [], isLoading } = useQuery({
    queryKey: ["dailyLogs", formattedDate],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return getDailyLogsByDate(token, formattedDate)
    },
    enabled: !!selectedDate,
    staleTime: 5 * 60 * 1000,
  })

  const todayStats = {
    totalClients: records.length,
    totalRevenue: calculateStoreIncome(records),
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <H1 className="text-3xl font-bold text-gray-900">Dashboard</H1>
          <p className="mt-2 text-base text-gray-600">
            Service records for {format(selectedDate, "MMMM dd, yyyy")}
          </p>
        </div>
        <div className="flex flex-1 justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex h-9 w-auto min-w-0 items-center gap-2 px-3 text-sm font-medium"
              >
                <Calendar className="mr-1 h-4 w-4" />
                {format(selectedDate, "yyyy-MM-dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <DatePicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {isLoading && (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
        </div>
      )}

      {!isLoading && (
        <>
          <DashboardStats
            totalClients={todayStats.totalClients}
            totalRevenue={todayStats.totalRevenue}
          />

          {/* Appointments List */}
          {records.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Service Records for {format(selectedDate, "MMMM dd, yyyy")}
                </CardTitle>
                <CardDescription>
                  All services for the selected date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {records.slice(0, 5).map((record) => (
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
                        <p className="font-medium">
                          ${record.income?.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {record.duration}min
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {records.length > 5 && (
                  <div className="mt-4 border-t pt-4 text-center text-sm text-gray-500">
                    Showing 5 of {records.length} services
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
