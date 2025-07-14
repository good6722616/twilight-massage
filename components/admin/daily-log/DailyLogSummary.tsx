import type { MassageRecord } from "@/lib/types/massage"
import {
  calculateStoreIncome,
  calculateStaffIncome,
  type MassageType,
  type Duration,
  type Addon,
} from "@/lib/types/massage"
import { Badge } from "@/components/ui/badge"
import { H2, H4 } from "@/components/ui/typography"
import { FileText, DollarSign, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface DailyLogSummaryProps {
  records: MassageRecord[]
}

export function DailyLogSummary({ records }: DailyLogSummaryProps) {
  const totalStoreIncome = calculateStoreIncome(records)

  // Calculate staff income breakdown
  const staffIncomeBreakdown = records.reduce(
    (acc, record) => {
      const staffName = record.staff
      const staffIncome = calculateStaffIncome(
        record.service_name as MassageType,
        record.duration as Duration,
        record.add_ons as Addon[]
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
    {} as Record<
      string,
      {
        name: string
        totalIncome: number
        recordCount: number
        totalPay: number
        totalTips: number
      }
    >
  )

  const staffList = Object.values(staffIncomeBreakdown).sort(
    (a, b) => b.totalIncome - a.totalIncome
  )

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-4">
          <H2 className="whitespace-nowrap">Today&apos;s Summary</H2>
          <span className="text-xl text-gray-500">
            {format(new Date(), "MMMM dd, yyyy")}
          </span>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-1 sm:flex-row sm:gap-3">
          <Badge
            variant="outline"
            className="w-full border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-lg font-medium text-blue-700 shadow-sm transition-all duration-200 hover:from-blue-100 hover:to-indigo-100 sm:w-auto"
          >
            <FileText className="mr-2 h-4 w-4" />
            {records.length} {records.length === 1 ? "Record" : "Records"}
          </Badge>
          <Badge
            variant="outline"
            className="w-full border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 text-lg font-medium text-emerald-700 shadow-sm transition-all duration-200 hover:from-emerald-100 hover:to-green-100 sm:w-auto"
          >
            <DollarSign className="mr-2 h-4 w-4" />$
            {totalStoreIncome.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            Store Income
          </Badge>
        </div>
      </div>

      {/* Staff Income Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-600" />
          <H4 className="font-bold tracking-tight text-gray-900">
            Staff Income Breakdown
          </H4>
        </div>
        {staffList.length > 0 ? (
          <Tabs defaultValue={staffList[0].name} className="w-full">
            <TabsList className="mb-4 flex flex-wrap gap-2">
              {staffList.map((staff) => (
                <TabsTrigger
                  key={staff.name}
                  value={staff.name}
                  className="capitalize"
                >
                  {staff.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {staffList.map((staff) => (
              <TabsContent
                key={staff.name}
                value={staff.name}
                className="w-full"
              >
                <Card className="max-w-lg border-l-4 border-l-blue-500 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-900">
                      <span>{staff.name}</span>
                      <Badge
                        variant="secondary"
                        className="text-sm font-semibold"
                      >
                        {staff.recordCount}{" "}
                        {staff.recordCount === 1 ? "service" : "services"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base text-gray-600">
                        Total Income:
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        ${staff.totalIncome.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Base Pay:</span>
                      <span className="font-semibold">
                        ${staff.totalPay.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Tips:</span>
                      <span className="font-semibold">
                        ${staff.totalTips.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <TrendingUp className="h-3 w-3" />
                        <span>
                          Avg: $
                          {(staff.totalIncome / staff.recordCount).toFixed(2)}{" "}
                          per service
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="p-4 italic text-gray-500">
            No staff records for today.
          </div>
        )}
      </div>
    </div>
  )
}
