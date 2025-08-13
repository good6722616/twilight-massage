import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import { permissionService } from "@/services/permissionService"

export async function DELETE(
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
      "delete"
    )

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // 获取 params
    const { userId: targetUserId } = await params

    // 不能删除自己
    if (userId === targetUserId) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 }
      )
    }

    // 删除用户
    const clerk = await clerkClient()
    await clerk.users.deleteUser(targetUserId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
