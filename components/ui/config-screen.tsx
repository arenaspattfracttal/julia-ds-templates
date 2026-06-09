"use client"

import { useEffect, useState, useRef } from "react"
import { Portal } from "radix-ui"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── MarqueeText — una línea, anima si desborda (Web Animations API) ──────────

function MarqueeText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef      = useRef<HTMLSpanElement>(null)
  const leftRef      = useRef<HTMLDivElement>(null)
  const rightRef     = useRef<HTMLDivElement>(null)
  const [shift, setShift] = useState(0)

  useEffect(() => {
    const c = containerRef.current, t = textRef.current
    if (!c || !t) return
    const measure = () => setShift(Math.max(0, t.scrollWidth - c.clientWidth))
    measure()
    const obs = new ResizeObserver(measure)
    obs.observe(c)
    return () => obs.disconnect()
  }, [text])

  useEffect(() => {
    const t = textRef.current
    if (!t || shift <= 0) return
    const dur = Math.max(7000, (shift / 16) * 1000)
    const e = "ease-in-out"
    const anims: Animation[] = []
    anims.push(t.animate([
      { transform: "translateX(0)", offset: 0, easing: e },
      { transform: "translateX(0)", offset: 0.30, easing: e },
      { transform: `translateX(-${shift}px)`, offset: 0.55, easing: e },
      { transform: `translateX(-${shift}px)`, offset: 0.70, easing: e },
      { transform: "translateX(0)", offset: 0.90, easing: e },
      { transform: "translateX(0)", offset: 1 },
    ], { duration: dur, iterations: Infinity }))
    if (leftRef.current) anims.push(leftRef.current.animate([
      { opacity: 0, offset: 0 }, { opacity: 0, offset: 0.30 },
      { opacity: 1, offset: 0.44 }, { opacity: 1, offset: 0.70 },
      { opacity: 0, offset: 0.90 }, { opacity: 0, offset: 1 },
    ], { duration: dur, iterations: Infinity }))
    if (rightRef.current) anims.push(rightRef.current.animate([
      { opacity: 1, offset: 0 }, { opacity: 1, offset: 0.30 },
      { opacity: 0, offset: 0.44 }, { opacity: 0, offset: 0.70 },
      { opacity: 1, offset: 0.90 }, { opacity: 1, offset: 1 },
    ], { duration: dur, iterations: Infinity }))
    return () => anims.forEach(a => a.cancel())
  }, [shift])

  const fade: React.CSSProperties = { position: "absolute", top: 0, height: "100%", width: "28px", pointerEvents: "none", zIndex: 1 }
  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 relative">
      <span ref={textRef} className={className} style={{ display: "inline-block", whiteSpace: "nowrap" }}>{text}</span>
      {shift > 0 && (
        <>
          <div ref={leftRef}  style={{ ...fade, left: 0, opacity: 0, background: "linear-gradient(to right, var(--popover), transparent)" }} />
          <div ref={rightRef} style={{ ...fade, right: 0, background: "linear-gradient(to left, var(--popover), transparent)" }} />
        </>
      )}
    </div>
  )
}

// ─── ConfigScreen ─────────────────────────────────────────────────────────────

export interface ConfigScreenProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  onSubmit: () => void
  submitLabel?: string
  cancelLabel?: string
  submitDisabled?: boolean
}

export function ConfigScreen({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  submitDisabled = false,
}: ConfigScreenProps) {

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <Portal.Root>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-overlay/10 supports-backdrop-filter:backdrop-blur-xs animate-in fade-in-0 duration-100"
        onClick={() => onOpenChange(false)}
      />

      {/* Panel */}
      <div className={[
        // Mobile: fullscreen
        "fixed inset-0 z-50 flex flex-col bg-popover text-sm text-popover-foreground",
        "animate-in fade-in-0 slide-in-from-bottom-6 duration-200",
        // Desktop: panel centrado 50vw
        "md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
        "md:w-[50vw] md:max-w-[50vw] md:min-h-[40vh] md:max-h-[70vh] md:overflow-hidden",
        "md:rounded-xl md:ring-1 md:ring-foreground/10 md:shadow-xl",
      ].join(" ")}>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 shrink-0">
          {/* Mobile: back arrow */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <ChevronLeft className="size-5" />
          </Button>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <MarqueeText text={title} className="font-semibold text-base leading-snug" />
            {description && (
              <MarqueeText text={description} className="text-sm text-muted-foreground" />
            )}
          </div>

          {/* Desktop: X */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden md:flex shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Body scrollable */}
        <div className="flex-auto min-h-0 overflow-y-auto px-6 pb-6
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-foreground/20
          [&:hover::-webkit-scrollbar-thumb]:bg-foreground/30">
          {children}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-5 flex flex-row gap-2 md:justify-end border-t border-border">
          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            className="flex-1 md:flex-none"
            disabled={submitDisabled}
            onClick={onSubmit}
          >
            {submitLabel}
          </Button>
        </div>

      </div>
    </Portal.Root>
  )
}
