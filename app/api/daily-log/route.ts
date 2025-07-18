import { NextRequest, NextResponse } from "next/server"
import {
  getDailyLogs,
  addDailyLog,
  deleteDailyLog,
  updateDailyLog,
} from "@/services/dailyLogService"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: NextRequest) {
  const { userId, getToken } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const token = await getToken({ template: "supabase" })
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const logs = await getDailyLogs(token)
  return NextResponse.json(logs)
}

export async function POST(req: NextRequest) {
  const { userId, getToken } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const token = await getToken({ template: "supabase" })
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const recordWithUser = { ...body, user_id: userId }
  const newLog = await addDailyLog(recordWithUser, token)
  return NextResponse.json(newLog)
}

export async function DELETE(req: NextRequest) {
  const { userId, getToken } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = await getToken({ template: "supabase" })
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get the record ID from the URL
  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Record ID is required" },
      { status: 400 }
    )
  }

  try {
    // Pass both the user ID and token to the service function
    await deleteDailyLog(id, token)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting record:", error)
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  const { userId, getToken } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const token = await getToken({ template: "supabase" })
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get the record ID from the URL
  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Record ID is required" },
      { status: 400 }
    )
  }

  try {
    const body = await req.json()
    const recordWithUser = { ...body, user_id: userId }
    const updatedLog = await updateDailyLog(id, recordWithUser, token)
    return NextResponse.json(updatedLog)
  } catch (error) {
    console.error("Error updating record:", error)
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 }
    )
  }
}
