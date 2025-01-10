"use client"

import { useState, useEffect } from "react"

export default function BookingWidget() {
  const [iframeHeight, setIframeHeight] = useState(600)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is from Square
      if (event.origin !== "https://square.site") return

      // Check if the message contains height information
      if (event.data && event.data.type === "SQUARE_APPOINTMENTS_RESIZE") {
        setIframeHeight(event.data.height)
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <div className="min-h-[1000px] w-full rounded-lg bg-white shadow-lg">
      <iframe
        src="https://square.site/appointments/buyer/widget/xe96ggmxltf5b6/L3RH0J52JYVYX"
        width="100%"
        height="1000px"
        className="h-[1000px] w-full"
        title="Square Booking Widget"
      />
    </div>
  )
}
