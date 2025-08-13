"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Staff } from "@/services/staffService"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  staff: Staff | null
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({
  isOpen,
  staff,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除员工</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            确定要删除员工{" "}
            <span className="font-medium text-foreground">
              &ldquo;{staff?.name}&rdquo;
            </span>{" "}
            吗？
          </p>
          <p className="text-xs text-muted-foreground">
            此操作无法撤销，员工的所有信息将被永久删除。
          </p>
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="flex-1"
            >
              确认删除
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
