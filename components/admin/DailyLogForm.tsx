"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
} from "@/lib/types/massage"
import { dailyLogFormSchema, DailyLogFormValues } from "@/lib/schema"

interface DailyLogFormProps {
  onSubmit: (record: MassageRecord) => void
}

export function DailyLogForm({ onSubmit }: DailyLogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DailyLogFormValues>({
    resolver: zodResolver(dailyLogFormSchema),
    defaultValues: {
      staff: "",
      type: MASSAGE_TYPES[0],
      duration: DURATIONS[0].toString(),
      discount: "",
      addOns: [],
      tip: "",
    },
  })

  const handleSubmit = async (values: DailyLogFormValues) => {
    setIsSubmitting(true)
    try {
      const record: MassageRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split("T")[0],
        staff: values.staff,
        type: values.type as MassageType,
        duration: parseInt(values.duration) as Duration,
        discount: values.discount ? parseFloat(values.discount) : 0,
        addOns: values.addOns
          ? values.addOns.map((s) => s.trim() as Addon)
          : [],
        tip: values.tip ? parseFloat(values.tip) : 0,
        income: 0,
        timestamp: new Date().toISOString(),
      }
      onSubmit(record)
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="staff"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Staff</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select staff member</option>
                    {STAFFS.map((staff) => (
                      <option key={staff} value={staff}>
                        {staff}
                      </option>
                    ))}
                  </select>
                </FormControl>
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
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select massage type</option>
                    {MASSAGE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </FormControl>
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
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select duration</option>
                    {DURATIONS.map((duration) => (
                      <option key={duration} value={duration.toString()}>
                        {duration} minutes
                      </option>
                    ))}
                  </select>
                </FormControl>
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
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select discount</option>
                    {DISCOUNTS.map((discount) => (
                      <option key={discount} value={discount.toString()}>
                        {discount}%
                      </option>
                    ))}
                  </select>
                </FormControl>
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
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-5 left-0 text-xs" />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-fit">
          {isSubmitting ? "Adding..." : "Add Record"}
        </Button>
      </form>
    </Form>
  )
}
