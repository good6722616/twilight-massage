import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Gift } from "lucide-react"
import React from "react"
import { P } from "@/components/ui/typography"

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
}

export function DashboardStats({
  totalClients,
  totalRevenue,
  totalStaffPays,
  totalTips,
  giftCardStats,
}: DashboardStatsProps) {
  const totalStaffEarnings = totalStaffPays + totalTips
  const netProfit = totalRevenue - totalStaffPays

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <P className="text-xs text-muted-foreground">Total records</P>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Financial Overview
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Revenue Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Revenue:
                </span>
                <span className="text-lg font-bold text-green-600">
                  ${totalRevenue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Staff Earnings Section */}
            <div className="space-y-1 border-t border-gray-100 pt-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Staff Earnings:</span>
                <span className="font-medium">
                  ${totalStaffEarnings.toFixed(2)}
                </span>
              </div>
              <div className="ml-3 flex items-center justify-between text-xs text-gray-500">
                <span>• Base Pay:</span>
                <span>${totalStaffPays.toFixed(2)}</span>
              </div>
              <div className="ml-3 flex items-center justify-between text-xs text-gray-500">
                <span>• Tips:</span>
                <span>${totalTips.toFixed(2)}</span>
              </div>
            </div>

            {/* Net Profit Section */}
            <div className="space-y-1 border-t border-gray-100 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Net Profit:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  ${netProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {giftCardStats && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gift Cards</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Cards Count Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Cards Issued:
                  </span>
                  <span className="text-xl font-bold text-indigo-600">
                    {giftCardStats.totalCards}
                  </span>
                </div>
              </div>

              {/* Face Value Section */}
              <div className="space-y-1 border-t border-gray-100 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Face Value:</span>
                  <span className="font-medium text-gray-700">
                    ${(Number(giftCardStats.totalValue) || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Revenue Section */}
              <div className="space-y-1 border-t border-gray-100 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Revenue:
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    ${(Number(giftCardStats.totalSold) || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
