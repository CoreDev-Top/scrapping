"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const notificationVariants = cva(
  "fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900 border-gray-200",
        destructive: "bg-red-50 text-red-900 border-red-200",
        success: "bg-green-50 text-green-900 border-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string
  description?: string
  onClose?: () => void
}

export function Notification({
  className,
  variant,
  title,
  description,
  onClose,
  ...props
}: NotificationProps) {
  return (
    <div
      className={cn(notificationVariants({ variant }), className)}
      role="alert"
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          {title && (
            <h5 className="text-sm font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </div>
  )
} 