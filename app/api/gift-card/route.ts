import { NextRequest, NextResponse } from "next/server"
import {
  addGiftCardRecord,
  deleteGiftCardRecord,
  updateGiftCardRecord,
} from "@/services/giftCardService"
import { auth } from "@clerk/nextjs/server"

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
  const newRecord = await addGiftCardRecord(recordWithUser, token)
  return NextResponse.json(newRecord)
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
    await deleteGiftCardRecord(id, token)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting gift card record:", error)
    return NextResponse.json(
      { error: "Failed to delete gift card record" },
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
    const updatedRecord = await updateGiftCardRecord(id, recordWithUser, token)
    return NextResponse.json(updatedRecord)
  } catch (error) {
    console.error("Error updating gift card record:", error)
    return NextResponse.json(
      { error: "Failed to update gift card record" },
      { status: 500 }
    )
  }
}
