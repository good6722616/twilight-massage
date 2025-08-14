"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import {
  Users,
  Shield,
  Mail,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  User as UserIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Toggle } from "@/components/ui/toggle"
import { toast } from "sonner"
import {
  userManagementService,
  type User,
} from "@/services/userManagementService"
import { usePermissions } from "@/hooks/usePermissions"
import { PermissionGate } from "@/components/auth/PermissionGate"
import { Spinner } from "@/components/ui/loading"

export default function AdminSettings() {
  const { getToken, userId: currentUserId } = useAuth()
  const { isLoading: permissionsLoading, userRole } = usePermissions()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"admin" | "staff">("staff")

  const queryClient = useQueryClient()

  const {
    data: users,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return userManagementService.getAllUsers()
    },
    enabled: userRole === "admin",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string
      role: "admin" | "staff"
    }) => {
      return userManagementService.updateUserRole(userId, role)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setIsRoleDialogOpen(false)
      setSelectedUser(null)
      toast.success("用户角色更新成功")
    },
    onError: (error) => {
      toast.error("更新用户角色失败: " + error.message)
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return userManagementService.deleteUser(userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      toast.success("用户删除成功")
    },
    onError: (error) => {
      toast.error("删除用户失败: " + error.message)
    },
  })

  const handleRoleChange = () => {
    if (selectedUser) {
      updateRoleMutation.mutate({ userId: selectedUser.id, role: selectedRole })
    }
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      // 检查是否是当前用户
      if (selectedUser.id === currentUserId) {
        toast.error("不能删除自己！")
        setIsDeleteDialogOpen(false)
        setSelectedUser(null)
        return
      }
      deleteUserMutation.mutate(selectedUser.id)
    }
  }

  const handleDeleteClick = (user: User) => {
    // 检查是否是当前用户
    if (user.id === currentUserId) {
      toast.error("不能删除自己！")
      return
    }
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleRoleDialogOpen = (user: User) => {
    setSelectedUser(user)
    setSelectedRole(user.role || "staff")
    setIsRoleDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getUserInitials = (user: User) => {
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U"
  }

  // 排序用户列表：当前用户排在第一位
  const sortedUsers = users
    ? [...users].sort((a, b) => {
        if (a.id === currentUserId) return -1
        if (b.id === currentUserId) return 1
        return 0
      })
    : []

  // 如果权限加载中或用户不是 admin，显示加载状态
  if (permissionsLoading || userRole !== "admin") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="large" />
      </div>
    )
  }

  // 如果数据加载中
  if (isPending || !users) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="large" />
      </div>
    )
  }

  // 如果加载出错
  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">加载失败</p>
          <p className="text-gray-600">无法加载用户数据</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
          <Users className="h-8 w-8" />
          用户管理
        </h1>
        <p className="mt-2 text-gray-600">管理系统中的所有注册用户和权限</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">管理员</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.role === "admin").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">员工</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.role === "staff").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>查看和管理所有注册用户</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedUsers.map((user) => {
              const isCurrentUser = user.id === currentUserId
              return (
                <div
                  key={user.id}
                  className={`flex flex-col rounded-lg border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                    isCurrentUser
                      ? "border-blue-200 bg-blue-50 shadow-sm"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-start space-x-3 sm:items-center sm:space-x-4">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.imageUrl}
                          alt={user.fullName || user.email}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      {isCurrentUser && (
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                          <UserIcon className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
                        <p
                          className={`truncate font-medium ${isCurrentUser ? "text-blue-900" : "text-gray-900"}`}
                        >
                          {user.fullName || user.email}
                          {isCurrentUser && (
                            <span className="ml-2 text-sm text-blue-600">
                              (当前用户)
                            </span>
                          )}
                        </p>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                          className={
                            user.role === "admin"
                              ? "w-fit bg-red-100 text-red-800"
                              : "w-fit bg-gray-100 text-gray-600"
                          }
                        >
                          {user.role === "admin" ? "管理员" : "员工"}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:space-x-4">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span>注册于 {formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end sm:ml-4 sm:mt-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRoleDialogOpen(user)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          更改角色
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(user)}
                          className={`${isCurrentUser ? "cursor-not-allowed text-gray-400" : "text-red-600"}`}
                          disabled={isCurrentUser}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isCurrentUser ? "删除用户 (不可用)" : "删除用户"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 角色更改对话框 */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更改用户角色</DialogTitle>
            <DialogDescription>
              为 {selectedUser?.fullName || selectedUser?.email} 选择新角色
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex gap-2">
              <Toggle
                pressed={selectedRole === "staff"}
                onPressedChange={() => setSelectedRole("staff")}
                className="flex-1"
                size="lg"
              >
                <Users className="mr-2 h-4 w-4" />
                员工
              </Toggle>
              <Toggle
                pressed={selectedRole === "admin"}
                onPressedChange={() => setSelectedRole("admin")}
                className="flex-1"
                size="lg"
              >
                <Shield className="mr-2 h-4 w-4" />
                管理员
              </Toggle>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleRoleChange}
                disabled={updateRoleMutation.isPending}
                className="flex-1"
              >
                {updateRoleMutation.isPending ? "更新中..." : "确认更改"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsRoleDialogOpen(false)}
                className="flex-1"
              >
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除用户</DialogTitle>
            <DialogDescription>
              确定要删除用户 {selectedUser?.fullName || selectedUser?.email}{" "}
              吗？ 此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="flex-1"
            >
              确认删除
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
