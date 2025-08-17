import { createSupabaseClient } from "./supabaseClient"
import { createClient } from "@supabase/supabase-js"

// 创建服务器端 Supabase 客户端（绕过 RLS）
const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

export type UserRole = "admin" | "staff"

export interface UserRoleData {
  id: string
  user_id: string
  role: UserRole
  created_at: string
  updated_at: string
}

// 定义资源类型
export type Resource =
  | "staff"
  | "dashboard"
  | "daily_logs"
  | "services"
  | "reports"
  | "settings"

// 定义操作类型
export type Action = "create" | "read" | "update" | "delete"

// 角色权限映射
const ROLE_PERMISSIONS = {
  admin: {
    staff: ["create", "read", "update", "delete"] as Action[],
    dashboard: ["read", "update"] as Action[],
    daily_logs: ["create", "read", "update", "delete"] as Action[],
    services: ["create", "read", "update", "delete"] as Action[],
    reports: ["read"] as Action[],
    settings: ["read", "update", "delete"] as Action[],
  },
  staff: {
    staff: ["read"] as Action[],
    dashboard: ["read"] as Action[],
    daily_logs: ["create", "read", "update"] as Action[],
    services: ["read"] as Action[],
    reports: ["read"] as Action[],
    settings: [] as Action[],
  },
} as const

export const permissionService = {
  // 获取用户角色
  async getUserRole(token: string, userId: string): Promise<UserRole> {
    try {
      // 检查是否在服务器端环境
      if (
        typeof window === "undefined" &&
        process.env.SUPABASE_SERVICE_ROLE_KEY
      ) {
        // 服务器端：使用 service role key
        const supabase = createServerSupabaseClient()

        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .single()

        if (error) {
          // 如果用户没有角色记录，默认为 staff
          return "staff"
        }

        return data.role
      } else {
        // 客户端：使用 Clerk token
        const supabase = createSupabaseClient(token)

        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .single()

        if (error) {
          // 如果用户没有角色记录，默认为 staff
          return "staff"
        }

        return data.role
      }
    } catch (err) {
      return "staff"
    }
  },

  // 检查用户权限
  async hasPermission(
    token: string,
    userId: string,
    resource: Resource,
    action: Action
  ): Promise<boolean> {
    const role = await this.getUserRole(token, userId)
    const permissions = ROLE_PERMISSIONS[role]
    const hasPermission = permissions[resource]?.includes(action) || false

    return hasPermission
  },

  // 更新用户角色（仅管理员可用）
  async updateUserRole(
    token: string,
    userId: string,
    role: UserRole
  ): Promise<void> {
    const supabase = createSupabaseClient(token)

    // 先检查用户是否已有角色记录
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .single()

    if (existingRole) {
      // 如果存在，更新角色
      const { error } = await supabase
        .from("user_roles")
        .update({ role, updated_at: new Date().toISOString() })
        .eq("user_id", userId)

      if (error) {
        throw new Error(`更新用户角色失败: ${error.message}`)
      }
    } else {
      // 如果不存在，插入新记录
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw new Error(`创建用户角色失败: ${error.message}`)
      }
    }
  },

  // 获取所有用户角色（仅管理员可用）
  async getAllUserRoles(token: string): Promise<UserRoleData[]> {
    const supabase = createSupabaseClient(token)
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at")

    if (error) {
      throw new Error(`获取用户角色失败: ${error.message}`)
    }

    return data || []
  },

  // 为现有用户添加默认角色
  async addDefaultRole(token: string, userId: string): Promise<void> {
    const supabase = createSupabaseClient(token)
    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "staff",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .single()

    if (error && error.code !== "23505") {
      // 23505 是唯一约束冲突错误
      throw new Error(`添加默认角色失败: ${error.message}`)
    }
  },
}
