import { createClient } from "@supabase/supabase-js"
import { MassageRecord } from "@/lib/types/massage"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Fetch today's daily logs for the daily log page
export async function getTodaysDailyLogs(
  token: string
): Promise<MassageRecord[]> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

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
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
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
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const { data, error } = await supabase
    .from("massage_records")
    .insert([record])
    .select()
  if (error) throw error
  return data?.[0] as MassageRecord
}

// Delete a daily log by id (not updated for token, but can be if needed)
export async function deleteDailyLog(id: string): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { error } = await supabase.from("massage_records").delete().eq("id", id)
  if (error) throw error
}
