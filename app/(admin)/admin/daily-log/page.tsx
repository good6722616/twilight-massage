"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { DailyLogForm } from "@/components/admin/daily-log/DailyLogForm"
import { DailyLogTable } from "@/components/admin/daily-log/DailyLogTable"
import {
  PageSpinner,
  InlineSpinner,
  TableSkeleton,
} from "@/components/ui/loading"
import { MassageRecord } from "@/lib/types/massage"
import { getTodaysDailyLogs } from "@/services/dailyLogService"

export default function DailyLogPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  // Query to fetch today's records
  const {
    data: records = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["dailyLogs", "today"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return getTodaysDailyLogs(token)
    },
    enabled: true, // Always enabled since we're in a protected route
  })

  // Mutation to add a new record
  const addRecordMutation = useMutation({
    mutationFn: async (
      record: Omit<MassageRecord, "id" | "created_at" | "user_id">
    ) => {
      const response = await fetch("/api/daily-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to add record")
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch today's records
      queryClient.invalidateQueries({ queryKey: ["dailyLogs", "today"] })

      // Reset mutation state after success animation (3 seconds)
      setTimeout(() => {
        addRecordMutation.reset()
      }, 3000)
    },
    onError: (error) => {
      console.error("Error adding record:", error)
    },
  })

  const handleAddRecord = (
    record: Omit<MassageRecord, "id" | "created_at" | "user_id">
  ) => {
    addRecordMutation.mutate(record)
  }

  const handleDeleteRecord = (recordId: string) => {
    // TODO: Implement delete mutation if needed
    console.log("Delete record:", recordId)
  }

  // Error state
  if (isError) {
    return (
      <div className="mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Daily Log</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="font-medium text-red-800">Error loading records</h3>
          <p className="mt-1 text-sm text-red-600">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Daily Log</h1>

      {/* Form Section */}
      <DailyLogForm
        onSubmit={handleAddRecord}
        isSubmitting={addRecordMutation.isPending}
        isSuccess={addRecordMutation.isSuccess}
      />

      {/* Mutation Error Display */}
      {addRecordMutation.isError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Error adding record:{" "}
            {addRecordMutation.error instanceof Error
              ? addRecordMutation.error.message
              : "Unknown error"}
          </p>
        </div>
      )}

      {/* Table Section */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Today's Records ({records.length})
        </h2>

        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : records.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No records found for today. Add your first record above.
          </div>
        ) : (
          <DailyLogTable records={records} onDelete={handleDeleteRecord} />
        )}
      </div>
    </div>
  )
}
