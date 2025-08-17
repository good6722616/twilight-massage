"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Eye, Package } from "lucide-react"
import Link from "next/link"
import { usePermissions } from "@/hooks/usePermissions"
import { LoadingSpinner } from "@/components/admin/dashboard/LoadingSpinner"

interface Service {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  durations_count: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { userRole } = usePermissions()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/services")

      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }

      const data = await response.json()
      setServices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // 如果角色还在加载中，显示加载状态
  if (!userRole) {
    return <LoadingSpinner />
  }

  // 如果角色不是 admin，显示拒绝信息
  if (userRole !== "admin") {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">
          Access denied. Admin only. Current role: {userRole}
        </p>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Services Management
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage your massage services, durations, and pricing
          </p>
        </div>
        <Link href="/admin/services/add">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Services ({services.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Service Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="min-w-[100px]">Durations</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[80px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="px-0 font-medium">
                      <div className="flex flex-col">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-xs text-muted-foreground md:hidden">
                          {service.description || "No description"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden px-0 text-muted-foreground md:table-cell">
                      {service.description || "No description"}
                    </TableCell>
                    <TableCell className="px-0">
                      <Badge variant="outline">
                        {service.durations_count} duration
                        {service.durations_count !== 1 ? "s" : ""}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-0">
                      <Badge
                        variant={service.is_active ? "default" : "secondary"}
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-0 text-right">
                      <Link href={`/admin/services/${service.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 sm:h-9 sm:px-3"
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {services.length === 0 && (
            <div className="flex h-32 flex-col items-center justify-center">
              <p className="mb-4 text-muted-foreground">No services found</p>
              <Link href="/admin/services/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Service
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
