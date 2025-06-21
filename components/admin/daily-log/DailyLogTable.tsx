"use client"

import { memo } from "react"
import { MassageRecord } from "@/lib/types/massage"
import { Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DailyLogTableProps {
  records: MassageRecord[]
  onDelete: (recordId: string) => void
  isUpdating?: boolean
}

function formatTimeSlot(timeSlot: string) {
  try {
    const [from, to] = timeSlot.split("–")
    const format = (t: string) => {
      if (!t) return ""
      const [h, m] = t.split(":")
      const date = new Date()
      date.setHours(Number(h), Number(m))
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    }
    return `${format(from)}–${format(to)}`
  } catch (error) {
    console.error("Error formatting time slot:", timeSlot, error)
    return timeSlot // Fallback to original value
  }
}

export const DailyLogTable = memo(function DailyLogTable({
  records,
  onDelete,
  isUpdating = false,
}: DailyLogTableProps) {
  return (
    <div className="mt-8 rounded-lg bg-white shadow">
      {isUpdating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Time Slot</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Add-ons</TableHead>
            <TableHead>Tip</TableHead>
            <TableHead>Income</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.staff}</TableCell>
              <TableCell>{record.service_name}</TableCell>
              <TableCell>{record.duration} min</TableCell>
              <TableCell>{formatTimeSlot(record.time_slot)}</TableCell>
              <TableCell>{record.discount}%</TableCell>
              <TableCell>
                {record.add_ons.length > 0 ? (
                  <ul className="list-inside list-disc">
                    {record.add_ons.map((addon: string) => (
                      <li key={addon}>{addon}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell>${record.tip.toFixed(2)}</TableCell>
              <TableCell className="font-medium">
                ${record.income.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => onDelete(record.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
})
