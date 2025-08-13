"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { StaffSwitch } from "@/components/ui/staff-switch"
import { type Staff } from "@/services/staffService"

interface EditStaffFormProps {
  staff: Staff
  onSubmit: (id: string, data: { name: string; is_active: boolean }) => void
  onCancel: () => void
}

export function EditStaffForm({
  staff,
  onSubmit,
  onCancel,
}: EditStaffFormProps) {
  const [name, setName] = useState(staff.name)
  const [isActive, setIsActive] = useState(staff.is_active)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isInitialFocus, setIsInitialFocus] = useState(true)

  // 只在初始加载时阻止自动聚焦
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current && isInitialFocus) {
        inputRef.current.blur()
        setIsInitialFocus(false)
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [isInitialFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(staff.id, { name: name.trim(), is_active: isActive })
    }
  }

  // 当状态改变时提供即时反馈
  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 当前状态指示器 */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
        <span className="text-sm font-medium text-gray-700">当前状态</span>
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={
            isActive
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-100 text-gray-600"
          }
        >
          {isActive ? "在职" : "离职"}
        </Badge>
      </div>

      <div>
        <Label htmlFor="edit-name">员工姓名</Label>
        <Input
          ref={inputRef}
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入员工姓名"
          required
          autoFocus={false}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <Label htmlFor="is-active" className="text-sm font-medium">
            在职状态
          </Label>
          <p className="text-xs text-muted-foreground">
            {isActive
              ? "员工当前在职，可以正常安排工作"
              : "员工已离职，不会出现在选择列表中"}
          </p>
        </div>
        <StaffSwitch
          id="is-active"
          checked={isActive}
          onCheckedChange={handleStatusChange}
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          保存
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          取消
        </Button>
      </div>
    </form>
  )
}
