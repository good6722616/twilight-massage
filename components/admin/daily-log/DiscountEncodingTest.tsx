"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  encodeDiscount,
  decodeDiscount,
  calculateDiscountAmount,
} from "@/lib/types/massage"

export function DiscountEncodingTest() {
  const [percentageValue, setPercentageValue] = useState("15")
  const [fixedAmountValue, setFixedAmountValue] = useState("20")
  const [basePrice, setBasePrice] = useState("100")
  const [results, setResults] = useState<any>(null)

  const testEncoding = () => {
    const percentageDiscount = encodeDiscount({
      type: "percentage",
      value: parseFloat(percentageValue),
    })

    const fixedAmountDiscount = encodeDiscount({
      type: "fixed_amount",
      value: parseFloat(fixedAmountValue),
    })

    const basePriceNum = parseFloat(basePrice)

    const percentageAmount = calculateDiscountAmount(
      basePriceNum,
      percentageDiscount
    )
    const fixedAmount = calculateDiscountAmount(
      basePriceNum,
      fixedAmountDiscount
    )

    setResults({
      percentage: {
        original: { type: "percentage", value: parseFloat(percentageValue) },
        encoded: percentageDiscount,
        decoded: decodeDiscount(percentageDiscount),
        discountAmount: percentageAmount,
        finalPrice: basePriceNum - percentageAmount,
      },
      fixedAmount: {
        original: { type: "fixed_amount", value: parseFloat(fixedAmountValue) },
        encoded: fixedAmountDiscount,
        decoded: decodeDiscount(fixedAmountDiscount),
        discountAmount: fixedAmount,
        finalPrice: basePriceNum - fixedAmount,
      },
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>折扣编码/解码测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="basePrice">基础价格 ($)</Label>
              <Input
                id="basePrice"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="percentage">百分比折扣 (%)</Label>
              <Input
                id="percentage"
                type="number"
                value={percentageValue}
                onChange={(e) => setPercentageValue(e.target.value)}
                placeholder="15"
              />
            </div>
            <div>
              <Label htmlFor="fixedAmount">固定金额折扣 ($)</Label>
              <Input
                id="fixedAmount"
                type="number"
                value={fixedAmountValue}
                onChange={(e) => setFixedAmountValue(e.target.value)}
                placeholder="20"
              />
            </div>
          </div>

          <Button onClick={testEncoding} className="w-full">
            测试编码/解码
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>百分比折扣测试</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>原始值:</span>
                <span>{results.percentage.original.value}%</span>
              </div>
              <div className="flex justify-between">
                <span>编码后:</span>
                <span className="font-mono">{results.percentage.encoded}</span>
              </div>
              <div className="flex justify-between">
                <span>解码后:</span>
                <span>{results.percentage.decoded.value}%</span>
              </div>
              <div className="flex justify-between">
                <span>折扣金额:</span>
                <span className="text-red-600">
                  -${results.percentage.discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>最终价格:</span>
                <span className="text-green-600">
                  ${results.percentage.finalPrice.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>固定金额折扣测试</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>原始值:</span>
                <span>${results.fixedAmount.original.value}</span>
              </div>
              <div className="flex justify-between">
                <span>编码后:</span>
                <span className="font-mono">{results.fixedAmount.encoded}</span>
              </div>
              <div className="flex justify-between">
                <span>解码后:</span>
                <span>${results.fixedAmount.decoded.value}</span>
              </div>
              <div className="flex justify-between">
                <span>折扣金额:</span>
                <span className="text-red-600">
                  -${results.fixedAmount.discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>最终价格:</span>
                <span className="text-green-600">
                  ${results.fixedAmount.finalPrice.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>编码策略说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>百分比折扣：</strong>直接存储百分比值 (0-100)
            </p>
            <p>
              <strong>固定金额折扣：</strong>
              存储为负值，通过负数标识固定金额折扣
            </p>
            <p>
              <strong>示例：</strong>
            </p>
            <ul className="ml-4 space-y-1">
              <li>• 15 → 15% 百分比折扣</li>
              <li>• -20 → $20 固定金额折扣</li>
              <li>• 0 → 无折扣</li>
            </ul>
            <p className="mt-4 text-gray-600">
              这种编码方式确保了与现有 int4
              数据库字段的完全兼容性，同时支持两种折扣类型。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

