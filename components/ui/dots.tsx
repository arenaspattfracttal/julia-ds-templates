"use client"

import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface DotsProps {
  /** Número total de puntos */
  count:          number
  /** Índice activo (0-based) */
  active:         number
  /** Callback al hacer click en un punto */
  onDotClick?:    (index: number) => void
  /** Tamaño de los puntos */
  size?:          "sm" | "default" | "lg"
  /**
   * Envuelve los puntos en un contenedor con fondo blanco (bg-background),
   * radio completo (rounded-full) y padding de 8 px (p-2).
   * Útil para mostrarlos sobre fondos oscuros o imágenes.
   */
  withContainer?: boolean
  className?:     string
}

// ─── Componente ───────────────────────────────────────────────────────────────

const SIZE = {
  sm:      { dot: "h-1",   active: "w-3",   inactive: "w-1"   },
  default: { dot: "h-1.5", active: "w-4",   inactive: "w-1.5" },
  lg:      { dot: "h-2",   active: "w-5",   inactive: "w-2"   },
}

function Dots({
  count,
  active,
  onDotClick,
  size          = "default",
  withContainer = false,
  className,
}: DotsProps) {
  const s = SIZE[size]

  const dotElements = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      role={onDotClick ? "button" : undefined}
      tabIndex={onDotClick ? 0 : undefined}
      aria-label={onDotClick ? `Ir a página ${i + 1}` : undefined}
      aria-current={i === active ? "true" : undefined}
      onClick={onDotClick ? () => onDotClick(i) : undefined}
      onKeyDown={onDotClick ? (e) => e.key === "Enter" && onDotClick(i) : undefined}
      className={cn(
        "rounded-full transition-all duration-300",
        s.dot,
        i === active
          ? cn(s.active,   "bg-primary")
          : cn(s.inactive, "bg-foreground/20"),
        onDotClick && "cursor-pointer hover:bg-foreground/40",
      )}
    />
  ))

  if (withContainer) {
    return (
      <div
        data-slot="dots"
        className={cn("flex items-center justify-center", className)}
      >
        <div className="inline-flex items-center justify-center gap-1.5 bg-background rounded-full p-2 shadow-sm">
          {dotElements}
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="dots"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      {dotElements}
    </div>
  )
}

export { Dots }
export type { DotsProps }
