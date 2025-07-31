import { createSupabaseClient } from "./supabaseClient"

export interface Staff {
  id: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateStaffData {
  name: string
}

export interface UpdateStaffData {
  id: string
  name: string
  is_active: boolean
}

export const staffService = {
  // 获取所有员工
  async getAllStaff(token: string): Promise<Staff[]> {
    const supabase = createSupabaseClient(token)
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("name")

    if (error) {
      throw new Error(`获取员工列表失败: ${error.message}`)
    }

    return data || []
  },

  // 获取在职员工
  async getActiveStaff(token: string): Promise<Staff[]> {
    const supabase = createSupabaseClient(token)
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("is_active", true)
      .order("name")

    if (error) {
      throw new Error(`获取在职员工失败: ${error.message}`)
    }

    return data || []
  },

  // 添加员工
  async addStaff(data: CreateStaffData, token: string): Promise<Staff> {
    const supabase = createSupabaseClient(token)
    const { data: newStaff, error } = await supabase
      .from("staff")
      .insert([data])
      .select()
      .single()

    if (error) {
      throw new Error(`添加员工失败: ${error.message}`)
    }

    return newStaff
  },

  // 更新员工信息
  async updateStaff(data: UpdateStaffData, token: string): Promise<Staff> {
    const supabase = createSupabaseClient(token)
    const { data: updatedStaff, error } = await supabase
      .from("staff")
      .update({
        name: data.name,
        is_active: data.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select()
      .single()

    if (error) {
      throw new Error(`更新员工信息失败: ${error.message}`)
    }

    return updatedStaff
  },

  // 删除员工
  async deleteStaff(id: string, token: string): Promise<void> {
    const supabase = createSupabaseClient(token)
    const { error } = await supabase.from("staff").delete().eq("id", id)

    if (error) {
      throw new Error(`删除员工失败: ${error.message}`)
    }
  },

  // 根据ID获取员工
  async getStaffById(id: string, token: string): Promise<Staff | null> {
    const supabase = createSupabaseClient(token)
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // 员工不存在
      }
      throw new Error(`获取员工信息失败: ${error.message}`)
    }

    return data
  },
}
