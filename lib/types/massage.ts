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
  { name: "Hot Stone", price: 10 },
  { name: "Essential Oil", price: 10 },
  { name: "Body Scrub", price: 15 },
  { name: "CBD Oil", price: 15 },
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

export const SERVICE_PRICES: Record<MassageType, Record<Duration, number>> = {
  "Swedish Massage": {
    30: 45,
    60: 80,
    90: 120,
  },
  "Deep Tissue Massage": {
    30: 50,
    60: 90,
    90: 135,
  },
  "Foot Massage": {
    30: 45,
    60: 65,
    90: 95,
  },
  "Twilight Special Combo": {
    30: 60,
    60: 110,
    90: 120,
  },
  "Thai Massage": {
    30: 60,
    60: 100,
    90: 150,
  },
  "Lymphatic Drainage Massage": {
    30: 60,
    60: 120,
    90: 180,
  },
  "Chest Care Massage": {
    30: 60,
    60: 100,
    90: 140,
  },
  "Abdominal Detox Massage": {
    30: 60,
    60: 100,
    90: 140,
  },
  "Full Core Detox Massage": {
    30: 80,
    60: 120,
    90: 160,
  },
  "Head-to-Toe Reset": {
    30: 60,
    60: 90,
    90: 130,
  },
  "Swedish Massage (Couple)": {
    30: 45,
    60: 80,
    90: 120,
  },
  "Deep Tissue Massage (Couple)": {
    30: 50,
    60: 90,
    90: 135,
  },
}

export function calculateStaffIncome(
  type: MassageType,
  duration: Duration,
  addOns: Addon[],
  tip: number
): number {
  // Get base staff income from mapping
  const baseStaffIncome = STAFF_SERVICE_INCOME[type][duration]

  // If base income is undefined, return 0 or handle error
  if (baseStaffIncome === undefined) {
    console.warn(`No base income defined for ${type} ${duration}min`)
    return 0
  }

  // Calculate staff's addon income ($3 per addon)
  const addonIncome = addOns.length * 3

  // Total staff income is base income + addon income + full tip
  const totalStaffIncome = baseStaffIncome + addonIncome + tip

  return totalStaffIncome
}

export function calculateStoreIncome(records: MassageRecord[]): number {
  return records.reduce((sum, record) => {
    // Get full service price from SERVICE_PRICES
    const baseServicePrice =
      SERVICE_PRICES[record.service_name as MassageType][
        record.duration as Duration
      ]

    // Calculate full price before discount
    const priceBeforeDiscount = baseServicePrice

    // Apply discount to service price
    const discountAmount = (priceBeforeDiscount * record.discount) / 100
    const servicePriceAfterDiscount = priceBeforeDiscount - discountAmount

    // Add full addon prices (addons are not discounted)
    const addOnsTotal = record.add_ons.reduce((addonSum, addon) => {
      const addonPrice = ADDONS.find((a) => a.name === addon)?.price || 0
      return addonSum + addonPrice
    }, 0)

    // Total store income for this record = discounted service price + full addon prices
    const totalForRecord = servicePriceAfterDiscount + addOnsTotal

    return sum + totalForRecord
  }, 0)
}

export const STAFFS: Staff[] = [
  "Vivian Zhang",
  "Sarah Jin",
  "Yoyo Lu",
  "Daisy L",
  "Anna",
]
