import { useState } from "react"
import {
  format,
  startOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
} from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Calendar as DatePicker } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Calendar, ChevronDown, X } from "lucide-react"

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

const presets = [
  {
    label: "Today",
    getRange: () => {
      const today = startOfToday()
      return { from: today, to: today }
    },
  },
  {
    label: "This Week",
    getRange: () => {
      const today = startOfToday()
      return {
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      }
    },
  },
  {
    label: "This Month",
    getRange: () => {
      const today = startOfToday()
      return { from: startOfMonth(today), to: endOfMonth(today) }
    },
  },
  {
    label: "Last Month",
    getRange: () => {
      const today = startOfToday()
      const lastMonth = subMonths(today, 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    },
  },
  {
    label: "This Year",
    getRange: () => {
      const today = startOfToday()
      return { from: startOfYear(today), to: endOfYear(today) }
    },
  },
]

interface DateRangeSelectorProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false)

  // Helper for display
  const display =
    value.from && value.to
      ? value.from.getTime() === value.to.getTime()
        ? format(value.from, "yyyy-MM-dd")
        : `${format(value.from, "yyyy-MM-dd")} ~ ${format(value.to, "yyyy-MM-dd")}`
      : "Select date"

  const handleDateSelect = (range: any) => {
    if (range) {
      // 确保日期对象是全新的，避免引用问题
      const newRange = {
        from: range.from ? new Date(range.from.getTime()) : undefined,
        to: range.to ? new Date(range.to.getTime()) : undefined,
      }
      onChange(newRange)
    }
  }

  return (
    <div className="flex flex-1 justify-end gap-2">
      {/* Preset Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex h-9 min-w-0 items-center gap-1 px-3 text-sm font-medium"
          >
            Presets <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.label}
              onClick={() => onChange(preset.getRange())}
            >
              {preset.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            onClick={() => onChange({ from: undefined, to: undefined })}
            className="text-red-600"
          >
            Clear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Custom Range Picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex h-9 w-auto min-w-0 items-center gap-2 px-3 text-sm font-medium"
          >
            <Calendar className="mr-1 h-4 w-4" />
            {display}
            {value.from && (
              <X
                className="h-3 w-3 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange({ from: undefined, to: undefined })
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <DatePicker
            mode="range"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
