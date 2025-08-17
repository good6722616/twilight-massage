import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { permissionService } from "@/services/permissionService"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const resource = searchParams.get("resource") as any
    const action = searchParams.get("action") as any

    if (!resource || !action) {
      return NextResponse.json(
        { error: "Resource and action are required" },
        { status: 400 }
      )
    }

    // 使用服务器端的权限检查
    const hasPermission = await permissionService.hasPermission(
      "", // token 在服务器端不需要
      userId,
      resource,
      action
    )

    return NextResponse.json({ hasPermission })
  } catch (error) {
    console.error("Permission check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
