"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { H1 } from "@/components/ui/typography"
import { getDailyLogsByDate, updateDailyLog } from "@/services/dailyLogService"
import { getGiftCardRecordsByDate } from "@/services/giftCardService"
import { format, isSameDay, isValid, startOfToday } from "date-fns"
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats"
import {
  DateRangeSelector,
  DateRange,
} from "@/components/admin/dashboard/DateRangeSelector"
import { ServiceRecordsList } from "@/components/admin/dashboard/ServiceRecordsList"
import { LoadingSpinner } from "@/components/admin/dashboard/LoadingSpinner"
import { CompactStaffSummary } from "@/components/admin/dashboard/CompactStaffSummary"
import {
  calculateStoreIncome,
  calculateStaffIncome,
  calculateDiscountAmount,
  type MassageType,
  type Duration,
  type Addon,
  type MassageRecord,
} from "@/lib/types/massage"
import { useServices } from "@/hooks/useServices"
import { usePermissions } from "@/hooks/usePermissions"
import { EditLogForm } from "@/components/admin/daily-log/EditLogForm"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export default function DashboardPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  // 使用动态服务数据
  const { serviceDetails, loading: servicesLoading } = useServices()

  // 权限检查
  const { userRole } = usePermissions()
  const isAdmin = userRole === "admin"

  // 编辑状态管理
  const [editingRecord, setEditingRecord] = useState<MassageRecord | null>(null)

  // 默认区间为今天
  const today = startOfToday()
  const [dateRange, setDateRange] = useState<DateRange>({
    from: today,
    to: today,
  })

  // 格式化参数
  const from =
    dateRange.from && isValid(dateRange.from)
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined
  const to =
    dateRange.to && isValid(dateRange.to)
      ? format(dateRange.to, "yyyy-MM-dd")
      : undefined
  const isSingleDay = from && to && from === to

  // Query to fetch records for the selected range
  const { data: records = [], isLoading } = useQuery({
    queryKey: ["dailyLogs", from, to],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return getDailyLogsByDate(token, from!, to!)
    },
    enabled: !!from && !!to,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })

  // Query to fetch gift card records for the selected range
  const { data: giftCardRecords = [], isLoading: isLoadingGiftCards } =
    useQuery({
      queryKey: ["giftCards", from, to],
      queryFn: async () => {
        const token = await getToken({ template: "supabase" })
        if (!token) throw new Error("No authentication token")
        return getGiftCardRecordsByDate(token, from!, to!)
      },
      enabled: !!from && !!to,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    })

  const totalTips = records.reduce((total, record) => {
    const tip =
      typeof record.tip === "number" ? record.tip : parseFloat(record.tip) || 0
    return total + tip
  }, 0)

  // Calculate gift card statistics for the selected range
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
    paymentBreakdown: {
      cash: giftCardRecords
        .filter((record) => record.payment_method === "cash")
        .reduce((sum, record) => sum + (Number(record.sold_price) || 0), 0),
      credit_card: giftCardRecords
        .filter((record) => record.payment_method === "credit_card")
        .reduce((sum, record) => sum + (Number(record.sold_price) || 0), 0),
    },
  }

  // 构建服务价格映射
  const servicePrices = useMemo(() => {
    const prices: Record<string, Record<number, number>> = {}
    Object.values(serviceDetails).forEach((service: any) => {
      if (service && service.is_active) {
        prices[service.name] = {}
        service.durations.forEach((duration: any) => {
          if (duration.is_active) {
            prices[service.name][duration.duration] = duration.customer_price
          }
        })
      }
    })
    return prices
  }, [serviceDetails])

  // Payment method breakdown for massage records
  const paymentBreakdown = useMemo(() => {
    const { ADDONS } = require("@/lib/types/massage")

    return {
      cash: records
        .filter((r) => {
          // Handle both old string format and new JSONB format
          if (typeof r.payment_method === "string") {
            return r.payment_method === "cash"
          }
          if (
            typeof r.payment_method === "object" &&
            r.payment_method !== null
          ) {
            // For custom payments, check if cash has an amount
            if (r.payment_method.cash !== null && r.payment_method.cash! > 0) {
              return true
            }
            // For single payments, check if cash is the only method
            const methods = Object.keys(r.payment_method)
            const amounts = Object.values(r.payment_method)
            const hasAmounts = amounts.some(
              (amount) => amount !== null && amount > 0
            )
            if (!hasAmounts && methods[0] === "cash") {
              return true
            }
          }
          return false
        })
        .reduce((sum, r) => {
          // For custom payments, use the stored amount
          if (
            typeof r.payment_method === "object" &&
            r.payment_method !== null
          ) {
            const amount = r.payment_method.cash
            if (amount !== null && amount > 0) {
              return sum + amount
            }
          }

          // For single payments, calculate the amount
          const price = servicePrices[r.service_name]?.[r.duration] || 0
          const discountAmount = calculateDiscountAmount(price, r.discount)
          const addOnsTotal = (r.add_ons || []).reduce((addonSum, addon) => {
            const addonPrice =
              ADDONS.find(
                (a: { name: string; price: number }) => a.name === addon
              )?.price || 0
            return addonSum + addonPrice
          }, 0)
          return sum + price - discountAmount + addOnsTotal
        }, 0),
      credit_card: records
        .filter((r) => {
          // Handle both old string format and new JSONB format
          if (typeof r.payment_method === "string") {
            return r.payment_method === "credit_card"
          }
          if (
            typeof r.payment_method === "object" &&
            r.payment_method !== null
          ) {
            // For custom payments, check if credit_card has an amount
            if (
              r.payment_method.credit_card !== null &&
              r.payment_method.credit_card! > 0
            ) {
              return true
            }
            // For single payments, check if credit_card is the only method
            const methods = Object.keys(r.payment_method)
            const amounts = Object.values(r.payment_method)
            const hasAmounts = amounts.some(
              (amount) => amount !== null && amount > 0
            )
            if (!hasAmounts && methods[0] === "credit_card") {
              return true
            }
          }
          return false
        })
        .reduce((sum, r) => {
          // For custom payments, use the stored amount
          if (
            typeof r.payment_method === "object" &&
            r.payment_method !== null
          ) {
            const amount = r.payment_method.credit_card
            if (amount !== null && amount > 0) {
              return sum + amount
            }
          }

          // For single payments, calculate the amount
          const price = servicePrices[r.service_name]?.[r.duration] || 0
          const discountAmount = calculateDiscountAmount(price, r.discount)
          const addOnsTotal = (r.add_ons || []).reduce((addonSum, addon) => {
            const addonPrice =
              ADDONS.find(
                (a: { name: string; price: number }) => a.name === addon
              )?.price || 0
            return addonSum + addonPrice
          }, 0)
          return sum + price - discountAmount + addOnsTotal
        }, 0),
      giftcard: records
        .filter((r) => {
          // Handle both old string format and new JSONB format
          if (typeof r.payment_method === "string") {
            return r.payment_method === "giftcard"
          }
          if (
            typeof r.payment_method === "object" &&
            r.payment_method !== null
          ) {
            // For custom payments, check if giftcard has an amount
            if (
              r.payment_method.giftcard !== null &&
              r.payment_method.giftcard! > 0
            ) {
              return true
            }
            // For single payments, check if giftcard is the only method
            const methods = Object.keys(r.payment_method)
            const amounts = Object.values(r.payment_method)
            const hasAmounts = amounts.some(
              (amount) => amount !== null && amount > 0
            )
            if (!hasAmounts && methods[0] === "giftcard") {
              return true
            }
          }
          return false
        })
        .reduce((sum, r) => {
          // For custom payments, use the stored amount
          if (
            typeof r.payment_method === "object" &&
            r.payment_method !== null
          ) {
            const amount = r.payment_method.giftcard
            if (amount !== null && amount > 0) {
              return sum + amount
            }
          }

          // For single payments, calculate the amount
          const price = servicePrices[r.service_name]?.[r.duration] || 0
          const discountAmount = calculateDiscountAmount(price, r.discount)
          const addOnsTotal = (r.add_ons || []).reduce((addonSum, addon) => {
            const addonPrice =
              ADDONS.find(
                (a: { name: string; price: number }) => a.name === addon
              )?.price || 0
            return addonSum + addonPrice
          }, 0)
          return sum + price - discountAmount + addOnsTotal
        }, 0),
      classpass: records
        .filter((r) => {
          // Handle both old string format and new JSONB format
          if (typeof r.payment_method === "string") {
            return r.payment_method === "classpass"
          }
          if (
            typeof r.payment_method === "object" &&
            r.payment_method !== null
          ) {
            // For custom payments, check if classpass has an amount
            if (
              r.payment_method.classpass !== null &&
              r.payment_method.classpass! > 0
            ) {
              return true
            }
            // For single payments, check if classpass is the only method
            const methods = Object.keys(r.payment_method)
            const amounts = Object.values(r.payment_method)
            const hasAmounts = amounts.some(
              (amount) => amount !== null && amount > 0
            )
            if (!hasAmounts && methods[0] === "classpass") {
              return true
            }
          }
          return false
        })
        .reduce((sum, r) => {
          // For custom payments, use the stored amount
          if (
            typeof r.payment_method === "object" &&
            r.payment_method !== null
          ) {
            const amount = r.payment_method.classpass
            if (amount !== null && amount > 0) {
              return sum + amount
            }
          }

          // For single payments, calculate the amount
          const price = servicePrices[r.service_name]?.[r.duration] || 0
          const discountAmount = calculateDiscountAmount(price, r.discount)
          const addOnsTotal = (r.add_ons || []).reduce((addonSum, addon) => {
            const addonPrice =
              ADDONS.find(
                (a: { name: string; price: number }) => a.name === addon
              )?.price || 0
            return addonSum + addonPrice
          }, 0)
          return sum + price - discountAmount + addOnsTotal
        }, 0),
    }
  }, [records, servicePrices])

  // 构建员工收入映射
  const serviceStaffIncomes = useMemo(() => {
    const incomes: Record<string, Record<number, number>> = {}
    Object.values(serviceDetails).forEach((service: any) => {
      if (service && service.is_active) {
        incomes[service.name] = {}
        service.durations.forEach((duration: any) => {
          if (duration.is_active) {
            incomes[service.name][duration.duration] = duration.staff_income
          }
        })
      }
    })
    return incomes
  }, [serviceDetails])

  const totalStaffPays = records.reduce((total, record) => {
    const staffIncome = calculateStaffIncome(
      record.service_name as MassageType,
      record.duration as Duration,
      record.add_ons as Addon[],
      serviceStaffIncomes
    )
    return total + staffIncome
  }, 0)

  const todayStats = {
    totalClients: records.length,
    totalRevenue: calculateStoreIncome(records, servicePrices),
    totalStaffPays,
    totalTips,
  }

  // Mutation to update a record
  const updateRecordMutation = useMutation({
    mutationFn: async ({
      id,
      record,
    }: {
      id: string
      record: Omit<
        MassageRecord,
        "id" | "created_at" | "updated_at" | "user_id"
      >
    }) => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return updateDailyLog(id, record, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogs"] })
      setEditingRecord(null)
      toast.success("Record updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update record")
    },
  })

  // Handle edit record
  const handleEditRecord = (record: MassageRecord) => {
    setEditingRecord(record)
  }

  // Handle update record
  const handleUpdateRecord = (
    record: Omit<MassageRecord, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    if (editingRecord) {
      updateRecordMutation.mutate({ id: editingRecord.id, record })
    }
  }

  // 标题文案
  let rangeTitle = ""
  if (from && to) {
    if (from === to) {
      rangeTitle = `Service records for ${format(dateRange.from!, "M/dd/yyyy")}`
    } else {
      rangeTitle = `Service records from ${format(dateRange.from!, "M/dd/yyyy")} - ${format(dateRange.to!, "M/dd/yyyy")}`
    }
  }

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <H1 className="text-3xl font-bold text-gray-900">Dashboard</H1>
          <p className="mt-2 text-base text-gray-600">{rangeTitle}</p>
        </div>
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      {servicesLoading || isLoading || isLoadingGiftCards ? (
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

          {/* Mobile Layout */}
          <div className="space-y-6 xl:hidden">
            <CompactStaffSummary
              records={records}
              title={
                isSingleDay
                  ? `Staff - ${format(dateRange.from!, "M/dd")}`
                  : `Staff - ${format(dateRange.from!, "M/dd")} to ${format(dateRange.to!, "M/dd")}`
              }
            />
            <ServiceRecordsList
              records={records}
              dateRange={dateRange}
              onEdit={isAdmin ? handleEditRecord : undefined}
              isAdmin={isAdmin}
            />
          </div>

          {/* Desktop Layout */}
          <div className="hidden gap-6 xl:grid xl:grid-cols-3">
            <CompactStaffSummary
              records={records}
              title={
                isSingleDay
                  ? `Staff Breakdown - ${format(dateRange.from!, "M/dd/yyyy")}`
                  : `Staff Breakdown - ${format(dateRange.from!, "M/dd")} to ${format(dateRange.to!, "M/dd")}`
              }
              className="xl:col-span-1"
            />
            <div className="xl:col-span-2">
              <ServiceRecordsList
                records={records}
                dateRange={dateRange}
                onEdit={isAdmin ? handleEditRecord : undefined}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </>
      )}

      {/* Edit Record Sheet */}
      {isAdmin && (
        <Sheet
          open={!!editingRecord}
          onOpenChange={(open) => !open && setEditingRecord(null)}
        >
          <SheetContent side="right" className="w-full p-0 sm:max-w-xl">
            <div className="flex h-full flex-col">
              <SheetHeader className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
                <SheetTitle>Edit Service Record</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {editingRecord && (
                  <EditLogForm
                    record={editingRecord}
                    onSubmit={handleUpdateRecord}
                    onCancel={() => setEditingRecord(null)}
                    isSubmitting={updateRecordMutation.isPending}
                    isSuccess={updateRecordMutation.isSuccess}
                  />
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
