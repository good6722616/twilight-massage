import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { permissionService } from "@/services/permissionService"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId, getToken } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      "update"
    )

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { role } = await request.json()

    if (!role || !["admin", "staff"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // 获取 params
    const { userId: targetUserId } = await params

    // 更新用户角色
    await permissionService.updateUserRole(token, targetUserId, role)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
