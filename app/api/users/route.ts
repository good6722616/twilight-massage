import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import { permissionService } from "@/services/permissionService"
import { createSupabaseClient } from "@/services/supabaseClient"

export async function GET(request: NextRequest) {
  try {
    const { userId, getToken } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 获取 token 用于权限检查
    const token = await getToken({ template: "supabase" })

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 }
      )
    }

    // 检查用户是否有 admin 权限
    const hasPermission = await permissionService.hasPermission(
      token,
      userId,
      "settings",
      "read"
    )

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // 获取所有用户
    const clerk = await clerkClient()
    const usersResponse = await clerk.users.getUserList({
      limit: 100,
    })

    // 批量获取用户角色信息 - 优化性能
    const userIds = usersResponse.data.map((user: any) => user.id)
    const supabase = createSupabaseClient(token)

    // 一次性获取所有用户角色
    const { data: userRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role")
      .in("user_id", userIds)

    // 创建角色映射
    const roleMap = new Map<string, string>()
    if (userRoles) {
      userRoles.forEach((userRole: any) => {
        roleMap.set(userRole.user_id, userRole.role)
      })
    }

    // 构建用户列表
    const usersWithRoles = usersResponse.data.map((user: any) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      role: roleMap.get(user.id) || "staff",
    }))

    return NextResponse.json(usersWithRoles)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
