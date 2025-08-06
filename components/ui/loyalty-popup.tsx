"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function LoyaltyPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 延迟2秒后显示弹窗
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 h-[60vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:h-[50vh] sm:max-w-lg">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-600 backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* iframe */}
        <iframe
          src="https://squareup.com/customer-programs/enroll/7TELhRRXD9Qc?utm_medium=copied-link&utm_source=online"
          className="h-full w-full rounded-2xl"
          title="Twilight Massage Loyalty Program"
          allow="camera; microphone; geolocation"
          style={{
            transform: "scale(0.7)",
            transformOrigin: "top left",
            width: "142.86%", // 补偿缩放 (100/0.7)
            height: "142.86%",
          }}
        />
      </div>
    </div>
  )
}
