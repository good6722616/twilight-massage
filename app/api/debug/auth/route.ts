import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { permissionService } from "@/services/permissionService"

export async function GET(request: NextRequest) {
  try {
    const { userId, getToken } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "No user ID" }, { status: 401 })
    }

    const token = await getToken()
    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 })
    }

    // Get user role
    const role = await permissionService.getUserRole(token, userId)

    // Check specific permissions
    const canReadServices = await permissionService.hasPermission(
      token,
      userId,
      "services",
      "read"
    )
    const canUpdateServices = await permissionService.hasPermission(
      token,
      userId,
      "services",
      "update"
    )
    const canCreateServices = await permissionService.hasPermission(
      token,
      userId,
      "services",
      "create"
    )
    const canDeleteServices = await permissionService.hasPermission(
      token,
      userId,
      "services",
      "delete"
    )

    return NextResponse.json({
      userId,
      role,
      permissions: {
        "services:read": canReadServices,
        "services:update": canUpdateServices,
        "services:create": canCreateServices,
        "services:delete": canDeleteServices,
      },
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 20) + "...",
    })
  } catch (error) {
    console.error("Debug auth error:", error)
    return NextResponse.json(
      {
        error: "Debug auth failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
