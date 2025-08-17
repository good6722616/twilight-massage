import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    console.log("Checking database connection...")
    console.log("Supabase URL:", supabaseUrl)
    console.log("Service Key length:", supabaseServiceKey?.length)

    // Check if user_roles table exists and get all records
    const { data: allRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at")

    if (rolesError) {
      console.error("Error fetching user_roles:", rolesError)
      return NextResponse.json(
        {
          error: "Failed to fetch user_roles",
          details: rolesError,
        },
        { status: 500 }
      )
    }

    console.log("All user roles:", allRoles)

    // If userId provided, check specific user
    let specificUser = null
    if (userId) {
      const { data: user, error: userError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (userError) {
        console.error("Error fetching specific user:", userError)
        specificUser = { error: userError }
      } else {
        specificUser = user
      }
    }

    return NextResponse.json({
      message: "Database check completed",
      totalRoles: allRoles?.length || 0,
      allRoles: allRoles,
      specificUser: userId ? specificUser : null,
      userId: userId,
    })
  } catch (error) {
    console.error("Error in database check:", error)
    return NextResponse.json(
      { error: "Database check failed", details: error },
      { status: 500 }
    )
  }
}
