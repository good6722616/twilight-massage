export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  imageUrl?: string
  createdAt: string
  lastSignInAt?: string
  role?: "admin" | "staff"
}

export const userManagementService = {
  async getAllUsers(): Promise<User[]> {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }

    return response.json()
  },

  async updateUserRole(userId: string, role: "admin" | "staff"): Promise<void> {
    const response = await fetch(`/api/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    })

    if (!response.ok) {
      throw new Error("Failed to update user role")
    }
  },

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete user")
    }
  },
}
