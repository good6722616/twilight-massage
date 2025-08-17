import { useCallback, useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import {
  permissionService,
  type UserRole,
  type Resource,
  type Action,
} from "@/services/permissionService"

export function usePermissions() {
  const { userId } = useAuth()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  // 获取用户角色
  const {
    data: userRole,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["userRole", userId],
    queryFn: async () => {
      if (!userId) return null

      // 通过 API 调用获取用户角色
      const response = await fetch("/api/permissions/user-role")
      if (!response.ok) {
        throw new Error("Failed to get user role")
      }

      const { role } = await response.json()
      return role
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5分钟内的数据认为是新鲜的
    gcTime: 10 * 60 * 1000, // 10分钟的垃圾回收时间
  })

  // 权限检查函数 - 使用 React Query 缓存结果
  const hasPermission = useCallback(
    async (resource: Resource, action: Action) => {
      if (!userId) return false

      // 使用 React Query 缓存权限检查结果
      const cacheKey = ["permission", userId, resource, action]
      const cachedResult = queryClient.getQueryData(cacheKey)

      if (cachedResult !== undefined) {
        return cachedResult as boolean
      }

      try {
        // 通过 API 调用检查权限
        const response = await fetch(
          `/api/permissions?resource=${resource}&action=${action}`
        )

        if (!response.ok) {
          console.error("Permission check failed:", response.statusText)
          return false
        }

        const { hasPermission: result } = await response.json()

        // 缓存结果，5分钟内有效
        queryClient.setQueryData(cacheKey, result)
        return result
      } catch (error) {
        console.error("Permission check failed:", error)
        return false
      }
    },
    [userId, queryClient]
  )

  // 角色检查函数
  const hasRole = useCallback(
    (role: UserRole) => {
      return userRole === role
    },
    [userRole]
  )

  // 更新用户角色
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string
      role: UserRole
    }) => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return permissionService.updateUserRole(token, userId, role)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRole"] })
      // 清除权限缓存
      queryClient.removeQueries({ queryKey: ["permission"] })
    },
  })

  // 获取所有用户角色
  const { data: allUserRoles } = useQuery({
    queryKey: ["allUserRoles"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return permissionService.getAllUserRoles(token)
    },
    enabled: !!userId && userRole === "admin", // 只有管理员可以获取所有用户角色
    staleTime: 5 * 60 * 1000, // 5分钟内的数据认为是新鲜的
  })

  // 计算是否应该显示加载状态
  const isLoading = isPending || (!userRole && !isError)

  return {
    userRole,
    isLoading,
    hasPermission,
    hasRole,
    updateUserRole: updateUserRoleMutation.mutate,
    isUpdating: updateUserRoleMutation.isPending,
    allUserRoles,
  }
}
