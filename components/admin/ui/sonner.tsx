"use client"

import * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"

const Toaster = ({ theme = "light", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      position="top-right"
      richColors={false}
      closeButton
      className="toaster group font-sans"
      icons={{
        success: (
          <CircleCheckIcon
            className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        ),
        info: (
          <InfoIcon
            className="h-4 w-4 text-blue-500 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        ),
        warning: (
          <TriangleAlertIcon
            className="h-4 w-4 text-amber-500 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        ),
        error: (
          <OctagonXIcon
            className="h-4 w-4 text-destructive shrink-0 mt-0.5"
            aria-hidden="true"
          />
        ),
        loading: (
          <Loader2Icon
            className="h-4 w-4 animate-spin text-muted-foreground shrink-0 mt-0.5"
            aria-hidden="true"
          />
        ),
      }}
      toastOptions={{
        style: {
          background: "var(--popover, #ffffff)",
          color: "var(--popover-foreground, #09090b)",
          border: "1px solid var(--border, #e4e4e7)",
          borderRadius: "0.75rem",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)",
          padding: "0.875rem 1rem",
        },
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:font-sans",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-xs leading-relaxed mt-0.5",
          title:
            "group-[.toast]:text-sm group-[.toast]:font-semibold leading-tight group-[.toast]:text-popover-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-medium group-[.toast]:text-xs group-[.toast]:rounded-md group-[.toast]:px-2.5 group-[.toast]:py-1.5",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:rounded-md group-[.toast]:px-2.5 group-[.toast]:py-1.5",
          closeButton:
            "!bg-popover !border-border !text-muted-foreground hover:!text-foreground !border !rounded-md !transition-colors",
          success:
            "group-[.toaster]:!bg-popover group-[.toaster]:!text-popover-foreground group-[.toaster]:!border-border",
          error:
            "group-[.toaster]:!bg-popover group-[.toaster]:!text-popover-foreground group-[.toaster]:!border-border",
          warning:
            "group-[.toaster]:!bg-popover group-[.toaster]:!text-popover-foreground group-[.toaster]:!border-border",
          info:
            "group-[.toaster]:!bg-popover group-[.toaster]:!text-popover-foreground group-[.toaster]:!border-border",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
