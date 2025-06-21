import React from "react"
import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"

const spinnerVariants = cva("flex-col items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
  },
  defaultVariants: {
    show: true,
  },
})

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      small: "size-6",
      medium: "size-8",
      large: "size-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
})

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string
  children?: React.ReactNode
}

export function Spinner({
  size,
  show,
  children,
  className,
}: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({ show })}>
      <Loader2 className={cn(loaderVariants({ size }), className)} />
      {children}
    </span>
  )
}

// Convenience components for common patterns
export function PageSpinner({
  children = "Loading...",
}: {
  children?: React.ReactNode
}) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner size="large">{children}</Spinner>
    </div>
  )
}

export function InlineSpinner({ children }: { children?: React.ReactNode }) {
  return <Spinner size="small">{children}</Spinner>
}

export function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
        </div>
      ))}
    </div>
  )
}
