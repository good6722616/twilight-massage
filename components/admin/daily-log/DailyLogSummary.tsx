import type { MassageRecord } from "@/lib/types/massage"
import {
  calculateStoreIncome,
  calculateStaffIncome,
  type MassageType,
  type Duration,
  type Addon,
  STAFFS,
} from "@/lib/types/massage"
import { Badge } from "@/components/ui/badge"
import { H2 } from "@/components/ui/typography"
import { FileText, DollarSign } from "lucide-react"

import { format } from "date-fns"

import { useMemo } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface DailyLogSummaryProps {
  records: MassageRecord[]
}

type StaffSummary = {
  name: string
  totalIncome: number
  recordCount: number
  totalPay: number
  totalTips: number
}

export function DailyLogSummary({ records }: DailyLogSummaryProps) {
  const totalStoreIncome = calculateStoreIncome(records)

  // Calculate staff income breakdown
  const staffIncomeBreakdown = useMemo(
    () =>
      records.reduce(
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
        {} as Record<string, StaffSummary>
      ),
    [records]
  )

  // Ensure all staff are present, even if they have zero records
  const staffList = useMemo(
    () =>
      STAFFS.map((name) => {
        const found = staffIncomeBreakdown[name]
        return found
          ? found
          : {
              name,
              totalIncome: 0,
              recordCount: 0,
              totalPay: 0,
              totalTips: 0,
            }
      }),
    [staffIncomeBreakdown]
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
          {/* <Badge
            variant="outline"
            className="w-full border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 text-lg font-medium text-emerald-700 shadow-sm transition-all duration-200 hover:from-emerald-100 hover:to-green-100 sm:w-auto"
          >
            <DollarSign className="mr-2 h-4 w-4" />$
            {totalStoreIncome.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            Store Income
          </Badge> */}
        </div>
      </div>

      {/* Staff Summary Accordion Grid */}
      <StaffSummaryAccordion staffList={staffList} />
    </div>
  )
}

export function StaffSummaryAccordion({
  staffList,
}: {
  staffList: StaffSummary[]
}) {
  if (!staffList.length) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center shadow-sm">
        <div className="text-lg italic text-gray-500">
          No staff records today.
        </div>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {staffList.map((staff) => (
        <Accordion type="single" collapsible key={staff.name}>
          <AccordionItem
            value={staff.name}
            className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <AccordionTrigger className="px-4 py-3 text-lg font-semibold capitalize">
              {staff.name}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-base">
                  <span className="text-gray-600">Services</span>
                  <span className="font-bold text-blue-600">
                    {staff.recordCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Base Pay</span>
                  <span className="font-semibold">
                    ${staff.totalPay.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Tips</span>
                  <span className="font-semibold">
                    ${staff.totalTips.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t pt-2 text-base">
                  <span className="font-medium text-gray-700">
                    Total Income
                  </span>
                  <span className="font-bold text-green-700">
                    ${staff.totalIncome.toFixed(2)}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  )
}
