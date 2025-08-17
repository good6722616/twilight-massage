"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import {
  ArrowLeft,
  Edit,
  Package,
  DollarSign,
  Clock,
  User,
  Plus,
  Trash2,
} from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { LoadingSpinner } from "@/components/admin/dashboard/LoadingSpinner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ServiceDuration {
  id: string
  duration: number
  customer_price: number
  staff_income: number
  is_active: boolean
}

interface Service {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  durations: ServiceDuration[]
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { userRole } = usePermissions()

  const serviceId = params.id as string

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails()
    }
  }, [serviceId])

  const fetchServiceDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/services/${serviceId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch service details")
      }

      const data = await response.json()
      setService(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete service")
      }

      // Redirect to services list
      router.push("/admin/services")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service")
      setShowDeleteDialog(false)
    } finally {
      setDeleting(false)
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

  if (!service) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Service not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/services")}
            className="flex h-8 items-center gap-2 px-3 sm:h-9 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {service.name}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Service Details
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="w-full sm:w-auto"
            onClick={() => router.push(`/admin/services/${serviceId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Service
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Service
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-lg font-semibold">{service.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm">
                {service.description || "No description provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge variant={service.is_active ? "default" : "secondary"}>
                  {service.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created
              </label>
              <p className="text-sm">
                {new Date(service.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Total Durations
              </label>
              <p className="text-2xl font-bold">{service.durations.length}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Price Range
              </label>
              <p className="text-lg font-semibold">
                ${Math.min(...service.durations.map((d) => d.customer_price))} -
                ${Math.max(...service.durations.map((d) => d.customer_price))}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Staff Income Range
              </label>
              <p className="text-lg font-semibold">
                ${Math.min(...service.durations.map((d) => d.staff_income))} - $
                {Math.max(...service.durations.map((d) => d.staff_income))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Durations and Pricing Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Durations & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Duration</TableHead>
                  <TableHead className="min-w-[120px]">
                    Customer Price
                  </TableHead>
                  <TableHead className="min-w-[120px]">Staff Income</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {service.durations.map((duration) => (
                  <TableRow key={duration.id}>
                    <TableCell className="px-0 font-medium">
                      {duration.duration} minutes
                    </TableCell>
                    <TableCell className="px-0">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        {duration.customer_price}
                      </div>
                    </TableCell>
                    <TableCell className="px-0">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {duration.staff_income}
                      </div>
                    </TableCell>
                    <TableCell className="px-0">
                      <Badge
                        variant={duration.is_active ? "default" : "secondary"}
                      >
                        {duration.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {service.durations.length === 0 && (
            <div className="flex h-32 flex-col items-center justify-center">
              <p className="mb-4 text-muted-foreground">
                No durations configured
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Duration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Service Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{service.name}"? This action
              cannot be undone and will also delete all associated durations and
              pricing information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete Service"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
