"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[6px] text-muted-foreground group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line:    "gap-1 bg-transparent rounded-none",
        white:   "bg-background border border-border",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = React.useState({
    left: 0, top: 0, width: 0, height: 0, ready: false,
  })

  React.useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    function update() {
      // Usamos aria-selected (no data-state): cuando un TabsTrigger se envuelve
      // en un Tooltip, el data-state del tooltip ("closed") pisa el de Tabs
      // ("active"). aria-selected lo setea Radix Tabs y el tooltip no lo toca.
      const active = list!.querySelector('[aria-selected="true"]') as HTMLElement | null
      if (!active) return

      if (variant === "default" || variant === "white") {
        const root = list!.closest("[data-slot='tabs']") as HTMLElement | null
        const isVertical = root?.dataset.orientation === "vertical"
        const style = getComputedStyle(list!)
        const pt = parseFloat(style.paddingTop)
        const pb = parseFloat(style.paddingBottom)
        const pl = parseFloat(style.paddingLeft)
        const pr = parseFloat(style.paddingRight)

        if (isVertical) {
          setIndicator({
            left:   pl,
            top:    active.offsetTop,
            width:  list!.offsetWidth - pl - pr,
            height: active.offsetHeight,
            ready:  true,
          })
        } else {
          setIndicator({
            left:   active.offsetLeft,
            top:    pt,
            width:  active.offsetWidth,
            height: list!.offsetHeight - pt - pb,
            ready:  true,
          })
        }
      } else if (variant === "line") {
        // Detecta orientación leyendo el data-orientation del root
        const root = list!.closest("[data-slot='tabs']") as HTMLElement | null
        const isVertical = root?.dataset.orientation === "vertical"

        if (isVertical) {
          setIndicator({
            left:   active.offsetLeft + active.offsetWidth + 4,
            top:    active.offsetTop,
            width:  2,
            height: active.offsetHeight,
            ready:  true,
          })
        } else {
          setIndicator({
            left:   active.offsetLeft,
            top:    active.offsetTop + active.offsetHeight - 2,
            width:  active.offsetWidth,
            height: 2,
            ready:  true,
          })
        }
      }
    }

    // Observa el list y cada trigger. observeAll es idempotente, así que se
    // re-llama cuando los triggers se re-montan: al alternar entre texto y
    // solo-ícono, el TabsTrigger pasa a envolverse en un Tooltip y React
    // reemplaza el nodo del botón — el RO observaba el botón viejo (ya removido)
    // y el indicador quedaba con el ancho anterior.
    const ro = new ResizeObserver(update)
    function observeAll() {
      ro.observe(list!)
      list!.querySelectorAll('[data-slot="tabs-trigger"]').forEach((t) => ro.observe(t))
    }
    observeAll()

    // Medición inicial síncrona (corre tras el layout en useLayoutEffect).
    update()

    // childList: detecta el re-montaje de triggers (texto ↔ ícono) y re-observa
    // los nodos nuevos. aria-selected: re-mide al cambiar de pestaña.
    const mo = new MutationObserver(() => { observeAll(); update() })
    mo.observe(list, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected"] })

    return () => { mo.disconnect(); ro.disconnect() }
  }, [variant])

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      data-variant={variant}

      className={cn(tabsListVariants({ variant }), "relative", className)}
      {...props}
    >
      {/* Indicador deslizante — variante default */}
      {variant === "default" && indicator.ready && (
        <span
          aria-hidden
          className="absolute rounded-md bg-background shadow-sm pointer-events-none transition-[left,top,width,height] duration-200 ease-out dark:border dark:border-input dark:bg-input/30"
          style={{
            left:   indicator.left,
            top:    indicator.top,
            width:  indicator.width,
            height: indicator.height,
          }}
        />
      )}

      {/* Indicador deslizante — variante white (cuadrito azul suave) */}
      {variant === "white" && indicator.ready && (
        <span
          aria-hidden
          className="absolute rounded-md bg-primary/10 pointer-events-none transition-[left,top,width,height] duration-200 ease-out"
          style={{
            left:   indicator.left,
            top:    indicator.top,
            width:  indicator.width,
            height: indicator.height,
          }}
        />
      )}

      {/* Indicador deslizante — variante line */}
      {variant === "line" && indicator.ready && (
        <span
          aria-hidden
          className="absolute bg-foreground pointer-events-none rounded-full transition-[left,top,width,height] duration-200 ease-out"
          style={{
            left:   indicator.left,
            top:    indicator.top,
            width:  indicator.width,
            height: indicator.height,
          }}
        />
      )}

      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  badge,
  tooltip,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /** Número de notificaciones que se muestra como bolita sobre el trigger */
  badge?: number | string
  /** Tooltip que aparece al hacer hover — recomendado cuando el trigger muestra solo ícono */
  tooltip?: string
}) {
  const trigger = (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center rounded-md border border-transparent font-medium whitespace-nowrap transition-colors",
        // en vertical el height debe ser automático (no relativo al padre h-fit)
        "group-data-[orientation=vertical]/tabs:h-auto group-data-[orientation=vertical]/tabs:flex-none",
        // tamaño default
        "gap-1.5 px-1.5 py-2 text-sm",
        "text-foreground/60 hover:text-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
        "aria-selected:text-foreground group-data-[variant=white]/tabs-list:aria-selected:text-primary",
        "dark:text-muted-foreground dark:hover:text-foreground dark:aria-selected:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {badge != null && (
        <Badge size="sm" className="absolute -top-1 -right-1 z-20">
          {badge}
        </Badge>
      )}
    </TabsPrimitive.Trigger>
  )

  if (!tooltip) return trigger
  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
