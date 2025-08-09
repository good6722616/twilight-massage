import { createSupabaseClient } from "./supabaseClient"
import { getCurrentBusinessDate, getTimezoneAwareDateRange } from "@/lib/utils"

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
  token: string,
  timezone: string = "America/Los_Angeles"
): Promise<GiftCardRecord[]> {
  const supabase = createSupabaseClient(token)

  const today = getCurrentBusinessDate()
  const { start, end } = getTimezoneAwareDateRange(today, timezone)

  const { data, error } = await supabase
    .from("gift_card_records")
    .select("*")
    .gte("created_at", start)
    .lte("created_at", end)
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
  to?: string,
  timezone: string = "America/Los_Angeles"
): Promise<GiftCardRecord[]> {
  const supabase = createSupabaseClient(token)

  if (from && to && from === to) {
    // Single day - use timezone-aware range
    const { start, end } = getTimezoneAwareDateRange(from, timezone)
    const { data, error } = await supabase
      .from("gift_card_records")
      .select("*")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw new Error("Failed to fetch gift card records for date range")
    }
    return data || []
  } else if (from && to) {
    // Date range - use timezone-aware ranges
    const fromRange = getTimezoneAwareDateRange(from, timezone)
    const toRange = getTimezoneAwareDateRange(to, timezone)

    const { data, error } = await supabase
      .from("gift_card_records")
      .select("*")
      .gte("created_at", fromRange.start)
      .lte("created_at", toRange.end)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw new Error("Failed to fetch gift card records for date range")
    }
    return data || []
  } else if (from) {
    // Single day fallback
    const { start, end } = getTimezoneAwareDateRange(from, timezone)
    const { data, error } = await supabase
      .from("gift_card_records")
      .select("*")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw new Error("Failed to fetch gift card records for date range")
    }
    return data || []
  }

  // Fallback to all records
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
