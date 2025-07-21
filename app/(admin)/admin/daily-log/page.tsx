"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { DailyLogForm } from "@/components/admin/daily-log/DailyLogForm"
import { EditLogForm } from "@/components/admin/daily-log/EditLogForm"
import { GiftCardForm } from "@/components/admin/daily-log/GiftCardForm"
import { DailyLogTable } from "@/components/admin/daily-log/DailyLogTable"
import { GiftCardTable } from "@/components/admin/daily-log/GiftCardTable"
import { DailyLogSummary } from "@/components/admin/daily-log/DailyLogSummary"
import { MassageRecord } from "@/lib/types/massage"
import {
  GiftCardRecord,
  getTodaysGiftCardRecords,
} from "@/services/giftCardService"
import { getTodaysDailyLogs } from "@/services/dailyLogService"
import { H1, H2 } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { RefreshCw } from "lucide-react"

export default function DailyLogPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [giftCardSheetOpen, setGiftCardSheetOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<MassageRecord | null>(null)
  const [editingGiftCard, setEditingGiftCard] = useState<GiftCardRecord | null>(
    null
  )
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Query to fetch today's massage records
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

  // Query to fetch today's gift card records
  const {
    data: giftCardRecords = [],
    isLoading: isLoadingGiftCards,
    error: giftCardError,
    isError: isGiftCardError,
  } = useQuery({
    queryKey: ["giftCards", "today"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return getTodaysGiftCardRecords(token)
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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

  // Mutation to add a gift card record
  const addGiftCardMutation = useMutation({
    mutationFn: async (record: {
      date: string
      amount: number
      sold_price: number
      payment_method: "cash" | "credit_card"
      notes?: string
    }) => {
      const response = await fetch("/api/gift-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to add gift card record")
      }

      return response.json()
    },
    onSuccess: () => {
      setTimeout(() => {
        addGiftCardMutation.reset()
      }, 3000)
      setGiftCardSheetOpen(false)
      toast.success("Gift card record added!")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["giftCards", "today"] })
    },
  })

  // Mutation to update a gift card record
  const updateGiftCardMutation = useMutation({
    mutationFn: async ({
      id,
      record,
    }: {
      id: string
      record: {
        date: string
        amount: number
        sold_price: number
        payment_method: "cash" | "credit_card"
        notes?: string
      }
    }) => {
      const response = await fetch(`/api/gift-card?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update gift card record")
      }

      return response.json()
    },
    onSuccess: () => {
      setTimeout(() => {
        updateGiftCardMutation.reset()
      }, 3000)
      setEditingGiftCard(null)
      setGiftCardSheetOpen(false)
      toast.success("Gift card record updated!")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["giftCards", "today"] })
    },
  })

  // Mutation to delete a gift card record
  const deleteGiftCardMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const response = await fetch(`/api/gift-card?id=${recordId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete gift card record")
      }

      return response.json()
    },
    onMutate: async (recordId) => {
      await queryClient.cancelQueries({ queryKey: ["giftCards", "today"] })
      const previousRecords = queryClient.getQueryData(["giftCards", "today"])
      queryClient.setQueryData(
        ["giftCards", "today"],
        (old: GiftCardRecord[] = []) =>
          old.filter((record) => record.id !== recordId)
      )
      return { previousRecords }
    },
    onError: (err, recordId, context) => {
      if (context?.previousRecords) {
        queryClient.setQueryData(
          ["giftCards", "today"],
          context.previousRecords
        )
      }
      console.error("Error deleting gift card record:", err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["giftCards", "today"] })
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

  const handleAddGiftCard = (record: {
    date: string
    amount: number
    sold_price: number
    payment_method: "cash" | "credit_card"
    notes?: string
  }) => {
    addGiftCardMutation.mutate(record)
  }

  const handleGiftCardClick = () => {
    setEditingGiftCard(null)
    setGiftCardSheetOpen(true)
  }

  const handleUpdateGiftCard = (record: {
    date: string
    amount: number
    sold_price: number
    payment_method: "cash" | "credit_card"
    notes?: string
  }) => {
    if (editingGiftCard) {
      updateGiftCardMutation.mutate({ id: editingGiftCard.id, record })
    }
  }

  const handleEditGiftCard = (record: GiftCardRecord) => {
    setEditingGiftCard(record)
    setGiftCardSheetOpen(true)
  }

  const handleCancelGiftCardEdit = () => {
    setEditingGiftCard(null)
    setGiftCardSheetOpen(false)
  }

  const handleDeleteGiftCard = async (recordId: string) => {
    return deleteGiftCardMutation.mutateAsync(recordId)
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
      <div className="mb-6 space-y-4">
        {/* Title and Refresh Button Row */}
        <div className="flex items-center gap-2">
          <H2 className="text-2xl text-gray-900 sm:text-3xl">Daily Log</H2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={async () => {
                    setIsRefreshing(true)
                    try {
                      await Promise.all([
                        queryClient.invalidateQueries({
                          queryKey: ["dailyLogs", "today"],
                        }),
                        queryClient.invalidateQueries({
                          queryKey: ["giftCards", "today"],
                        }),
                      ])
                    } finally {
                      setIsRefreshing(false)
                    }
                  }}
                  aria-label="Refresh"
                  disabled={isLoading || isLoadingGiftCards || isRefreshing}
                >
                  <RefreshCw
                    className={`h-5 w-5 transition-transform ${isLoading || isLoadingGiftCards || isRefreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>获取最新资料</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Button
            onClick={handleAddClick}
            size="lg"
            className="rounded-md border border-blue-200 bg-blue-50 text-base text-blue-700 hover:bg-blue-100 sm:text-lg"
          >
            Add Record
          </Button>
          <Button
            onClick={handleGiftCardClick}
            size="lg"
            className="rounded-md border border-blue-200 bg-blue-50 text-base text-blue-700 hover:bg-blue-100 sm:text-lg"
          >
            Add Gift Card
          </Button>
        </div>
      </div>

      <Tabs defaultValue="massage" className="w-full">
        <div className="flex flex-col">
          <TabsList className="inline-flex h-12 items-center justify-center space-x-6 bg-transparent p-0 text-muted-foreground">
            <TabsTrigger
              value="massage"
              className="group flex items-center justify-center space-x-2 rounded-none border-b-2 border-l-0 border-r-0 border-t-0 border-transparent bg-transparent px-4 py-2 text-base font-medium text-gray-500 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:bg-clip-text data-[state=active]:text-transparent"
            >
              <span>Massage Records</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-xs font-medium text-gray-600 group-data-[state=active]:border-orange-500 group-data-[state=active]:text-orange-600">
                {records?.length || 0}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="giftcards"
              className="group flex items-center justify-center space-x-2 rounded-none border-b-2 border-l-0 border-r-0 border-t-0 border-transparent bg-transparent px-4 py-2 text-base font-medium text-gray-500 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:bg-clip-text data-[state=active]:text-transparent"
            >
              <span>Gift Cards</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-xs font-medium text-gray-600 group-data-[state=active]:border-orange-500 group-data-[state=active]:text-orange-600">
                {giftCardRecords?.length || 0}
              </span>
            </TabsTrigger>
          </TabsList>
          <div className="border-b border-gray-200"></div>
        </div>

        <TabsContent value="massage" className="mt-6">
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
        </TabsContent>

        <TabsContent value="giftcards" className="mt-6">
          <GiftCardTable
            records={giftCardRecords}
            onDelete={handleDeleteGiftCard}
            onEdit={handleEditGiftCard}
            isUpdating={
              addGiftCardMutation.isPending ||
              updateGiftCardMutation.isPending ||
              deleteGiftCardMutation.isPending ||
              isLoadingGiftCards
            }
          />
        </TabsContent>
      </Tabs>

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

      <Sheet open={giftCardSheetOpen} onOpenChange={setGiftCardSheetOpen}>
        <SheetContent side="right" className="w-full p-0 sm:max-w-xl">
          <div className="flex h-full max-h-screen flex-col">
            <SheetHeader className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
              <SheetTitle>
                {editingGiftCard ? "Edit Gift Card" : "Add Gift Card Sale"}
              </SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              {editingGiftCard ? (
                <GiftCardForm
                  onSubmit={handleUpdateGiftCard}
                  isSubmitting={updateGiftCardMutation.isPending}
                  isSuccess={updateGiftCardMutation.isSuccess}
                  editingRecord={editingGiftCard}
                />
              ) : (
                <GiftCardForm
                  onSubmit={handleAddGiftCard}
                  isSubmitting={addGiftCardMutation.isPending}
                  isSuccess={addGiftCardMutation.isSuccess}
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
