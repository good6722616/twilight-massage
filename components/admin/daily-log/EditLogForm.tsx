"use client"

import { useState, useEffect, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { H2, Muted } from "@/components/ui/typography"
import { Check, X } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MassageRecord,
  MassageType,
  Duration,
  Addon,
  ADDONS,
  DISCOUNTS,
  PAYMENT_METHODS,
  Discount,
  DiscountInfo,
  calculateStaffIncome,
  calculateDiscountAmount,
  encodeDiscount,
  decodeDiscount,
} from "@/lib/types/massage"
import { useServices } from "@/hooks/useServices"
import { FormStaffSelector } from "@/components/admin/StaffSelector"
import { dailyLogFormSchema, DailyLogFormValues } from "@/lib/schema"
import { CustomPaymentBreakdown } from "./CustomPaymentBreakdown"
import { DiscountSelector } from "./DiscountSelector"

interface EditLogFormProps {
  record: MassageRecord
  onSubmit: (
    record: Omit<MassageRecord, "id" | "created_at" | "updated_at" | "user_id">
  ) => void
  onCancel: () => void
  isSubmitting?: boolean
  isSuccess?: boolean
}

export function EditLogForm({
  record,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isSuccess = false,
}: EditLogFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [customPaymentValid, setCustomPaymentValid] = useState(false)
  const [discountValid, setDiscountValid] = useState(false)

  // 使用动态服务数据
  const {
    serviceDetails,
    getServiceNames,
    getServiceDurations,
    getServicePrice,
  } = useServices()

  // 构建员工收入映射
  const serviceStaffIncomes = useMemo(() => {
    const incomes: Record<string, Record<number, number>> = {}
    Object.values(serviceDetails).forEach((service: any) => {
      if (service && service.is_active) {
        incomes[service.name] = {}
        service.durations.forEach((duration: any) => {
          if (duration.is_active) {
            incomes[service.name][duration.duration] = duration.staff_income
          }
        })
      }
    })
    return incomes
  }, [serviceDetails])

  // Parse time slot for edit mode
  const parseTimeSlot = (timeSlot: string) => {
    const [from, to] = timeSlot.split("–")
    return { from: from || "", to: to || "" }
  }

  // 处理折扣格式转换
  const parseDiscount = (discount: number) => {
    const discountInfo = decodeDiscount(discount)
    return {
      discount_type: discountInfo.type,
      discount_value: discountInfo.value.toString(),
    }
  }

  const form = useForm<DailyLogFormValues>({
    resolver: zodResolver(dailyLogFormSchema),
    defaultValues: {
      staff: record.staff || "",
      type: record.service_name || "",
      duration: record.duration?.toString() || "",
      ...parseDiscount(record.discount),
      addOns: record.add_ons || [],
      tip: record.tip?.toString() || "",
      payment_method: (() => {
        // Handle both old string format and new JSONB format
        if (typeof record.payment_method === "string") {
          return record.payment_method
        }
        if (
          typeof record.payment_method === "object" &&
          record.payment_method !== null
        ) {
          const methods = Object.keys(record.payment_method)
          const amounts = Object.values(record.payment_method)

          // Check if it's a custom payment (multiple methods with amounts)
          const hasAmounts = amounts.some(
            (amount) => amount !== null && amount > 0
          )

          if (hasAmounts) {
            return "custom"
          } else {
            // Single payment method (old format converted)
            return methods[0] || ""
          }
        }
        return ""
      })(),
      custom: (() => {
        // Initialize custom payment fields if it's a custom payment
        if (
          typeof record.payment_method === "object" &&
          record.payment_method !== null
        ) {
          const amounts = Object.values(record.payment_method)
          const hasAmounts = amounts.some(
            (amount) => amount !== null && amount > 0
          )

          if (hasAmounts) {
            return {
              cash: record.payment_method.cash?.toString() || "",
              credit_card: record.payment_method.credit_card?.toString() || "",
              giftcard: record.payment_method.giftcard?.toString() || "",
              spa_finder: record.payment_method.spa_finder?.toString() || "",
            }
          }
        }
        return {
          cash: "",
          credit_card: "",
          giftcard: "",
          spa_finder: "",
        }
      })(),
      timeSlot: record.time_slot
        ? parseTimeSlot(record.time_slot)
        : { from: "", to: "" },
    },
    mode: "onSubmit", // Only validate when form is submitted
  })

  const selectedType = form.watch("type") as MassageType | undefined
  const selectedDuration = form.watch("duration")
  const selectedAddOns = form.watch("addOns") || []
  const selectedDiscountType = form.watch("discount_type")
  const selectedDiscountValue = form.watch("discount_value")
  const paymentMethod = form.watch("payment_method")

  const availableDurations = useMemo(() => {
    if (!selectedType) return []
    const durations = getServiceDurations(selectedType)
    return durations.map((d) => d.duration.toString())
  }, [selectedType, getServiceDurations])

  const expectedAmount = useMemo(() => {
    if (!selectedType || !selectedDuration) return 0
    const duration = parseInt(selectedDuration) as Duration
    const basePrice = getServicePrice(selectedType, duration) || 0
    const addOnsTotal = selectedAddOns.reduce((sum, addon) => {
      const addonPrice = ADDONS.find((a) => a.name === addon)?.price || 0
      return sum + addonPrice
    }, 0)

    // Calculate discount using new logic
    let discountAmount = 0
    if (selectedDiscountValue) {
      const discountValue = parseFloat(selectedDiscountValue)
      if (!isNaN(discountValue)) {
        // 构建折扣信息并编码
        const discountInfo: DiscountInfo = {
          type: selectedDiscountType as "percentage" | "fixed_amount",
          value: discountValue,
        }
        const encodedDiscount = encodeDiscount(discountInfo)
        discountAmount = calculateDiscountAmount(basePrice, encodedDiscount)
      }
    }

    return basePrice + addOnsTotal - discountAmount
  }, [
    selectedType,
    selectedDuration,
    selectedAddOns,
    selectedDiscountType,
    selectedDiscountValue,
    getServicePrice,
  ])

  // Handle success state animation
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true)
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 2000) // Show success for 2 seconds
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  // Reset showSuccess when opening a new record or modal is reopened
  useEffect(() => {
    if (!isSuccess) {
      setShowSuccess(false)
    }
  }, [record.id, isSuccess])

  const isCoupleMassage = useMemo(() => {
    return (type: MassageType) => type.includes("(Couple)")
  }, [])

  const handleSubmit = async (values: DailyLogFormValues) => {
    try {
      const duration = parseInt(values.duration) as Duration

      // Validate that type is a valid MassageType
      if (
        !values.type ||
        !getServiceNames().includes(values.type as MassageType)
      ) {
        console.error("Invalid massage type:", values.type)
        return
      }

      const massageType = values.type as MassageType
      const isCouple = isCoupleMassage(massageType)
      const staffIncome = calculateStaffIncome(
        massageType,
        duration,
        values.addOns ? values.addOns.map((s) => s.trim() as Addon) : [],
        serviceStaffIncomes
      )

      // 处理新的折扣格式
      let discountValue: number
      const discountVal = parseFloat(values.discount_value)

      if (values.discount_type === "percentage") {
        // 百分比折扣
        if (DISCOUNTS.map(String).includes(values.discount_value)) {
          // 预设百分比值
          discountValue = parseInt(values.discount_value) as Discount
        } else {
          // 自定义百分比值
          if (isNaN(discountVal) || discountVal < 0 || discountVal > 100) {
            console.error(
              "Invalid percentage discount value:",
              values.discount_value
            )
            return
          }
          discountValue = discountVal
        }
      } else {
        // 固定金额折扣
        if (isNaN(discountVal) || discountVal < 0) {
          console.error(
            "Invalid fixed amount discount value:",
            values.discount_value
          )
          return
        }
        // 使用编码函数将固定金额折扣转换为负数存储
        discountValue = encodeDiscount({
          type: "fixed_amount",
          value: discountVal,
        })
      }

      // Create the massage record
      const recordData: Omit<
        MassageRecord,
        "id" | "created_at" | "updated_at" | "user_id"
      > = {
        date: record.date, // Keep the original date
        time_slot: `${values.timeSlot.from}–${values.timeSlot.to}`,
        staff: values.staff,
        service_name: massageType,
        duration,
        discount: discountValue,
        add_ons: values.addOns
          ? values.addOns.map((s) => s.trim() as Addon)
          : [],
        tip: values.tip ? parseFloat(values.tip) / (isCouple ? 2 : 1) : 0,
        income: staffIncome / (isCouple ? 2 : 1),
        payment_method: (() => {
          // Handle payment method - now supports both single and custom payments
          if (values.payment_method === "custom" && values.custom) {
            // Custom payment breakdown
            const customBreakdown: Record<string, number | null> = {
              cash: parseFloat(values.custom.cash || "0") || null,
              credit_card: parseFloat(values.custom.credit_card || "0") || null,
              giftcard: parseFloat(values.custom.giftcard || "0") || null,
              spa_finder: parseFloat(values.custom.spa_finder || "0") || null,
            }
            // Remove null values for cleaner storage
            Object.keys(customBreakdown).forEach((key) => {
              if (customBreakdown[key] === null || customBreakdown[key] === 0) {
                delete customBreakdown[key]
              }
            })
            return customBreakdown
          } else {
            // Single payment method - store as {method: null} for old records
            return { [values.payment_method]: null }
          }
        })(),
      }

      // Call the parent's onSubmit function
      onSubmit(recordData)
    } catch (error) {
      console.error("Error preparing form data:", error)
    }
  }

  // Custom button content based on state
  const getButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Updating...
        </>
      )
    }

    if (showSuccess) {
      return <Check className="h-4 w-4" />
    }

    return "Update"
  }

  // Button className based on state
  const getButtonClassName = () => {
    if (showSuccess) {
      return "w-fit bg-green-600 hover:bg-green-700 transition-colors duration-300"
    }
    return "w-fit"
  }

  return (
    <Form {...form}>
      <div className="mb-6">
        <H2 className="text-2xl font-semibold text-gray-900">Edit Record</H2>
        <p className="mt-1 text-sm text-gray-600">Record ID: {record.id}</p>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-1 text-base sm:px-2 sm:text-lg"
        key={form.formState.submitCount}
      >
        {/* Time Slot */}
        <FormItem>
          <FormLabel htmlFor="timeSlot-from" className="text-base sm:text-lg">
            Time Slot
          </FormLabel>
          <div className="flex flex-row gap-2">
            <Controller
              name="timeSlot.from"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="timeSlot-from"
                  tabIndex={-1}
                  autoFocus={false}
                  type="time"
                  {...field}
                  className="w-full bg-white text-base placeholder:text-sm sm:text-lg sm:placeholder:text-base"
                />
              )}
            />
            <span className="flex items-center">–</span>
            <Controller
              name="timeSlot.to"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="timeSlot-to"
                  type="time"
                  tabIndex={-1}
                  autoFocus={false}
                  {...field}
                  className="w-full bg-white text-base placeholder:text-sm sm:text-lg sm:placeholder:text-base"
                />
              )}
            />
          </div>
          <FormMessage className="absolute -bottom-5 left-0 text-xs" />
        </FormItem>

        {/* Staff */}
        <FormStaffSelector
          control={form.control}
          name="staff"
          label="Staff"
          placeholder="Select staff member"
          className="h-9 w-full bg-white py-1 text-base sm:text-lg [&_[data-slot=select-value]]:text-sm [&_[data-slot=select-value]]:sm:text-base"
        />

        {/* Massage Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="massage-type">Massage Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    id="massage-type"
                    className="h-9 w-full bg-white py-1 text-base sm:text-lg [&_[data-slot=select-value]]:text-sm [&_[data-slot=select-value]]:sm:text-base"
                  >
                    <SelectValue placeholder="Select massage type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getServiceNames().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-1">
                <FormLabel htmlFor="duration" className="text-base sm:text-lg">
                  Duration
                </FormLabel>
                {!selectedType && (
                  <span className="text-sm font-medium text-green-600">
                    Please select a massage type first
                  </span>
                )}
              </div>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedType}
              >
                <FormControl>
                  <SelectTrigger
                    id="duration"
                    className="h-9 w-full bg-white py-1 text-base sm:text-lg [&_[data-slot=select-value]]:text-sm [&_[data-slot=select-value]]:sm:text-base"
                  >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedType ? (
                    availableDurations.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration} minutes
                      </SelectItem>
                    ))
                  ) : (
                    <Muted className="px-4 py-2">
                      Please select a massage type first
                    </Muted>
                  )}
                </SelectContent>
              </Select>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

        {/* Discount */}
        <div className="space-y-2">
          <DiscountSelector onValidationChange={setDiscountValid} />
        </div>

        {/* Add-ons */}
        <FormField
          control={form.control}
          name="addOns"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="addOns">Add-ons</FormLabel>
              <FormControl>
                <div className="[&_span]:text-sm [&_span]:sm:text-base">
                  <MultiSelect
                    id="addOns"
                    options={ADDONS.map((addon) => ({
                      label: addon.name,
                      value: addon.name,
                    }))}
                    onValueChange={field.onChange}
                    value={field.value || []}
                    placeholder="Select add-ons"
                    className="h-9 w-full bg-white py-1 text-base hover:bg-orange-50 sm:text-lg"
                  />
                </div>
              </FormControl>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

        {/* Tip */}
        <FormField
          control={form.control}
          name="tip"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="tip">Tip ($)</FormLabel>
              <FormControl>
                <Input
                  id="tip"
                  type="number"
                  step="0.01"
                  placeholder="Enter tip amount"
                  {...field}
                  className="h-9 w-full bg-white py-1 text-base placeholder:text-sm sm:text-lg sm:placeholder:text-base"
                />
              </FormControl>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

        {/* Payment Method */}
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="payment_method">Payment Method</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    id="payment_method"
                    className="h-9 w-full bg-white py-1 text-base sm:text-lg [&_[data-slot=select-value]]:text-sm [&_[data-slot=select-value]]:sm:text-base"
                  >
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method === "cash" && "Cash"}
                      {method === "credit_card" && "Credit Card"}
                      {method === "giftcard" && "Gift Card"}
                      {method === "classpass" && "ClassPass"}
                      {method === "spa_finder" && "Spa Finder"}
                      {method === "custom" && "Custom Payment"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

        {/* Custom Payment Breakdown */}
        {paymentMethod === "custom" && (
          <CustomPaymentBreakdown
            expectedAmount={expectedAmount}
            onValidationChange={setCustomPaymentValid}
          />
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              showSuccess ||
              (paymentMethod === "custom" && !customPaymentValid) ||
              !discountValid
            }
            className={getButtonClassName()}
          >
            {getButtonContent()}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
