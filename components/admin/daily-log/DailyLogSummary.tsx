import type { MassageRecord } from "@/lib/types/massage"
import { calculateStoreIncome } from "@/lib/types/massage"
import { Badge } from "@/components/ui/badge"
import { H2 } from "@/components/ui/typography"
import { FileText, DollarSign } from "lucide-react"

interface DailyLogSummaryProps {
  records: MassageRecord[]
}

export function DailyLogSummary({ records }: DailyLogSummaryProps) {
  const totalStoreIncome = calculateStoreIncome(records)

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <H2 className="whitespace-nowrap">Today&apos;s Summary</H2>
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
          <DollarSign className="mr-2 h-4 w-4" />
          {totalStoreIncome.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          Store Income
        </Badge>
      </div>
    </div>
  )
}
