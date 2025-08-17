import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"
import { permissionService } from "@/services/permissionService"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface ServiceDuration {
  id: string
  duration: number
  customer_price: number
  staff_income: number
  is_active: boolean
}

interface ServiceWithDurations {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  service_durations: ServiceDuration[]
}

export async function GET(request: NextRequest) {
  try {
    const { userId, getToken } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 检查用户是否有权限查看服务列表
    const token = await getToken()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const hasPermission = await permissionService.hasPermission(
      token,
      userId,
      "services",
      "read"
    )

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // 获取所有活跃服务及其详细信息
    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select(
        `
        id,
        name,
        description,
        is_active,
        created_at,
        updated_at,
        service_durations (
          id,
          duration,
          customer_price,
          staff_income,
          is_active
        )
      `
      )
      .eq("is_active", true)
      .order("name")

    if (servicesError) {
      console.error("Error fetching services:", servicesError)
      return NextResponse.json(
        { error: "Failed to fetch services" },
        { status: 500 }
      )
    }

    // 转换数据格式以匹配前端期望的结构
    const formattedServices = (services as ServiceWithDurations[]).map(
      (service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        is_active: service.is_active,
        created_at: service.created_at,
        updated_at: service.updated_at,
        durations: service.service_durations
          .filter((duration: ServiceDuration) => duration.is_active)
          .map((duration: ServiceDuration) => ({
            id: duration.id,
            duration: duration.duration,
            customer_price: duration.customer_price,
            staff_income: duration.staff_income,
            is_active: duration.is_active,
          })),
      })
    )

    return NextResponse.json(formattedServices)
  } catch (error) {
    console.error("Error in services details API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
