"use client"

import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Calendar as DatePicker } from "@/components/ui/calendar"

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  return (
    <div className="flex flex-1 justify-end">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex h-9 w-auto min-w-0 items-center gap-2 px-3 text-sm font-medium"
          >
            <Calendar className="mr-1 h-4 w-4" />
            {format(selectedDate, "yyyy-MM-dd")}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <DatePicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
