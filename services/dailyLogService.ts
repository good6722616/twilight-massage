import { createSupabaseClient } from "./supabaseClient"
import { MassageRecord } from "@/lib/types/massage"

// Fetch today's daily logs for the daily log page
export async function getTodaysDailyLogs(
  token: string
): Promise<MassageRecord[]> {
  const supabase = createSupabaseClient(token)

  const today = new Date().toLocaleDateString("en-CA") // YYYY-MM-DD format in local timezone

  const { data, error } = await supabase
    .from("massage_records")
    .select("*")
    .eq("date", today)
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
  to?: string
): Promise<MassageRecord[]> {
  const supabase = createSupabaseClient(token)
  let query = supabase
    .from("massage_records")
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
  if (error) throw error
  return data as MassageRecord[]
}

// Update a daily log by id
export async function updateDailyLog(
  id: string,
  record: Omit<MassageRecord, "id" | "created_at" | "user_id">,
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
