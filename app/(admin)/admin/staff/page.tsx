"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { Plus, Edit, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StaffSwitch } from "@/components/ui/staff-switch"
import { toast } from "sonner"
import { staffService, type Staff } from "../../../../services/staffService"

export default function StaffPage() {
  const { getToken } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean
    staff: Staff | null
  }>({ isOpen: false, staff: null })

  const queryClient = useQueryClient()

  const { data: staffList, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return staffService.getAllStaff(token)
    },
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
      setEditingStaff(null)
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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">员工管理</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staffList?.map((staff: Staff) => (
          <Card key={staff.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {staff.name}
              </CardTitle>
              <Badge
                variant={staff.is_active ? "default" : "secondary"}
                className={
                  staff.is_active
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                }
              >
                {staff.is_active ? "在职" : "离职"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  创建时间: {new Date(staff.created_at).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingStaff(staff)}
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
                        onSubmit={handleUpdateStaff}
                        onCancel={() => setEditingStaff(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStaff(staff)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteConfirmDialog.isOpen}
        onOpenChange={(open) =>
          setDeleteConfirmDialog({ isOpen: open, staff: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除员工</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              确定要删除员工{" "}
              <span className="font-medium text-foreground">
                &ldquo;{deleteConfirmDialog.staff?.name}&rdquo;
              </span>{" "}
              吗？
            </p>
            <p className="text-xs text-muted-foreground">
              此操作无法撤销，员工的所有信息将被永久删除。
            </p>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="flex-1"
              >
                确认删除
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setDeleteConfirmDialog({ isOpen: false, staff: null })
                }
                className="flex-1"
              >
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddStaffForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isInitialFocus, setIsInitialFocus] = useState(true)

  // 只在初始加载时阻止自动聚焦
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current && isInitialFocus) {
        inputRef.current.blur()
        setIsInitialFocus(false)
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [isInitialFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
      setName("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">员工姓名</Label>
        <Input
          ref={inputRef}
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入员工姓名"
          required
          autoFocus={false}
        />
      </div>
      <Button type="submit" className="w-full">
        添加员工
      </Button>
    </form>
  )
}

function EditStaffForm({
  staff,
  onSubmit,
  onCancel,
}: {
  staff: Staff
  onSubmit: (id: string, data: { name: string; is_active: boolean }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(staff.name)
  const [isActive, setIsActive] = useState(staff.is_active)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isInitialFocus, setIsInitialFocus] = useState(true)

  // 只在初始加载时阻止自动聚焦
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current && isInitialFocus) {
        inputRef.current.blur()
        setIsInitialFocus(false)
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [isInitialFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(staff.id, { name: name.trim(), is_active: isActive })
    }
  }

  // 当状态改变时提供即时反馈
  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked)
    // 可以在这里添加一些视觉反馈，比如toast提示
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 当前状态指示器 */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
        <span className="text-sm font-medium text-gray-700">当前状态</span>
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={
            isActive
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-100 text-gray-600"
          }
        >
          {isActive ? "在职" : "离职"}
        </Badge>
      </div>

      <div>
        <Label htmlFor="edit-name">员工姓名</Label>
        <Input
          ref={inputRef}
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入员工姓名"
          required
          autoFocus={false}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <Label htmlFor="is-active" className="text-sm font-medium">
            在职状态
          </Label>
          <p className="text-xs text-muted-foreground">
            {isActive
              ? "员工当前在职，可以正常安排工作"
              : "员工已离职，不会出现在选择列表中"}
          </p>
        </div>
        <StaffSwitch
          id="is-active"
          checked={isActive}
          onCheckedChange={handleStatusChange}
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          保存
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          取消
        </Button>
      </div>
    </form>
  )
}
