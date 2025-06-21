export interface MassageRecord {
  id: string
  created_at: string
  date: string
  time_slot: string
  staff: string
  service_name: string
  duration: number
  discount: number
  add_ons: string[]
  tip: number
  income: number
  user_id: string
}

export type MassageType =
  | "Swedish Massage"
  | "Deep Tissue Massage"
  | "Foot Massage"
  | "Twilight Special Combo"
  | "Thai Massage"
  | "Lymphatic Drainage Massage"
  | "Swedish Massage (Couple)"
  | "Deep Tissue Massage (Couple)"

export type CoupleMassageSubtype = "Swedish Massage" | "Deep Tissue Massage"

export type Duration = 30 | 60 | 90
export type Addon = "Hot Stone" | "Essential Oil" | "Body Scrub" | "CBD Oil"

export type Staff =
  | "Vivian Zhang"
  | "Sarah Jin"
  | "Yoyo Lu"
  | "Daisy L"
  | "Anna"

export const MASSAGE_TYPES: MassageType[] = [
  "Swedish Massage",
  "Deep Tissue Massage",
  "Foot Massage",
  "Twilight Special Combo",
  "Thai Massage",
  "Lymphatic Drainage Massage",
  "Swedish Massage (Couple)",
  "Deep Tissue Massage (Couple)",
]

export const COUPLE_MASSAGE_SUBTYPES: CoupleMassageSubtype[] = [
  "Swedish Massage",
  "Deep Tissue Massage",
]

export const DURATIONS: Duration[] = [30, 60, 90]

export const ADDONS: { name: Addon; price: number }[] = [
  { name: "Hot Stone", price: 3 },
  { name: "Essential Oil", price: 3 },
  { name: "Body Scrub", price: 3 },
  { name: "CBD Oil", price: 3 },
]

export const DISCOUNTS = [0, 5, 10, 15, 20] as const
export type Discount = (typeof DISCOUNTS)[number]

export const BASE_PRICES: Record<MassageType, Record<Duration, number>> = {
  "Swedish Massage": {
    30: 40,
    60: 60,
    90: 90,
  },
  "Deep Tissue Massage": {
    30: 45,
    60: 70,
    90: 100,
  },
  "Foot Massage": {
    30: 35,
    60: 50,
    90: 75,
  },
  "Twilight Special Combo": {
    30: 55,
    60: 80,
    90: 120,
  },
  "Thai Massage": {
    30: 45,
    60: 65,
    90: 95,
  },
  "Lymphatic Drainage Massage": {
    30: 50,
    60: 75,
    90: 110,
  },
  "Swedish Massage (Couple)": {
    30: 40,
    60: 60,
    90: 90,
  },
  "Deep Tissue Massage (Couple)": {
    30: 45,
    60: 70,
    90: 100,
  },
}

export function calculateIncome(
  type: MassageType,
  duration: Duration,
  discount: number,
  addOns: Addon[],
  tip: number
): number {
  // Get base price from mapping
  const basePrice = BASE_PRICES[type][duration]

  // If price is undefined, return 0 or handle error
  if (basePrice === undefined) {
    console.warn(`No price defined for ${type} ${duration}min`)
    return 0
  }

  // Calculate add-ons (each add-on is $3)
  const addOnsTotal = addOns.length * 3

  // Calculate total before discount
  const subtotal = basePrice + addOnsTotal

  // Apply discount
  const discountAmount = (subtotal * discount) / 100
  const discountedTotal = subtotal - discountAmount

  // Add tip
  const total = discountedTotal + tip

  return total
}

export const STAFFS: Staff[] = [
  "Vivian Zhang",
  "Sarah Jin",
  "Yoyo Lu",
  "Daisy L",
  "Anna",
]
