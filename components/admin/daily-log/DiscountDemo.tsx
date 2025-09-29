"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DiscountSelector } from "./DiscountSelector"
import { dailyLogFormSchema, DailyLogFormValues } from "@/lib/schema"
import { calculateDiscountAmount, encodeDiscount } from "@/lib/types/massage"

export function DiscountDemo() {
  const [result, setResult] = useState<{
    basePrice: number
    discountAmount: number
    finalPrice: number
    discountType: string
  } | null>(null)

  const form = useForm<DailyLogFormValues>({
    resolver: zodResolver(dailyLogFormSchema),
    defaultValues: {
      staff: "",
      type: "",
      duration: "",
      discount_type: "percentage",
      discount_value: "",
      addOns: [],
      tip: "",
      payment_method: "",
      custom: {
        cash: "",
        credit_card: "",
        giftcard: "",
      },
      timeSlot: { from: "", to: "" },
    },
  })

  const handleCalculate = () => {
    const values = form.getValues()
    const basePrice = 100 // 示例基础价格
    const discountValue = parseFloat(values.discount_value)

    if (isNaN(discountValue)) return

    // 构建折扣信息并编码
    const discountInfo = {
      type: values.discount_type as "percentage" | "fixed_amount",
      value: discountValue,
    }
    const encodedDiscount = encodeDiscount(discountInfo)
    const discountAmount = calculateDiscountAmount(basePrice, encodedDiscount)
    const finalPrice = basePrice - discountAmount

    setResult({
      basePrice,
      discountAmount,
      finalPrice,
      discountType: values.discount_type,
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>折扣功能演示</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormProvider {...form}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">基础价格: $100</label>
              </div>

              <DiscountSelector />

              <Button onClick={handleCalculate} className="w-full">
                计算折扣
              </Button>
            </div>
          </FormProvider>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>计算结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>基础价格:</span>
                <span>${result.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>折扣类型:</span>
                <span>
                  {result.discountType === "percentage" ? "百分比" : "固定金额"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>折扣金额:</span>
                <span className="text-red-600">
                  -${result.discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>最终价格:</span>
                <span className="text-green-600">
                  ${result.finalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
