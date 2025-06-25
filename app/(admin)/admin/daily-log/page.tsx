"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { DailyLogForm } from "@/components/admin/daily-log/DailyLogForm"
import { DailyLogTable } from "@/components/admin/daily-log/DailyLogTable"
import { DailyLogSummary } from "@/components/admin/daily-log/DailyLogSummary"
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
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
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
    onMutate: async (newRecord) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["dailyLogs", "today"] })

      // Snapshot the previous value
      const previousRecords = queryClient.getQueryData(["dailyLogs", "today"])

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["dailyLogs", "today"],
        (old: MassageRecord[] = []) => {
          const optimisticRecord: MassageRecord = {
            id: `temp-${Date.now()}`, // Temporary ID
            created_at: new Date().toISOString(),
            user_id: "", // Will be filled by server
            ...newRecord,
          }
          return [optimisticRecord, ...old]
        }
      )

      // Return a context object with the snapshotted value
      return { previousRecords }
    },
    onError: (err, newRecord, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousRecords) {
        queryClient.setQueryData(
          ["dailyLogs", "today"],
          context.previousRecords
        )
      }
      console.error("Error adding record:", err)
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["dailyLogs", "today"] })
    },
    onSuccess: () => {
      // Reset mutation state after success animation (3 seconds)
      setTimeout(() => {
        addRecordMutation.reset()
      }, 3000)
    },
  })

  // Mutation to delete a record
  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const response = await fetch(`/api/daily-log?id=${recordId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete record")
      }

      return response.json()
    },
    onMutate: async (recordId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["dailyLogs", "today"] })

      // Snapshot the previous value
      const previousRecords = queryClient.getQueryData(["dailyLogs", "today"])

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["dailyLogs", "today"],
        (old: MassageRecord[] = []) =>
          old.filter((record) => record.id !== recordId)
      )

      // Return a context object with the snapshotted value
      return { previousRecords }
    },
    onError: (err, recordId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousRecords) {
        queryClient.setQueryData(
          ["dailyLogs", "today"],
          context.previousRecords
        )
      }
      console.error("Error deleting record:", err)
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["dailyLogs", "today"] })
    },
  })

  const handleAddRecord = (
    record: Omit<MassageRecord, "id" | "created_at" | "user_id">
  ) => {
    addRecordMutation.mutate(record)
  }

  const handleDeleteRecord = async (recordId: string) => {
    return deleteRecordMutation.mutateAsync(recordId)
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
        <div className="mb-4">
          <DailyLogSummary records={records} />
        </div>

        <DailyLogTable
          records={records}
          onDelete={handleDeleteRecord}
          isUpdating={addRecordMutation.isPending || isLoading}
        />
      </div>
    </div>
  )
}
