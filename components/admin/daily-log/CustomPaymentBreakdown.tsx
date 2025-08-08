"use client"

import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import { AlertCircle, CheckCircle2 } from "lucide-react"

interface CustomPaymentBreakdownProps {
  expectedAmount: number
  onValidationChange: (isValid: boolean) => void
}

const PAYMENT_OPTIONS = [
  { id: "cash", label: "Cash", placeholder: "Enter cash amount" },
  { id: "credit_card", label: "Credit Card", placeholder: "Enter card amount" },
  { id: "giftcard", label: "Gift Card", placeholder: "Enter gift card amount" },
]

export function CustomPaymentBreakdown({
  expectedAmount,
  onValidationChange,
}: CustomPaymentBreakdownProps) {
  const { control, watch, setValue, clearErrors, setError } = useFormContext()
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])

  // Watch all custom payment amounts
  const customCash = watch("custom.cash") || ""
  const customCard = watch("custom.credit_card") || ""
  const customGiftCard = watch("custom.giftcard") || ""

  // Calculate total entered amount (only for selected methods)
  const totalEntered = [
    selectedMethods.includes("cash") ? parseFloat(customCash) || 0 : 0,
    selectedMethods.includes("credit_card") ? parseFloat(customCard) || 0 : 0,
    selectedMethods.includes("giftcard") ? parseFloat(customGiftCard) || 0 : 0,
  ].reduce((sum, amount) => sum + amount, 0)

  const isValid = Math.abs(totalEntered - expectedAmount) < 0.01
  const hasAmounts = totalEntered > 0
  const hasMultipleMethods = selectedMethods.length >= 2

  // Update validation state
  useEffect(() => {
    onValidationChange(isValid && hasAmounts && hasMultipleMethods)
  }, [isValid, hasAmounts, hasMultipleMethods, onValidationChange])

  // Handle checkbox changes
  const handleMethodToggle = (methodId: string, checked: boolean) => {
    if (checked) {
      setSelectedMethods((prev) => [...prev, methodId])
    } else {
      setSelectedMethods((prev) => prev.filter((id) => id !== methodId))
      // Clear the amount when unchecking
      setValue(`custom.${methodId}`, "")
    }
  }

  // Handle amount changes
  const handleAmountChange = (methodId: string, value: string) => {
    setValue(`custom.${methodId}`, value)

    // Clear validation errors when user starts typing
    if (value) {
      clearErrors(`custom.${methodId}`)
    }
  }

  // Validate individual amounts
  const validateAmount = (value: string, methodId: string) => {
    const numValue = parseFloat(value)
    if (value && (isNaN(numValue) || numValue < 0)) {
      setError(`custom.${methodId}`, {
        type: "manual",
        message: "Please enter a valid amount",
      })
      return false
    }
    return true
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700">
          Select Payment Methods
        </Label>
        <p className="mt-1 text-xs text-gray-500">
          Select at least 2 payment methods and enter amounts for each
        </p>
      </div>

      {/* Payment Method Checkboxes and Inputs */}
      <div className="space-y-3">
        {PAYMENT_OPTIONS.map((option) => (
          <div key={option.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Checkbox
                checked={selectedMethods.includes(option.id)}
                onCheckedChange={(checked) =>
                  handleMethodToggle(option.id, checked as boolean)
                }
                className="h-6 w-6 border-2 border-gray-300 bg-white data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 [&>svg]:h-4 [&>svg]:w-4"
              />
            </div>
            <Label className="min-w-[100px] text-sm font-medium text-gray-700">
              {option.label}
            </Label>

            {/* Amount Input - Always show but disabled when not selected */}
            <div className="relative flex-1">
              <Input
                type="number"
                step="0.01"
                placeholder={
                  selectedMethods.includes(option.id)
                    ? option.placeholder
                    : "Select checkbox to enable"
                }
                value={watch(`custom.${option.id}`) || ""}
                onChange={(e) => {
                  const value = e.target.value
                  handleAmountChange(option.id, value)
                  validateAmount(value, option.id)
                }}
                disabled={!selectedMethods.includes(option.id)}
                className={`h-9 text-sm transition-all duration-200 ${
                  selectedMethods.includes(option.id)
                    ? "border-gray-300 bg-white"
                    : "cursor-not-allowed border-gray-200 bg-gray-100 opacity-60"
                }`}
              />
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-colors duration-200 ${
                  selectedMethods.includes(option.id)
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                $
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      {hasAmounts && hasMultipleMethods && (
        <div className="mt-4 rounded-md border border-gray-200 bg-white p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Total Entered:</span>
            <span className="font-semibold">${totalEntered.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Expected Amount:</span>
            <span className="font-semibold">${expectedAmount.toFixed(2)}</span>
          </div>

          {/* Validation Status */}
          <div className="mt-2">
            {isValid ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Amounts match ✓</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {totalEntered > expectedAmount
                    ? `Total exceeds expected by $${(totalEntered - expectedAmount).toFixed(2)}`
                    : `Total is $${(expectedAmount - totalEntered).toFixed(2)} short`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {selectedMethods.length === 0 && (
        <div className="flex items-start space-x-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600" />
          <div className="text-sm text-yellow-800">
            Please select at least 2 payment methods to continue.
          </div>
        </div>
      )}

      {selectedMethods.length === 1 && (
        <div className="flex items-start space-x-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 text-blue-600" />
          <div className="text-sm text-blue-800">
            Please select one more payment method to continue.
          </div>
        </div>
      )}
    </div>
  )
}
