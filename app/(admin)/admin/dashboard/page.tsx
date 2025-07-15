"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { H1 } from "@/components/ui/typography"
import { getDailyLogsByDate } from "@/services/dailyLogService"
import { format } from "date-fns"
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats"
import { DateSelector } from "@/components/admin/dashboard/DateSelector"
import { ServiceRecordsList } from "@/components/admin/dashboard/ServiceRecordsList"
import { LoadingSpinner } from "@/components/admin/dashboard/LoadingSpinner"
import {
  calculateStoreIncome,
  calculateStaffIncome,
  type MassageType,
  type Duration,
  type Addon,
} from "@/lib/types/massage"

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

  const totalStaffPays = records.reduce((total, record) => {
    const staffIncome = calculateStaffIncome(
      record.service_name as MassageType,
      record.duration as Duration,
      record.add_ons as Addon[]
    )
    return total + staffIncome
  }, 0)

  const totalTips = records.reduce((total, record) => {
    const tip =
      typeof record.tip === "number" ? record.tip : parseFloat(record.tip) || 0
    return total + tip
  }, 0)

  const todayStats = {
    totalClients: records.length,
    totalRevenue: calculateStoreIncome(records),
    totalStaffPays,
    totalTips,
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
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <DashboardStats
            totalClients={todayStats.totalClients}
            totalRevenue={todayStats.totalRevenue}
            totalStaffPays={todayStats.totalStaffPays}
            totalTips={todayStats.totalTips}
          />

          <ServiceRecordsList records={records} selectedDate={selectedDate} />
        </>
      )}
    </div>
  )
}
