"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Users, DollarSign, Coins, PiggyBank } from "lucide-react"
import { staffService } from "@/services/staffService"
import type { MassageRecord } from "@/lib/types/massage"
import {
  calculateStaffIncome,
  type MassageType,
  type Duration,
  type Addon,
} from "@/lib/types/massage"
import { useServices } from "@/hooks/useServices"

interface CompactStaffSummaryProps {
  records: MassageRecord[]
  title?: string
  className?: string
}

type StaffSummary = {
  name: string
  totalIncome: number
  recordCount: number
  totalPay: number
  totalTips: number
}

export function CompactStaffSummary({
  records,
  title = "Staff Breakdown",
  className = "",
}: CompactStaffSummaryProps) {
  const { getToken } = useAuth()

  // 使用动态服务数据
  const { serviceDetails } = useServices()

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

  // Get all staff from database
  const { data: allStaff } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return staffService.getAllStaff(token)
    },
  })

  // Calculate staff income breakdown
  const staffIncomeBreakdown = useMemo(
    () =>
      records.reduce(
        (acc, record) => {
          const staffName = record.staff
          const staffIncome = calculateStaffIncome(
            record.service_name as MassageType,
            record.duration as Duration,
            record.add_ons as Addon[],
            serviceStaffIncomes
          )
          const tip =
            typeof record.tip === "number"
              ? record.tip
              : parseFloat(record.tip) || 0
          const totalIncome = staffIncome + tip

          if (!acc[staffName]) {
            acc[staffName] = {
              name: staffName,
              totalIncome: 0,
              recordCount: 0,
              totalPay: 0,
              totalTips: 0,
            }
          }

          acc[staffName].totalIncome += totalIncome
          acc[staffName].recordCount += 1
          acc[staffName].totalPay += staffIncome
          acc[staffName].totalTips += tip

          return acc
        },
        {} as Record<string, StaffSummary>
      ),
    [records, serviceStaffIncomes]
  )

  // Ensure all staff are present, even if they have zero records
  const staffList = useMemo(() => {
    if (!allStaff) return []

    return allStaff.map((staff) => {
      const found = staffIncomeBreakdown[staff.name]
      return found
        ? found
        : {
            name: staff.name,
            totalIncome: 0,
            recordCount: 0,
            totalPay: 0,
            totalTips: 0,
          }
    })
  }, [staffIncomeBreakdown, allStaff])

  // Calculate totals
  const totals = useMemo(() => {
    return staffList.reduce(
      (acc, staff) => ({
        totalIncome: acc.totalIncome + staff.totalIncome,
        totalPay: acc.totalPay + staff.totalPay,
        totalTips: acc.totalTips + staff.totalTips,
        totalServices: acc.totalServices + staff.recordCount,
      }),
      { totalIncome: 0, totalPay: 0, totalTips: 0, totalServices: 0 }
    )
  }, [staffList])

  if (!staffList.length) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 sm:text-lg">
            <Users className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
            <span className="truncate">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <div className="text-sm italic text-gray-500">
              No staff records found.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 sm:text-lg">
          <Users className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats Row */}
        <div className="grid grid-cols-3 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 sm:p-3">
          <div className="text-center">
            <div className="text-xs font-medium text-gray-500">Services</div>
            <div className="text-sm font-bold text-blue-600 sm:text-lg">
              {totals.totalServices}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-medium text-gray-500">Total Pay</div>
            <div className="text-sm font-bold text-green-600 sm:text-lg">
              ${totals.totalPay.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-medium text-gray-500">Total Tips</div>
            <div className="text-sm font-bold text-purple-600 sm:text-lg">
              ${totals.totalTips.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Legend for mobile */}
        <div className="flex items-center justify-center gap-4 rounded-lg bg-gray-50 p-2 text-xs text-gray-600 sm:hidden">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>Base Pay</span>
          </div>
          <div className="flex items-center gap-1">
            <Coins className="h-3 w-3" />
            <span>Tips</span>
          </div>
        </div>

        <Separator />

        {/* Individual Staff List */}
        <div className="space-y-3">
          {staffList.map((staff) => (
            <div
              key={staff.name}
              className={`rounded-lg border p-1.5 transition-all sm:p-3 ${
                staff.recordCount > 0
                  ? "border-gray-200 bg-white shadow-sm hover:shadow-md"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              {/* Mobile Layout (stacked) */}
              <div className="flex flex-col gap-1.5 sm:hidden">
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700">
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs font-medium capitalize text-gray-900">
                    {staff.name}
                  </span>
                  {staff.recordCount > 0 && (
                    <Badge
                      variant="outline"
                      className="h-3.5 border-blue-200 bg-blue-50 px-1 text-xs text-blue-700"
                    >
                      {staff.recordCount}
                    </Badge>
                  )}
                  <div className="ml-auto">
                    <div
                      className={`text-xs font-bold ${
                        staff.totalIncome > 0
                          ? "text-green-700"
                          : "text-gray-400"
                      }`}
                    >
                      ${staff.totalIncome.toFixed(2)}
                    </div>
                  </div>
                </div>

                {staff.recordCount > 0 && (
                  <div className="ml-6 flex items-center gap-2.5">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-0.5">
                            <DollarSign className="h-2.5 w-2.5 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              ${staff.totalPay.toFixed(2)}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Base Pay</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-0.5">
                            <Coins className="h-2.5 w-2.5 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              ${staff.totalTips.toFixed(2)}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tips</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}

                {staff.recordCount === 0 && (
                  <div className="ml-6 text-xs text-gray-400">No services</div>
                )}
              </div>

              {/* Desktop Layout (horizontal) */}
              <div className="hidden items-center gap-3 sm:flex">
                {/* Avatar */}
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700">
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {/* Staff Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium capitalize text-gray-900">
                      {staff.name}
                    </span>
                    {staff.recordCount > 0 && (
                      <Badge
                        variant="outline"
                        className="h-5 border-blue-200 bg-blue-50 px-1.5 text-xs text-blue-700"
                      >
                        {staff.recordCount}
                      </Badge>
                    )}
                  </div>

                  {staff.recordCount > 0 ? (
                    <div className="mt-1 flex items-center gap-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                ${staff.totalPay.toFixed(2)}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Base Pay</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1">
                              <Coins className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                ${staff.totalTips.toFixed(2)}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tips</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-gray-400">
                      No services today
                    </div>
                  )}
                </div>

                {/* Total Income */}
                <div className="flex-shrink-0 text-right">
                  <div
                    className={`text-sm font-bold ${
                      staff.totalIncome > 0 ? "text-green-700" : "text-gray-400"
                    }`}
                  >
                    ${staff.totalIncome.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">total</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grand Total */}
        <Separator />
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-2 sm:p-3">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
            <span className="text-xs font-semibold text-green-800 sm:text-sm">
              Total Staff Earnings
            </span>
          </div>
          <span className="text-base font-bold text-green-700 sm:text-lg">
            ${totals.totalIncome.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
