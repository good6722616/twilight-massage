"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { DailyLogForm } from "@/components/admin/daily-log/DailyLogForm"
import { EditLogForm } from "@/components/admin/daily-log/EditLogForm"
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
import { RefreshCw } from "lucide-react"

export default function DailyLogPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<MassageRecord | null>(null)

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
      queryClient.invalidateQueries({ queryKey: ["dailyLogs"] }) // Invalidate dashboard queries
    },
  })

  // Mutation to update a record
  const updateRecordMutation = useMutation({
    mutationFn: async ({
      id,
      record,
    }: {
      id: string
      record: Omit<MassageRecord, "id" | "created_at" | "user_id">
    }) => {
      const response = await fetch(`/api/daily-log?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update record")
      }

      return response.json()
    },
    onMutate: async ({ id, record }) => {
      await queryClient.cancelQueries({ queryKey: ["dailyLogs", "today"] })
      const previousRecords = queryClient.getQueryData(["dailyLogs", "today"])
      queryClient.setQueryData(
        ["dailyLogs", "today"],
        (old: MassageRecord[] = []) =>
          old.map((r) =>
            r.id === id
              ? {
                  ...r,
                  ...record,
                }
              : r
          )
      )
      return { previousRecords }
    },
    onError: (err, variables, context) => {
      if (context?.previousRecords) {
        queryClient.setQueryData(
          ["dailyLogs", "today"],
          context.previousRecords
        )
      }
      console.error("Error updating record:", err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogs", "today"] })
    },
    onSuccess: () => {
      setTimeout(() => {
        updateRecordMutation.reset()
      }, 3000)
      setEditingRecord(null)
      setSheetOpen(false)
      queryClient.invalidateQueries({ queryKey: ["dailyLogs"] }) // Invalidate dashboard queries
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

  const handleUpdateRecord = (
    record: Omit<MassageRecord, "id" | "created_at" | "user_id">
  ) => {
    if (editingRecord) {
      updateRecordMutation.mutate({ id: editingRecord.id, record })
    }
  }

  const handleEditRecord = (record: MassageRecord) => {
    setEditingRecord(record)
    setSheetOpen(true)
  }

  const handleCancelEdit = () => {
    setEditingRecord(null)
    setSheetOpen(false)
  }

  const handleDeleteRecord = async (recordId: string) => {
    return deleteRecordMutation.mutateAsync(recordId)
  }

  const handleAddClick = () => {
    setEditingRecord(null)
    setSheetOpen(true)
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
    <div className="mx-auto px-2 py-2">
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <DailyLogSummary records={records} />
      </div>
      <div className="mb-6 flex items-center gap-4">
        <H2 className="text-3xl text-gray-900">Daily Log</H2>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["dailyLogs", "today"] })
          }
          className="ml-2"
          aria-label="Refresh"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-5 w-5 transition-transform ${isLoading ? "animate-spin" : ""}`}
          />
        </Button>
        <Button
          onClick={handleAddClick}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-red-600 text-base text-white hover:from-orange-600 hover:to-red-700 sm:text-lg"
        >
          Add Record
        </Button>
      </div>

      <DailyLogTable
        records={records}
        onDelete={handleDeleteRecord}
        onEdit={handleEditRecord}
        isUpdating={
          addRecordMutation.isPending ||
          updateRecordMutation.isPending ||
          isLoading
        }
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full p-0 sm:max-w-xl">
          <div className="flex h-full max-h-screen flex-col">
            <SheetHeader className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
              <SheetTitle>
                {editingRecord ? "Edit Daily Log" : "Add Daily Log"}
              </SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              {editingRecord ? (
                <EditLogForm
                  record={editingRecord}
                  onSubmit={handleUpdateRecord}
                  onCancel={handleCancelEdit}
                  isSubmitting={updateRecordMutation.isPending}
                  isSuccess={updateRecordMutation.isSuccess}
                />
              ) : (
                <DailyLogForm
                  onSubmit={handleAddRecord}
                  isSubmitting={addRecordMutation.isPending}
                  isSuccess={addRecordMutation.isSuccess}
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
