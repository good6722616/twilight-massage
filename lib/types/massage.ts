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

export const MASSAGE_TYPES = [
  "Swedish Massage",
  "Deep Tissue Massage",
  "Foot Massage",
  "Twilight Special Combo",
  "Thai Massage",
  "Lymphatic Drainage Massage",
  "Chest Care Massage",
  "Abdominal Detox Massage",
  "Full Core Detox Massage",
  "Head-to-Toe Reset",
  "Swedish Massage (Couple)",
  "Deep Tissue Massage (Couple)",
] as const

export type MassageType = (typeof MASSAGE_TYPES)[number]

export type CoupleMassageSubtype = "Swedish Massage" | "Deep Tissue Massage"

export type Duration = 30 | 60 | 90
export type Addon = "Hot Stone" | "Essential Oil" | "Body Scrub" | "CBD Oil"

export type Staff =
  | "Vivian Zhang"
  | "Sarah Jin"
  | "Yoyo Lu"
  | "Daisy L"
  | "Anna"

export const DURATIONS: Duration[] = [30, 60, 90]

export const ADDONS: { name: Addon; price: number }[] = [
  { name: "Hot Stone", price: 3 },
  { name: "Essential Oil", price: 3 },
  { name: "Body Scrub", price: 3 },
  { name: "CBD Oil", price: 3 },
]

export const DISCOUNTS = [0, 5, 10, 15, 20] as const
export type Discount = (typeof DISCOUNTS)[number]

export const STAFF_SERVICE_INCOME: Record<
  MassageType,
  Record<Duration, number>
> = {
  "Swedish Massage": {
    30: 20,
    60: 45,
    90: 90,
  },
  "Deep Tissue Massage": {
    30: 20,
    60: 35,
    90: 50,
  },
  "Foot Massage": {
    30: 20,
    60: 30,
    90: 40,
  },
  "Twilight Special Combo": {
    30: 20,
    60: 32,
    90: 48,
  },
  "Thai Massage": {
    30: 20,
    60: 40,
    90: 60,
  },
  "Lymphatic Drainage Massage": {
    30: 20,
    60: 30,
    90: 40,
  },
  "Swedish Massage (Couple)": {
    30: 20,
    60: 30,
    90: 45,
  },
  "Deep Tissue Massage (Couple)": {
    30: 20,
    60: 35,
    90: 50,
  },
  "Chest Care Massage": {
    30: 20,
    60: 30,
    90: 40,
  },
  "Abdominal Detox Massage": {
    30: 20,
    60: 40,
    90: 60,
  },
  "Full Core Detox Massage": {
    30: 20,
    60: 40,
    90: 60,
  },
  "Head-to-Toe Reset": {
    30: 20,
    60: 30,
    90: 40,
  },
}

export function calculateIncome(
  type: MassageType,
  duration: Duration,
  discount: number,
  addOns: Addon[],
  tip: number
): number {
  // Get staff income from mapping
  const staffIncome = STAFF_SERVICE_INCOME[type][duration]

  // If price is undefined, return 0 or handle error
  if (staffIncome === undefined) {
    console.warn(`No price defined for ${type} ${duration}min`)
    return 0
  }

  // Calculate add-ons (each add-on is $3)
  const addOnsTotal = addOns.length * 3

  // Calculate total before discount
  const subtotal = staffIncome + addOnsTotal

  // Apply discount
  const discountAmount = (subtotal * discount) / 100
  const discountedTotal = subtotal - discountAmount

  // Add tip
  const total = discountedTotal + tip

  return total
}

export function calculateTotalIncome(records: MassageRecord[]): number {
  return records.reduce((sum, record) => {
    // Get staff income
    const staffIncome =
      STAFF_SERVICE_INCOME[record.service_name as MassageType][
        record.duration as Duration
      ]

    // Calculate add-ons total (each add-on is $3)
    const addOnsTotal = record.add_ons.length * 3

    // Calculate total before discount
    const subtotal = staffIncome + addOnsTotal

    // Apply discount
    const discountAmount = (subtotal * record.discount) / 100
    const discountedTotal = subtotal - discountAmount

    return sum + discountedTotal
  }, 0)
}

export const STAFFS: Staff[] = [
  "Vivian Zhang",
  "Sarah Jin",
  "Yoyo Lu",
  "Daisy L",
  "Anna",
]
