"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  Save,
  Package,
  DollarSign,
  Clock,
  User,
  Plus,
  Trash2,
} from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { LoadingSpinner } from "@/components/admin/dashboard/LoadingSpinner"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog"

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

interface EditableService {
  name: string
  description: string
  is_active: boolean
  durations: ServiceDuration[]
}

export default function EditServicePage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [editableService, setEditableService] =
    useState<EditableService | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedSuccessfully, setSavedSuccessfully] = useState(false)
  const { userRole } = usePermissions()

  // 检测是否有未保存的更改
  const hasUnsavedChanges = useMemo(() => {
    // 如果刚刚保存成功，不显示未保存更改警告
    if (savedSuccessfully) return false

    if (!service || !editableService) return false

    // 检查基本信息是否改变
    if (
      service.name !== editableService.name ||
      service.description !== editableService.description ||
      service.is_active !== editableService.is_active
    ) {
      return true
    }

    // 检查时长是否改变
    if (service.durations.length !== editableService.durations.length) {
      return true
    }

    // 检查每个时长的详细信息
    for (let i = 0; i < service.durations.length; i++) {
      const original = service.durations[i]
      const edited = editableService.durations[i]

      if (
        original.duration !== edited.duration ||
        original.customer_price !== edited.customer_price ||
        original.staff_income !== edited.staff_income ||
        original.is_active !== edited.is_active
      ) {
        return true
      }
    }

    return false
  }, [service, editableService, savedSuccessfully])

  // 使用未保存更改 Hook - 只用于 Back 按钮
  const {
    showDialog,
    setShowDialog,
    handleConfirmNavigation,
    handleCancelNavigation,
  } = useUnsavedChanges({
    hasUnsavedChanges: false, // 暂时禁用路由拦截
  })

  const serviceId = params.id as string

  // 添加调试信息
  console.log("EditServicePage rendered", { serviceId, userRole, loading })

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
      setEditableService({
        name: data.name,
        description: data.description || "",
        is_active: data.is_active,
        durations: [...data.durations],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editableService) return

    try {
      setSaving(true)
      setError(null)
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableService),
      })

      if (!response.ok) {
        throw new Error("Failed to update service")
      }

      // 标记保存成功，然后导航
      setSavedSuccessfully(true)

      // Redirect back to service details
      router.push(`/admin/services/${serviceId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const addDuration = () => {
    if (!editableService) return

    const newDuration: ServiceDuration = {
      id: `temp-${Date.now()}`,
      duration: 60,
      customer_price: 80,
      staff_income: 30,
      is_active: true,
    }

    setEditableService({
      ...editableService,
      durations: [...editableService.durations, newDuration],
    })
  }

  const updateDuration = (
    index: number,
    field: keyof ServiceDuration,
    value: any
  ) => {
    if (!editableService) return

    const updatedDurations = [...editableService.durations]
    updatedDurations[index] = {
      ...updatedDurations[index],
      [field]: value,
    }

    setEditableService({
      ...editableService,
      durations: updatedDurations,
    })
  }

  const removeDuration = (index: number) => {
    if (!editableService) return

    const updatedDurations = editableService.durations.filter(
      (_, i) => i !== index
    )
    setEditableService({
      ...editableService,
      durations: updatedDurations,
    })
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

  if (!service || !editableService) {
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
            onClick={() => {
              if (hasUnsavedChanges) {
                // 手动触发未保存更改对话框
                setShowDialog(true)
              } else {
                router.push(`/admin/services/${serviceId}`)
              }
            }}
            className="flex h-8 items-center gap-2 px-3 sm:h-9 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              Edit {service.name}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Update service information and pricing
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/services/${serviceId}`)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editableService.name}
                onChange={(e) =>
                  setEditableService({
                    ...editableService,
                    name: e.target.value,
                  })
                }
                placeholder="Service name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editableService.description}
                onChange={(e) =>
                  setEditableService({
                    ...editableService,
                    description: e.target.value,
                  })
                }
                placeholder="Service description"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Active</Label>
              <Switch
                id="status"
                checked={editableService.is_active}
                onCheckedChange={(checked) =>
                  setEditableService({ ...editableService, is_active: checked })
                }
              />
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
              <p className="text-2xl font-bold">
                {editableService.durations.length}
              </p>
            </div>
            {editableService.durations.length > 0 && (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Price Range
                  </label>
                  <p className="text-lg font-semibold">
                    $
                    {Math.min(
                      ...editableService.durations.map((d) => d.customer_price)
                    )}{" "}
                    - $
                    {Math.max(
                      ...editableService.durations.map((d) => d.customer_price)
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Staff Income Range
                  </label>
                  <p className="text-lg font-semibold">
                    $
                    {Math.min(
                      ...editableService.durations.map((d) => d.staff_income)
                    )}{" "}
                    - $
                    {Math.max(
                      ...editableService.durations.map((d) => d.staff_income)
                    )}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Durations and Pricing Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Durations & Pricing
            </CardTitle>
            <Button onClick={addDuration} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Duration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">
                    Duration (min)
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    Customer Price ($)
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    Staff Income ($)
                  </TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[80px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editableService.durations.map((duration, index) => (
                  <TableRow key={duration.id}>
                    <TableCell>
                      <Input
                        type="number"
                        value={duration.duration}
                        onChange={(e) =>
                          updateDuration(
                            index,
                            "duration",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20"
                        min="1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={duration.customer_price}
                        onChange={(e) =>
                          updateDuration(
                            index,
                            "customer_price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-24"
                        min="0"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={duration.staff_income}
                        onChange={(e) =>
                          updateDuration(
                            index,
                            "staff_income",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-24"
                        min="0"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={duration.is_active}
                        onCheckedChange={(checked) =>
                          updateDuration(index, "is_active", checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDuration(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {editableService.durations.length === 0 && (
            <div className="flex h-32 flex-col items-center justify-center">
              <p className="mb-4 text-muted-foreground">
                No durations configured
              </p>
              <Button onClick={addDuration}>
                <Plus className="mr-2 h-4 w-4" />
                Add Duration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 未保存更改对话框 */}
      <UnsavedChangesDialog
        open={showDialog}
        onOpenChange={() => {}} // 只通过我们的逻辑控制
        onConfirm={() => {
          setShowDialog(false)
          router.push(`/admin/services/${serviceId}`)
        }}
        onCancel={() => setShowDialog(false)}
        title="Unsaved Changes"
        description="You have unsaved changes to this service. Are you sure you want to leave? Your changes will be lost."
      />
    </div>
  )
}
