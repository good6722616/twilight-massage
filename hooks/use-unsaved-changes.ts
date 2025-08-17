"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean
  onBeforeUnload?: () => void
  onBeforeRouteChange?: () => void
}

export function useUnsavedChanges({
  hasUnsavedChanges,
  onBeforeUnload,
  onBeforeRouteChange,
}: UseUnsavedChangesOptions) {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  )
  const originalPush = useRef(router.push)
  const originalBack = useRef(router.back)

  // 处理浏览器刷新/关闭
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
        onBeforeUnload?.()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges, onBeforeUnload])

  // 拦截路由导航
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const handleRouteChange = (url: string) => {
      setPendingNavigation(url)
      setShowDialog(true)
      return false // 阻止默认导航
    }

    // 重写 router.push 和 router.back
    router.push = (url: string) => {
      if (hasUnsavedChanges) {
        handleRouteChange(url)
        return
      }
      originalPush.current(url)
    }

    router.back = () => {
      if (hasUnsavedChanges) {
        handleRouteChange("back")
        return
      }
      originalBack.current()
    }

    return () => {
      // 恢复原始方法
      router.push = originalPush.current
      router.back = originalBack.current
    }
  }, [hasUnsavedChanges, router])

  const handleConfirmNavigation = () => {
    setShowDialog(false)
    if (pendingNavigation && pendingNavigation !== "back") {
      originalPush.current(pendingNavigation)
    } else if (pendingNavigation === "back") {
      originalBack.current()
    }
    setPendingNavigation(null)
    onBeforeRouteChange?.()
  }

  const handleCancelNavigation = () => {
    setShowDialog(false)
    setPendingNavigation(null)
  }

  return {
    showDialog,
    setShowDialog,
    handleConfirmNavigation,
    handleCancelNavigation,
  }
}
