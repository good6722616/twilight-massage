import * as z from "zod"
import {
  MASSAGE_TYPES,
  DURATIONS,
  DISCOUNTS,
  STAFFS,
} from "@/lib/types/massage"

export const dailyLogFormSchema = z.object({
  staff: z.enum(STAFFS as [string, ...string[]], {
    required_error: "Staff is required",
  }),
  type: z.enum(MASSAGE_TYPES as [string, ...string[]], {
    required_error: "Please select a massage type",
  }),
  duration: z.enum(DURATIONS.map(String) as [string, ...string[]], {
    required_error: "Please select a duration",
  }),
  discount: z.string().optional(),
  addOns: z.array(z.string()).optional(),
  tip: z.string().optional(),
})

export type DailyLogFormValues = z.infer<typeof dailyLogFormSchema>
