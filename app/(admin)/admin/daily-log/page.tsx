"use client"

import { useState } from "react"
import { DailyLogForm } from "@/components/admin/DailyLogForm"
import { DailyLogTable } from "@/components/admin/DailyLogTable"
import { MassageRecord } from "@/lib/types/massage"

export default function DailyLogPage() {
  const [records, setRecords] = useState<MassageRecord[]>([])

  const handleAddRecord = (record: MassageRecord) => {
    setRecords((prev) => [...prev, record])
  }

  const handleDeleteRecord = (recordId: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== recordId))
  }

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Daily Log</h1>
      <DailyLogForm onSubmit={handleAddRecord} />
      <DailyLogTable records={records} onDelete={handleDeleteRecord} />
    </div>
  )
}
