"use client"

import { X } from "lucide-react"
import { useState } from "react"

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative z-10 w-full bg-gradient-to-r from-pink-500 to-yellow-500 p-3 text-center text-white">
      <p className="text-sm font-medium">
        🎉 Exciting news! Our new massage parlor is opening soon. Stay tuned for
        exclusive opening offers! 🎉
      </p>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 transform"
        aria-label="Close announcement"
      >
        <X size={18} />
      </button>
    </div>
  )
}
