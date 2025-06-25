"use client"

import { useState, useEffect, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Check } from "lucide-react"
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
  DURATIONS,
  ADDONS,
  DISCOUNTS,
  STAFFS,
  STAFF_SERVICE_INCOME,
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
  const form = useForm<DailyLogFormValues>({
    resolver: zodResolver(dailyLogFormSchema),
    defaultValues: {
      staff: "",
      type: "",
      duration: "",
      discount: "",
      addOns: [],
      tip: "",
      timeSlot: { from: "", to: "" },
    },
    mode: "onSubmit", // Only validate when form is submitted
  })

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

      // Create the massage record
      const record = {
        date: today.toLocaleDateString("en-CA"),
        time_slot: `${values.timeSlot.from}–${values.timeSlot.to}`,
        staff: values.staff,
        service_name: massageType,
        duration,
        discount: Number(values.discount) as Discount,
        add_ons: values.addOns
          ? values.addOns.map((s) => s.trim() as Addon)
          : [],
        tip: values.tip ? parseFloat(values.tip) / (isCouple ? 2 : 1) : 0,
        income: staffIncome / (isCouple ? 2 : 1),
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
        timeSlot: { from: "", to: "" },
      })
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

    return "Add Record"
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
        <h2 className="text-2xl font-semibold text-gray-900">
          {format(today, "MMMM dd, yyyy")}
        </h2>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-1 text-base sm:px-2 sm:text-lg"
        key={form.formState.submitCount}
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:gap-y-8 md:grid-cols-2">
          <FormItem className="col-span-1 md:col-span-2">
            <FormLabel className="text-base sm:text-lg">Time Slot</FormLabel>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
              <Controller
                name="timeSlot.from"
                control={form.control}
                render={({ field }) => (
                  <Input
                    type="time"
                    {...field}
                    className="h-11 w-full bg-white text-base sm:h-12 sm:w-32 sm:text-lg"
                  />
                )}
              />
              <span className="hidden sm:inline">–</span>
              <span className="text-center text-sm text-gray-500 sm:hidden">
                to
              </span>
              <Controller
                name="timeSlot.to"
                control={form.control}
                render={({ field }) => (
                  <Input
                    type="time"
                    {...field}
                    className="h-11 w-full bg-white text-base sm:h-12 sm:w-32 sm:text-lg"
                  />
                )}
              />
            </div>
            <FormMessage className="absolute -bottom-5 left-0 text-xs" />
          </FormItem>

          <FormField
            control={form.control}
            name="staff"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-base sm:text-lg">Staff</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full bg-white text-base sm:h-12 sm:text-lg">
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

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-base sm:text-lg">
                  Massage Type
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full bg-white text-base sm:h-12 sm:text-lg">
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

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <FormLabel className="text-base sm:text-lg">
                    Duration
                  </FormLabel>
                  {!selectedType && (
                    <span className="text-xs font-medium text-green-600">
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
                    <SelectTrigger className="h-11 w-full bg-white text-base sm:h-12 sm:text-lg">
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
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        Please select a massage type first
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="absolute -bottom-5 left-0 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-base sm:text-lg">Discount</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full bg-white text-base sm:h-12 sm:text-lg">
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DISCOUNTS.map((discount) => (
                      <SelectItem key={discount} value={discount.toString()}>
                        {discount}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="absolute -bottom-5 left-0 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addOns"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-base sm:text-lg">Add-ons</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={ADDONS.map((addon) => ({
                      label: addon.name,
                      value: addon.name,
                    }))}
                    onValueChange={field.onChange}
                    value={field.value || []}
                    placeholder="Select add-ons"
                    className="h-11 w-full bg-white text-base hover:bg-orange-50 sm:h-12 sm:text-lg"
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-5 left-0 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tip"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-base sm:text-lg">Tip ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter tip amount"
                    {...field}
                    className="h-11 w-full bg-white text-base sm:h-12 sm:text-lg"
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-5 left-0 text-xs" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || showSuccess}
          className={`${getButtonClassName()} w-full sm:w-fit`}
        >
          {getButtonContent()}
        </Button>
      </form>
    </Form>
  )
}
