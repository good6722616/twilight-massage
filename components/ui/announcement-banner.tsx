"use client"

import { X } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

export type AnnouncementBannerProps = {
  children: React.ReactNode
  /** Tailwind classes for the bar: background, text color, borders, etc. */
  className?: string
  /** Tailwind classes for the text block (size, weight, tracking). */
  contentClassName?: string
}

export default function AnnouncementBanner({
  children,
  className,
  contentClassName,
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    // Outer clip: contains box-shadow / subpixel overflow so the bar never widens the page.
    <div className="w-full min-w-0 max-w-full overflow-x-clip">
      <div
        role="status"
        className={cn(
          "box-border grid w-full min-w-0 max-w-full grid-cols-1 items-center border-b py-4 md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-3 md:min-h-[4rem] md:py-5",
          className
        )}
      >
        <div
          className={cn(
            "min-w-0 max-w-full whitespace-normal px-3 text-center [overflow-wrap:anywhere] md:px-6 md:pr-4",
            "[&_p]:m-0 [&_p]:max-w-full [&_p]:whitespace-normal [&_p]:break-words",
            "[&_strong]:font-semibold",
            contentClassName
          )}
        >
          {children}
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="hidden h-11 w-11 shrink-0 items-center justify-center self-center rounded-md text-current transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:mr-3 md:flex"
          aria-label="Close announcement"
        >
          <X className="h-7 w-7 shrink-0" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  )
}
