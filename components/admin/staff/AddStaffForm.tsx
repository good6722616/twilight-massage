"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddStaffFormProps {
  onSubmit: (name: string) => void
}

export function AddStaffForm({ onSubmit }: AddStaffFormProps) {
  const [name, setName] = useState("")
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
      onSubmit(name.trim())
      setName("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">员工姓名</Label>
        <Input
          ref={inputRef}
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入员工姓名"
          required
          autoFocus={false}
        />
      </div>
      <Button type="submit" className="w-full">
        添加员工
      </Button>
    </form>
  )
}
