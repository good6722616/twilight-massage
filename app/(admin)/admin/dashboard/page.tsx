"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { H1 } from "@/components/ui/typography"
import { getDailyLogsByDate } from "@/services/dailyLogService"
import { getGiftCardRecordsByDate } from "@/services/giftCardService"
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
    refetchOnWindowFocus: true,
  })

  // Query to fetch gift card records for the selected date
  const { data: giftCardRecords = [], isLoading: isLoadingGiftCards } =
    useQuery({
      queryKey: ["giftCards", formattedDate],
      queryFn: async () => {
        const token = await getToken({ template: "supabase" })
        if (!token) throw new Error("No authentication token")
        return getGiftCardRecordsByDate(token, formattedDate)
      },
      enabled: !!selectedDate,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
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

  // Calculate gift card statistics for the selected date
  const giftCardStats = {
    totalCards: giftCardRecords.length, // Number of gift cards issued
    totalValue: giftCardRecords.reduce(
      (sum, record) => sum + (Number(record.amount) || 0),
      0
    ), // Total face value of all gift cards
    totalSold: giftCardRecords.reduce(
      (sum, record) => sum + (Number(record.sold_price) || 0),
      0
    ), // Total revenue from gift card sales
  }

  // Payment method breakdown for massage records
  const paymentBreakdown = {
    cash: records
      .filter((r) => r.payment_method === "cash")
      .reduce(
        (sum, r) =>
          sum +
          (function () {
            const { SERVICE_PRICES, ADDONS } = require("@/lib/types/massage")
            const price = SERVICE_PRICES[r.service_name]?.[r.duration] || 0
            const discountAmount = (price * r.discount) / 100
            const addOnsTotal = (r.add_ons || []).reduce((addonSum, addon) => {
              const addonPrice =
                ADDONS.find(
                  (a: { name: string; price: number }) => a.name === addon
                )?.price || 0
              return addonSum + addonPrice
            }, 0)
            return price - discountAmount + addOnsTotal
          })(),
        0
      ),
    credit_card: records
      .filter((r) => r.payment_method === "credit_card")
      .reduce(
        (sum, r) =>
          sum +
          (function () {
            const { SERVICE_PRICES, ADDONS } = require("@/lib/types/massage")
            const price = SERVICE_PRICES[r.service_name]?.[r.duration] || 0
            const discountAmount = (price * r.discount) / 100
            const addOnsTotal = (r.add_ons || []).reduce((addonSum, addon) => {
              const addonPrice =
                ADDONS.find(
                  (a: { name: string; price: number }) => a.name === addon
                )?.price || 0
              return addonSum + addonPrice
            }, 0)
            return price - discountAmount + addOnsTotal
          })(),
        0
      ),
    giftcard: records
      .filter((r) => r.payment_method === "giftcard")
      .reduce(
        (sum, r) =>
          sum +
          (function () {
            const { SERVICE_PRICES, ADDONS } = require("@/lib/types/massage")
            const price = SERVICE_PRICES[r.service_name]?.[r.duration] || 0
            const discountAmount = (price * r.discount) / 100
            const addOnsTotal = (r.add_ons || []).reduce((addonSum, addon) => {
              const addonPrice =
                ADDONS.find(
                  (a: { name: string; price: number }) => a.name === addon
                )?.price || 0
              return addonSum + addonPrice
            }, 0)
            return price - discountAmount + addOnsTotal
          })(),
        0
      ),
  }

  const todayStats = {
    totalClients: records.length,
    totalRevenue: calculateStoreIncome(records),
    totalStaffPays,
    totalTips,
  }

  return (
    <div className="min-h-screen space-y-8">
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

      {isLoading || isLoadingGiftCards ? (
        <LoadingSpinner />
      ) : (
        <>
          <DashboardStats
            totalClients={todayStats.totalClients}
            totalRevenue={todayStats.totalRevenue}
            totalStaffPays={todayStats.totalStaffPays}
            totalTips={todayStats.totalTips}
            giftCardStats={giftCardStats}
            paymentBreakdown={paymentBreakdown}
          />

          <ServiceRecordsList records={records} selectedDate={selectedDate} />
        </>
      )}
    </div>
  )
}
