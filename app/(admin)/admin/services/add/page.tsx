"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

interface NewService {
  name: string
  description: string
  is_active: boolean
  durations: ServiceDuration[]
}

export default function AddServicePage() {
  const router = useRouter()
  const [newService, setNewService] = useState<NewService>({
    name: "",
    description: "",
    is_active: true,
    durations: [],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedSuccessfully, setSavedSuccessfully] = useState(false)
  const { userRole } = usePermissions()

  // 检测是否有未保存的更改
  const hasUnsavedChanges =
    !savedSuccessfully &&
    (newService.name.trim() !== "" ||
      newService.description.trim() !== "" ||
      newService.durations.length > 0)

  // 使用未保存更改 Hook - 只用于 Back 按钮
  const {
    showDialog,
    setShowDialog,
    handleConfirmNavigation,
    handleCancelNavigation,
  } = useUnsavedChanges({
    hasUnsavedChanges: false, // 暂时禁用路由拦截
  })

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

  const handleSave = async () => {
    if (!newService.name.trim()) {
      setError("Service name is required")
      return
    }

    if (newService.durations.length === 0) {
      setError("At least one duration is required")
      return
    }

    try {
      setSaving(true)
      setError(null)

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      })

      if (!response.ok) {
        throw new Error("Failed to create service")
      }

      const data = await response.json()

      // 标记保存成功，然后导航
      setSavedSuccessfully(true)

      // Redirect to the new service details page
      router.push(`/admin/services/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service")
    } finally {
      setSaving(false)
    }
  }

  const addDuration = () => {
    const newDuration: ServiceDuration = {
      id: `temp-${Date.now()}`,
      duration: 60,
      customer_price: 80,
      staff_income: 30,
      is_active: true,
    }

    setNewService({
      ...newService,
      durations: [...newService.durations, newDuration],
    })
  }

  const updateDuration = (
    index: number,
    field: keyof ServiceDuration,
    value: any
  ) => {
    const updatedDurations = [...newService.durations]
    updatedDurations[index] = {
      ...updatedDurations[index],
      [field]: value,
    }

    setNewService({
      ...newService,
      durations: updatedDurations,
    })
  }

  const removeDuration = (index: number) => {
    const updatedDurations = newService.durations.filter((_, i) => i !== index)
    setNewService({
      ...newService,
      durations: updatedDurations,
    })
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
                router.push("/admin/services")
              }
            }}
            className="flex h-8 items-center gap-2 px-3 sm:h-9 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              Add New Service
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Create a new massage service with pricing
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/services")}
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
            {saving ? "Creating..." : "Create Service"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 rounded-md p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

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
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                placeholder="Service name"
                className={
                  error && !newService.name.trim() ? "border-destructive" : ""
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
                placeholder="Service description"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Active</Label>
              <Switch
                id="status"
                checked={newService.is_active}
                onCheckedChange={(checked) =>
                  setNewService({ ...newService, is_active: checked })
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
                {newService.durations.length}
              </p>
            </div>
            {newService.durations.length > 0 && (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Price Range
                  </label>
                  <p className="text-lg font-semibold">
                    $
                    {Math.min(
                      ...newService.durations.map((d) => d.customer_price)
                    )}{" "}
                    - $
                    {Math.max(
                      ...newService.durations.map((d) => d.customer_price)
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
                      ...newService.durations.map((d) => d.staff_income)
                    )}{" "}
                    - $
                    {Math.max(
                      ...newService.durations.map((d) => d.staff_income)
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
              Durations & Pricing *
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
                {newService.durations.map((duration, index) => (
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

          {newService.durations.length === 0 && (
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
          router.push("/admin/services")
        }}
        onCancel={() => setShowDialog(false)}
        title="Unsaved Changes"
        description="You have unsaved changes to this new service. Are you sure you want to leave? Your changes will be lost."
      />
    </div>
  )
}
