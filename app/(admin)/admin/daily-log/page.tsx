"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { DailyLogForm } from "@/components/admin/daily-log/DailyLogForm"
import { DailyLogTable } from "@/components/admin/daily-log/DailyLogTable"
import { DailyLogSummary } from "@/components/admin/daily-log/DailyLogSummary"
import { MassageRecord } from "@/lib/types/massage"
import { getTodaysDailyLogs } from "@/services/dailyLogService"
import { H1, H2 } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export default function DailyLogPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [sheetOpen, setSheetOpen] = useState(false)

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
            id: `temp-${Date.now()}`,
            created_at: new Date().toISOString(),
            user_id: "",
            ...newRecord,
          }
          return [optimisticRecord, ...old]
        }
      )

      // Return a context object with the snapshotted value
      return { previousRecords }
    },
    onError: (err, newRecord, context) => {
      if (context?.previousRecords) {
        queryClient.setQueryData(
          ["dailyLogs", "today"],
          context.previousRecords
        )
      }
      console.error("Error adding record:", err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogs", "today"] })
    },
    onSuccess: () => {
      setTimeout(() => {
        addRecordMutation.reset()
      }, 3000)
      setSheetOpen(false)
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
      await queryClient.cancelQueries({ queryKey: ["dailyLogs", "today"] })
      const previousRecords = queryClient.getQueryData(["dailyLogs", "today"])
      queryClient.setQueryData(
        ["dailyLogs", "today"],
        (old: MassageRecord[] = []) =>
          old.filter((record) => record.id !== recordId)
      )
      return { previousRecords }
    },
    onError: (err, recordId, context) => {
      if (context?.previousRecords) {
        queryClient.setQueryData(
          ["dailyLogs", "today"],
          context.previousRecords
        )
      }
      console.error("Error deleting record:", err)
    },
    onSettled: () => {
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
        <H1 className="mb-8 text-3xl font-bold text-gray-900">Daily Log</H1>
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
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <DailyLogSummary records={records} />
      </div>
      <div className="mb-6 flex items-center gap-4">
        <H2 className="text-3xl text-gray-900">Daily Log</H2>
        <Button
          onClick={() => setSheetOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-red-600 text-base text-white hover:from-orange-600 hover:to-red-700 sm:text-lg"
        >
          Add Record
        </Button>
      </div>

      <DailyLogTable
        records={records}
        onDelete={handleDeleteRecord}
        isUpdating={addRecordMutation.isPending || isLoading}
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full p-8 sm:max-w-xl sm:p-6">
          <SheetHeader>
            <SheetTitle>Add Daily Log</SheetTitle>
          </SheetHeader>
          <DailyLogForm
            onSubmit={handleAddRecord}
            isSubmitting={addRecordMutation.isPending}
            isSuccess={addRecordMutation.isSuccess}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
