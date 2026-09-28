"use client"

import { type ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin/ui/alert-dialog"
import { Spinner } from "@/components/admin/ui/spinner"

// ─── Types ────────────────────────────────────────────────────────────────────

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string | ReactNode
  /** Label on the confirm button (shown when not loading) */
  confirmLabel?: string
  /** Label on the cancel button */
  cancelLabel?: string
  /** Variant — destructive shows a solid red confirm button with white text */
  variant?: "default" | "destructive"
  /** While true the confirm button shows a spinner and is disabled */
  isLoading?: boolean
  onConfirm: () => void
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              variant === "destructive"
                ? "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/40 disabled:opacity-70"
                : undefined
            }
          >
            {isLoading ? (
              <>
                <Spinner className="mr-1.5 size-3.5" />
                {confirmLabel}
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
