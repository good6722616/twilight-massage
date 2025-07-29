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
  MassageType,
  Duration,
  Addon,
  MASSAGE_TYPES,
  ADDONS,
  DISCOUNTS,
  STAFFS,
  PAYMENT_METHODS,
  Discount,
  SERVICE_PRICES,
  calculateStaffIncome,
} from "@/lib/types/massage"
import { dailyLogFormSchema, DailyLogFormValues } from "@/lib/schema"

interface DailyLogFormProps {
  onSubmit: (
    record: Omit<MassageRecord, "id" | "created_at" | "user_id">
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
  const [customDiscountMode, setCustomDiscountMode] = useState(false)

  const form = useForm<DailyLogFormValues>({
    resolver: zodResolver(dailyLogFormSchema),
    defaultValues: {
      staff: "",
      type: "",
      duration: "",
      discount: "",
      addOns: [],
      tip: "",
      payment_method: "",
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
      discount: "",
      addOns: [],
      tip: "",
      payment_method: "",
      timeSlot: { from: "", to: "" },
    })
    setCustomDiscountMode(false)
    // eslint-disable-next-line
  }, [])

  // Watch discount value to handle custom mode
  const discountValue = form.watch("discount")

  // Handle discount mode changes
  useEffect(() => {
    if (discountValue === "custom") {
      setCustomDiscountMode(true)
      form.setValue("discount", "")
    }
    // 移除自动切换回下拉框的逻辑，让用户手动控制
  }, [discountValue, form])

  // 添加手动切换回预设模式的功能
  const switchToPresetMode = () => {
    setCustomDiscountMode(false)
    form.setValue("discount", "")
    form.clearErrors("discount")
  }

  const selectedType = form.watch("type") as MassageType | undefined
  const availableDurations = useMemo(() => {
    if (!selectedType || !SERVICE_PRICES[selectedType]) return []
    return Object.entries(SERVICE_PRICES[selectedType])
      .filter(([_, price]) => price > 0)
      .map(([duration]) => duration)
  }, [selectedType])

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

  const isCoupleMassage = useMemo(() => {
    return (type: MassageType) => type.includes("(Couple)")
  }, [])

  const handleSubmit = async (values: DailyLogFormValues) => {
    try {
      const duration = parseInt(values.duration) as Duration

      // Validate that type is a valid MassageType
      if (!values.type || !MASSAGE_TYPES.includes(values.type as MassageType)) {
        console.error("Invalid massage type:", values.type)
        return
      }

      const massageType = values.type as MassageType
      const isCouple = isCoupleMassage(massageType)
      const staffIncome = calculateStaffIncome(
        massageType,
        duration,
        values.addOns ? values.addOns.map((s) => s.trim() as Addon) : []
      )

      // 处理 discount 值，支持预设值和自定义值
      let discountValue: number
      if (DISCOUNTS.map(String).includes(values.discount)) {
        // 预设值
        discountValue = parseInt(values.discount) as Discount
      } else {
        // 自定义值
        discountValue = parseFloat(values.discount)
        if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
          console.error("Invalid custom discount value:", values.discount)
          return
        }
      }

      // Create the massage record
      const record = {
        date: today.toLocaleDateString("en-CA"),
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
        payment_method: values.payment_method,
      }

      // Call the parent's onSubmit function
      onSubmit(record)

      // Reset form on successful submission
      form.reset({
        staff: "",
        type: "",
        duration: "",
        discount: "",
        addOns: [],
        tip: "",
        payment_method: "",
        timeSlot: { from: "", to: "" },
      })
      setCustomDiscountMode(false)
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
        <FormField
          control={form.control}
          name="staff"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="staff">Staff</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    id="staff"
                    className="h-9 w-full bg-white py-1 text-base sm:text-lg [&_[data-slot=select-value]]:text-sm [&_[data-slot=select-value]]:sm:text-base"
                  >
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STAFFS.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
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
                  {MASSAGE_TYPES.map((type) => (
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
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="discount">Discount</FormLabel>
              {!customDiscountMode ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      id="discount"
                      className="h-9 w-full bg-white py-1 text-base sm:text-lg [&_[data-slot=select-value]]:text-sm [&_[data-slot=select-value]]:sm:text-base"
                    >
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DISCOUNTS.map((discount) => (
                      <SelectItem key={discount} value={discount.toString()}>
                        {discount}%
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative">
                  <FormControl>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="Enter custom discount"
                      {...field}
                      className="h-9 w-full bg-white py-1 pr-8 text-base placeholder:text-sm sm:text-lg sm:placeholder:text-base"
                      onBlur={(e) => {
                        const value = parseFloat(e.target.value)
                        if (isNaN(value) || value < 0 || value > 100) {
                          form.setError("discount", {
                            type: "manual",
                            message:
                              "Please enter a valid discount between 0–100%",
                          })
                        } else {
                          form.clearErrors("discount")
                        }
                      }}
                    />
                  </FormControl>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    %
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-8 top-1/2 h-6 w-6 -translate-y-1/2 p-0 text-gray-400 hover:text-gray-600"
                    onClick={switchToPresetMode}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

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
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting || showSuccess}
          className="w-32"
        >
          {getButtonContent()}
        </Button>
      </form>
    </Form>
  )
}
