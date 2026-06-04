"use client"

import { cn } from "@/lib/utils"

type Mask = "none" | "horizontal" | "radial"

const MASKS: Record<Mask, string | undefined> = {
  none: undefined,
  horizontal: "linear-gradient(to right, black 0%, transparent 22%, transparent 78%, black 100%)",
  radial: "radial-gradient(ellipse at center, transparent 30%, black 80%)",
}

export function dotPatternStyle(
  mode: "light" | "dark",
  strength = 0.08,
  mask: Mask = "none",
): React.CSSProperties {
  const color = mode === "dark" ? `rgba(255,255,255,${strength})` : `rgba(0,0,0,${strength})`
  const maskImage = MASKS[mask]
  return {
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: "14px 14px",
    maskImage,
    WebkitMaskImage: maskImage,
  }
}

export function DotPattern({
  mode,
  mask = "none",
  strength = 0.08,
  className,
}: {
  mode: "light" | "dark"
  mask?: Mask
  strength?: number
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
      style={dotPatternStyle(mode, strength, mask)}
    />
  )
}
