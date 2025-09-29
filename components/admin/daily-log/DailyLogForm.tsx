"use client"

import { useState, useEffect, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
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
  Addon,
  ADDONS,
  DISCOUNTS,
  PAYMENT_METHODS,
  Discount,
  DiscountInfo,
  calculateDiscountAmount,
  encodeDiscount,
} from "@/lib/types/massage"
import { FormStaffSelector } from "@/components/admin/StaffSelector"
import { dailyLogFormSchema, DailyLogFormValues } from "@/lib/schema"
import { CustomPaymentBreakdown } from "./CustomPaymentBreakdown"
import { DiscountSelector } from "./DiscountSelector"
import { getCurrentBusinessDate } from "@/lib/utils"
import { useServices } from "@/hooks/useServices"

interface DailyLogFormProps {
  onSubmit: (
    record: Omit<MassageRecord, "id" | "created_at" | "updated_at" | "user_id">
  ) => void
  isSubmitting?: boolean
  isSuccess?: boolean
}

export function DailyLogForm({
  onSubmit,
  isSubmitting = false,
  isSuccess = false,
}: DailyLogFormProps) {
  const today = new Date()
  const [showSuccess, setShowSuccess] = useState(false)
  const [customPaymentValid, setCustomPaymentValid] = useState(false)
  const [discountValid, setDiscountValid] = useState(false)

  // 使用动态服务数据
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    getServiceNames,
    getServiceByName,
    getServiceDurations,
    getServicePrice,
    getStaffIncome,
  } = useServices()

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
    mode: "onSubmit", // Only validate when form is submitted
  })

  // Reset form every time the component mounts (sheet opens)
  useEffect(() => {
    form.reset({
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
    })
    setCustomPaymentValid(false)
    setDiscountValid(false)
    // eslint-disable-next-line
  }, [])

  // Watch form values for price calculation
  const selectedDuration = form.watch("duration")
  const selectedAddOns = form.watch("addOns") || []
  const selectedDiscountType = form.watch("discount_type")
  const selectedDiscountValue = form.watch("discount_value")
  const paymentMethod = form.watch("payment_method")

  const selectedType = form.watch("type") as string | undefined

  // 当选择服务时，加载服务详情
  useEffect(() => {
    if (selectedType) {
      getServiceByName(selectedType)
    }
  }, [selectedType, getServiceByName])

  // Calculate expected amount
  const expectedAmount = useMemo(() => {
    if (!selectedType || !selectedDuration) return 0

    const duration = parseInt(selectedDuration)
    const basePrice = getServicePrice(selectedType, duration)

    // Calculate add-ons total
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

    // Total expected amount = base price + add-ons - discount
    return basePrice + addOnsTotal - discountAmount
  }, [
    selectedType,
    selectedDuration,
    selectedAddOns,
    selectedDiscountType,
    selectedDiscountValue,
    getServicePrice,
  ])

  const availableDurations = useMemo(() => {
    if (!selectedType) return []
    const durations = getServiceDurations(selectedType)
    return durations.map((d) => d.duration.toString())
  }, [selectedType, getServiceDurations])

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

  const handleSubmit = async (values: DailyLogFormValues) => {
    try {
      const duration = parseInt(values.duration)

      // Validate that type exists in our services
      if (!values.type || !getServiceNames().includes(values.type)) {
        form.setError("type", {
          type: "manual",
          message: "Please select a valid massage type",
        })
        return
      }

      // Ensure service details are loaded before validation
      const serviceDetail = await getServiceByName(values.type)
      if (!serviceDetail) {
        form.setError("type", {
          type: "manual",
          message: "Failed to load service details. Please try again.",
        })
        return
      }

      // Validate that duration exists for the selected service
      const availableDurations = serviceDetail.durations.filter(
        (d) => d.is_active
      )
      const durationExists = availableDurations.some(
        (d) => d.duration === duration
      )
      if (!durationExists) {
        form.setError("duration", {
          type: "manual",
          message: "Please select a valid duration for this service",
        })
        return
      }

      const massageType = values.type
      const staffIncome = getStaffIncome(massageType, duration)

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

      // Handle payment method - now supports both single and custom payments
      let finalPaymentMethod: Record<string, number | null>
      if (values.payment_method === "custom" && values.custom) {
        // Custom payment breakdown
        finalPaymentMethod = {
          cash: parseFloat(values.custom.cash || "0") || null,
          credit_card: parseFloat(values.custom.credit_card || "0") || null,
          giftcard: parseFloat(values.custom.giftcard || "0") || null,
        }
        // Remove null values for cleaner storage
        Object.keys(finalPaymentMethod).forEach((key) => {
          if (
            finalPaymentMethod[key] === null ||
            finalPaymentMethod[key] === 0
          ) {
            delete finalPaymentMethod[key]
          }
        })
      } else {
        // Single payment method - store as {method: null} for old records
        finalPaymentMethod = { [values.payment_method]: null }
      }

      // Create the massage record
      const record = {
        date: getCurrentBusinessDate(),
        time_slot: `${values.timeSlot.from}–${values.timeSlot.to}`,
        staff: values.staff,
        service_name: massageType,
        duration,
        discount: discountValue,
        add_ons: values.addOns
          ? values.addOns.map((s) => s.trim() as Addon)
          : [],
        tip: values.tip ? parseFloat(values.tip) : 0,
        income: staffIncome,
        payment_method: finalPaymentMethod,
      }

      // Call the parent's onSubmit function
      onSubmit(record)

      // Reset form on successful submission
      form.reset({
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
      })
      setCustomPaymentValid(false)
      setDiscountValid(false)
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
          Adding...
        </>
      )
    }

    if (showSuccess) {
      return <Check className="h-4 w-4" />
    }

    return "Submit"
  }

  return (
    <Form {...form}>
      <div className="mb-6">
        <H2 className="text-2xl font-semibold text-gray-900">
          {format(today, "MMMM dd, yyyy")}
        </H2>
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
                  type="time"
                  {...field}
                  tabIndex={-1}
                  autoFocus={false}
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
                  {...field}
                  tabIndex={-1}
                  autoFocus={false}
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
                  {servicesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading services...
                    </SelectItem>
                  ) : servicesError ? (
                    <SelectItem value="error" disabled>
                      Error loading services
                    </SelectItem>
                  ) : (
                    getServiceNames().map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))
                  )}
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

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            showSuccess ||
            (paymentMethod === "custom" && !customPaymentValid) ||
            !discountValid
          }
          className="w-32"
        >
          {getButtonContent()}
        </Button>
      </form>
    </Form>
  )
}
