"use client"

import { type Staff } from "@/services/staffService"
import { StaffCard } from "./StaffCard"
import { Spinner } from "@/components/ui/loading"

interface StaffListProps {
  staffList?: Staff[]
  isLoading: boolean
  onUpdate: (id: string, data: { name: string; is_active: boolean }) => void
  onDelete: (staff: Staff) => void
}

export function StaffList({
  staffList,
  isLoading,
  onUpdate,
  onDelete,
}: StaffListProps) {
  // 如果正在加载或者还没有数据，显示 loading spinner
  if (isLoading || !staffList) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner size="large" />
      </div>
    )
  }

  // 数据加载完成后，显示内容，带有渐进式动画
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {staffList.map((staff: Staff, index: number) => (
        <div
          key={staff.id}
          className="animate-in fade-in-0 slide-in-from-bottom-4"
          style={{
            animationDelay: `${index * 50}ms`, // 减少延迟时间
            animationDuration: "400ms", // 减少动画时间
            animationFillMode: "both",
            animationTimingFunction: "ease-out",
          }}
        >
          <StaffCard staff={staff} onUpdate={onUpdate} onDelete={onDelete} />
        </div>
      ))}
    </div>
  )
}
