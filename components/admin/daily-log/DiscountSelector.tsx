"use client"

import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import { DISCOUNTS, DISCOUNT_TYPES } from "@/lib/types/massage"

interface DiscountSelectorProps {
  onValidationChange?: (isValid: boolean) => void
}

export function DiscountSelector({
  onValidationChange,
}: DiscountSelectorProps) {
  const { control, watch, setValue, clearErrors, setError } = useFormContext()
  const [discountMode, setDiscountMode] = useState<"preset" | "custom">(
    "preset"
  )
  const [discountType, setDiscountType] = useState<string>("percentage")

  const watchedDiscountType = watch("discount_type")
  const watchedDiscountValue = watch("discount_value")

  // 初始化模式 - 根据折扣值判断显示模式
  useEffect(() => {
    if (watchedDiscountValue && watchedDiscountType) {
      const isPresetValue = DISCOUNTS.map(String).includes(watchedDiscountValue)
      if (isPresetValue && watchedDiscountType === "percentage") {
        // 预设百分比折扣
        setDiscountMode("preset")
        setDiscountType("percentage")
      } else {
        // 自定义折扣 - 根据 discount_type 判断类型
        setDiscountMode("custom")
        setDiscountType(watchedDiscountType)
      }
    }
  }, [watchedDiscountValue, watchedDiscountType])

  // 监听折扣类型变化
  useEffect(() => {
    if (watchedDiscountType) {
      setDiscountType(watchedDiscountType)
    }
  }, [watchedDiscountType])

  // 验证折扣值
  useEffect(() => {
    if (watchedDiscountValue && onValidationChange) {
      const numValue = parseFloat(watchedDiscountValue)
      let isValid = false

      if (discountType === "percentage") {
        isValid = !isNaN(numValue) && numValue >= 0 && numValue <= 100
      } else {
        isValid = !isNaN(numValue) && numValue >= 0
      }

      onValidationChange(isValid)
    }
  }, [watchedDiscountValue, discountType, onValidationChange])

  const handlePresetDiscountSelect = (value: string) => {
    if (value === "custom") {
      setDiscountMode("custom")
      setValue("discount_type", "percentage")
      setValue("discount_value", "")
    } else {
      setDiscountMode("preset")
      setValue("discount_type", "percentage")
      setValue("discount_value", value)
    }
  }

  const handleDiscountTypeChange = (type: string) => {
    setDiscountType(type)
    setValue("discount_type", type)
    setValue("discount_value", "")
    clearErrors("discount_value")
  }

  const handleCustomValueChange = (value: string) => {
    setValue("discount_value", value)

    // 验证输入
    const numValue = parseFloat(value)
    if (value && !isNaN(numValue)) {
      if (discountType === "percentage" && (numValue < 0 || numValue > 100)) {
        setError("discount_value", {
          type: "manual",
          message: "Percentage must be between 0-100%",
        })
      } else if (discountType === "fixed_amount" && numValue < 0) {
        setError("discount_value", {
          type: "manual",
          message: "Amount must be positive",
        })
      } else {
        clearErrors("discount_value")
      }
    }
  }

  const switchToPresetMode = () => {
    setDiscountMode("preset")
    setValue("discount_type", "percentage")
    setValue("discount_value", "")
    clearErrors("discount_value")
  }

  return (
    <div className="space-y-3">
      {discountMode === "preset" ? (
        <div className="space-y-2">
          <Label htmlFor="discount-preset">Discount</Label>
          <Select
            onValueChange={handlePresetDiscountSelect}
            value={watchedDiscountValue}
          >
            <SelectTrigger
              id="discount-preset"
              className="h-9 w-full bg-white py-1 text-base sm:text-lg [&_[data-slot=select-value]]:text-sm [&_[data-slot=select-value]]:sm:text-base"
            >
              <SelectValue placeholder="Select discount" />
            </SelectTrigger>
            <SelectContent>
              {DISCOUNTS.map((discount) => (
                <SelectItem key={discount} value={discount.toString()}>
                  {discount}%
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="discount-type">Discount Type</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              onClick={switchToPresetMode}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <Select
            value={watchedDiscountType}
            onValueChange={handleDiscountTypeChange}
          >
            <SelectTrigger
              id="discount-type"
              className="h-9 w-full bg-white py-1 text-base sm:text-lg [&_[data-slot=select-value]]:text-sm [&_[data-slot=select-value]]:sm:text-base"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DISCOUNT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Input
              id="discount-value"
              type="number"
              min="0"
              step={discountType === "percentage" ? "0.1" : "0.01"}
              max={discountType === "percentage" ? "100" : undefined}
              placeholder={
                discountType === "percentage"
                  ? "Enter percentage (0-100)"
                  : "Enter amount ($)"
              }
              value={watchedDiscountValue || ""}
              onChange={(e) => handleCustomValueChange(e.target.value)}
              className="h-9 w-full bg-white py-1 pr-8 text-base placeholder:text-sm sm:text-lg sm:placeholder:text-base"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {discountType === "percentage" ? "%" : "$"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
