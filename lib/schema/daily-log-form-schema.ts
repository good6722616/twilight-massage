import * as z from "zod"
import {
  MASSAGE_TYPES,
  DURATIONS,
  DISCOUNTS,
  STAFFS,
  MassageType,
  Staff,
} from "@/lib/types/massage"

const baseSchema = {
  type: z
    .string()
    .min(1, { message: "Please select a massage type" })
    .refine((val) => MASSAGE_TYPES.includes(val as MassageType), {
      message: "Please select a valid massage type",
    }),
  duration: z
    .string()
    .min(1, { message: "Please select a duration" })
    .refine((val) => DURATIONS.map(String).includes(val), {
      message: "Please select a valid duration",
    }),
  discount: z
    .string()
    .min(1, { message: "Please select a discount" })
    .refine((val) => DISCOUNTS.map(String).includes(val), {
      message: "Please select a valid discount",
    }),
  addOns: z.array(z.string()).optional(),
  tip: z
    .string()
    .min(1, { message: "Tip is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Tip must be a non-negative number",
    }),
  staff: z
    .string()
    .min(1, { message: "Please select a staff member" })
    .refine((val) => STAFFS.includes(val as Staff), {
      message: "Please select a valid staff member",
    }),
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
