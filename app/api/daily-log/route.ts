import { NextRequest, NextResponse } from "next/server"
import {
  getDailyLogs,
  addDailyLog,
  deleteDailyLog,
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

// For DELETE, you might use a dynamic route or handle in the same file
