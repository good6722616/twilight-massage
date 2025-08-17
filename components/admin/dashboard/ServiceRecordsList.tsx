"use client"

import { useState, useMemo } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  MassageRecord,
  calculateStaffIncome,
  MassageType,
  Duration,
  Addon,
} from "@/lib/types/massage"
import { useServices } from "@/hooks/useServices"
import { Search, ChevronDown, ArrowUpDown, Funnel } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"

interface ServiceRecordsListProps {
  records: MassageRecord[]
  dateRange: { from: Date | undefined; to: Date | undefined }
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

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`
}

export function ServiceRecordsList({
  records,
  dateRange,
}: ServiceRecordsListProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  // 使用动态服务数据
  const { serviceDetails, loading: servicesLoading } = useServices()

  // 构建员工收入映射
  const serviceStaffIncomes = useMemo(() => {
    const incomes: Record<string, Record<number, number>> = {}
    Object.values(serviceDetails).forEach((service: any) => {
      if (service && service.is_active) {
        incomes[service.name] = {}
        service.durations.forEach((duration: any) => {
          if (duration.is_active) {
            incomes[service.name][duration.duration] = duration.staff_income
          }
        })
      }
    })
    return incomes
  }, [serviceDetails])

  // 构建服务价格映射
  const servicePrices = useMemo(() => {
    const prices: Record<string, Record<number, number>> = {}
    Object.values(serviceDetails).forEach((service: any) => {
      if (service && service.is_active) {
        prices[service.name] = {}
        service.durations.forEach((duration: any) => {
          if (duration.is_active) {
            prices[service.name][duration.duration] = duration.customer_price
          }
        })
      }
    })
    return prices
  }, [serviceDetails])

  const columns: ColumnDef<MassageRecord>[] = useMemo(
    () => [
      {
        accessorKey: "staff",
        header: ({ column }) => {
          return (
            <div className="w-24 px-4 py-2">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
              >
                Staff
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => <div className="w-24">{row.getValue("staff")}</div>,
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
          return value.length === 0 || value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "service_name",
        header: ({ column }) => {
          return (
            <div className="w-40 px-4 py-2 sm:w-36 lg:w-40">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
              >
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
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
        header: ({ column }) => {
          return (
            <div className="w-20 px-4 py-2">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
              >
                Duration
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => (
          <div className="w-20">{row.getValue("duration")} mins</div>
        ),
      },
      {
        accessorKey: "original_price",
        header: () => <div className="w-24 px-4 py-2">Original Price</div>,
        cell: ({ row }) => {
          const record = row.original as MassageRecord
          const price =
            servicePrices[record.service_name]?.[record.duration] ?? 0
          return (
            <div className="w-24">
              <span>${price.toFixed(2)}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "discounted_price",
        header: () => <div className="w-24 px-4 py-2">Discounted Price</div>,
        cell: ({ row }) => {
          const record = row.original as MassageRecord
          const price =
            servicePrices[record.service_name]?.[record.duration] ?? 0
          const discountAmount = (price * record.discount) / 100
          const discounted = price - discountAmount
          return (
            <div className="w-24">
              <span>${discounted.toFixed(2)}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "time_slot",
        header: ({ column }) => {
          return (
            <div className="w-24 px-4 py-2">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
              >
                Time Slot
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => (
          <div className="w-24">
            {formatTimeSlot(row.getValue("time_slot"))}
          </div>
        ),
      },
      {
        accessorKey: "discount",
        header: ({ column }) => {
          return (
            <div className="w-20 px-4 py-2">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
              >
                Discount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => (
          <div className="w-20">{row.getValue("discount")}%</div>
        ),
      },
      {
        accessorKey: "add_ons",
        header: () => <div className="w-20 px-4 py-2">Add-ons</div>,
        cell: ({ row }) => {
          const addOns = row.getValue("add_ons") as string[]
          return (
            <div className="w-20">
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
        header: ({ column }) => {
          return (
            <div className="w-20 px-4 py-2">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
              >
                Tip
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
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
        header: ({ column }) => {
          return (
            <div className="w-20 px-4 py-2">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
              >
                Pay
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => {
          const record = row.original
          const staffIncome = calculateStaffIncome(
            record.service_name as MassageType,
            record.duration as Duration,
            (record.add_ons as string[]).map((a) => a as Addon),
            serviceStaffIncomes
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
        header: () => {
          return <div className="w-20 px-4 py-2">Income</div>
        },
        cell: ({ row }) => {
          const record = row.original
          const staffIncome = calculateStaffIncome(
            record.service_name as MassageType,
            record.duration as Duration,
            (record.add_ons as string[]).map((a) => a as Addon),
            serviceStaffIncomes
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
    ],
    [serviceStaffIncomes, servicePrices]
  )

  const table = useReactTable({
    data: records,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // 如果服务数据还在加载中，显示loading状态
  if (servicesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Records</CardTitle>
          <CardDescription>Loading service data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (records.length === 0) {
    return null
  }

  // 标题文案
  let rangeTitle = ""
  if (dateRange.from && dateRange.to) {
    if (dateRange.from.getTime() === dateRange.to.getTime()) {
      rangeTitle = `Service Records for ${format(dateRange.from, "M/dd/yyyy")}`
    } else {
      rangeTitle = `Service Records from ${format(dateRange.from, "M/dd/yyyy")} - ${format(dateRange.to, "M/dd/yyyy")}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{rangeTitle}</CardTitle>
        <CardDescription>
          All services for the selected date
          {dateRange.from &&
          dateRange.to &&
          dateRange.from.getTime() !== dateRange.to.getTime()
            ? " range"
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full space-y-4 overflow-x-auto">
          {/* Filters and Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              {/* Search bar always visible */}
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Staff Name"
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="bg-white pl-8"
                />
              </div>

              {/* Desktop filters */}
              <div className="hidden items-center space-x-2 sm:flex">
                {/* Staff Filter */}
                <Select
                  value={
                    (table.getColumn("staff")?.getFilterValue() as string) ?? ""
                  }
                  onValueChange={(value) => {
                    table
                      .getColumn("staff")
                      ?.setFilterValue(value === "all" ? "" : value)
                  }}
                >
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Filter by staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    {Array.from(new Set(records.map((record) => record.staff)))
                      .sort()
                      .map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {/* Rows per page */}
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value))
                  }}
                >
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select page size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize} rows
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Columns selection */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile: Popover for filters */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="sm:hidden">
                    <Funnel className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 space-y-4 p-4">
                  {/* Staff Filter */}
                  <Select
                    value={
                      (table.getColumn("staff")?.getFilterValue() as string) ??
                      ""
                    }
                    onValueChange={(value) => {
                      table
                        .getColumn("staff")
                        ?.setFilterValue(value === "all" ? "" : value)
                    }}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Filter by staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Staff</SelectItem>
                      {Array.from(
                        new Set(records.map((record) => record.staff))
                      )
                        .sort()
                        .map((staff) => (
                          <SelectItem key={staff} value={staff}>
                            {staff}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {/* Rows per page */}
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value))
                    }}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select page size" />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize} rows
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Columns selection */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          )
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border bg-white">
            <Table className="min-w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-lg font-medium text-muted-foreground">
                          No records found
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {globalFilter || columnFilters.length > 0
                            ? "Try adjusting your search or filter criteria."
                            : "No massage records have been added yet."}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination and Selection Info */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
