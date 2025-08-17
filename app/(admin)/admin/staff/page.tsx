"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { usePermissions } from "@/hooks/usePermissions"
import { staffService } from "@/services/staffService"
import { StaffTable } from "@/components/admin/staff/StaffTable"
import { AddStaffForm } from "@/components/admin/staff/AddStaffForm"
import { EditStaffForm } from "@/components/admin/staff/EditStaffForm"
import { DeleteConfirmDialog } from "@/components/admin/staff/DeleteConfirmDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function StaffPage() {
  const { userId, getToken } = useAuth()
  const { isLoading: permissionsLoading, hasPermission } = usePermissions()
  const queryClient = useQueryClient()

  const [canCreate, setCanCreate] = useState(false)
  const [canUpdate, setCanUpdate] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  const [permissionsChecked, setPermissionsChecked] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<{
    id: string
    name: string
    is_active: boolean
  } | null>(null)
  const [deletingStaff, setDeletingStaff] = useState<{
    id: string
    name: string
  } | null>(null)

  // 检查权限
  useEffect(() => {
    const checkPermissions = async () => {
      if (!permissionsLoading && userId) {
        const token = await getToken({ template: "supabase" })
        if (token) {
          const [createPerm, updatePerm, deletePerm] = await Promise.all([
            hasPermission("staff", "create"),
            hasPermission("staff", "update"),
            hasPermission("staff", "delete"),
          ])
          setCanCreate(createPerm)
          setCanUpdate(updatePerm)
          setCanDelete(deletePerm)
        }
        setPermissionsChecked(true)
      }
    }

    if (!permissionsLoading) {
      checkPermissions()
    }
  }, [hasPermission, permissionsLoading, userId, getToken])

  // 获取员工列表
  const {
    data: staffList,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      return staffService.getAllStaff()
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // 添加员工
  const addStaffMutation = useMutation({
    mutationFn: async (data: { name: string; is_active: boolean }) => {
      return staffService.addStaff(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      setIsAddDialogOpen(false)
    },
  })

  // 更新员工
  const updateStaffMutation = useMutation({
    mutationFn: async (data: {
      id: string
      name: string
      is_active: boolean
    }) => {
      return staffService.updateStaff(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      setEditingStaff(null)
    },
  })

  // 删除员工
  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      return staffService.deleteStaff(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      setDeletingStaff(null)
    },
  })

  const handleAddStaff = (data: { name: string; is_active: boolean }) => {
    addStaffMutation.mutate(data)
  }

  const handleUpdateStaff = (data: { name: string; is_active: boolean }) => {
    if (editingStaff) {
      updateStaffMutation.mutate({
        id: editingStaff.id,
        name: data.name,
        is_active: data.is_active,
      })
    }
  }

  const handleDeleteStaff = (id: string) => {
    deleteStaffMutation.mutate(id)
  }

  const shouldShowLoading =
    isPending ||
    (!staffList && !isError) ||
    (!permissionsChecked && !permissionsLoading)

  // 在权限检查完成之前不显示任何内容
  if (!permissionsChecked && permissionsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">员工管理</h1>
        {canCreate && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加员工
          </Button>
        )}
      </div>

      <StaffTable
        staffList={staffList}
        isLoading={shouldShowLoading}
        onUpdate={(staff) => setEditingStaff(staff)}
        onDelete={setDeletingStaff}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />

      {/* 添加员工对话框 */}
      <AddStaffForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddStaff}
        isLoading={addStaffMutation.isPending}
      />

      {/* 编辑员工对话框 */}
      <EditStaffForm
        open={!!editingStaff}
        onOpenChange={(open) => !open && setEditingStaff(null)}
        staff={editingStaff}
        onSubmit={handleUpdateStaff}
        isLoading={updateStaffMutation.isPending}
      />

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog
        open={!!deletingStaff}
        onOpenChange={(open) => !open && setDeletingStaff(null)}
        staff={deletingStaff}
        onConfirm={handleDeleteStaff}
        isLoading={deleteStaffMutation.isPending}
      />
    </div>
  )
}
