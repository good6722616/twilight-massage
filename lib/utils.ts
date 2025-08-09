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

/**
 * Get timezone-aware date range for querying records
 * This calculates the UTC timestamps for start and end of a day in a specific timezone
 */
export function getTimezoneAwareDateRange(
  dateStr: string,
  timezone: string = "America/Los_Angeles"
): { start: string; end: string } {
  // Calculate offset for the timezone (simplified for PST/PDT)
  const now = new Date()
  const isPDT = now.getTimezoneOffset() === 420 // PDT is UTC-7, PST is UTC-8
  const offsetHours = isPDT ? 7 : 8 // Pacific timezone offset

  // Create date at midnight in the target timezone
  const localMidnight = new Date(`${dateStr}T00:00:00`)
  const utcMidnight = new Date(
    localMidnight.getTime() + offsetHours * 60 * 60 * 1000
  )

  // End of day is 23:59:59.999
  const utcEndOfDay = new Date(utcMidnight.getTime() + 24 * 60 * 60 * 1000 - 1)

  return {
    start: utcMidnight.toISOString(),
    end: utcEndOfDay.toISOString(),
  }
}
