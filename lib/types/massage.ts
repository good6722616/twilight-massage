export interface MassageRecord {
  id: string
  created_at: string
  updated_at: string
  date: string
  time_slot: string
  staff: string
  service_name: string
  duration: number
  discount: number
  add_ons: string[]
  tip: number
  income: number
  payment_method: Record<string, number | null>
  user_id: string
}

export const MASSAGE_TYPES = [
  "Swedish Massage",
  "Deep Tissue Massage",
  "Foot Massage",
  "Twilight Special Combo (Swedish)",
  "Twilight Special Combo (Deep Tissue)",
  "Thai Massage",
  "Lymphatic Drainage Massage",
  "Chest Care Massage",
  "Abdominal Detox Massage",
  "Full Core Detox Massage",
  "Head-to-Toe Reset",
  "Swedish Massage (Couple)",
  "Deep Tissue Massage (Couple)",
  "Focus",
] as const

export type MassageType = (typeof MASSAGE_TYPES)[number]

export type Duration = 30 | 45 | 60 | 90
export type Addon = "Hot Stone" | "Essential Oil" | "Body Scrub" | "CBD Oil"

export const DURATIONS: Duration[] = [30, 45, 60, 90]

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
  Partial<Record<Duration, number>>
> = {
  "Swedish Massage": {
    30: 20,
    60: 30,
    90: 45,
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
  "Twilight Special Combo (Swedish)": {
    90: 42,
  },
  "Twilight Special Combo (Deep Tissue)": {
    90: 45,
  },
  "Thai Massage": {
    60: 40,
    90: 60,
  },
  "Lymphatic Drainage Massage": {
    30: 20,
    60: 30,
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
    30: 23,
    60: 40,
    90: 60,
  },
  "Abdominal Detox Massage": {
    30: 23,
    60: 40,
    90: 55,
  },
  "Full Core Detox Massage": {
    30: 23, // 30分钟 员工收入$23
    60: 40, // 60分钟 员工收入$40
  },
  "Head-to-Toe Reset": {
    60: 32,
    90: 48,
  },
  Focus: {
    30: 20,
    45: 30,
  },
}

export const SERVICE_PRICES: Record<
  MassageType,
  Partial<Record<Duration, number>>
> = {
  "Swedish Massage": {
    30: 50,
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
  "Twilight Special Combo (Swedish)": {
    90: 110,
  },
  "Twilight Special Combo (Deep Tissue)": {
    90: 120,
  },
  "Thai Massage": {
    60: 100,
    90: 150,
  },
  "Lymphatic Drainage Massage": {
    30: 60,
    60: 120,
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
    30: 60,
    60: 120,
  },
  "Head-to-Toe Reset": {
    60: 90,
    90: 130,
  },
  "Swedish Massage (Couple)": {
    60: 80,
    90: 120,
  },
  "Deep Tissue Massage (Couple)": {
    60: 90,
    90: 135,
  },
  Focus: {
    30: 55,
    45: 75,
  },
}

export function calculateStaffIncome(
  type: MassageType,
  duration: Duration,
  addOns: Addon[],
  serviceStaffIncomes?: Record<string, Record<number, number>>
): number {
  let baseStaffIncome = 0

  if (serviceStaffIncomes && serviceStaffIncomes[type]) {
    // Use dynamic staff income if provided
    baseStaffIncome = serviceStaffIncomes[type][duration] ?? 0
  } else {
    // Fallback to hardcoded staff income for backward compatibility
    baseStaffIncome = STAFF_SERVICE_INCOME[type]?.[duration] ?? 0
  }

  // Only non-CBD Oil add-ons give $3 to staff
  const addonIncome = addOns.filter((a) => a !== "CBD Oil").length * 3

  // Total staff income is base income + addon income (NO tip, NO discount)
  const totalStaffIncome = baseStaffIncome + addonIncome

  return totalStaffIncome
}

export function calculateStoreIncome(
  records: MassageRecord[],
  servicePrices?: Record<string, Record<number, number>>
): number {
  return records.reduce((sum, record) => {
    let baseServicePrice: number | undefined

    if (servicePrices && servicePrices[record.service_name]) {
      // Use dynamic service prices if provided
      baseServicePrice = servicePrices[record.service_name][record.duration]
    } else {
      // Fallback to hardcoded prices for backward compatibility
      baseServicePrice =
        SERVICE_PRICES[record.service_name as MassageType]?.[
          record.duration as Duration
        ]
    }

    // If the price is undefined, skip this record
    if (baseServicePrice === undefined) {
      return sum
    }

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

export type PaymentMethod = "cash" | "credit_card" | "giftcard" | "custom"

export const PAYMENT_METHODS: PaymentMethod[] = [
  "cash",
  "credit_card",
  "giftcard",
  "custom",
]
