import { MassageRecord } from "@/lib/types/massage"

interface DailyLogSummaryProps {
  records: MassageRecord[]
}

export function DailyLogSummary({ records }: DailyLogSummaryProps) {
  const totalIncome = records.reduce((sum, record) => sum + record.income, 0)

  return (
    <div className="flex items-center gap-8">
      <h2 className="text-xl font-semibold text-gray-900">
        Today&apos;s Records ({records.length})
      </h2>
      <div className="text-xl font-semibold text-gray-900">
        Total Income: ${totalIncome.toFixed(2)}
      </div>
    </div>
  )
}
