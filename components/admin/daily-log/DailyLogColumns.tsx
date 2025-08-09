import {
  ArrowUpDown,
  Edit,
  Trash2,
  CircleDollarSign,
  CreditCard,
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  MassageRecord,
  calculateStaffIncome,
  MassageType,
  Duration,
  Addon,
} from "@/lib/types/massage"
import { ColumnDef } from "@tanstack/react-table"

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

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`
}

function getPaymentIcon(method: string) {
  switch (method) {
    case "cash":
      return <CircleDollarSign className="h-4 w-4" />
    case "credit_card":
      return <CreditCard className="h-4 w-4" />
    case "giftcard":
      return <Gift className="h-4 w-4" />
    default:
      return null
  }
}

function getPaymentName(method: string) {
  switch (method) {
    case "cash":
      return "Cash"
    case "credit_card":
      return "Credit Card"
    case "giftcard":
      return "Gift Card"
    default:
      return method
  }
}

interface GetDailyLogColumnsParams {
  onEdit: (record: MassageRecord) => void
  onDelete: (recordId: string) => void
  deletingIds: Set<string>
}

export function getDailyLogColumns({
  onEdit,
  onDelete,
  deletingIds,
}: GetDailyLogColumnsParams): ColumnDef<MassageRecord>[] {
  return [
    {
      accessorKey: "staff",
      header: ({ column }) => (
        <div className="w-24 px-4 py-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Staff
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="w-24">{row.getValue("staff")}</div>,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "service_name",
      header: ({ column }) => (
        <div className="w-40 px-4 py-2 sm:w-36 lg:w-40">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const serviceName = row.getValue("service_name") as string

        return (
          <div className="w-40 min-w-0 pr-2 sm:w-36 lg:w-40">
            {/* 桌面版 - 使用 Tooltip */}
            <div className="hidden sm:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help truncate">{serviceName}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{serviceName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* 移动版 - 使用 Popover */}
            <div className="block sm:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="cursor-pointer truncate">{serviceName}</div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <p className="text-sm">{serviceName}</p>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <div className="w-20 px-4 py-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Duration
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-20">{row.getValue("duration")} mins</div>
      ),
    },
    {
      accessorKey: "time_slot",
      header: ({ column }) => (
        <div className="w-24 px-4 py-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Time Slot
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-24">{formatTimeSlot(row.getValue("time_slot"))}</div>
      ),
    },
    {
      accessorKey: "discount",
      header: ({ column }) => (
        <div className="w-20 px-4 py-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Discount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-20">{row.getValue("discount")}%</div>
      ),
    },
    {
      accessorKey: "add_ons",
      header: () => <div className="w-28 px-4 py-2">Add-ons</div>,
      cell: ({ row }) => {
        const addOns = row.getValue("add_ons") as string[]
        return (
          <div className="w-28">
            {addOns.length > 0 ? (
              <ul className="list-inside list-disc">
                {addOns.map((addon: string) => (
                  <li key={addon}>{addon}</li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">--</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "tip",
      header: ({ column }) => (
        <div className="w-20 px-4 py-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Tip
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const tip = parseFloat(row.getValue("tip"))
        return (
          <div className="w-20">
            <div className="font-medium text-blue-600">${tip.toFixed(2)}</div>
          </div>
        )
      },
    },

    {
      accessorKey: "Pay",
      header: ({ column }) => (
        <div className="w-20 px-4 py-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Pay
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const record = row.original
        const staffIncome = calculateStaffIncome(
          record.service_name as MassageType,
          record.duration as Duration,
          (record.add_ons as string[]).map((a) => a as Addon)
        )
        return (
          <div className="w-20">
            <div className="font-medium text-green-600">
              {formatCurrency(staffIncome)}
            </div>
          </div>
        )
      },
    },
    {
      id: "income",
      header: () => <div className="w-20 px-4 py-2">Income</div>,
      cell: ({ row }) => {
        const record = row.original
        const staffIncome = calculateStaffIncome(
          record.service_name as MassageType,
          record.duration as Duration,
          (record.add_ons as string[]).map((a) => a as Addon)
        )
        const tip =
          typeof record.tip === "number" ? record.tip : parseFloat(record.tip)
        const overallIncome = staffIncome + (isNaN(tip) ? 0 : tip)
        return (
          <div className="w-20">
            <div className="font-bold text-green-700">
              {formatCurrency(overallIncome)}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "payment_method",
      header: () => <div className="w-32 px-4 py-2">Payment Method</div>,
      cell: ({ row }) => {
        const paymentMethod = row.getValue("payment_method") as Record<
          string,
          number | null
        >

        // Handle both old string format and new JSONB format
        if (typeof paymentMethod === "string") {
          const icon = getPaymentIcon(paymentMethod)
          return (
            <div className="w-32">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex cursor-pointer items-center rounded-md p-1 transition-colors hover:bg-green-100">
                      {icon}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getPaymentName(paymentMethod)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        }

        // New JSONB format
        if (typeof paymentMethod === "object" && paymentMethod !== null) {
          const methods = Object.keys(paymentMethod)
          const amounts = Object.values(paymentMethod)

          // Check if it's a custom payment (multiple methods with amounts)
          const hasAmounts = amounts.some(
            (amount) => amount !== null && amount > 0
          )

          if (hasAmounts) {
            // Custom payment - show breakdown with icons
            const paymentBreakdown = methods
              .filter(
                (method) =>
                  paymentMethod[method] !== null && paymentMethod[method]! > 0
              )
              .map((method) => {
                const icon = getPaymentIcon(method)
                return (
                  <TooltipProvider key={method}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex cursor-pointer items-center gap-1 rounded-md p-1 transition-colors hover:bg-green-100">
                          {icon}
                          <span className="text-sm">
                            ${paymentMethod[method]}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {getPaymentName(method)}: ${paymentMethod[method]}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })

            return (
              <div className="w-32">
                <div className="flex flex-col gap-1">{paymentBreakdown}</div>
              </div>
            )
          } else {
            // Single payment method (old format converted)
            const method = methods[0]
            const icon = getPaymentIcon(method)
            return (
              <div className="w-32">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex cursor-pointer items-center rounded-md p-1 transition-colors hover:bg-green-100">
                        {icon}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getPaymentName(method)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )
          }
        }

        return <div className="w-32">-</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      accessorKey: "actions",
      header: () => <div className="w-24 px-4 py-2">Actions</div>,
      cell: ({ row }) => {
        const record = row.original
        const isDeleting = deletingIds.has(record.id)
        return (
          <div className="w-24">
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(record)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(record.id)}
                      disabled={isDeleting}
                      className="text-destructive hover:text-destructive"
                    >
                      {isDeleting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )
      },
    },
  ]
}
