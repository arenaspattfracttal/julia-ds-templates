"use client"

import { useState, useMemo } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Sun, Moon, X, Pencil, Eye, PenLine, Square, Columns2, LayoutGrid, Search, Plus,
  ChevronsUpDown, AlertCircle, AlertTriangle, BellRing,
  AppWindow, ChevronDown, CircleUser, Tag,
  MousePointerClick, Calendar, CheckSquare, TextCursorInput,
  Gauge, CircleDot, ListFilter, SlidersHorizontal, ToggleLeft,
  LayoutDashboard, AlignLeft, Info,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { components } from "./registry"
import type { ComponentEntry } from "./types"
import { RightPanel } from "./right-panel"
import { CodeBlock } from "./code-block"
import { translations } from "./i18n"
import { useViewer } from "./viewer-context"
import { DotPattern } from "./dot-pattern"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode       = "light" | "dark"
type PaddingVal = "none" | "sm" | "md" | "lg"
type GapVal     = "none" | "sm" | "md" | "lg"
type RadiusVal  = "none" | "sm" | "md" | "lg" | "full"
type DimMode    = "hug" | "fixed"

interface Dim { mode: DimMode; px: number }

interface DroppedItem {
  uid:   string
  id:    string
  name:  string
  props: Record<string, unknown>
}

interface Section {
  id:   string
  type: "1col" | "2col" | "3col"
  cols: DroppedItem[][]
}

// ─── Registry helpers ─────────────────────────────────────────────────────────

const compMap: Record<string, ComponentEntry> = Object.fromEntries(
  components.map((c) => [c.id, c])
)
function getDefaultProps(entry: ComponentEntry): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(entry.controls).map(([k, ctrl]) => [k, ctrl.defaultValue])
  )
}

// ─── Palette data ─────────────────────────────────────────────────────────────

const ITEM_ICONS: Record<string, LucideIcon> = {
  accordion: ChevronsUpDown, alert: AlertCircle, "alert-dialog": AlertTriangle,
  sonner: BellRing, dialog: AppWindow, "dropdown-menu": ChevronDown,
  avatar: CircleUser, badge: Tag, button: MousePointerClick, calendar: Calendar,
  checkbox: CheckSquare, input: TextCursorInput, progress: Gauge,
  "radio-group": CircleDot, select: ListFilter, slider: SlidersHorizontal,
  switch: ToggleLeft, tabs: LayoutDashboard, textarea: AlignLeft, tooltip: Info,
}

// Components that require a trigger/overlay and cannot be composed statically
const COMPOSITOR_BLOCKED = new Set(["alert-dialog", "sonner", "tooltip", "dropdown-menu", "dialog"])

const PALETTE_GROUPS = [
  { label: "Feedback",      items: [{ id: "alert", name: "Alert" }, { id: "alert-dialog", name: "Alert Dialog" }, { id: "sonner", name: "Sonner" }, { id: "tooltip", name: "Tooltip" }] },
  { label: "Overlay",       items: [{ id: "dialog", name: "Dialog" }, { id: "dropdown-menu", name: "Dropdown Menu" }] },
  { label: "Form & Inputs", items: [{ id: "button", name: "Button" }, { id: "calendar", name: "Calendar" }, { id: "checkbox", name: "Checkbox" }, { id: "input", name: "Input" }, { id: "radio-group", name: "Radio Group" }, { id: "select", name: "Select" }, { id: "slider", name: "Slider" }, { id: "switch", name: "Switch" }, { id: "textarea", name: "Textarea" }] },
  { label: "Display",       items: [{ id: "accordion", name: "Accordion" }, { id: "avatar", name: "Avatar" }, { id: "badge", name: "Badge" }, { id: "progress", name: "Progress" }, { id: "tabs", name: "Tabs" }] },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2) }

const PADDING_CLASS: Record<PaddingVal, string> = {
  none: "p-0", sm: "p-3", md: "p-6", lg: "p-10",
}
const GAP_CLASS: Record<GapVal, string> = {
  none: "gap-0", sm: "gap-2", md: "gap-4", lg: "gap-8",
}
const RADIUS_CLASS: Record<RadiusVal, string> = {
  none: "rounded-none", sm: "rounded-md", md: "rounded-xl", lg: "rounded-2xl", full: "rounded-3xl",
}

function dimStyle(dim: Dim): string | number {
  return dim.mode === "hug" ? "fit-content" : dim.px
}

// ─── Dimension input ──────────────────────────────────────────────────────────

function DimInput({ label, dim, onChange }: { label: string; dim: Dim; onChange: (d: Dim) => void }) {
  const [raw, setRaw] = useState(String(dim.px))

  const commit = () => {
    const n = parseInt(raw, 10)
    const clamped = isNaN(n) ? dim.px : Math.max(40, Math.min(2400, n))
    setRaw(String(clamped))
    onChange({ ...dim, px: clamped })
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground font-medium shrink-0 w-3">{label}</span>
      <div className="flex">
        {(["hug", "fixed"] as DimMode[]).map((m, i) => (
          <button
            key={m}
            onClick={() => onChange({ ...dim, mode: m })}
            className={[
              "px-2 py-1 text-xs font-medium border transition-colors cursor-pointer",
              i === 0 ? "rounded-l-md" : "rounded-r-md -ml-px",
              dim.mode === m
                ? "bg-primary text-primary-foreground border-primary z-10 relative"
                : "bg-background text-muted-foreground border-border hover:bg-muted",
            ].join(" ")}
          >
            {m === "hug" ? "Hug" : "px"}
          </button>
        ))}
      </div>
      {dim.mode === "fixed" && (
        <input
          type="number"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur() }}
          className="w-16 text-xs bg-background border border-border rounded-md px-2 py-1 outline-none focus:border-ring text-foreground text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
      )}
    </div>
  )
}

// ─── Component drawer ─────────────────────────────────────────────────────────

function ComponentDrawer({
  onAdd, onClose,
}: {
  onAdd:   (raw: { id: string; name: string }) => void
  onClose: () => void
}) {
  const t = translations[useViewer().lang]
  const [search, setSearch] = useState("")
  const query = search.toLowerCase()
  const filtered = PALETTE_GROUPS
    .map((g) => ({ ...g, items: g.items.filter((c) => !COMPOSITOR_BLOCKED.has(c.id) && c.name.toLowerCase().includes(query)) }))
    .filter((g) => g.items.length > 0)

  return (
    <aside className="w-1/5 min-w-[240px] max-w-[380px] shrink-0 flex flex-col bg-background border-l border-border">
      <div className="px-4 border-b border-border h-[74px] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-semibold text-foreground leading-none">{t.compositor.drawerTitle}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t.compositor.drawerSubtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="px-3 py-2 border-b border-border shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.compositor.searchPlaceholder}
            className="w-full text-sm bg-muted border border-border rounded-md pl-7 pr-3 py-1.5 outline-none focus:border-ring text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0" scrollbarSize="thin">
      <div className="p-3 space-y-4">
        {filtered.map((group) => (
          <div key={group.label}>
            <p className="px-1 mb-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = ITEM_ICONS[item.id]
                return (
                  <button
                    key={item.id}
                    onClick={() => onAdd(item)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer text-left"
                  >
                    {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
                    <span>{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center pt-6">{t.noResults}</p>
        )}
      </div>
      </ScrollArea>
    </aside>
  )
}

// ─── Insertion indicator ──────────────────────────────────────────────────────

function InsertLine() {
  return (
    <div className="flex items-center gap-1 py-0.5 pointer-events-none">
      <div className="size-1.5 rounded-full bg-primary shrink-0" />
      <div className="flex-1 h-0.5 bg-primary rounded-full" />
    </div>
  )
}

// ─── Rendered component ───────────────────────────────────────────────────────

function RenderedItem({
  item, zoneId, index, selected, dragging, isPreview, onSelect, onRemove, onDragStart, onDragEnd,
}: {
  item:        DroppedItem
  zoneId:      string
  index:       number
  selected:    boolean
  dragging:    boolean
  isPreview:   boolean
  onSelect:    () => void
  onRemove:    () => void
  onDragStart: (uid: string, fromZoneId: string) => void
  onDragEnd:   () => void
}) {
  const entry = compMap[item.id]
  if (!entry) return null

  return (
    <div
      draggable={!isPreview}
      onDragStart={isPreview ? undefined : (e) => {
        e.dataTransfer.setData("application/compositor-move", JSON.stringify({ uid: item.uid, fromZoneId: zoneId, fromIdx: index }))
        e.dataTransfer.effectAllowed = "move"
        onDragStart(item.uid, zoneId)
      }}
      onDragEnd={isPreview ? undefined : onDragEnd}
      onClick={isPreview ? undefined : onSelect}
      className={[
        "relative w-full rounded-lg transition-all ring-offset-2",
        isPreview
          ? ""
          : [
              "group cursor-grab active:cursor-grabbing",
              selected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-primary/40 hover:ring-offset-1",
              dragging  ? "opacity-40" : "",
            ].join(" "),
      ].join(" ")}
    >
      {!isPreview && (
        <div className="absolute top-1.5 right-1.5 z-20 hidden group-hover:flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect() }}
            className="size-5 rounded-md bg-sidebar/80 text-sidebar-foreground flex items-center justify-center cursor-pointer hover:bg-primary transition-colors shadow-sm backdrop-blur-sm"
          >
            <Pencil className="size-2.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="size-5 rounded-md bg-sidebar/80 text-sidebar-foreground flex items-center justify-center cursor-pointer hover:bg-destructive transition-colors shadow-sm backdrop-blur-sm"
          >
            <X className="size-2.5" />
          </button>
        </div>
      )}
      <div className="w-full flex [&>*]:w-full [&>*]:!max-w-none">
        {(entry.compositorRender ?? entry.render)(item.props)}
      </div>
    </div>
  )
}

// ─── Drop zone helpers ────────────────────────────────────────────────────────

function buildZoneClassName(over: boolean, active: boolean, hasItems: boolean): string {
  const base = "w-full rounded-lg transition-all duration-150"
  if (hasItems) return base
  if (over) return `${base} min-h-[48px] ring-2 ring-primary/70 ring-offset-1 bg-primary/10`
  if (active) return `${base} min-h-[48px] ring-2 ring-primary ring-offset-1`
  return `${base} min-h-[48px] border-2 border-dashed border-border`
}

function ZoneEmptyContent({
  active, zoneId, onActivate,
}: {
  active:     boolean
  zoneId:     string
  onActivate: (zoneId: string) => void
}) {
  const t = translations[useViewer().lang]
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onActivate(zoneId) }}
      className={[
        "w-full flex items-center justify-center h-12 gap-1 text-xs font-medium rounded-lg transition-colors cursor-pointer",
        active
          ? "text-primary bg-primary/10"
          : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted",
      ].join(" ")}
    >
      <Plus className="size-3.5" />
      {active ? t.compositor.selectComponent : t.compositor.addComponent}
    </button>
  )
}

function ZoneItemsContent({
  items, zoneId, gap, over, insertIdx, selectedUid, draggingUid, isPreview,
  onSelect, onRemove, onDragStart, onDragEnd, onItemDragOver,
}: {
  items:         DroppedItem[]
  zoneId:        string
  gap:           GapVal
  over:          boolean
  insertIdx:     number | null
  selectedUid:   string | null
  draggingUid:   string | null
  isPreview:     boolean
  onSelect:      (uid: string) => void
  onRemove:      (zoneId: string, i: number) => void
  onDragStart:   (uid: string, fromZoneId: string) => void
  onDragEnd:     () => void
  onItemDragOver: (e: React.DragEvent, idx: number) => void
}) {
  return (
    <div className={["flex flex-col w-full", GAP_CLASS[gap]].join(" ")}>
      {over && insertIdx === 0 && <InsertLine />}
      {items.map((item, i) => (
        <div key={item.uid} onDragOver={(e) => onItemDragOver(e, i)}>
          <RenderedItem
            item={item}
            zoneId={zoneId}
            index={i}
            selected={selectedUid === item.uid}
            dragging={draggingUid === item.uid}
            isPreview={isPreview}
            onSelect={() => onSelect(item.uid)}
            onRemove={() => onRemove(zoneId, i)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
          {over && insertIdx === i + 1 && <InsertLine />}
        </div>
      ))}
    </div>
  )
}

// ─── Drop zone ────────────────────────────────────────────────────────────────

function DropZone({
  zoneId, items, selectedUid, draggingUid, active, isPreview, onActivate, onAdd, onMove, onRemove, onSelect,
  onDragStart, onDragEnd, gap,
}: {
  zoneId:      string
  items:       DroppedItem[]
  selectedUid: string | null
  draggingUid: string | null
  active:      boolean
  isPreview:   boolean
  onActivate:  (zoneId: string) => void
  onAdd:       (zoneId: string, raw: { id: string; name: string }, atIdx: number) => void
  onMove:      (uid: string, fromZoneId: string, toZoneId: string, toIdx: number) => void
  onRemove:    (zoneId: string, i: number) => void
  onSelect:    (uid: string) => void
  onDragStart: (uid: string, fromZoneId: string) => void
  onDragEnd:   () => void
  gap:         GapVal
}) {
  const [over, setOver]           = useState(false)
  const [insertIdx, setInsertIdx] = useState<number | null>(null)
  const hasItems = items.length > 0

  if (isPreview && !hasItems) return null

  function handleZoneDragOver(e: React.DragEvent) {
    e.preventDefault()
    setOver(true)
    if (!hasItems) setInsertIdx(0)
  }

  function handleItemDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.stopPropagation()
    setOver(true)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setInsertIdx(e.clientY < rect.top + rect.height / 2 ? idx : idx + 1)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setOver(false)
      setInsertIdx(null)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    const targetIdx = insertIdx ?? items.length
    setOver(false)
    setInsertIdx(null)

    const moveData = e.dataTransfer.getData("application/compositor-move")
    if (moveData) {
      const { uid, fromZoneId } = JSON.parse(moveData) as { uid: string; fromZoneId: string }
      onMove(uid, fromZoneId, zoneId, targetIdx)
      return
    }

    const newData = e.dataTransfer.getData("application/compositor-comp")
    if (newData) {
      onAdd(zoneId, JSON.parse(newData) as { id: string; name: string }, targetIdx)
    }
  }

  return (
    <div
      onDragOver={isPreview ? undefined : handleZoneDragOver}
      onDragLeave={isPreview ? undefined : handleDragLeave}
      onDrop={isPreview ? undefined : handleDrop}
      className={buildZoneClassName(over, active, hasItems)}
    >
      {hasItems ? (
        <ZoneItemsContent
          items={items}
          zoneId={zoneId}
          gap={gap}
          over={over}
          insertIdx={insertIdx}
          selectedUid={selectedUid}
          draggingUid={draggingUid}
          isPreview={isPreview}
          onSelect={onSelect}
          onRemove={onRemove}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onItemDragOver={handleItemDragOver}
        />
      ) : !isPreview ? (
        <ZoneEmptyContent active={active} zoneId={zoneId} onActivate={onActivate} />
      ) : null}
    </div>
  )
}

// ─── Section row ──────────────────────────────────────────────────────────────

function SectionRow({
  section, gap, selectedUid, draggingUid, activeZoneId, isPreview,
  onActivate, onAdd, onMove, onRemove, onSelect, onDragStart, onDragEnd, onDelete,
}: {
  section:      Section
  gap:          GapVal
  selectedUid:  string | null
  draggingUid:  string | null
  activeZoneId: string | null
  isPreview:    boolean
  onActivate:   (zoneId: string) => void
  onAdd:        (zoneId: string, raw: { id: string; name: string }, atIdx: number) => void
  onMove:       (uid: string, fromZoneId: string, toZoneId: string, toIdx: number) => void
  onRemove:     (zoneId: string, i: number) => void
  onSelect:     (uid: string) => void
  onDragStart:  (uid: string, fromZoneId: string) => void
  onDragEnd:    () => void
  onDelete:     (id: string) => void
}) {
  const sharedZoneProps = {
    gap, selectedUid, draggingUid, isPreview,
    onActivate, onAdd, onMove, onRemove, onSelect, onDragStart, onDragEnd,
  }
  const isEmpty = section.cols.every((col) => col.length === 0)
  if (isPreview && isEmpty) return null

  return (
    <div className="relative group">
      {!isPreview && isEmpty && (
        <button
          onClick={() => onDelete(section.id)}
          className="absolute top-1.5 right-1.5 z-20 size-5 rounded-md bg-sidebar/80 text-sidebar-foreground items-center justify-center hidden group-hover:flex hover:bg-destructive hover:text-destructive-foreground cursor-pointer transition-colors shadow-sm backdrop-blur-sm"
        >
          <X className="size-2.5" />
        </button>
      )}

      {section.type === "1col" ? (
        <DropZone
          zoneId={`${section.id}-0`}
          items={section.cols[0] ?? []}
          active={activeZoneId === `${section.id}-0`}
          {...sharedZoneProps}
        />
      ) : section.type === "2col" ? (
        <div className="grid grid-cols-2 gap-3">
          <DropZone zoneId={`${section.id}-0`} items={section.cols[0] ?? []} active={activeZoneId === `${section.id}-0`} {...sharedZoneProps} />
          <DropZone zoneId={`${section.id}-1`} items={section.cols[1] ?? []} active={activeZoneId === `${section.id}-1`} {...sharedZoneProps} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <DropZone zoneId={`${section.id}-0`} items={section.cols[0] ?? []} active={activeZoneId === `${section.id}-0`} {...sharedZoneProps} />
          <DropZone zoneId={`${section.id}-1`} items={section.cols[1] ?? []} active={activeZoneId === `${section.id}-1`} {...sharedZoneProps} />
          <DropZone zoneId={`${section.id}-2`} items={section.cols[2] ?? []} active={activeZoneId === `${section.id}-2`} {...sharedZoneProps} />
        </div>
      )}
    </div>
  )
}

// ─── Segment picker ───────────────────────────────────────────────────────────

function SegmentPicker<T extends string>({
  label, options, value, onChange,
}: {
  label:    string
  options:  { value: T; label: string }[]
  value:    T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground font-medium shrink-0">{label}</span>
      <div className="flex">
        {options.map((opt, i) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              "px-2.5 py-1 text-xs font-medium border transition-colors cursor-pointer",
              i === 0 ? "rounded-l-md" : i === options.length - 1 ? "rounded-r-md" : "",
              i > 0 ? "-ml-px" : "",
              value === opt.value
                ? "bg-primary text-primary-foreground border-primary z-10 relative"
                : "bg-background text-muted-foreground border-border hover:bg-muted",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PADDING_OPTIONS: { value: PaddingVal; label: string }[] = [
  { value: "none", label: "0" }, { value: "sm", label: "S" },
  { value: "md",   label: "M" }, { value: "lg", label: "L" },
]
const GAP_OPTIONS: { value: GapVal; label: string }[] = [
  { value: "none", label: "0" }, { value: "sm", label: "S" },
  { value: "md",   label: "M" }, { value: "lg", label: "L" },
]
const RADIUS_OPTIONS: { value: RadiusVal; label: string }[] = [
  { value: "none", label: "0" }, { value: "sm",  label: "S" },
  { value: "md",   label: "M" }, { value: "lg",  label: "L" },
  { value: "full", label: "•" },
]

function makeSection(type: Section["type"]): Section {
  const cols = type === "3col" ? [[], [], []] : type === "2col" ? [[], []] : [[]]
  return { id: uid(), type, cols }
}

// ─── Compositor code generator ────────────────────────────────────────────────

function indentLines(code: string, spaces: number): string {
  const pad = " ".repeat(spaces)
  return code.split("\n").map((l) => `${pad}${l}`).join("\n")
}

/** Extracts imports + inner JSX from a full generateCode() output. */
function extractFromCode(fullCode: string): { imports: string[]; jsx: string } {
  const importLines = fullCode.split("\n").filter((l) => l.startsWith("import "))
  const start = fullCode.indexOf("  return (\n")
  const end   = fullCode.lastIndexOf("\n  )\n}")
  if (start === -1 || end === -1) return { imports: importLines, jsx: "/* component */" }
  const raw = fullCode.slice(start + "  return (\n".length, end)
  // Strip 4-space indent added by generateCode wrapper
  const jsx = raw.split("\n").map((l) => (l.startsWith("    ") ? l.slice(4) : l)).join("\n")
  return { imports: importLines, jsx }
}

export function generateCompositorCode(
  sections: Section[],
  padding: PaddingVal,
  gap: GapVal,
  radius: RadiusVal,
  width: Dim,
  height: Dim,
  isDark: boolean,
  emptyMessage: string,
): string {
  const allItems = sections.flatMap((s) => s.cols.flat())
  if (allItems.length === 0) return emptyMessage

  // Build per-item JSX map and collect imports
  const importSet = new Set<string>()
  const jsxByUid = new Map<string, string>()

  for (const item of allItems) {
    const entry = compMap[item.id]
    if (!entry) continue
    const { imports, jsx } = extractFromCode(entry.generateCode(item.props))
    imports.forEach((i) => importSet.add(i))
    jsxByUid.set(item.uid, jsx)
  }

  // Build section blocks
  const gapClass = GAP_CLASS[gap]

  function renderItems(col: DroppedItem[]): string {
    return col.map((item) => jsxByUid.get(item.uid) ?? "/* unknown */").join("\n")
  }

  const sectionBlocks = sections
    .map((section) => {
      const isEmpty = section.cols.every((col) => col.length === 0)
      if (isEmpty) return null

      if (section.type === "1col") {
        return renderItems(section.cols[0] ?? [])
      }

      const colCount = section.type === "2col" ? 2 : 3
      const colsJSX = section.cols
        .map((col) => {
          if (col.length === 0) return `  <div />`
          const inner = indentLines(renderItems(col), 4)
          return `  <div className="flex flex-col ${gapClass}">\n${inner}\n  </div>`
        })
        .join("\n")

      return `<div className="grid grid-cols-${colCount} gap-3">\n${colsJSX}\n</div>`
    })
    .filter(Boolean) as string[]

  // Container
  const containerClasses = [
    "flex flex-col",
    gapClass,
    PADDING_CLASS[padding],
    RADIUS_CLASS[radius],
    "bg-background border border-border",
    isDark ? "dark" : "",
  ].filter(Boolean).join(" ")

  const widthProp  = width.mode  === "fixed" ? ` style={{ width: ${width.px} }}` : ""
  const heightProp = height.mode === "fixed" ? ` style={{ height: ${height.px}, overflowY: "auto" }}` : ""

  const inner = indentLines(sectionBlocks.join("\n"), 6)
  const importBlock = Array.from(importSet).sort().join("\n")

  return `${importBlock}

export default function Example() {
  return (
    <div className="${containerClasses}"${widthProp}${heightProp}>
${inner}
    </div>
  )
}`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CompositorArea() {
  const { lang } = useViewer()
  const t = translations[lang]
  const [mode, setMode]         = useState<Mode>("light")
  const [padding, setPadding]   = useState<PaddingVal>("md")
  const [gap, setGap]           = useState<GapVal>("md")
  const [radius, setRadius]     = useState<RadiusVal>("md")
  const [width, setWidth]       = useState<Dim>({ mode: "fixed", px: 480 })
  const [height, setHeight]     = useState<Dim>({ mode: "hug",   px: 320 })
  const [sections, setSections] = useState<Section[]>([makeSection("1col")])
  const [selectedUid, setSelectedUid]         = useState<string | null>(null)
  const [activeZoneId, setActiveZoneId]       = useState<string | null>(null)
  const [draggingUid, setDraggingUid]         = useState<string | null>(null)
  const [isPreview, setIsPreview]             = useState(false)
  const isDark = mode === "dark"

  const selectedItem = useMemo(() => {
    if (!selectedUid) return null
    for (const section of sections) {
      for (const col of section.cols) {
        const found = col.find((i) => i.uid === selectedUid)
        if (found) return found
      }
    }
    return null
  }, [selectedUid, sections])

  const compositorCode = useMemo(
    () => generateCompositorCode(sections, padding, gap, radius, width, height, isDark, t.compositor.emptyCode),
    [sections, padding, gap, radius, width, height, isDark, t.compositor.emptyCode],
  )

  // ── Section management ───────────────────────────────────────────────────
  function addSection(type: Section["type"]) {
    setSections((prev) => [...prev, makeSection(type)])
  }
  function deleteSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }

  // ── Add new component to zone ────────────────────────────────────────────
  function handleAdd(zoneId: string, raw: { id: string; name: string }, atIdx: number) {
    const entry = compMap[raw.id]
    if (!entry) return
    const item: DroppedItem = { uid: uid(), id: raw.id, name: raw.name, props: getDefaultProps(entry) }
    const [sectionId, colStr] = zoneId.split("-")
    const colIdx = Number(colStr)
    setSections((prev) => prev.map((s) => {
      if (s.id !== sectionId) return s
      return {
        ...s,
        cols: s.cols.map((col, i) => {
          if (i !== colIdx) return col
          const idx = Math.min(atIdx, col.length)
          return [...col.slice(0, idx), item, ...col.slice(idx)]
        }),
      }
    }))
    setSelectedUid(item.uid)
    setActiveZoneId(null)
  }

  // ── Move existing component between / within zones ───────────────────────
  function handleMove(itemUid: string, fromZoneId: string, toZoneId: string, toIdx: number) {
    setSections((prev) => {
      let moved: DroppedItem | null = null

      // Remove from source
      const withRemoved = prev.map((section) => ({
        ...section,
        cols: section.cols.map((col) => {
          const idx = col.findIndex((i) => i.uid === itemUid)
          if (idx === -1) return col
          moved = col[idx]
          return col.filter((_, j) => j !== idx)
        }),
      }))

      if (!moved) return prev

      // Insert into target
      const [toSectionId, toColStr] = toZoneId.split("-")
      const toColIdx = Number(toColStr)

      return withRemoved.map((section) => {
        if (section.id !== toSectionId) return section
        return {
          ...section,
          cols: section.cols.map((col, i) => {
            if (i !== toColIdx) return col
            const insertAt = Math.min(toIdx, col.length)
            return [...col.slice(0, insertAt), moved!, ...col.slice(insertAt)]
          }),
        }
      })
    })
  }

  // ── Remove ───────────────────────────────────────────────────────────────
  function handleRemove(zoneId: string, itemIdx: number) {
    const [sectionId, colStr] = zoneId.split("-")
    const colIdx = Number(colStr)
    setSections((prev) => prev.map((s) => {
      if (s.id !== sectionId) return s
      return { ...s, cols: s.cols.map((col, i) => i === colIdx ? col.filter((_, j) => j !== itemIdx) : col) }
    }))
    setSelectedUid(null)
  }

  // ── Prop changes ─────────────────────────────────────────────────────────
  function handlePropChange(key: string, value: unknown) {
    if (!selectedUid || !selectedItem) return
    const entry = compMap[selectedItem.id]
    setSections((prev) => prev.map((section) => ({
      ...section,
      cols: section.cols.map((col) =>
        col.map((item) => {
          if (item.uid !== selectedUid) return item
          const cascaded = entry?.cascade?.(key, value, item.props) ?? {}
          return { ...item, props: { ...item.props, [key]: value, ...cascaded } }
        })
      ),
    })))
  }

  function handleActivateZone(zoneId: string) {
    setActiveZoneId(zoneId)
    setSelectedUid(null)
  }

  const containerStyle: React.CSSProperties = {
    width:     dimStyle(width),
    height:    dimStyle(height),
    overflowY: height.mode === "fixed" ? "auto" : undefined,
    minWidth:  width.mode === "hug" ? undefined : dimStyle(width),
  }

  const showDrawer     = !isPreview && activeZoneId !== null
  const showRightPanel = !isPreview && !showDrawer && selectedItem !== null

  return (
    <main className={cn("flex-1 min-w-0 flex flex-col border-l border-border bg-background overflow-hidden", isDark && "dark")}>

      {/* Header */}
      <div className="px-4 shrink-0 h-[74px] flex items-center justify-between border-b border-border bg-background">
        <div>
          <h1 className="text-base font-semibold text-foreground leading-none">{t.compositor.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t.compositor.subtitle}
          </p>
        </div>
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList className="h-7 p-0.5">
            <TabsTrigger value="light" className="h-6 w-7 px-0"><Sun  className="size-3.5" /></TabsTrigger>
            <TabsTrigger value="dark"  className="h-6 w-7 px-0"><Moon className="size-3.5" /></TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">

        {/* Canvas column */}
        <ScrollArea className="flex-1 min-h-0" scrollbarSize="thin">
          <div className="px-4 pt-4 pb-8 space-y-4">

            {/* Controls bar */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3 bg-background rounded-xl border border-border">
              <DimInput label="W" dim={width}  onChange={setWidth}  />
              <div className="w-px h-4 bg-border" />
              <DimInput label="H" dim={height} onChange={setHeight} />
              <div className="w-px h-4 bg-border" />
              <SegmentPicker label="Padding" options={PADDING_OPTIONS} value={padding} onChange={setPadding} />
              <div className="w-px h-4 bg-border" />
              <SegmentPicker label="Gap"     options={GAP_OPTIONS}     value={gap}     onChange={setGap}     />
              <div className="w-px h-4 bg-border" />
              <SegmentPicker label="Radius"  options={RADIUS_OPTIONS}  value={radius}  onChange={setRadius}  />
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground font-medium mr-0.5">{t.compositor.containers}</span>
                <button onClick={() => addSection("1col")}    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer"><Square    className="size-3" />1</button>
                <button onClick={() => addSection("2col")}    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer"><Columns2   className="size-3" />2</button>
                <button onClick={() => addSection("3col")}    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer"><LayoutGrid className="size-3" />3</button>
              </div>
            </div>

            {/* Canvas */}
            <div
              className={[
                "relative pt-4 rounded-xl transition-colors duration-200",
                "bg-background text-foreground border border-border",
              ].join(" ")}
              onClick={() => { setSelectedUid(null); setActiveZoneId(null) }}
            >
              {/* Dot pattern */}
              <DotPattern mode={mode} mask="horizontal" className="rounded-xl" />

              {/* Top-left: edit/preview toggle */}
              <div className="absolute top-3 left-3">
                <Tabs
                  value={isPreview ? "preview" : "edit"}
                  onValueChange={(v) => {
                    const next = v === "preview"
                    setIsPreview(next)
                    if (next) { setSelectedUid(null); setActiveZoneId(null) }
                  }}
                >
                  <TabsList className="h-7 p-0.5">
                    <TabsTrigger value="edit"    className="h-6 w-7 px-0"><PenLine className="size-3.5" /></TabsTrigger>
                    <TabsTrigger value="preview" className="h-6 w-7 px-0"><Eye     className="size-3.5" /></TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>


              {/* Base container */}
              <div className="relative flex flex-col items-center px-8 pb-8 pt-6 gap-2">
                <div
                  className={[
                    "bg-background border border-border shadow-sm mx-auto",
                    PADDING_CLASS[padding],
                    RADIUS_CLASS[radius],
                  ].join(" ")}
                  style={containerStyle}
                >
                  <div className={["flex flex-col w-full", GAP_CLASS[gap]].join(" ")}>
                    {sections.map((section) => (
                      <SectionRow
                        key={section.id}
                        section={section}
                        gap={gap}
                        selectedUid={selectedUid}
                        draggingUid={draggingUid}
                        activeZoneId={activeZoneId}
                        isPreview={isPreview}
                        onActivate={handleActivateZone}
                        onAdd={handleAdd}
                        onMove={handleMove}
                        onRemove={handleRemove}
                        onSelect={(u) => { setSelectedUid(u); setActiveZoneId(null) }}
                        onDragStart={(u) => setDraggingUid(u)}
                        onDragEnd={() => setDraggingUid(null)}
                        onDelete={deleteSection}
                      />
                    ))}

                    {sections.length === 0 && (
                      <p className="text-center text-xs text-muted-foreground py-8">
                        {t.compositor.addSectionsHint}
                      </p>
                    )}
                  </div>
                </div>
                {/* Dimension badge below base */}
                <span className="text-[10px] font-mono text-muted-foreground">
                  {width.mode === "hug" ? "auto" : `${width.px}px`}
                  {" × "}
                  {height.mode === "hug" ? "auto" : `${height.px}px`}
                </span>
              </div>
            </div>

          {/* Code panel */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">{t.compositor.codeTitle}</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {t.compositor.codeHint}
              </span>
            </div>
            <CodeBlock code={compositorCode} lang="en" />
          </div>

          </div>
        </ScrollArea>

        {/* Right side: component drawer or property editor */}
        {showDrawer && (
          <ComponentDrawer
            onAdd={(raw) => handleAdd(activeZoneId!, raw, Infinity)}
            onClose={() => setActiveZoneId(null)}
          />
        )}
        {showRightPanel && (
          <RightPanel
            component={compMap[selectedItem!.id]}
            propValues={selectedItem!.props}
            onChange={handlePropChange}
            lang={lang}
          />
        )}
      </div>
    </main>
  )
}
