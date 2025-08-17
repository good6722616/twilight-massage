import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all services with their duration counts
    const { data: services, error } = await supabase
      .from("services")
      .select(
        `
        *,
        service_durations!inner(count)
      `
      )
      .eq("is_active", true)
      .order("name")

    if (error) {
      console.error("Error fetching services:", error)
      return NextResponse.json(
        { error: "Failed to fetch services" },
        { status: 500 }
      )
    }

    // Transform the data to include duration count
    const transformedServices = services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      is_active: service.is_active,
      created_at: service.created_at,
      updated_at: service.updated_at,
      durations_count: service.service_durations?.[0]?.count || 0,
    }))

    return NextResponse.json(transformedServices)
  } catch (error) {
    console.error("Error in services API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: "Service name is required" },
        { status: 400 }
      )
    }

    if (!body.durations || body.durations.length === 0) {
      return NextResponse.json(
        { error: "At least one duration is required" },
        { status: 400 }
      )
    }

    // Create service
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .insert({
        name: body.name.trim(),
        description: body.description || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (serviceError) {
      console.error("Error creating service:", serviceError)
      return NextResponse.json(
        { error: "Failed to create service" },
        { status: 500 }
      )
    }

    // Create durations
    const durationData = body.durations.map((duration: any) => ({
      service_id: service.id,
      duration: duration.duration,
      customer_price: duration.customer_price,
      staff_income: duration.staff_income,
      is_active: duration.is_active !== undefined ? duration.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { error: durationError } = await supabase
      .from("service_durations")
      .insert(durationData)

    if (durationError) {
      console.error("Error creating durations:", durationError)
      // Rollback service creation if duration creation fails
      await supabase.from("services").delete().eq("id", service.id)
      return NextResponse.json(
        { error: "Failed to create service durations" },
        { status: 500 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error in service creation API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
