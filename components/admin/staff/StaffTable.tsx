"use client"

import { type Staff } from "@/services/staffService"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface StaffTableProps {
  staffList?: Staff[]
  isLoading: boolean
  onUpdate?: (staff: { id: string; name: string; is_active: boolean }) => void
  onDelete?: (staff: { id: string; name: string }) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export function StaffTable({
  staffList = [],
  isLoading,
  onUpdate,
  onDelete,
  canUpdate = false,
  canDelete = false,
}: StaffTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>Manage your staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Management</CardTitle>
        <CardDescription>Manage your staff members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto bg-white">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3">Name</TableHead>
                <TableHead className="px-4 py-3">Status</TableHead>
                <TableHead className="px-4 py-3">Created</TableHead>
                <TableHead className="px-4 py-3">Updated</TableHead>
                {(canUpdate || canDelete) && (
                  <TableHead className="px-4 py-3">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.length > 0 ? (
                staffList.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="px-4 py-3 font-medium">
                      {staff.name}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        variant={staff.is_active ? "default" : "secondary"}
                      >
                        {staff.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {format(new Date(staff.created_at), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {format(new Date(staff.updated_at), "MMM dd, yyyy")}
                    </TableCell>
                    {(canUpdate || canDelete) && (
                      <TableCell className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canUpdate && (
                              <DropdownMenuItem
                                onClick={() => onUpdate?.(staff)}
                                className="cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                编辑
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onDelete?.({ id: staff.id, name: staff.name })
                                }
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={canUpdate || canDelete ? 5 : 4}
                    className="h-24 px-4 py-3 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="text-lg font-medium text-muted-foreground">
                        No staff found
                      </div>
                      <div className="text-sm text-muted-foreground">
                        No staff members have been added yet.
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
