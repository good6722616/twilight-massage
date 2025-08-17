import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { permissionService } from "@/services/permissionService"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 使用服务器端的权限检查
    const role = await permissionService.getUserRole("", userId)

    return NextResponse.json({ role })
  } catch (error) {
    console.error("Get user role error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
