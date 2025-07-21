import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Gift, CreditCard, Wallet, Ticket } from "lucide-react"
import React from "react"

interface DashboardStatsProps {
  totalClients: number
  totalRevenue: number
  totalStaffPays: number
  totalTips: number
  giftCardStats?: {
    totalCards: number // Number of gift cards issued
    totalValue: number // Total face value of all gift cards
    totalSold: number // Total revenue from gift card sales
  }
  paymentBreakdown?: {
    cash: number
    credit_card: number
    giftcard: number
  }
}

export function DashboardStats({
  totalClients,
  totalRevenue,
  totalStaffPays,
  totalTips,
  giftCardStats,
  paymentBreakdown,
}: DashboardStatsProps) {
  const totalStaffEarnings = totalStaffPays + totalTips
  const netProfit = totalRevenue - totalStaffPays

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 1. Financial Overview Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <DollarSign className="h-5 w-5 text-green-600" /> Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Revenue */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Revenue</span>
            <span className="text-2xl font-bold text-green-700">
              ${totalRevenue.toFixed(2)}
            </span>
          </div>
          {/* Staff Earnings */}
          <div className="space-y-1 border-t border-gray-100 pt-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Staff Earnings</span>
              <span className="font-semibold text-gray-700">
                ${totalStaffEarnings.toFixed(2)}
              </span>
            </div>
            <div className="ml-3 flex items-center justify-between text-xs text-gray-500">
              <span>• Base Pay</span>
              <span>${totalStaffPays.toFixed(2)}</span>
            </div>
            <div className="ml-3 flex items-center justify-between text-xs text-gray-500">
              <span>• Tips</span>
              <span>${totalTips.toFixed(2)}</span>
            </div>
          </div>
          {/* Net Profit */}
          <div className="space-y-1 border-t border-gray-100 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Net Profit
              </span>
              <span className="text-xl font-bold text-blue-700">
                ${netProfit.toFixed(2)}
              </span>
            </div>
          </div>
          {/* Note */}
          <div className="pt-2">
            <span className="block text-xs text-muted-foreground">
              Includes services paid with gift cards. Gift card sales not
              included.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Payment Breakdown Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <CreditCard className="h-5 w-5 text-gray-500" /> Payment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span className="flex items-center gap-1">
              <Wallet className="h-4 w-4 text-gray-400" />
              Cash
            </span>
            <span className="font-semibold">
              ${paymentBreakdown?.cash?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span className="flex items-center gap-1">
              <CreditCard className="h-4 w-4 text-gray-400" />
              Credit Card
            </span>
            <span className="font-semibold">
              ${paymentBreakdown?.credit_card?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span className="flex items-center gap-1">
              <Ticket className="h-4 w-4 text-gray-400" />
              Gift Card Used
            </span>
            <span className="font-semibold">
              ${paymentBreakdown?.giftcard?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          <div className="pt-2">
            <span className="block text-xs text-muted-foreground">
              These values sum to total revenue.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Gift Cards Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <Gift className="h-5 w-5 text-indigo-500" /> Gift Cards (Sold Today)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>Cards Issued</span>
            <span className="font-semibold text-indigo-700">
              {giftCardStats?.totalCards ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>Total Face Value</span>
            <span className="font-semibold">
              ${giftCardStats?.totalValue?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>Revenue (sold price)</span>
            <span className="font-semibold text-emerald-700">
              ${giftCardStats?.totalSold?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          <div className="pt-2">
            <span className="block text-xs text-muted-foreground">
              These sales are <b>not</b> included in today's revenue.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
