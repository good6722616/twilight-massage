import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MassageRecord, MassageType, Duration } from "@/lib/types/massage"
import { SERVICE_PRICES, ADDONS } from "@/lib/types/massage"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculatePaymentBreakdown(records: MassageRecord[]) {
  const getTotal = (method: string) =>
    records
      .filter((r) => r.payment_method === method)
      .reduce((sum, r) => {
        const price =
          SERVICE_PRICES[r.service_name as MassageType]?.[
            r.duration as Duration
          ] || 0
        const discountAmount = (price * r.discount) / 100
        const addOnsTotal = (r.add_ons || []).reduce((addonSum, addon) => {
          const addonPrice =
            ADDONS.find(
              (a: { name: string; price: number }) => a.name === addon
            )?.price || 0
          return addonSum + addonPrice
        }, 0)
        return sum + price - discountAmount + addOnsTotal
      }, 0)

  return {
    cash: getTotal("cash"),
    credit_card: getTotal("credit_card"),
    giftcard: getTotal("giftcard"),
  }
}
