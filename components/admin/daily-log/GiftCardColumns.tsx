import { ColumnDef } from "@tanstack/react-table"
import { GiftCardRecord } from "@/services/giftCardService"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ArrowUpDown } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format } from "date-fns"

interface GiftCardColumnsProps {
  onEdit: (record: GiftCardRecord) => void
  onDelete: (recordId: string) => void
  deletingIds: Set<string>
}

export function getGiftCardColumns({
  onEdit,
  onDelete,
  deletingIds,
}: GiftCardColumnsProps): ColumnDef<GiftCardRecord>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("date") as string
        // Parse the date string as local date to avoid timezone issues
        const [year, month, day] = date.split("-").map(Number)
        const localDate = new Date(year, month - 1, day) // month is 0-indexed
        return <div>{format(localDate, "MMM dd")}</div>
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gift Card Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        return <div className="font-medium">${amount.toFixed(2)}</div>
      },
    },
    {
      accessorKey: "sold_price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price Paid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const soldPrice = parseFloat(row.getValue("sold_price"))
        return (
          <div className="font-medium text-green-600">
            ${soldPrice.toFixed(2)}
          </div>
        )
      },
    },
    {
      accessorKey: "payment_method",
      header: () => <span className="px-2 py-2 md:px-1">Payment Method</span>,
      cell: ({ row }) => {
        const paymentMethod = row.getValue("payment_method") as string
        const displayName =
          {
            cash: "Cash",
            credit_card: "Credit Card",
          }[paymentMethod] || paymentMethod

        return <div>{displayName}</div>
      },
    },
    {
      accessorKey: "notes",
      header: () => <span className="px-4 py-2 md:px-1">Notes</span>,
      cell: ({ row }) => {
        const notes = row.getValue("notes") as string
        const displayText = notes || "-"
        const isLongText = displayText.length > 20

        return (
          <div className="relative">
            {/* Mobile: Show full text on tap */}
            <div className="block sm:hidden">
              {isLongText ? (
                <details className="group">
                  <summary className="cursor-pointer list-none">
                    <div className="truncate text-sm text-gray-600">
                      {displayText.slice(0, 20)}...
                    </div>
                  </summary>
                  <div className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-600">
                    {displayText}
                  </div>
                </details>
              ) : (
                <div className="text-sm text-gray-600">{displayText}</div>
              )}
            </div>

            {/* Desktop: Show tooltip on hover */}
            <div className="hidden sm:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="max-w-[150px] truncate text-sm text-gray-600 lg:max-w-[200px] xl:max-w-[250px]">
                      {displayText}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="whitespace-pre-wrap break-words">
                      {displayText}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      accessorKey: "actions",
      header: () => <span className="px-4 py-2 md:px-1">Actions</span>,
      cell: ({ row }) => {
        const record = row.original
        const isDeleting = deletingIds.has(record.id)
        return (
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
        )
      },
    },
  ]
}
