import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, role = "admin" } = body

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // Check if user role already exists
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .single()

    if (existingRole) {
      return NextResponse.json({
        message: "User role already exists",
        userId,
        role,
      })
    }

    // Add user role
    const { data, error } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding user role:", error)
      return NextResponse.json(
        { error: "Failed to add user role", details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "User role added successfully",
      data,
    })
  } catch (error) {
    console.error("Error in add user role API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
