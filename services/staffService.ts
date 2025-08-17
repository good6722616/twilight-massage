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
  is_active?: boolean
}

export interface UpdateStaffData {
  id: string
  name: string
  is_active: boolean
}

export const staffService = {
  // 获取所有员工
  async getAllStaff(): Promise<Staff[]> {
    const response = await fetch("/api/staff")

    if (!response.ok) {
      throw new Error("Failed to fetch staff")
    }

    return response.json()
  },

  // 获取在职员工
  async getActiveStaff(): Promise<Staff[]> {
    const allStaff = await this.getAllStaff()
    return allStaff.filter((staff) => staff.is_active)
  },

  // 添加员工
  async addStaff(data: CreateStaffData): Promise<Staff> {
    const response = await fetch("/api/staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to add staff")
    }

    return response.json()
  },

  // 更新员工信息
  async updateStaff(data: UpdateStaffData): Promise<Staff> {
    const response = await fetch(`/api/staff/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        is_active: data.is_active,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update staff")
    }

    return response.json()
  },

  // 删除员工
  async deleteStaff(id: string): Promise<void> {
    const response = await fetch(`/api/staff/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to delete staff")
    }
  },

  // 根据ID获取员工
  async getStaffById(id: string): Promise<Staff | null> {
    const allStaff = await this.getAllStaff()
    return allStaff.find((staff) => staff.id === id) || null
  },
}
