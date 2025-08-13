"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PermissionGate } from "@/components/auth/PermissionGate"
import { type Staff } from "@/services/staffService"
import { EditStaffForm } from "./EditStaffForm"

interface StaffCardProps {
  staff: Staff
  onUpdate: (id: string, data: { name: string; is_active: boolean }) => void
  onDelete: (staff: Staff) => void
}

export function StaffCard({ staff, onUpdate, onDelete }: StaffCardProps) {
  return (
    <Card className="group h-[120px] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
          {staff.name}
        </CardTitle>
        <Badge
          variant={staff.is_active ? "default" : "secondary"}
          className={`transition-all duration-200 ${
            staff.is_active
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 group-hover:bg-emerald-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100 group-hover:bg-gray-200"
          }`}
        >
          {staff.is_active ? "在职" : "离职"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            创建时间: {new Date(staff.created_at).toLocaleDateString()}
          </div>
          <div className="flex space-x-2">
            <PermissionGate
              resource="staff"
              action="update"
              loading={
                <Button variant="outline" size="sm" disabled>
                  <Edit className="h-3 w-3" />
                </Button>
              }
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-200 hover:scale-105 hover:shadow-sm"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>编辑员工信息</DialogTitle>
                  </DialogHeader>
                  <EditStaffForm
                    staff={staff}
                    onSubmit={onUpdate}
                    onCancel={() => {}}
                  />
                </DialogContent>
              </Dialog>
            </PermissionGate>
            <PermissionGate
              resource="staff"
              action="delete"
              loading={
                <Button variant="outline" size="sm" disabled>
                  <Trash2 className="h-3 w-3" />
                </Button>
              }
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(staff)}
                className="transition-all duration-200 hover:scale-105 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </PermissionGate>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
