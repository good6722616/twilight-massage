export interface MassageRecord {
  id: string
  date: string
  staff: string
  type: MassageType
  duration: Duration
  discount: number
  addOns: Addon[]
  tip: number
  income: number
  timestamp: string
}

export type MassageType =
  | "Abdominal Detox Massage"
  | "Chest Care Massage"
  | "Couple Massage"
  | "Deep Tissue Massage"
  | "Foot Massage"
  | "Full Core Detox Massage"
  | "Head-to-Toe Reset"
  | "Lymphatic Drainage Massage"
  | "Swedish Massage"
  | "Thai Massage"
  | "Twilight Special Combo"
export type Duration = 30 | 60 | 90 | 120
export type Addon = "Body Scrub" | "CBD Oil" | "Essential Oil" | "Hot Stone"
export type Staff =
  | "Vivian Zhang"
  | "Sarah Jin"
  | "Yoyo Lu"
  | "Daisy L"
  | "Anna"

export const MASSAGE_TYPES: MassageType[] = [
  "Abdominal Detox Massage",
  "Chest Care Massage",
  "Couple Massage",
  "Deep Tissue Massage",
  "Foot Massage",
  "Full Core Detox Massage",
  "Head-to-Toe Reset",
  "Lymphatic Drainage Massage",
  "Swedish Massage",
  "Thai Massage",
  "Twilight Special Combo",
]

export const DURATIONS: Duration[] = [30, 60, 90, 120]

export const ADDONS: { name: Addon; price: number }[] = [
  { name: "Body Scrub", price: 3 },
  { name: "CBD Oil", price: 3 },
  { name: "Essential Oil", price: 3 },
  { name: "Hot Stone", price: 3 },
]

export const DISCOUNTS = [0, 10, 15, 20]

export const BASE_PRICES: Record<MassageType, Record<Duration, number>> = {
  "Abdominal Detox Massage": {
    30: 60,
    60: 100,
    90: 140,
    120: 180,
  },
  "Chest Care Massage": {
    30: 60,
    60: 100,
    90: 140,
    120: 180,
  },
  "Couple Massage": {
    30: 120,
    60: 200,
    90: 280,
    120: 360,
  },
  "Deep Tissue Massage": {
    30: 70,
    60: 110,
    90: 150,
    120: 190,
  },
  "Foot Massage": {
    30: 50,
    60: 90,
    90: 130,
    120: 170,
  },
  "Full Core Detox Massage": {
    30: 70,
    60: 120,
    90: 170,
    120: 220,
  },
  "Head-to-Toe Reset": {
    30: 65,
    60: 110,
    90: 155,
    120: 200,
  },
  "Lymphatic Drainage Massage": {
    30: 65,
    60: 110,
    90: 155,
    120: 200,
  },
  "Swedish Massage": {
    30: 60,
    60: 100,
    90: 140,
    120: 180,
  },
  "Thai Massage": {
    30: 65,
    60: 110,
    90: 155,
    120: 200,
  },
  "Twilight Special Combo": {
    30: 80,
    60: 130,
    90: 180,
    120: 230,
  },
}

export const calculateIncome = (
  type: MassageType,
  duration: Duration,
  discount: number,
  addOns: Addon[],
  tip: number
): number => {
  const basePrice = BASE_PRICES[type][duration]
  const discountAmount = (basePrice * discount) / 100
  const addOnsTotal = addOns.reduce((sum, addon) => {
    const addonPrice = ADDONS.find((a) => a.name === addon)?.price || 0
    return sum + addonPrice
  }, 0)

  return basePrice - discountAmount + addOnsTotal + tip
}

export const STAFFS: Staff[] = [
  "Vivian Zhang",
  "Sarah Jin",
  "Yoyo Lu",
  "Daisy L",
  "Anna",
]
