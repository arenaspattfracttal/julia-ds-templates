"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  scrollbarSize = "thin",
  viewportRef,
  horizontal = false,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  /** Grosor de la barra de scroll: "default" (10px) | "thin" (6px, minimalista) */
  scrollbarSize?: "default" | "thin"
  /** Ref al elemento viewport (el div que hace scroll) para scroll programático */
  viewportRef?: React.Ref<HTMLDivElement>
  /** Habilita la barra de scroll horizontal además de la vertical */
  horizontal?: boolean
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      type="hover"
      scrollHideDelay={0}
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar scrollbarSize={scrollbarSize} />
      {horizontal && <ScrollBar scrollbarSize={scrollbarSize} orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  scrollbarSize = "thin",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
  scrollbarSize?: "default" | "thin"
}) {
  const isThin = scrollbarSize === "thin"
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none",
        orientation === "vertical" && [
          "h-full py-1",
          isThin ? "w-1.5" : "w-2.5",
        ],
        orientation === "horizontal" && [
          "flex-col px-1",
          isThin ? "h-1.5" : "h-2.5",
        ],
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative flex-1 rounded-full",
          isThin ? "bg-foreground/30" : "bg-foreground/45"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
