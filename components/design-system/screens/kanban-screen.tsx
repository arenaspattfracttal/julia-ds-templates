"use client"

import { useState, useEffect, useRef } from "react"
import { RefreshCw, ListFilter, Columns3, CalendarDays, ListChecks, Layers, Smartphone, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { Dots } from "@/components/ui/dots"
import { OTCardSingle, OTCardMulti, OTCardTareaSinTomar } from "./kanban-card-ot"
import { TAREAS_PENDIENTES, INIT_PROCESO, INIT_REVISION, INIT_FINALIZADA } from "./kanban-screen-data"
import type { DraggableEntry } from "./kanban-screen-data"
import { translations, type Translation } from "../i18n"
import { useViewer } from "../viewer-context"
import { cn } from "@/lib/utils"

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type KanbanTab = "kanban" | "calendario" | "tareas" | "ordenes"
const TABS: { id: KanbanTab; labelKey: keyof Translation["kanban"]; icon: React.ElementType }[] = [
  { id: "kanban",     labelKey: "tabKanban",       icon: Columns3     },
  { id: "calendario", labelKey: "tabCalendar",     icon: CalendarDays },
  { id: "tareas",     labelKey: "tabPendingTasks", icon: ListChecks   },
  { id: "ordenes",    labelKey: "tabWorkOrders",   icon: Layers       },
]

// ─── Fondo del tablero ────────────────────────────────────────────────────────
const BOARD_BG = "color-mix(in srgb, var(--primary) 8%, var(--background))"

// Imagen transparente de 1×1 para ocultar el ghost nativo del navegador
const TRANSPARENT_IMG = (() => {
  if (typeof window === "undefined") return undefined
  const img = new Image()
  img.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII="
  return img
})()

// ─── Tipos de lógica de tablero ───────────────────────────────────────────────
type ColKey = "proceso" | "revision" | "finalizada"
type DropTarget = { col: ColKey; index: number }
type DragPos = { x: number; y: number; w: number; offsetX: number; offsetY: number }

// ─── Indicador de posición de drop ───────────────────────────────────────────
function DropIndicator() {
  return (
    <div
      className="flex items-center shrink-0 pointer-events-none h-[2px] -my-0.5 mx-1 rounded-full"
      style={{
        backgroundColor: "var(--primary)",
        animation: "kanban-drop-pulse 1s ease-in-out infinite",
      }}
    />
  )
}

// ─── Tarjeta auxiliar (sin estado de drag) ────────────────────────────────────
// Se usa tanto en columnas como en el ghost flotante
function CardContent({ entry }: { entry: DraggableEntry }) {
  return entry.type === "single" ? (
    <OTCardSingle className="w-full" progress={entry.progress} initialFlagged={false} {...entry.data} />
  ) : (
    <OTCardMulti className="w-full" progress={entry.progress} initialFlagged={false} {...entry.data} />
  )
}

// ─── Acento → variable CSS ────────────────────────────────────────────────────
const ACCENT_VAR: Record<string, string> = {
  "bg-primary":          "var(--primary)",
  "bg-warning":          "var(--warning)",
  "bg-success":          "var(--success)",
  "bg-muted-foreground": "var(--muted-foreground)",
}

// ─── Columna Kanban ───────────────────────────────────────────────────────────
function KanbanColumn({
  title, count, accentCls, children, className,
  isDropTarget = false,
  onDragOver, onDragLeave, onDrop,
}: {
  title: string; count: number; accentCls: string; children: React.ReactNode
  className?: string
  isDropTarget?: boolean
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
}) {
  const accentVar = ACCENT_VAR[accentCls] ?? "var(--border)"

  return (
    <div
      className={cn("relative flex flex-1 min-w-0 rounded-t-[8px] border border-border/50", className)}
    >
      {/* Contenido: overflow-hidden separado del wrapper del borde */}
      <div
        className="flex flex-col w-full overflow-hidden rounded-t-[7px]"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* Overlay drop target */}
        {isDropTarget && (
          <div
            className="absolute inset-0 rounded-t-[7px] pointer-events-none z-10"
            style={{
              boxShadow: "inset 0 2px 0 0 var(--primary), inset 2px 0 0 0 var(--primary), inset -2px 0 0 0 var(--primary)",
              animation: "kanban-drop-pulse 1s ease-in-out infinite",
            }}
          />
        )}

        <div className="flex items-center justify-between px-3 pt-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-1 h-5 rounded-full shrink-0 ${accentCls}`} />
            <span className="text-base font-semibold text-foreground">{title}</span>
            <Badge variant="secondary" className="tabular-nums text-xs font-medium px-1.5">
              {count.toLocaleString()}
            </Badge>
          </div>
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
            <RefreshCw className="size-3.5" />
          </Button>
        </div>
        <ScrollArea className="scroll-block-viewport flex-1 min-h-0 min-w-0" scrollbarSize="thin">
          <div className="flex flex-col gap-2 px-2 py-2">
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

// ─── useKanbanDrag ────────────────────────────────────────────────────────────
// Encapsula todo el estado y lógica de drag-and-drop del tablero Kanban.

export function useKanbanDrag(initialColumns: Record<ColKey, DraggableEntry[]>) {
  const [columns,     setColumns]     = useState<Record<ColKey, DraggableEntry[]>>(initialColumns)
  const [dragging,    setDragging]    = useState<{ id: string; from: ColKey } | null>(null)
  const [dropTarget,  setDropTarget]  = useState<DropTarget | null>(null)
  const [dragPos,     setDragPos]     = useState<DragPos | null>(null)
  const [justDropped, setJustDropped] = useState<string | null>(null)

  // Safety net: si onDragEnd no dispara (ej. el elemento fue movido en el DOM),
  // el listener de documento garantiza que el estado se limpie siempre.
  useEffect(() => {
    if (!dragging) return
    const clear = () => { setDragging(null); setDropTarget(null); setDragPos(null) }
    document.addEventListener("dragend", clear)
    return () => document.removeEventListener("dragend", clear)
  }, [dragging])

  const draggingEntry = dragging
    ? (columns.proceso.find(c => c.id === dragging.id) ??
       columns.revision.find(c => c.id === dragging.id) ??
       columns.finalizada.find(c => c.id === dragging.id))
    : undefined

  function moveCard(id: string, from: ColKey, to: ColKey, toIndex: number) {
    setColumns(prev => {
      const card = prev[from].find(c => c.id === id)
      if (!card) return prev
      if (from === to) {
        const arr = [...prev[from]]
        const fromIdx = arr.findIndex(c => c.id === id)
        arr.splice(fromIdx, 1)
        arr.splice(toIndex > fromIdx ? toIndex - 1 : toIndex, 0, card)
        return { ...prev, [from]: arr }
      }
      const fromArr = prev[from].filter(c => c.id !== id)
      const toArr   = [...prev[to]]
      toArr.splice(Math.min(toIndex, toArr.length), 0, card)
      return { ...prev, [from]: fromArr, [to]: toArr }
    })
  }

  function makeDropHandlers(colKey: ColKey) {
    return {
      onDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        const draggables = [...e.currentTarget.querySelectorAll<HTMLElement>("[draggable='true']")]
        let index = columns[colKey].length
        if (draggables.length > 0) {
          const firstRect = draggables[0].getBoundingClientRect()
          if (e.clientY <= firstRect.top + firstRect.height / 2) index = 0
        }
        setDropTarget({ col: colKey, index })
        setDragPos(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
      },
      onDragLeave(e: React.DragEvent<HTMLDivElement>) {
        const related = e.relatedTarget as Node | null
        if (!related || !e.currentTarget.contains(related)) setDropTarget(null)
      },
      onDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        if (dragging && dropTarget) {
          moveCard(dragging.id, dragging.from, dropTarget.col, dropTarget.index)
          const id = dragging.id
          setJustDropped(id)
          setTimeout(() => setJustDropped(prev => prev === id ? null : prev), 400)
        }
        setDragging(null); setDropTarget(null); setDragPos(null)
      },
    }
  }

  function renderColumnCards(entries: DraggableEntry[], colKey: ColKey, draggable = true) {
    const nodes: React.ReactNode[] = []
    for (let i = 0; i <= entries.length; i++) {
      if (dragging && dropTarget?.col === colKey && dropTarget.index === i) {
        const fromIdx = dragging.from === colKey ? entries.findIndex(c => c.id === dragging.id) : -1
        const adjacent = fromIdx !== -1 && (i === fromIdx || i === fromIdx + 1)
        if (!adjacent) nodes.push(<DropIndicator key={`ind-${colKey}-${i}`} />)
      }
      if (i >= entries.length) continue
      const entry     = entries[i]
      const isSource  = dragging?.id === entry.id
      const isLanding = entry.id === justDropped
      nodes.push(
        <div
          key={entry.id}
          draggable={draggable}
          onDragStart={!draggable ? undefined : (e) => {
            if (TRANSPARENT_IMG) e.dataTransfer.setDragImage(TRANSPARENT_IMG, 0, 0)
            e.dataTransfer.effectAllowed = "move"
            const rect = e.currentTarget.getBoundingClientRect()
            setDragPos({ x: e.clientX, y: e.clientY, w: rect.width, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top })
            setDragging({ id: entry.id, from: colKey })
          }}
          onDragEnd={!draggable ? undefined : () => { setDragging(null); setDropTarget(null); setDragPos(null) }}
          onDragOver={!draggable ? undefined : (e) => {
            e.preventDefault()
            e.stopPropagation()
            const rect = e.currentTarget.getBoundingClientRect()
            setDropTarget({ col: colKey, index: e.clientY < rect.top + rect.height / 2 ? i : i + 1 })
            setDragPos(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
          }}
          className={[
            draggable ? "cursor-grab active:cursor-grabbing" : "",
            "select-none",
            isSource  ? "opacity-30 scale-[0.98] transition-all duration-150" : "",
            isLanding ? "[animation:card-enter_280ms_ease-out_both]" : "",
          ].join(" ")}
        >
          <CardContent entry={entry} />
        </div>
      )
    }
    return nodes
  }

  return { columns, dragging, dropTarget, dragPos, draggingEntry, moveCard, makeDropHandlers, renderColumnCards }
}

// ─── Pantalla Kanban ──────────────────────────────────────────────────────────
type ViewMode = "desktop" | "tablet" | "mobile"

const DS_BREAKPOINTS = { desktop: 1024, tablet: 768, mobile: 390 }

export function KanbanScreen() {
  const t = translations[useViewer().lang]
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoViewMode, setAutoViewMode] = useState<ViewMode>("desktop")
  const [activeTab,    setActiveTab]    = useState<KanbanTab>("kanban")
  const [colIndex,     setColIndex]     = useState(0)
  const [swipeStartX,  setSwipeStartX]  = useState<number | null>(null)

  // Auto-detecta breakpoint con ResizeObserver
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w >= DS_BREAKPOINTS.desktop)     setAutoViewMode("desktop")
      else if (w >= DS_BREAKPOINTS.tablet) setAutoViewMode("tablet")
      else                                 setAutoViewMode("mobile")
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Resetea el índice al cambiar de modo
  useEffect(() => { setColIndex(0) }, [autoViewMode])

  const viewMode = autoViewMode

  const { columns, dragging, dropTarget, dragPos, draggingEntry, makeDropHandlers, renderColumnCards } = useKanbanDrag({
    proceso: INIT_PROCESO, revision: INIT_REVISION, finalizada: INIT_FINALIZADA,
  })

  const otColumns: { key: ColKey; title: string; count: number; accentCls: string }[] = [
    { key: "proceso",    title: t.kanban.colInProcess, count: 247,  accentCls: "bg-primary" },
    { key: "revision",   title: t.kanban.colInReview,  count: 83,   accentCls: "bg-warning" },
    { key: "finalizada", title: t.kanban.colDone,      count: 1204, accentCls: "bg-success" },
  ]

  return (
    <div ref={containerRef} className="h-full flex flex-col gap-2 overflow-hidden bg-muted">

      {/* ── Topbar ── */}
      {viewMode === "mobile"
        ? <TopbarBarMobile title="Órdenes de trabajo" subtitle="Vista Kanban" />
        : <TopbarBar />
      }

      {/* ── Toolbar ── */}
      <div className="px-2 shrink-0">
        <div className="bg-background border rounded-lg flex items-center justify-between p-3">
          <ToggleGroup
            type="single" variant="outline" size="sm" spacing={0}
            value={activeTab}
            onValueChange={v => v && setActiveTab(v as KanbanTab)}
          >
            {TABS.map(({ id, labelKey, icon: Icon }) => (
              <ToggleGroupItem key={id} value={id}>
                <Icon className="size-4" />
                {viewMode === "desktop" && t.kanban[labelKey]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Button variant="ghost" size="icon-sm">
            <ListFilter className="size-4" />
          </Button>
        </div>
      </div>

      {/* ── Vista desktop ── */}
      {viewMode === "desktop" && (
        <div className="flex-1 min-h-0 flex gap-2 px-2 overflow-hidden">
          <KanbanColumn title={t.kanban.colPending} count={14675} accentCls="bg-muted-foreground">
            {TAREAS_PENDIENTES.map(d => (
              <OTCardTareaSinTomar key={d.requestNumber} className="w-full" {...d} />
            ))}
          </KanbanColumn>

          {otColumns.map(({ key, title, count, accentCls }) => (
            <KanbanColumn
              key={key} title={title} count={count} accentCls={accentCls}
              isDropTarget={dragging !== null && dragging.from !== key && dropTarget?.col === key}
              {...makeDropHandlers(key)}
            >
              {renderColumnCards(columns[key], key)}
            </KanbanColumn>
          ))}
        </div>
      )}

      {/* ── Vista tablet: 2 columnas por página, carrusel de 2 páginas ── */}
      {viewMode === "tablet" && (
        <div
          className="flex-1 min-h-0 overflow-hidden relative select-none"
          style={{ touchAction: "pan-y" }}
          onPointerDown={(e) => setSwipeStartX(e.clientX)}
          onPointerUp={(e) => {
            if (swipeStartX === null) return
            const delta = e.clientX - swipeStartX
            if (delta < -40) setColIndex(i => Math.min(i + 1, 1))
            if (delta >  40) setColIndex(i => Math.max(i - 1, 0))
            setSwipeStartX(null)
          }}
        >
          {/* Track: 200% de ancho, translada 50% por página */}
          <div
            className="flex h-full"
            style={{
              width: "200%",
              transform: colIndex === 0 ? "translateX(0%)" : "translateX(-50%)",
              transition: "transform 300ms ease-in-out",
            }}
          >
            {/* Página 0: Pending + En Proceso */}
            <div
              className="h-full"
              style={{ width: "50%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 8px 8px" }}
            >
              <KanbanColumn title={t.kanban.colPending} count={14675} accentCls="bg-muted-foreground">
                {TAREAS_PENDIENTES.map(d => <OTCardTareaSinTomar key={d.requestNumber} className="w-full" {...d} />)}
              </KanbanColumn>
              <KanbanColumn title={otColumns[0].title} count={otColumns[0].count} accentCls={otColumns[0].accentCls}>
                {renderColumnCards(columns.proceso, "proceso", false)}
              </KanbanColumn>
            </div>

            {/* Página 1: En Revisión + Finalizada */}
            <div
              className="h-full"
              style={{ width: "50%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 8px 8px" }}
            >
              <KanbanColumn title={otColumns[1].title} count={otColumns[1].count} accentCls={otColumns[1].accentCls}>
                {renderColumnCards(columns.revision, "revision", false)}
              </KanbanColumn>
              <KanbanColumn title={otColumns[2].title} count={otColumns[2].count} accentCls={otColumns[2].accentCls}>
                {renderColumnCards(columns.finalizada, "finalizada", false)}
              </KanbanColumn>
            </div>
          </div>

          {/* Indicador: 2 puntos */}
          <Dots count={2} active={colIndex} onDotClick={setColIndex} size="lg" withContainer className="absolute bottom-4 left-0 right-0 pointer-events-auto" />
        </div>
      )}

      {/* ── Vista mobile: 1 columna por página, 4 páginas ── */}
      {viewMode === "mobile" && (
        <div
          className="flex-1 min-h-0 overflow-hidden relative select-none"
          style={{ touchAction: "pan-y" }}
          onPointerDown={(e) => setSwipeStartX(e.clientX)}
          onPointerUp={(e) => {
            if (swipeStartX === null) return
            const delta = e.clientX - swipeStartX
            const total = 1 + otColumns.length
            if (delta < -40) setColIndex(i => Math.min(i + 1, total - 1))
            if (delta >  40) setColIndex(i => Math.max(i - 1, 0))
            setSwipeStartX(null)
          }}
        >
          <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ width: `${(1 + otColumns.length) * 100}%`, transform: `translateX(-${colIndex * (100 / (1 + otColumns.length))}%)` }}
          >
            {[
              <KanbanColumn key="pending" title={t.kanban.colPending} count={14675} accentCls="bg-muted-foreground" className="flex-1">
                {TAREAS_PENDIENTES.map(d => <OTCardTareaSinTomar key={d.requestNumber} className="w-full" {...d} />)}
              </KanbanColumn>,
              ...otColumns.map(({ key, title, count, accentCls }) => (
                <KanbanColumn key={key} title={title} count={count} accentCls={accentCls} className="flex-1">
                  {renderColumnCards(columns[key], key, false)}
                </KanbanColumn>
              )),
            ].map((col, i) => (
              <div key={i} className="h-full px-2 pb-2 flex" style={{ width: `${100 / (1 + otColumns.length)}%` }}>
                {col}
              </div>
            ))}
          </div>
          <Dots count={1 + otColumns.length} active={colIndex} onDotClick={setColIndex} size="lg" withContainer className="absolute bottom-4 left-0 right-0 pointer-events-auto" />
        </div>
      )}

      {dragging && dragPos && draggingEntry && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            left:  dragPos.x - dragPos.offsetX,
            top:   dragPos.y - dragPos.offsetY,
            width: dragPos.w,
            zIndex: 9999,
            pointerEvents: "none",
            transform: "rotate(2deg) scale(1.03)",
            filter: "drop-shadow(0 16px 32px oklch(0 0 0 / 30%))",
          }}
        >
          <CardContent entry={draggingEntry} />
        </div>
      )}

    </div>
  )
}
