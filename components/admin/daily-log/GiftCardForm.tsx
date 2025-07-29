"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { H2 } from "@/components/ui/typography"
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

import { giftCardFormSchema, GiftCardFormValues } from "@/lib/schema"

interface GiftCardRecord {
  id: string
  created_at: string
  date: string
  amount: number
  sold_price: number
  payment_method: "cash" | "credit_card"
  notes?: string
  user_id: string
}

interface GiftCardFormProps {
  onSubmit: (
    record: Omit<GiftCardRecord, "id" | "created_at" | "user_id">
  ) => void
  isSubmitting?: boolean
  isSuccess?: boolean
  editingRecord?: GiftCardRecord
}

export function GiftCardForm({
  onSubmit,
  isSubmitting = false,
  isSuccess = false,
  editingRecord,
}: GiftCardFormProps) {
  const today = new Date()
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<GiftCardFormValues>({
    resolver: zodResolver(giftCardFormSchema),
    defaultValues: {
      date: editingRecord?.date || today.toLocaleDateString("en-CA"), // YYYY-MM-DD format
      amount: editingRecord?.amount?.toString() || "",
      sold_price: editingRecord?.sold_price?.toString() || "",
      payment_method: editingRecord?.payment_method || undefined,
      notes: editingRecord?.notes || "",
    },
    mode: "onSubmit",
  })

  // Reset form every time the component mounts (sheet opens) or editingRecord changes
  useEffect(() => {
    form.reset({
      date: editingRecord?.date || today.toLocaleDateString("en-CA"),
      amount: editingRecord?.amount?.toString() || "",
      sold_price: editingRecord?.sold_price?.toString() || "",
      payment_method: editingRecord?.payment_method || undefined,
      notes: editingRecord?.notes || "",
    })

    // Prevent auto-focus on inputs when modal opens
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }, 0)
    // eslint-disable-next-line
  }, [editingRecord])

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

  const handleSubmit = async (values: GiftCardFormValues) => {
    try {
      // Create the gift card record
      const record = {
        date: values.date,
        amount: parseFloat(values.amount),
        sold_price: parseFloat(values.sold_price),
        payment_method: values.payment_method,
        notes: values.notes || "",
      }

      // Call the parent's onSubmit function
      onSubmit(record)

      // Reset form on successful submission
      form.reset({
        date: today.toLocaleDateString("en-CA"),
        amount: "",
        sold_price: "",
        payment_method: undefined,
        notes: "",
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

    return editingRecord ? "Update" : "Submit"
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
        <H2 className="text-2xl font-semibold text-gray-900">
          {editingRecord
            ? "Edit Gift Card Sale"
            : `Gift Card Sale - ${format(today, "MMMM dd, yyyy")}`}
        </H2>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-1 text-base sm:px-2 sm:text-lg"
        key={form.formState.submitCount}
      >
        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="date">Date</FormLabel>
              <FormControl>
                <Input
                  id="date"
                  type="date"
                  {...field}
                  tabIndex={-1}
                  autoFocus={false}
                  className="w-full bg-white text-base placeholder:text-sm sm:text-lg sm:placeholder:text-base"
                />
              </FormControl>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

        {/* Gift Card Value */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="amount">Gift Card Value ($)</FormLabel>
              <FormControl>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter gift card value (what customer can spend)"
                  {...field}
                  className="h-9 w-full bg-white py-1 text-base placeholder:text-sm sm:text-lg sm:placeholder:text-base"
                />
              </FormControl>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

        {/* Price Paid */}
        <FormField
          control={form.control}
          name="sold_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="sold_price">Price Paid ($)</FormLabel>
              <FormControl>
                <Input
                  id="sold_price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter actual price customer paid"
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
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="notes">Notes (Optional)</FormLabel>
              <FormControl>
                <textarea
                  id="notes"
                  placeholder="Add any additional notes..."
                  {...field}
                  className="min-h-[100px] w-full resize-none rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background placeholder:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg sm:placeholder:text-base"
                />
              </FormControl>
              <FormMessage className="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          )}
        />

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
