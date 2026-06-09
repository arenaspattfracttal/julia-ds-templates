"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { type DialogSize } from "@/components/ui/dialog"

export interface ModalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  onSubmit: () => void
  submitLabel?: string
  cancelLabel?: string
  submitDisabled?: boolean
  size?: DialogSize
}

export function ModalForm({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  submitDisabled = false,
  size = "default",
}: ModalFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size={size}
        showCloseButton={false}
        animationVariant="slide-up"
        className={cn(
          // Mobile: fullscreen, flex column, sin padding ni gap propios
          "max-sm:fixed max-sm:inset-0 max-sm:top-0 max-sm:left-0",
          "max-sm:translate-x-0 max-sm:translate-y-0",
          "max-sm:max-w-none max-sm:w-full max-sm:h-full",
          "max-sm:rounded-none max-sm:flex max-sm:flex-col max-sm:gap-0 max-sm:p-0",
        )}
      >

        {/* ── Header mobile: flecha + título ── */}
        <div className="sm:hidden flex items-start gap-2 px-6 pt-6 pb-0 shrink-0">
          <DialogClose asChild>
            <Button variant="ghost" size="icon-sm" className="-ml-2 shrink-0 mt-0.5 text-primary">
              <ChevronLeft className="size-5" />
            </Button>
          </DialogClose>
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-lg font-semibold leading-none">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </div>
        </div>

        {/* ── Header desktop: estándar con X ── */}
        <DialogHeader className="hidden sm:flex sm:flex-col sm:gap-2">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {/* ── Desktop: X button ── */}
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="max-sm:hidden absolute top-4 right-4"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
            </svg>
            <span className="sr-only">Cerrar</span>
          </Button>
        </DialogClose>

        {/* ── Contenido: scrollable en mobile ── */}
        <div className="max-sm:flex-1 max-sm:overflow-y-auto max-sm:px-6 max-sm:py-6">
          {children}
        </div>

        {/* ── Footer ── */}
        <DialogFooter
          className="max-sm:shrink-0 max-sm:border-t max-sm:border-border max-sm:px-6 max-sm:py-4 max-sm:flex-row max-sm:gap-2 [&>*]:max-sm:flex-1"
        >
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={submitDisabled}>
            {submitLabel}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
