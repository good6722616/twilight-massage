"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { staffService, type Staff } from "../../../../services/staffService"
import { usePermissions } from "@/hooks/usePermissions"
import { PermissionGate } from "@/components/auth/PermissionGate"
import {
  StaffList,
  AddStaffForm,
  DeleteConfirmDialog,
} from "@/components/admin/staff"

export default function StaffPage() {
  const { getToken } = useAuth()
  const { isLoading: permissionsLoading } = usePermissions()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean
    staff: Staff | null
  }>({ isOpen: false, staff: null })

  const queryClient = useQueryClient()

  const {
    data: staffList,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return staffService.getAllStaff(token)
    },
    staleTime: 5 * 60 * 1000, // 5分钟内的数据认为是新鲜的
    gcTime: 10 * 60 * 1000, // 10分钟的垃圾回收时间
  })

  const addStaffMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return staffService.addStaff(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      setIsAddDialogOpen(false)
      toast.success("员工添加成功")
    },
    onError: (error) => {
      toast.error("添加员工失败: " + error.message)
    },
  })

  const updateStaffMutation = useMutation({
    mutationFn: async (data: {
      id: string
      name: string
      is_active: boolean
    }) => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return staffService.updateStaff(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      toast.success("员工信息更新成功")
    },
    onError: (error) => {
      toast.error("更新员工信息失败: " + error.message)
    },
  })

  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return staffService.deleteStaff(id, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      toast.success("员工删除成功")
    },
    onError: (error) => {
      toast.error("删除员工失败: " + error.message)
    },
  })

  const handleAddStaff = (name: string) => {
    addStaffMutation.mutate({ name })
  }

  const handleUpdateStaff = (
    id: string,
    data: { name: string; is_active: boolean }
  ) => {
    updateStaffMutation.mutate({ id, ...data })
  }

  const handleDeleteStaff = (staff: Staff) => {
    setDeleteConfirmDialog({ isOpen: true, staff })
  }

  const confirmDelete = () => {
    if (deleteConfirmDialog.staff) {
      deleteStaffMutation.mutate(deleteConfirmDialog.staff.id)
    }
    setDeleteConfirmDialog({ isOpen: false, staff: null })
  }

  const cancelDelete = () => {
    setDeleteConfirmDialog({ isOpen: false, staff: null })
  }

  // 计算是否应该显示加载状态
  const shouldShowLoading =
    isPending || permissionsLoading || (!staffList && !isError)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">员工管理</h1>
        {!permissionsLoading && (
          <PermissionGate resource="staff" action="create">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="transition-all hover:scale-105 hover:shadow-md">
                  <Plus className="mr-2 h-4 w-4" />
                  添加员工
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新员工</DialogTitle>
                </DialogHeader>
                <AddStaffForm onSubmit={handleAddStaff} />
              </DialogContent>
            </Dialog>
          </PermissionGate>
        )}
      </div>

      <StaffList
        staffList={staffList}
        isLoading={shouldShowLoading}
        onUpdate={handleUpdateStaff}
        onDelete={handleDeleteStaff}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmDialog.isOpen}
        staff={deleteConfirmDialog.staff}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}
