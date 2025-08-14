import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import { permissionService } from "@/services/permissionService"
import { createSupabaseClient } from "@/services/supabaseClient"

export async function GET(request: NextRequest) {
  try {
    console.log("API: Starting user fetch request")

    const { userId, getToken } = await auth()
    console.log("API: Auth result - userId:", userId)

    if (!userId) {
      console.log("API: No userId found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 获取 token 用于权限检查
    const token = await getToken({ template: "supabase" })
    console.log("API: Token result:", token ? "Token exists" : "No token")

    if (!token) {
      console.log("API: No authentication token")
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 }
      )
    }

    console.log("API: Checking permissions for user:", userId)

    // 检查用户是否有 admin 权限
    const hasPermission = await permissionService.hasPermission(
      token,
      userId,
      "settings",
      "read"
    )

    console.log("API: Permission check result:", hasPermission)

    if (!hasPermission) {
      console.log("API: Permission denied")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("API: Getting users from Clerk")

    // 获取所有用户
    const clerk = await clerkClient()
    const usersResponse = await clerk.users.getUserList({
      limit: 100,
    })

    console.log("API: Found users:", usersResponse.data.length)

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

    console.log("API: Returning users with roles")
    return NextResponse.json(usersWithRoles)
  } catch (error) {
    console.error("API: Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
