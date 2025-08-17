import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"
import { permissionService } from "@/services/permissionService"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 暂时跳过权限检查，直接获取数据
    // TODO: 重新启用权限检查
    // const token = await getToken()
    // const hasReadPermission = await permissionService.hasPermission(
    //   token,
    //   userId,
    //   "staff",
    //   "read"
    // )
    // if (!hasReadPermission) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    const { data: staff, error } = await supabase
      .from("staff")
      .select("*")
      .order("name")

    if (error) {
      console.error("Error fetching staff:", error)
      return NextResponse.json(
        { error: "Failed to fetch staff" },
        { status: 500 }
      )
    }

    return NextResponse.json(staff || [])
  } catch (error) {
    console.error("Error in staff API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 暂时跳过权限检查
    // TODO: 重新启用权限检查
    // const token = await getToken()
    // const hasCreatePermission = await permissionService.hasPermission(
    //   token,
    //   userId,
    //   "staff",
    //   "create"
    // )
    // if (!hasCreatePermission) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    const body = await request.json()
    const { name, is_active = true } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const { data: newStaff, error } = await supabase
      .from("staff")
      .insert({
        name,
        is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating staff:", error)
      return NextResponse.json(
        { error: "Failed to create staff" },
        { status: 500 }
      )
    }

    return NextResponse.json(newStaff, { status: 201 })
  } catch (error) {
    console.error("Error in staff API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
