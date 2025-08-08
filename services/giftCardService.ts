import { createSupabaseClient } from "./supabaseClient"
import { getCurrentDateUTC } from "@/lib/utils"

export interface GiftCardRecord {
  id: string
  created_at: string
  date: string
  amount: number
  sold_price: number
  payment_method: "cash" | "credit_card"
  notes?: string
  user_id: string
}

export async function addGiftCardRecord(
  record: Omit<GiftCardRecord, "id" | "created_at">,
  token: string
): Promise<GiftCardRecord> {
  const supabase = createSupabaseClient(token)

  const { data, error } = await supabase
    .from("gift_card_records")
    .insert(record)
    .select()
    .single()

  if (error) {
    console.error("Supabase error:", error)
    throw new Error("Failed to add gift card record")
  }

  return data
}

export async function getGiftCardRecords(
  token: string
): Promise<GiftCardRecord[]> {
  const supabase = createSupabaseClient(token)

  const { data, error } = await supabase
    .from("gift_card_records")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase error:", error)
    throw new Error("Failed to fetch gift card records")
  }

  return data || []
}

export async function getTodaysGiftCardRecords(
  token: string
): Promise<GiftCardRecord[]> {
  const supabase = createSupabaseClient(token)

  const today = getCurrentDateUTC() // Use consistent UTC date

  const { data, error } = await supabase
    .from("gift_card_records")
    .select("*")
    .eq("date", today)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase error:", error)
    throw new Error("Failed to fetch today's gift card records")
  }

  return data || []
}

export async function getGiftCardRecordsByDate(
  token: string,
  from: string,
  to?: string
): Promise<GiftCardRecord[]> {
  const supabase = createSupabaseClient(token)
  let query = supabase
    .from("gift_card_records")
    .select("*")
    .order("created_at", { ascending: false })

  if (from && to && from === to) {
    query = query.eq("date", from)
  } else if (from && to) {
    query = query.gte("date", from).lte("date", to)
  } else if (from) {
    query = query.eq("date", from)
  }

  const { data, error } = await query
  if (error) {
    console.error("Supabase error:", error)
    throw new Error("Failed to fetch gift card records for date range")
  }

  return data || []
}

// Delete a gift card record by id
export async function deleteGiftCardRecord(
  id: string,
  token: string
): Promise<void> {
  const supabase = createSupabaseClient(token)
  const { error } = await supabase
    .from("gift_card_records")
    .delete()
    .eq("id", id)
  if (error) throw error
}

// Update a gift card record by id
export async function updateGiftCardRecord(
  id: string,
  record: Omit<GiftCardRecord, "id" | "created_at">,
  token: string
): Promise<GiftCardRecord> {
  const supabase = createSupabaseClient(token)
  const { data, error } = await supabase
    .from("gift_card_records")
    .update(record)
    .eq("id", id)
    .select()
  if (error) throw error
  return data?.[0] as GiftCardRecord
}
