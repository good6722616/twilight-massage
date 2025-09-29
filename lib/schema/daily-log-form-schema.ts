import * as z from "zod"
import {
  DISCOUNTS,
  PAYMENT_METHODS,
  PaymentMethod,
  DISCOUNT_TYPES,
} from "@/lib/types/massage"

const baseSchema = {
  type: z.string().min(1, { message: "Please select a massage type" }),
  duration: z.string().min(1, { message: "Please select a duration" }),
  discount_type: z
    .string()
    .min(1, { message: "Please select a discount type" })
    .refine((val) => DISCOUNT_TYPES.some((type) => type.value === val), {
      message: "Please select a valid discount type",
    }),
  discount_value: z
    .string()
    .min(1, { message: "Please enter a discount value" })
    .refine(
      (val) => {
        const numVal = parseFloat(val)
        return !isNaN(numVal) && numVal >= 0
      },
      { message: "Please enter a valid discount value" }
    ),
  addOns: z.array(z.string()).optional(),
  tip: z
    .string()
    .min(1, { message: "Tip is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Tip must be a non-negative number",
    }),
  staff: z.string().min(1, { message: "Please select a staff member" }),
  payment_method: z
    .string()
    .min(1, { message: "Please select a payment method" })
    .refine((val) => PAYMENT_METHODS.includes(val as PaymentMethod), {
      message: "Please select a valid payment method",
    }),
  custom: z
    .object({
      cash: z.string().optional(),
      credit_card: z.string().optional(),
      giftcard: z.string().optional(),
    })
    .optional(),
  timeSlot: z
    .object({
      from: z.string().min(1, "Start time is required"),
      to: z.string().min(1, "End time is required"),
    })
    .refine(
      (data) => {
        if (!data.from || !data.to) return false
        return data.from < data.to
      },
      {
        message: "End time must be after start time",
        path: ["to"],
      }
    ),
}

export const dailyLogFormSchema = z.object(baseSchema)

export type DailyLogFormValues = z.infer<typeof dailyLogFormSchema>
