"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { type Resource, type Action } from "@/services/permissionService"
import { permissionService } from "@/services/permissionService"
import { Skeleton } from "@/components/ui/skeleton"

interface PermissionGateProps {
  resource: Resource
  action: Action
  children: React.ReactNode
  fallback?: React.ReactNode
  loading?: React.ReactNode
}

export function PermissionGate({
  resource,
  action,
  children,
  fallback = null,
  loading = <Skeleton className="h-8 w-8" />,
}: PermissionGateProps) {
  const { userId } = useAuth()
  const { getToken } = useAuth()

  // 使用 React Query 来管理权限检查
  const {
    data: hasAccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["permission", userId, resource, action],
    queryFn: async () => {
      if (!userId) return false
      const token = await getToken({ template: "supabase" })
      if (!token) return false
      return permissionService.hasPermission(token, userId, resource, action)
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5分钟内权限检查结果认为是新鲜的
    gcTime: 10 * 60 * 1000, // 10分钟的垃圾回收时间
  })

  // 如果正在加载，显示loading状态
  if (isLoading) {
    return <>{loading}</>
  }

  // 如果有权限，显示内容
  if (hasAccess) {
    return <>{children}</>
  }

  // 如果没有权限或出错，显示fallback
  return <>{fallback}</>
}
