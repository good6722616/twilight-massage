"use client"

import { useState, useEffect } from "react"
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
  BASE_PRICES,
  Discount,
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
    } as any,
  })

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

  const isCoupleMassage = (type: MassageType) => type.includes("(Couple)")

  const handleSubmit = async (values: DailyLogFormValues) => {
    try {
      const duration = parseInt(values.duration) as Duration

      // Validate that type is a valid MassageType
      if (!values.type || !MASSAGE_TYPES.includes(values.type as MassageType)) {
        console.error("Invalid massage type:", values.type)
        return
      }

      const massageType = values.type as MassageType
      const basePrice = BASE_PRICES[massageType][duration]
      const isCouple = isCoupleMassage(massageType)

      // Create the massage record
      const record = {
        date: today.toISOString().split("T")[0],
        time_slot: `${values.timeSlot.from}–${values.timeSlot.to}`,
        staff: values.staff,
        service_name: massageType,
        duration,
        discount: Number(values.discount) as Discount,
        add_ons: values.addOns
          ? values.addOns.map((s) => s.trim() as Addon)
          : [],
        tip: values.tip ? parseFloat(values.tip) / (isCouple ? 2 : 1) : 0,
        income: basePrice / (isCouple ? 2 : 1),
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
      } as any)
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
      return (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added!
        </>
      )
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
        className="space-y-6 px-2"
        key={form.formState.submitCount}
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          <FormItem className="col-span-2">
            <FormLabel>Time Slot</FormLabel>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Controller
                name="timeSlot.from"
                control={form.control}
                render={({ field }) => (
                  <Input
                    type="time"
                    {...field}
                    className="w-full bg-white sm:w-32"
                  />
                )}
              />
              <span className="hidden sm:inline">–</span>
              <Controller
                name="timeSlot.to"
                control={form.control}
                render={({ field }) => (
                  <Input
                    type="time"
                    {...field}
                    className="w-full bg-white sm:w-32"
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
                <FormLabel>Staff</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-white">
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
                <FormLabel>Massage Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-white">
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
                <FormLabel>Duration</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DURATIONS.map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} minutes
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
            name="discount"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Discount</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-white">
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
                <FormLabel>Add-ons ($3 each)</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={ADDONS.map((addon) => ({
                      label: `${addon.name} (+$${addon.price})`,
                      value: addon.name,
                    }))}
                    onValueChange={field.onChange}
                    value={field.value || []}
                    placeholder="Select add-ons"
                    className="w-full bg-white hover:bg-orange-50"
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
                <FormLabel>Tip ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter tip amount"
                    {...field}
                    className="w-full"
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
          className={getButtonClassName()}
        >
          {getButtonContent()}
        </Button>
      </form>
    </Form>
  )
}
