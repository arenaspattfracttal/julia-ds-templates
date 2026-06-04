"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info:    <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error:   <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--border-radius":  "var(--radius)",
          "--normal-bg":      "var(--popover)",
          "--normal-border":  "var(--border)",
          "--normal-text":    "var(--popover-foreground)",
          "--success-bg":     "var(--popover)",
          "--success-border": "var(--border)",
          "--success-text":   "var(--success)",
          "--error-bg":       "var(--popover)",
          "--error-border":   "var(--border)",
          "--error-text":     "var(--destructive)",
          "--warning-bg":     "var(--popover)",
          "--warning-border": "var(--border)",
          "--warning-text":   "var(--warning)",
          "--info-bg":        "var(--popover)",
          "--info-border":    "var(--border)",
          "--info-text":      "var(--info)",
        } as React.CSSProperties
      }
      toastOptions={{ classNames: { toast: "cn-toast" } }}
      {...props}
    />
  )
}

export { Toaster }
