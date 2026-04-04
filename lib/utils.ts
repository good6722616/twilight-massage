import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MassageRecord, MassageType, Duration } from "@/lib/types/massage"
import {
  SERVICE_PRICES,
  ADDONS,
  calculateDiscountAmount,
} from "@/lib/types/massage"
import { toZonedTime, fromZonedTime } from "date-fns-tz"
import { startOfDay, endOfDay, format } from "date-fns"

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
        const discountAmount = calculateDiscountAmount(price, r.discount)
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
    classpass: getTotal("classpass"),
    spa_finder: getTotal("spa_finder"),
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
 * Get current business date in YYYY-MM-DD format using Pacific timezone
 * This ensures we use the business timezone for date classification
 */
export function getCurrentBusinessDate(): string {
  const now = new Date()

  // Get the date in Pacific timezone for business purposes
  const laDate = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Los_Angeles",
  })

  return laDate
}

/**
 * Get date in YYYY-MM-DD format from a Date object using UTC
 */
export function formatDateUTC(date: Date): string {
  return date.toISOString().split("T")[0]
}

/**
 * Get timezone-aware date range for querying records
 * This calculates the UTC timestamps for start and end of a day in Pacific timezone
 */
export function getTimezoneAwareDateRange(
  dateStr: string,
  timezone: string = "America/Los_Angeles"
): { start: string; end: string } {
  // Create a date object for midnight of the given date
  const baseDate = new Date(`${dateStr}T00:00:00`)

  // Create start of day (00:00:00) and end of day (23:59:59.999) in the target timezone
  const startOfDayInTimezone = new Date(baseDate.getTime())
  const endOfDayInTimezone = new Date(
    baseDate.getTime() + 24 * 60 * 60 * 1000 - 1
  )

  // Convert these timezone-specific times to UTC
  const startUTC = fromZonedTime(startOfDayInTimezone, timezone)
  const endUTC = fromZonedTime(endOfDayInTimezone, timezone)

  return {
    start: startUTC.toISOString(),
    end: endUTC.toISOString(),
  }
}

/**
 * Convert UTC timestamp to Los Angeles time for display
 * This ensures all timestamps are shown in business timezone regardless of user location
 */
export function formatTimestampForLA(
  utcTimestamp: string,
  formatString: string = "MMM dd, yyyy 'at' h:mm a"
): string {
  try {
    const utcDate = new Date(utcTimestamp)
    const laTime = toZonedTime(utcDate, "America/Los_Angeles")
    return format(laTime, formatString)
  } catch (error) {
    console.error("Error formatting timestamp:", error)
    return utcTimestamp // Fallback to original value
  }
}

/**
 * Convert UTC timestamp to LA date only (YYYY-MM-DD)
 */
export function formatDateForLA(utcTimestamp: string): string {
  return formatTimestampForLA(utcTimestamp, "yyyy-MM-dd")
}

/**
 * Convert UTC timestamp to LA time only (h:mm a)
 */
export function formatTimeForLA(utcTimestamp: string): string {
  return formatTimestampForLA(utcTimestamp, "h:mm a")
}

/**
 * Test function to verify timezone conversion logic
 * This helps debug timezone issues
 */
