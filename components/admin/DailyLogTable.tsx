"use client"

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
}

export function DailyLogTable({ records, onDelete }: DailyLogTableProps) {
  return (
    <div className="mt-8 rounded-lg bg-white shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
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
              <TableCell>{record.type}</TableCell>
              <TableCell>{record.duration} min</TableCell>
              <TableCell>{record.discount}%</TableCell>
              <TableCell>
                {record.addOns.length > 0 ? (
                  <ul className="list-inside list-disc">
                    {record.addOns.map((addon: string) => (
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
}
