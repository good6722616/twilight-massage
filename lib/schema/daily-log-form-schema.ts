import * as z from "zod"
import {
  MASSAGE_TYPES,
  DURATIONS,
  DISCOUNTS,
  STAFFS,
  MassageType,
} from "@/lib/types/massage"

const baseSchema = {
  type: z
    .enum(MASSAGE_TYPES as [MassageType, ...MassageType[]], {
      required_error: "Please select a massage type",
    })
    .or(z.literal(""))
    .refine((val) => val !== "", { message: "Please select a massage type" }),
  duration: z
    .enum(DURATIONS.map(String) as [string, ...string[]], {
      required_error: "Please select a duration",
    })
    .or(z.literal(""))
    .refine((val) => val !== "", { message: "Please select a duration" }),
  discount: z.enum(DISCOUNTS.map(String) as [string, ...string[]], {
    required_error: "Please select a discount",
  }),
  addOns: z.array(z.string()).optional(),
  tip: z
    .string()
    .min(1, { message: "Tip is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Tip must be a non-negative number",
    }),
  staff: z
    .enum(STAFFS as [string, ...string[]], {
      required_error: "Staff is required",
    })
    .or(z.literal(""))
    .refine((val) => val !== "", { message: "Please select a staff member" }),
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
