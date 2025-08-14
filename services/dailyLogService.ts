import { createSupabaseClient } from "./supabaseClient"
import { MassageRecord } from "@/lib/types/massage"
import { getCurrentBusinessDate, getTimezoneAwareDateRange } from "@/lib/utils"

// Fetch today's daily logs for the daily log page
export async function getTodaysDailyLogs(
  token: string,
  timezone: string = "America/Los_Angeles"
): Promise<MassageRecord[]> {
  const supabase = createSupabaseClient(token)

  // Get today's business date and create timezone-aware range
  const today = getCurrentBusinessDate()
  const { start, end } = getTimezoneAwareDateRange(today, timezone)

  const { data, error } = await supabase
    .from("massage_records")
    .select("*")
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as MassageRecord[]
}

// Fetch all daily logs (now massage_records)
export async function getDailyLogs(token: string): Promise<MassageRecord[]> {
  const supabase = createSupabaseClient(token)
  const { data, error } = await supabase
    .from("massage_records")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as MassageRecord[]
}

// Add a new daily log (now massage_records)
export async function addDailyLog(
  record: Omit<MassageRecord, "id" | "created_at" | "user_id">,
  token: string
): Promise<MassageRecord> {
  const supabase = createSupabaseClient(token)

  // Let Supabase handle the created_at timestamp automatically in UTC
  // This is the correct practice - store in UTC, convert to local on client side
  const { data, error } = await supabase
    .from("massage_records")
    .insert([record] as any)
    .select()
  if (error) throw error
  return data?.[0] as MassageRecord
}

// Delete a daily log by id
export async function deleteDailyLog(id: string, token: string): Promise<void> {
  const supabase = createSupabaseClient(token)
  const { error } = await supabase.from("massage_records").delete().eq("id", id)
  if (error) throw error
}

// Fetch daily logs for a specific date or date range
export async function getDailyLogsByDate(
  token: string,
  from: string,
  to?: string,
  timezone: string = "America/Los_Angeles"
): Promise<MassageRecord[]> {
  const supabase = createSupabaseClient(token)

  if (from && to && from === to) {
    // Single day - use timezone-aware range
    const { start, end } = getTimezoneAwareDateRange(from, timezone)
    const { data, error } = await supabase
      .from("massage_records")
      .select("*")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as MassageRecord[]
  } else if (from && to) {
    // Date range - use timezone-aware ranges
    const fromRange = getTimezoneAwareDateRange(from, timezone)
    const toRange = getTimezoneAwareDateRange(to, timezone)

    const { data, error } = await supabase
      .from("massage_records")
      .select("*")
      .gte("created_at", fromRange.start)
      .lte("created_at", toRange.end)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as MassageRecord[]
  } else if (from) {
    // Single day fallback
    const { start, end } = getTimezoneAwareDateRange(from, timezone)
    const { data, error } = await supabase
      .from("massage_records")
      .select("*")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as MassageRecord[]
  }

  // Fallback to all records
  const { data, error } = await supabase
    .from("massage_records")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as MassageRecord[]
}

// Update a daily log by id
export async function updateDailyLog(
  id: string,
  record: Omit<MassageRecord, "id" | "created_at" | "updated_at" | "user_id">,
  token: string
): Promise<MassageRecord> {
  const supabase = createSupabaseClient(token)
  const { data, error } = await supabase
    .from("massage_records")
    .update(record)
    .eq("id", id)
    .select()
  if (error) throw error
  return data?.[0] as MassageRecord
}
