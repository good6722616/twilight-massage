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
      .filter((r) => {
        // Handle both old string format and new JSONB format
        if (typeof r.payment_method === "string") {
          return r.payment_method === method
        }
        if (typeof r.payment_method === "object" && r.payment_method !== null) {
          // For custom payments, check if this method has an amount
          if (
            r.payment_method[method] !== null &&
            r.payment_method[method]! > 0
          ) {
            return true
          }
          // For single payments, check if this is the only method
          const methods = Object.keys(r.payment_method)
          const amounts = Object.values(r.payment_method)
          const hasAmounts = amounts.some(
            (amount) => amount !== null && amount > 0
          )
          if (!hasAmounts && methods[0] === method) {
            return true
          }
        }
        return false
      })
      .reduce((sum, r) => {
        // For custom payments, use the stored amount
        if (typeof r.payment_method === "object" && r.payment_method !== null) {
          const amount = r.payment_method[method]
          if (amount !== null && amount > 0) {
            return sum + amount
          }
        }

        // For single payments, calculate the amount
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

/**
 * Get current date in YYYY-MM-DD format using UTC to avoid timezone issues
 * This ensures consistent date handling across the application
 */
export function getCurrentDateUTC(): string {
  return new Date().toISOString().split("T")[0]
}

/**
 * Get date in YYYY-MM-DD format from a Date object using UTC
 */
export function formatDateUTC(date: Date): string {
  return date.toISOString().split("T")[0]
}
