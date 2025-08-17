import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"
import { permissionService } from "@/services/permissionService"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 暂时跳过权限检查
    // TODO: 重新启用权限检查
    // const token = await getToken()
    // const hasUpdatePermission = await permissionService.hasPermission(
    //   token,
    //   userId,
    //   "staff",
    //   "update"
    // )
    // if (!hasUpdatePermission) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    const { id: staffId } = await params
    const body = await request.json()
    const { name, is_active } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const { data: updatedStaff, error } = await supabase
      .from("staff")
      .update({
        name,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", staffId)
      .select()
      .single()

    if (error) {
      console.error("Error updating staff:", error)
      return NextResponse.json(
        { error: "Failed to update staff" },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedStaff)
  } catch (error) {
    console.error("Error in staff API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 暂时跳过权限检查
    // TODO: 重新启用权限检查
    // const token = await getToken()
    // const hasDeletePermission = await permissionService.hasPermission(
    //   token,
    //   userId,
    //   "staff",
    //   "delete"
    // )
    // if (!hasDeletePermission) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    const { id: staffId } = await params

    const { error } = await supabase.from("staff").delete().eq("id", staffId)

    if (error) {
      console.error("Error deleting staff:", error)
      return NextResponse.json(
        { error: "Failed to delete staff" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Staff deleted successfully" })
  } catch (error) {
    console.error("Error in staff API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
