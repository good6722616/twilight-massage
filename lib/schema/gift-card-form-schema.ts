import * as z from "zod"

export const giftCardFormSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  amount: z
    .string()
    .min(1, { message: "Gift card amount is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Gift card amount must be greater than 0",
    }),
  sold_price: z
    .string()
    .min(1, { message: "Sold price is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Sold price must be greater than 0",
    }),
  payment_method: z.enum(["cash", "credit_card"], {
    required_error: "Please select a payment method",
  }),
  notes: z.string().optional(),
})

export type GiftCardFormValues = z.infer<typeof giftCardFormSchema>
