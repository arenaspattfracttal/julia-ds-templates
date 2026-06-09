"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnSizingState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDown, ChevronUp, ChevronsUpDown,
  ChevronLeft, ChevronRight, Search, SlidersHorizontal, Rows3, RotateCcw, Plus,
  Trash2, RefreshCw, ListFilter, X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// ─── Re-export for convenience ────────────────────────────────────────────────
export type { ColumnDef }
export { flexRender }

/** Definición de acción directa para filas con una única acción */
export type RowDirectAction<TData> = {
  icon:     React.ComponentType<{ className?: string }>
  label:    string
  onClick:  (row: TData) => void
  variant?: "ghost" | "destructive"
}

// ─── Sticky column styling (selección + acciones) ─────────────────────────────
// Las columnas fijas viven DENTRO de la <table> (mismas filas → misma altura exacta,
// sin medir el DOM) y se mantienen ancladas con position:sticky al hacer scroll
// horizontal. El separador es un box-shadow inset SOBRE la celda: por eso la línea
// llega solo hasta la última fila y no continúa hacia abajo.
// Los fondos son opacos (color-mix con --background) para que el contenido que se
// desplaza por debajo no se transparente a través de la celda fija.
const STICKY_HEADER_BG = "color-mix(in oklab, var(--muted) 50%, var(--background))"
const STICKY_STRIPE_BG = "color-mix(in oklab, var(--muted) 30%, var(--background))"
const SHADOW_LEFT  = "inset -1px 0 0 0 var(--border), 6px 0 10px -8px rgba(0,0,0,0.18)"
const SHADOW_RIGHT = "inset 1px 0 0 0 var(--border), -6px 0 10px -8px rgba(0,0,0,0.18)"

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ChevronUp   className="size-3.5 shrink-0" />
  if (direction === "desc") return <ChevronDown className="size-3.5 shrink-0" />
  return <ChevronsUpDown className="size-3.5 shrink-0 opacity-40" />
}

// ─── Column width helper ──────────────────────────────────────────────────────
// fitContent (no-resizable o midiendo): columna ajustada a su contenido (width:1px + nowrap).
// fixed (resizable ya medido): width explícito por columna; el spacer absorbe el sobrante.
function colWidthStyle(isSpacer: boolean, isSelect: boolean, fitContent: boolean, size: number): React.CSSProperties | undefined {
  if (isSpacer) return { width: fitContent ? "100%" : "auto" }
  if (isSelect) return undefined
  if (fitContent) return { width: "1px" }
  return { width: size }
}

// Estilo final de una celda fija: ancho + fondo opaco + separador (box-shadow).
function stickyStyle(
  isSpacer: boolean, isSelect: boolean, isActions: boolean,
  fitContent: boolean, size: number, bg: string,
): React.CSSProperties | undefined {
  const width = colWidthStyle(isSpacer, isSelect, fitContent, size)
  if (isSelect)  return { ...width, backgroundColor: bg, boxShadow: SHADOW_LEFT }
  if (isActions) return { ...width, backgroundColor: bg, boxShadow: SHADOW_RIGHT }
  return width
}

// ─── Column reorder helper ────────────────────────────────────────────────────

function reorderColumns(order: string[], fromId: string, toId: string): string[] {
  const next    = [...order]
  const fromIdx = next.indexOf(fromId)
  const toIdx   = next.indexOf(toId)
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return order
  next.splice(fromIdx, 1)
  next.splice(toIdx, 0, fromId)
  return next
}

// ─── Special column factories ─────────────────────────────────────────────────

function buildSpacerColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id:                  "__spacer__",
    enableSorting:       false,
    enableHiding:        false,
    enableResizing:      false,
    enableGlobalFilter:  false,
    header:              () => null,
    cell:                () => null,
  }
}

function buildSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id:                 "__select__",
    enableSorting:      false,
    enableHiding:       false,
    enableResizing:     false,
    enableGlobalFilter: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Seleccionar fila"
        onClick={(e) => e.stopPropagation()}
      />
    ),
  }
}

// Columna de acciones fija a la derecha. Lee los render-props desde refs estables
// para no recrear las columnas (y resetear el estado de TanStack) en cada render.
type ActionsRenderRef<TData> = React.MutableRefObject<((row: TData) => React.ReactNode) | undefined>
type DirectActionRef<TData>  = React.MutableRefObject<RowDirectAction<TData> | undefined>
type DeleteRequestRef<TData> = React.MutableRefObject<((row: TData) => void) | undefined>

function buildActionsColumn<TData>(
  renderRef:       ActionsRenderRef<TData>,
  deleteRef:       DeleteRequestRef<TData>,
  directActionRef: DirectActionRef<TData>,
): ColumnDef<TData, unknown> {
  return {
    id:                 "__actions__",
    enableSorting:      false,
    enableHiding:       false,
    enableResizing:     false,
    enableGlobalFilter: false,
    header:             () => null,
    cell: ({ row }) => {
      const render        = renderRef.current
      const onDelete      = deleteRef.current
      const directAction  = directActionRef.current

      // Acción única directa — muestra el ícono como botón con tooltip sin menú
      if (directAction) {
        const { icon: Icon, label, onClick, variant = "ghost" } = directAction
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={variant as "ghost" | "destructive"}
                size="icon-xs"
                onClick={() => onClick(row.original as TData)}
                aria-label={label}
              >
                <Icon className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" avoidCollisions={false}>{label}</TooltipContent>
          </Tooltip>
        )
      }

      return (
        <>
          {render?.(row.original as TData)}
          {onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-xs" onClick={() => onDelete(row.original as TData)} aria-label="Eliminar">
                  <Trash2 className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" avoidCollisions={false}>Eliminar</TooltipContent>
            </Tooltip>
          )}
        </>
      )
    },
  }
}

// ─── Column visibility toggle ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTable = ReturnType<typeof useReactTable<any>>

function ColumnToggle({ table, onResetOrder }: { table: AnyTable; onResetOrder: () => void }) {
  const hideable = table.getAllColumns().filter((c: { getCanHide: () => boolean }) => c.getCanHide())
  const [open, setOpen] = React.useState(false)

  function handleReset() { onResetOrder(); setOpen(false) }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Columnas visibles">
                <SlidersHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Columnas visibles</TooltipContent>
        </Tooltip>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="flex items-center justify-between pr-1">
          Mostrar columnas
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={handleReset} aria-label="Restablecer orden">
                  <RotateCcw className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reiniciar orden de las columnas</TooltipContent>
            </Tooltip>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideable.map((col: { id: string; getIsVisible: () => boolean; toggleVisibility: (v: boolean) => void; columnDef: { header?: unknown } }) => (
          <DropdownMenuCheckboxItem
            key={col.id}
            checked={col.getIsVisible()}
            onCheckedChange={(v) => col.toggleVisibility(!!v)}
          >
            {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Row height toggle ────────────────────────────────────────────────────────

export type RowDensity = "sm" | "default" | "lg"

const DENSITY_LABELS: Record<RowDensity, string> = {
  sm:      "Compacto",
  default: "Normal",
  lg:      "Espaciado",
}

function RowHeightToggle({ density, onDensityChange }: { density: RowDensity; onDensityChange: (d: RowDensity) => void }) {
  return (
    <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Tamaño de filas">
                <Rows3 className="size-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Tamaño de filas</TooltipContent>
        </Tooltip>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuLabel>Altura de fila</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={density} onValueChange={(v) => onDensityChange(v as RowDensity)}>
          {(["sm", "default", "lg"] as RowDensity[]).map((d) => (
            <DropdownMenuRadioItem key={d} value={d}>
              {DENSITY_LABELS[d]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Toolbar (search + column toggle) ────────────────────────────────────────

interface ToolbarProps {
  table:            AnyTable
  showSearch:       boolean
  showToggle:       boolean
  showDensity:      boolean
  searchValue:      string
  onSearchChange:   (v: string) => void
  density:          RowDensity
  onDensityChange:  (d: RowDensity) => void
  onResetOrder:     () => void
  onAdd?:           () => void
  addLabel?:        string
  onBulkDelete?:    () => void
  onRefresh?:       () => void
  onFilter?:        () => void
}

function ToolbarBulkActions({ onBulkDelete }: { onBulkDelete?: () => void }) {
  if (!onBulkDelete) return null
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" onClick={onBulkDelete} aria-label="Eliminar seleccionados">
          <Trash2 className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Eliminar seleccionados</TooltipContent>
    </Tooltip>
  )
}

function ToolbarNormalActions({ table, showSearch, showToggle, showDensity, searchValue, onSearchChange, density, onDensityChange, onResetOrder, onAdd, addLabel, onRefresh, onFilter }: Omit<ToolbarProps, "onBulkDelete">) {
  return (
    <>
      {showSearch && (
        <Input type="search" placeholder="Buscar..." value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)} className="h-8 text-sm w-40" />
      )}
      {onRefresh && (
        <Tooltip><TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" onClick={onRefresh} aria-label="Actualizar"><RefreshCw className="size-4" /></Button>
        </TooltipTrigger><TooltipContent>Actualizar</TooltipContent></Tooltip>
      )}
      {onFilter && (
        <Tooltip><TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" onClick={onFilter} aria-label="Filtros"><ListFilter className="size-4" /></Button>
        </TooltipTrigger><TooltipContent>Filtros</TooltipContent></Tooltip>
      )}
      {showDensity && <RowHeightToggle density={density} onDensityChange={onDensityChange} />}
      {showToggle && <ColumnToggle table={table} onResetOrder={onResetOrder} />}
      {onAdd && <Button size="sm" onClick={onAdd}><Plus className="size-4" />{addLabel ?? "Nueva"}</Button>}
    </>
  )
}

function DataTableToolbar({ table, showSearch, showToggle, showDensity, searchValue, onSearchChange, density, onDensityChange, onResetOrder, onAdd, addLabel = "Nueva", onBulkDelete, onRefresh, onFilter }: ToolbarProps) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const totalCount    = table.getFilteredRowModel().rows.length
  const hasRight      = showSearch || showToggle || showDensity || !!onAdd || !!onRefresh || !!onFilter

  if (!hasRight && !onBulkDelete && selectedCount === 0) return null

  return (
    <div className="flex items-center gap-2 p-2 border-b border-border shrink-0">
      <div className="flex-1 min-w-0 flex items-center gap-1">
        {selectedCount > 0 && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{selectedCount}</span>
            {" "}de{" "}
            <span className="font-medium text-foreground">{totalCount}</span>
            {" "}fila(s) seleccionada(s)
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {selectedCount >= 1
          ? <ToolbarBulkActions onBulkDelete={onBulkDelete} />
          : <ToolbarNormalActions table={table} showSearch={showSearch} showToggle={showToggle}
              showDensity={showDensity} searchValue={searchValue} onSearchChange={onSearchChange}
              density={density} onDensityChange={onDensityChange} onResetOrder={onResetOrder}
              onAdd={onAdd} addLabel={addLabel} onRefresh={onRefresh} onFilter={onFilter} />
        }
      </div>
    </div>
  )
}

// ─── Pagination footer ────────────────────────────────────────────────────────

function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const range: number[] = []
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) range.push(i)
  }
  const result: (number | "…")[] = []
  let prev = 0
  for (const n of range) {
    if (n - prev > 1) result.push("…")
    result.push(n)
    prev = n
  }
  return result
}

function DataTablePagination({ table }: { table: AnyTable }) {
  const { pageIndex, pageSize } = table.getState().pagination
  const total     = table.getFilteredRowModel().rows.length
  const from      = total === 0 ? 0 : pageIndex * pageSize + 1
  const to        = Math.min((pageIndex + 1) * pageSize, total)
  const pageCount = table.getPageCount()
  const pages     = getPageRange(pageIndex + 1, pageCount)

  return (
    <div className="flex items-center justify-between p-2 border-t border-border shrink-0">
      <span className="text-xs text-muted-foreground">
        Mostrando{" "}
        <span className="font-medium text-foreground">{from}–{to}</span>
        {" "}de{" "}
        <span className="font-medium text-foreground">{total}</span>
        {" "}filas
      </span>
      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PaginationLink
                    size="icon-sm"
                    aria-label="Página anterior"
                    onClick={(e) => { e.preventDefault(); table.previousPage() }}
                    className={cn("cursor-pointer", !table.getCanPreviousPage() && "pointer-events-none opacity-50")}
                  >
                    <ChevronLeft className="size-4" />
                  </PaginationLink>
                </TooltipTrigger>
                <TooltipContent>Página anterior</TooltipContent>
              </Tooltip>
          </PaginationItem>
          {pages.map((page, i) => (
            <PaginationItem key={i}>
              {page === "…" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  size="icon-sm"
                  onClick={(e) => { e.preventDefault(); table.setPageIndex((page as number) - 1) }}
                  isActive={page === pageIndex + 1}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PaginationLink
                    size="icon-sm"
                    aria-label="Página siguiente"
                    onClick={(e) => { e.preventDefault(); table.nextPage() }}
                    className={cn("cursor-pointer", !table.getCanNextPage() && "pointer-events-none opacity-50")}
                  >
                    <ChevronRight className="size-4" />
                  </PaginationLink>
                </TooltipTrigger>
                <TooltipContent>Página siguiente</TooltipContent>
              </Tooltip>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

// ─── Header cell ─────────────────────────────────────────────────────────────

interface HeaderCellProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  header:          any
  bordered:        boolean
  resizable:       boolean
  measuring:       boolean
  reorder:         boolean
  isDragOver:      boolean
  isDragging:      boolean
  isLastResizable: boolean
  onAutoFit:       (colId: string) => void
  onDragStart:     (id: string) => void
  onDragOver:      (id: string) => void
  onDrop:          (id: string) => void
  onDragEnd:       () => void
}

function DataTableHeaderCell({ header, bordered, resizable, measuring, reorder, isDragOver, isDragging, isLastResizable, onAutoFit, onDragStart, onDragOver, onDrop, onDragEnd }: HeaderCellProps) {
  const canSort        = header.column.getCanSort()
  const canResize      = header.column.getCanResize()
  const isSelect       = header.column.id === "__select__"
  const isSpacer       = header.column.id === "__spacer__"
  const isActions      = header.column.id === "__actions__"
  const isSticky       = isSelect || isActions
  const draggable      = reorder && !isSelect && !isSpacer && !isActions
  // fitContent: columnas ajustadas al contenido (no-resizable, o durante la medición inicial del modo resizable)
  const fitContent     = !resizable || measuring
  const [onHandle, setOnHandle] = React.useState(false)

  // ── Touch drag (tablet): long press 500ms → arrastrar → soltar ──────────────
  const lpTimer       = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchDragging = React.useRef(false)
  const touchOrigin   = React.useRef<{ x: number; y: number } | null>(null)

  function touchDragStart(e: React.TouchEvent) {
    if (!draggable) return
    const t = e.touches[0]
    touchOrigin.current = { x: t.clientX, y: t.clientY }
    lpTimer.current = setTimeout(() => {
      touchDragging.current = true
      onDragStart(header.column.id)
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(40)
    }, 500)
  }

  function touchDragMove(e: React.TouchEvent) {
    const t = e.touches[0]
    // Cancel long press if finger moved > 8px before 500ms
    if (lpTimer.current && touchOrigin.current) {
      const moved = Math.hypot(t.clientX - touchOrigin.current.x, t.clientY - touchOrigin.current.y)
      if (moved > 8) { clearTimeout(lpTimer.current); lpTimer.current = null }
    }
    if (!touchDragging.current) return
    const el  = document.elementFromPoint(t.clientX, t.clientY)
    const th  = el?.closest?.("[data-col-id]") as HTMLElement | null
    const col = th?.getAttribute("data-col-id")
    if (col && col !== header.column.id && col !== "__spacer__" && col !== "__select__" && col !== "__actions__") {
      onDragOver(col)
    }
  }

  function touchDragEnd(e: React.TouchEvent) {
    if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null }
    touchOrigin.current = null
    if (!touchDragging.current) return
    touchDragging.current = false
    const t   = e.changedTouches[0]
    const el  = document.elementFromPoint(t.clientX, t.clientY)
    const th  = el?.closest?.("[data-col-id]") as HTMLElement | null
    const col = th?.getAttribute("data-col-id")
    if (col && col !== "__spacer__") onDrop(col); else onDragEnd()
  }

  return (
    <TableHead
      data-col-id={header.column.id}
      draggable={draggable && !onHandle}
      onDragStart={draggable ? () => onDragStart(header.column.id) : undefined}
      onDragOver={draggable  ? (e: React.DragEvent) => { e.preventDefault(); onDragOver(header.column.id) } : undefined}
      onDrop={draggable      ? (e: React.DragEvent) => { e.preventDefault(); onDrop(header.column.id) } : undefined}
      onDragEnd={draggable   ? onDragEnd : undefined}
      onTouchStart={draggable ? touchDragStart : undefined}
      onTouchMove={draggable  ? touchDragMove  : undefined}
      onTouchEnd={draggable   ? touchDragEnd   : undefined}
      className={cn(
        "relative select-none",
        isSelect && "w-10 !px-2",
        canSort && "cursor-pointer",
        draggable && !onHandle && "cursor-grab active:cursor-grabbing",
        bordered && !isSpacer && !isSticky && "border-r last:border-r-0",
        isSticky && "sticky z-20",
        isSelect && "left-0",
        isActions && "right-0",
        isDragging && "opacity-40",
        isDragOver && "border-l-2 border-l-foreground/50",
      )}
      style={stickyStyle(isSpacer, isSelect, isActions, fitContent, header.getSize(), STICKY_HEADER_BG)}
      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
    >
      {header.isPlaceholder || isActions ? null : isSelect ? (
        <div className="flex items-center justify-center">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </div>
      ) : (
        <div className={cn("flex items-center gap-1.5 -mx-2 px-2", !fitContent && "min-w-0 overflow-hidden")}>
          <span className={cn(fitContent ? "whitespace-nowrap" : "truncate min-w-0")}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          {canSort && <SortIcon direction={header.column.getIsSorted()} />}
        </div>
      )}
      {resizable && !measuring && !isLastResizable && !isSpacer && !isSelect && !isActions && (
        <div
          onMouseEnter={canResize ? () => setOnHandle(true) : undefined}
          onMouseLeave={canResize ? () => setOnHandle(false) : undefined}
          onDoubleClick={canResize ? () => onAutoFit(header.column.id) : undefined}
          onMouseDown={canResize ? header.getResizeHandler() : undefined}
          onTouchStart={canResize ? header.getResizeHandler() : undefined}
          className={cn(
            "absolute top-0 h-full w-4 -right-2 z-10 select-none flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-px before:transition-colors",
            canResize && "cursor-col-resize touch-none hover:before:bg-muted-foreground hover:before:w-[2px]",
          )}
        />
      )}
    </TableHead>
  )
}

// ─── Body row ─────────────────────────────────────────────────────────────────

interface BodyRowProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row:               any
  index:             number
  striped:           boolean
  bordered:          boolean
  resizable:         boolean
  measuring:         boolean
  densityCellClass:  string
  densityInnerClass: string
  onRowClick?:       (row: TData) => void
}

function DataTableBodyRow<TData>({ row, index, striped, bordered, resizable, measuring, densityCellClass, densityInnerClass, onRowClick }: BodyRowProps<TData>) {
  // fitContent: columnas ajustadas al contenido (no-resizable, o durante la medición inicial del modo resizable)
  const fitContent  = !resizable || measuring
  const selected    = row.getIsSelected()
  const stripedOdd  = striped && index % 2 === 1
  // Fondo opaco que debe usar una celda fija para tapar lo que se desplaza por debajo.
  const stickyBg    = selected ? "var(--muted)" : stripedOdd ? STICKY_STRIPE_BG : "var(--background)"
  return (
    <TableRow
      data-state={selected ? "selected" : undefined}
      className={cn(stripedOdd && "bg-muted/30", onRowClick && "cursor-pointer")}
      onClick={onRowClick ? () => onRowClick(row.original as TData) : undefined}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {row.getVisibleCells().map((cell: any) => {
        const isSpacer  = cell.column.id === "__spacer__"
        const isSelect  = cell.column.id === "__select__"
        const isActions = cell.column.id === "__actions__"
        const isSticky  = isSelect || isActions
        return (
          <TableCell
            key={cell.id}
            data-col-id={cell.column.id}
            className={cn(
              isSelect && "w-10 !py-0 !px-2",
              isActions && "!py-0 !px-2",
              !isSpacer && !isSticky && densityCellClass,
              bordered && !isSpacer && !isSticky && "border-r last:border-r-0",
              isSpacer && "!p-0",
              isSticky && "sticky z-10",
              isSelect && "left-0",
              isActions && "right-0",
            )}
            style={stickyStyle(isSpacer, isSelect, isActions, fitContent, cell.column.getSize(), stickyBg)}
          >
            {isSelect && (
              <div className="flex items-center justify-center">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            )}
            {isActions && (
              <div className="flex items-center justify-end gap-0.5">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            )}
            {!isSpacer && !isSelect && !isActions && (
              <div className={cn("flex items-center whitespace-nowrap -mx-2 px-2 [&_[data-slot=badge]]:max-w-full [&_[data-slot=badge]]:shrink", densityInnerClass)}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            )}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

// ─── Table content (header + body) ───────────────────────────────────────────

interface TableContentProps<TData> {
  table:            AnyTable
  bordered:         boolean
  resizable:        boolean
  measuring:        boolean
  reorder:          boolean
  striped:          boolean
  density:          RowDensity
  densityCellClass: string
  densityInnerClass: string
  emptyText:        string
  dragOverId:       string | null
  draggingId:       string | null
  onColumnDragStart:(id: string) => void
  onColumnDragOver: (id: string) => void
  onColumnDrop:     (id: string) => void
  onColumnDragEnd:  () => void
  onMeasured:       (sizes: Record<string, number>) => void
  contentSizes:     Record<string, number>
  onRowClick?:        (row: TData) => void
  onOptimalPageSize?:   (n: number) => void
}

function DataTableContent<TData>({ table, bordered, resizable, measuring, reorder, striped, density, densityCellClass, densityInnerClass, emptyText, dragOverId, draggingId, onColumnDragStart, onColumnDragOver, onColumnDrop, onColumnDragEnd, onMeasured, contentSizes, onRowClick, onOptimalPageSize }: TableContentProps<TData>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = table.getRowModel().rows as any[]
  const fitContent = !resizable || measuring

  // Doble clic en el handle → vuelve al ancho medido por contenido (no al default de TanStack)
  const handleAutoFit = (colId: string) => {
    const w = contentSizes[colId]
    table.setColumnSizing((prev: Record<string, number>) => {
      if (w) return { ...prev, [colId]: w }
      const next = { ...prev }
      delete next[colId]
      return next
    })
  }

  const wrapperRef        = React.useRef<HTMLDivElement>(null)
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  // Calcula el pageSize óptimo para que las filas llenen el alto disponible sin scroll
  // vertical. Mide solo el header y la primera fila (ya no hay paneles que sincronizar:
  // selección y acciones son columnas reales de la tabla y alinean por sí solas).
  React.useLayoutEffect(() => {
    if (!onOptimalPageSize) return
    const wrapper   = wrapperRef.current
    const container = tableContainerRef.current
    if (!wrapper || !container) return
    const measure = () => {
      // Sin datos no hay filas reales; la fila placeholder (h-24) tiene altura anormal
      // que envenenarías el cálculo y dejaría pageSize atascado en 1.
      if (rows.length === 0) return
      const headerTr    = container.querySelector("thead tr") as HTMLElement | null
      const firstBodyTr = container.querySelector("tbody tr") as HTMLElement | null
      if (!headerTr || !firstBodyTr) return
      const headerH = firstBodyTr.getBoundingClientRect().top - headerTr.getBoundingClientRect().top
      const rowH    = firstBodyTr.getBoundingClientRect().height
      if (headerH <= 0 || rowH <= 0) return
      const wrapH   = wrapper.getBoundingClientRect().height
      // Solo actualizar cuando el contenedor tiene espacio libre real (≥ media fila extra)
      // o cuando el contenido desborda el contenedor. En contenedores auto-sized el wrapper
      // mide exactamente lo que muestra (freeH ≈ 0), lo que causaría un feedback loop.
      const usedH   = headerH + rows.length * rowH
      if (Math.abs(wrapH - usedH) < rowH * 0.5) return
      onOptimalPageSize(Math.max(1, Math.floor((wrapH - headerH) / rowH)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrapper)
    ro.observe(container)
    return () => ro.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length, density])

  // Pasada de medición (solo modo resizable): mide el ancho natural de cada columna
  // ajustado a su contenido más largo, y lo entrega como tamaño inicial de columna.
  // La columna de acciones SÍ se mide (su ancho fijo viene de los botones); selección
  // y spacer no (selección es 40px fijos, spacer absorbe el sobrante).
  React.useLayoutEffect(() => {
    if (!measuring) return
    const container = tableContainerRef.current
    if (!container) return
    const ths = container.querySelectorAll("thead th[data-col-id]")
    const sizes: Record<string, number> = {}
    ths.forEach((th) => {
      const id = th.getAttribute("data-col-id")
      if (!id || id === "__spacer__" || id === "__select__") return
      if (id === "__actions__") {
        // El encabezado de acciones devuelve null (ancho 0); medir la primera celda del cuerpo
        const bodyCell = container.querySelector(`tbody td[data-col-id="__actions__"]`) as HTMLElement | null
        const w = bodyCell ? Math.ceil(bodyCell.getBoundingClientRect().width) : 32
        sizes[id] = Math.min(Math.max(w, 24), 120)
        return
      }
      // +2px de holgura para que el truncado del modo fijo no recorte el último píxel
      const w = Math.ceil(th.getBoundingClientRect().width) + 2
      sizes[id] = Math.min(Math.max(w, 48), 400)
    })
    if (Object.keys(sizes).length) onMeasured(sizes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measuring, rows.length])

  return (
    <div ref={wrapperRef} className="flex flex-col overflow-hidden min-h-0 flex-1">
    <ScrollArea
      horizontal
      className="flex-1 min-w-0 min-h-0"
      horizontalInset={{
        left:  table.getColumn("__select__")  ? 40 : 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        right: table.getColumn("__actions__") ? (table.getColumn("__actions__") as any).getSize() : 0,
      }}
    >
      <div ref={tableContainerRef}>
      <Table
        wrapperClassName="relative w-full overflow-x-visible"
        className={cn(!fitContent && "table-fixed")}
        style={!fitContent ? {
          width: "100%",
          // El minWidth define el punto a partir del cual aparece el scroll horizontal:
          // suma de columnas medidas + acciones, más los 40px fijos de la selección.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          minWidth: `${table.getAllLeafColumns().filter((c: any) => c.id !== "__spacer__" && c.id !== "__select__").reduce((s: number, c: any) => s + c.getSize(), 0) + (table.getColumn("__select__") ? 40 : 0)}px`,
        } : { width: "100%" }}
      >
        <TableHeader>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {table.getHeaderGroups().map((hg: any) => (
            <TableRow key={hg.id} className="bg-muted/50 hover:bg-muted/50">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {hg.headers.map((header: any, i: number, arr: any[]) => (
                <DataTableHeaderCell
                  key={header.id}
                  header={header}
                  bordered={bordered}
                  resizable={resizable}
                  measuring={measuring}
                  reorder={reorder}
                  isDragOver={dragOverId === header.column.id}
                  isDragging={draggingId === header.column.id}
                  isLastResizable={arr[i + 1]?.column.id === "__spacer__"}
                  onAutoFit={handleAutoFit}
                  onDragStart={onColumnDragStart}
                  onDragOver={onColumnDragOver}
                  onDrop={onColumnDrop}
                  onDragEnd={onColumnDragEnd}
                />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            rows.map((row: any, i: number) => (
              <DataTableBodyRow<TData>
                key={row.id}
                row={row}
                index={i}
                striped={striped}
                bordered={bordered}
                resizable={resizable}
                measuring={measuring}
                densityCellClass={densityCellClass}
                densityInnerClass={densityInnerClass}
                onRowClick={onRowClick}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center text-muted-foreground">
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </ScrollArea>
    </div>
  )
}

// ─── Mobile card view ────────────────────────────────────────────────────────

interface MobileViewProps<TData> {
  table:              AnyTable
  searchValue:        string
  onSearchChange:     (v: string) => void
  striped:            boolean
  rowSelection:       boolean
  onAdd?:             () => void
  addLabel?:          string
  onBulkDelete?:      () => void
  onRefresh?:         () => void
  onFilter?:          () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderActions?:     (row: any) => React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteRowRequest?:(row: any) => void
  emptyText?:         string
}

function DataTableMobileView<TData>({
  table, searchValue, onSearchChange, striped, rowSelection,
  onAdd, addLabel = "Nueva", onBulkDelete, onRefresh, onFilter,
  renderActions, onDeleteRowRequest, emptyText = "Sin resultados.",
}: MobileViewProps<TData>) {
  const [expanded,      setExpanded]      = React.useState<Set<string>>(new Set())
  const [selectionMode, setSelectionMode] = React.useState(false)
  const [slideDir,      setSlideDir]      = React.useState<"left" | "right">("left")
  const [searchOpen,    setSearchOpen]    = React.useState(false)
  const searchInputRef  = React.useRef<HTMLInputElement>(null)

  function openSearch()  {
    setSearchOpen(true)
    // Espera el frame de transición antes de enfocar
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }
  function closeSearch() { setSearchOpen(false); onSearchChange("") }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows          = table.getRowModel().rows as any[]
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const totalCount    = table.getFilteredRowModel().rows.length
  const { pageIndex } = table.getState().pagination
  const pageCount     = table.getPageCount()
  const pageSize      = table.getState().pagination.pageSize
  const from          = totalCount === 0 ? 0 : pageIndex * pageSize + 1
  const to            = Math.min((pageIndex + 1) * pageSize, totalCount)

  // Refs
  const listViewport  = React.useRef<HTMLDivElement>(null)
  const pullWrapRef   = React.useRef<HTMLDivElement>(null)
  const topGlowRef    = React.useRef<HTMLDivElement>(null)
  const botGlowRef    = React.useRef<HTMLDivElement>(null)
  const leftGlowRef   = React.useRef<HTMLDivElement>(null)
  const rightGlowRef  = React.useRef<HTMLDivElement>(null)
  const prevScrollTop = React.useRef(0)
  const bounceX       = React.useRef(0)
  const bounceY       = React.useRef(0)
  const lpTimer       = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const lpFired       = React.useRef(false)
  const touchStart    = React.useRef<{ x: number; y: number } | null>(null)

  // Auto-exit selection mode when nothing selected
  React.useEffect(() => {
    if (selectedCount === 0) setSelectionMode(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCount])

  // Scroll to top on page change
  React.useEffect(() => {
    listViewport.current?.scrollTo({ top: 0 })
  }, [pageIndex])

  // Clamp pageIndex cuando un filtro reduce el total de páginas
  React.useEffect(() => {
    const pc = table.getPageCount()
    if (pc > 0 && pageIndex >= pc) table.setPageIndex(pc - 1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount, pageIndex])

  // ── Bounce helpers (declaradas antes de los useEffect que las usan) ───────────
  function applyBounce() {
    const wrap = pullWrapRef.current
    if (!wrap) return
    wrap.style.transition = "none"
    wrap.style.transform  = `translateX(${bounceX.current}px) translateY(${bounceY.current}px)`
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!pullWrapRef.current) return
      pullWrapRef.current.style.transition = "transform 0.6s cubic-bezier(0.1, 0.8, 0.2, 1.4)"
      bounceX.current = 0
      bounceY.current = 0
      pullWrapRef.current.style.transform  = "translateX(0) translateY(0)"
    }))
  }

  function triggerOverscroll(edge: "top" | "bottom") {
    const glow = edge === "top" ? topGlowRef.current : botGlowRef.current
    bounceY.current = edge === "top" ? 22 : -22
    applyBounce()
    if (glow) {
      glow.style.opacity = "1"
      setTimeout(() => { if (glow) glow.style.opacity = "0" }, 450)
    }
  }

  function triggerPageBoundary(side: "start" | "end") {
    const glow = side === "end" ? rightGlowRef.current : leftGlowRef.current
    bounceX.current = side === "end" ? -22 : 22
    applyBounce()
    if (glow) {
      glow.style.opacity = "1"
      setTimeout(() => { if (glow) glow.style.opacity = "0" }, 450)
    }
  }

  // Android overscroll bounce
  React.useEffect(() => {
    const el = listViewport.current
    if (!el) return
    function onScroll() {
      if (!el) return
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollTop <= 0 && prevScrollTop.current > 0)                               triggerOverscroll("top")
      if (scrollTop + clientHeight >= scrollHeight - 2 &&
          prevScrollTop.current + clientHeight < scrollHeight - 2)                   triggerOverscroll("bottom")
      prevScrollTop.current = scrollTop
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  // Swipe to change page
  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (lpFired.current) { lpFired.current = false; touchStart.current = null; return }
    if (!touchStart.current) return
    const t   = e.changedTouches[0]
    const dx  = t.clientX - touchStart.current.x
    const dy  = t.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) {
      if (!table.getCanNextPage()) { triggerPageBoundary("end"); return }
      setSlideDir("left"); table.nextPage()
    } else {
      if (!table.getCanPreviousPage()) { triggerPageBoundary("start"); return }
      setSlideDir("right"); table.previousPage()
    }
  }

  // Long press → selection mode
  function startLongPress(rowId: string) {
    lpFired.current = false
    lpTimer.current = setTimeout(() => {
      lpFired.current = true
      setSelectionMode(true)
      table.getRow(rowId)?.toggleSelected(true)
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(50)
    }, 500)
  }

  function cancelLongPress() {
    if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null }
  }

  function handleTouchCancel() {
    cancelLongPress()
    lpFired.current = false
    touchStart.current = null
  }

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getColLabel = (cell: any) =>
    typeof cell.column.columnDef.header === "string" ? cell.column.columnDef.header : cell.column.id

  return (
    <>
      {/* Toolbar — checkbox izquierdo + acciones derechas (o bulk cuando hay selección) */}
      <div className={cn(
        "flex items-center gap-2 pl-3 pr-2 py-2 border-b shrink-0 transition-colors duration-200",
        selectedCount > 0 && "bg-primary/5",
      )}>
        {/* Checkbox select-all (solo con rowSelection) */}
        {rowSelection && (
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={table.getIsAllPageRowsSelected() ? true
                : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
              onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
              aria-label="Seleccionar todos"
            />
          </div>
        )}

        {/* Lado derecho: bulk / búsqueda / normal */}
        {selectedCount > 0 ? (
          /* Modo bulk */
          <div className="flex items-center gap-1 flex-1 min-w-0 animate-in fade-in-0 duration-150">
            <span className="text-xs text-muted-foreground flex-1 min-w-0 truncate">
              <span className="font-medium text-foreground">{selectedCount}</span>
              {` seleccionado${selectedCount > 1 ? "s" : ""}`}
            </span>
            {onBulkDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={onBulkDelete} aria-label="Eliminar seleccionados">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Eliminar seleccionados</TooltipContent>
              </Tooltip>
            )}
          </div>
        ) : (
          /* Wrapper animado: ambos estados montados, transición CSS coordinada */
          <div className="relative flex-1 h-8">
            {/* Modo normal — sale hacia la derecha al abrir búsqueda */}
            <div className={cn(
              "absolute inset-0 flex items-center gap-1 transition-[transform,opacity] duration-250 ease-in-out",
              searchOpen ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100",
            )}>
              <div className="flex-1" />
              <Button variant="ghost" size="icon-sm" onClick={openSearch} aria-label="Buscar">
                <Search className="size-4" />
              </Button>
              {onRefresh && (
                <Button variant="ghost" size="icon-sm" onClick={onRefresh} aria-label="Actualizar">
                  <RefreshCw className="size-4" />
                </Button>
              )}
              {onFilter && (
                <Button variant="ghost" size="icon-sm" onClick={onFilter} aria-label="Filtros">
                  <ListFilter className="size-4" />
                </Button>
              )}
              {onAdd && (
                <Button size="icon-sm" onClick={onAdd} aria-label={addLabel}>
                  <Plus className="size-4" />
                </Button>
              )}
            </div>
            {/* Modo búsqueda — entra desde la derecha */}
            <div className={cn(
              "absolute inset-0 flex items-center gap-2 transition-[transform,opacity] duration-250 ease-in-out",
              searchOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none",
            )}>
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Buscar..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8 text-sm flex-1 min-w-0"
              />
              <Button variant="ghost" size="icon-sm" onClick={closeSearch} aria-label="Cerrar búsqueda">
                <X className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Card list */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div ref={topGlowRef} className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-muted-foreground/12 to-transparent pointer-events-none z-10"
          style={{ opacity: 0, transition: "opacity 0.4s ease" }} />
        <div ref={botGlowRef} className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-muted-foreground/12 to-transparent pointer-events-none z-10"
          style={{ opacity: 0, transition: "opacity 0.4s ease" }} />
        <div ref={leftGlowRef} className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-muted-foreground/12 to-transparent pointer-events-none z-10"
          style={{ opacity: 0, transition: "opacity 0.4s ease" }} />
        <div ref={rightGlowRef} className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-muted-foreground/12 to-transparent pointer-events-none z-10"
          style={{ opacity: 0, transition: "opacity 0.4s ease" }} />
        <div ref={pullWrapRef} className="h-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <ScrollArea className="h-full" viewportRef={listViewport}>
            <div
              key={pageIndex}
              className={cn(
                "flex flex-col animate-in fade-in-0 duration-200",
                slideDir === "left" ? "slide-in-from-right-4" : "slide-in-from-left-4",
              )}
            >
              {rows.length === 0 ? (
                <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : rows.map((row: any, i: number) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                // Celdas booleanas (Switch on/off) van al área de acciones, no como campo de texto
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const allDataCells  = row.getVisibleCells().filter((c: any) =>
                  !["__select__", "__spacer__", "__actions__"].includes(c.column.id)
                )
                // Columnas sin accessor (getValue = undefined) o con valor booleano son
                // controles inline (Switch, toggle) → van al área de acciones, no como campo.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const toggleCells   = allDataCells.filter((c: any) => { const v = row.getValue(c.column.id); return v === undefined || typeof v === "boolean" })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const contentCells  = allDataCells.filter((c: any) => { const v = row.getValue(c.column.id); return v !== undefined && typeof v !== "boolean" })
                const titleCell    = contentCells[0]
                const previewCells = contentCells.slice(1, 3)
                const extraCells   = contentCells.slice(3)
                const isExpanded   = expanded.has(row.id)
                const isSelected   = row.getIsSelected()
                return (
                  <div key={row.id}>
                    <div
                      className={cn(
                        "flex gap-2 px-3 py-2.5 cursor-pointer transition-colors select-none",
                        isSelected && "bg-primary/5",
                        striped && i % 2 === 1 && !isSelected && "bg-muted/30",
                      )}
                      onClick={() => selectionMode ? row.toggleSelected() : toggleExpand(row.id)}
                      onTouchStart={() => rowSelection && startLongPress(row.id)}
                      onTouchMove={cancelLongPress}
                      onTouchEnd={cancelLongPress}
                    >
                      {rowSelection && (
                        <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(v) => row.toggleSelected(!!v)}
                            aria-label="Seleccionar fila"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        {titleCell && (
                          <p className="text-sm font-semibold text-foreground [&_*]:!text-foreground">
                            {flexRender(titleCell.column.columnDef.cell, titleCell.getContext())}
                          </p>
                        )}
                        {previewCells.map((cell: any) => (  // eslint-disable-line @typescript-eslint/no-explicit-any
                          <div key={cell.id} className="flex gap-1.5 min-w-0 items-center">
                            <span className="text-xs font-medium text-muted-foreground shrink-0">{getColLabel(cell)}:</span>
                            <span className="text-xs text-foreground min-w-0">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </span>
                          </div>
                        ))}
                        {extraCells.length > 0 && (
                          <div className={cn(
                            "grid transition-[grid-template-rows] duration-300 ease-out",
                            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                          )}>
                            <div className="overflow-hidden">
                              <div className="flex flex-col gap-1 pb-0.5">
                                {extraCells.map((cell: any) => (  // eslint-disable-line @typescript-eslint/no-explicit-any
                                  <div key={cell.id} className="flex gap-1.5 min-w-0 items-center">
                                    <span className="text-xs font-medium text-muted-foreground shrink-0">{getColLabel(cell)}:</span>
                                    <span className="text-xs text-foreground min-w-0">
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {extraCells.length > 0 && (
                          <p className="text-xs text-muted-foreground/50">
                            {isExpanded ? "Toca para ver menos" : "Toca para ver más"}
                          </p>
                        )}
                      </div>
                      {(toggleCells.length > 0 || renderActions || onDeleteRowRequest) && (
                        <div className="shrink-0 self-start flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {toggleCells.map((cell: any) => (  // eslint-disable-line @typescript-eslint/no-explicit-any
                            <div key={cell.id} className="flex items-center">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          ))}
                          {renderActions?.(row.original as TData)}
                          {onDeleteRowRequest && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon-sm"
                                  onClick={() => onDeleteRowRequest(row.original as TData)}
                                  aria-label="Eliminar">
                                  <Trash2 className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left" avoidCollisions={false}>Eliminar</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      )}
                    </div>
                    {i < rows.length - 1 && <Separator />}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Pagination footer */}
      <div className="px-3 h-10 border-t shrink-0 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{from}–{to}</span>
          {" "}de{" "}
          <span className="font-medium text-foreground">{totalCount}</span>
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => { setSlideDir("right"); table.previousPage() }}
            aria-label="Página anterior">
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-xs text-muted-foreground px-1 tabular-nums">
            Página{" "}
            <span className="font-medium text-foreground">{pageIndex + 1}</span>
            {" "}de{" "}
            <span className="font-medium text-foreground">{pageCount}</span>
          </span>
          <Button variant="ghost" size="icon-sm"
            disabled={!table.getCanNextPage()}
            onClick={() => { setSlideDir("left"); table.nextPage() }}
            aria-label="Página siguiente">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </>
  )
}

// ─── DataTable component ──────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  /** Definición de columnas creada con `ColumnDef<TData, TValue>[]` */
  columns:       ColumnDef<TData, TValue>[]
  /** Array de datos a mostrar */
  data:          TData[]
  /** Número de filas por página (default 10) */
  pageSize?:     number
  /** Mostrar paginación (default true cuando hay más filas que pageSize) */
  pagination?:   boolean
  /** Placeholder cuando no hay filas */
  emptyText?:    string
  className?:    string
  /** Habilitar ordenación en columnas (default true) */
  sortable?:     boolean
  /** Mostrar checkboxes de selección de filas */
  rowSelection?: boolean
  /** Mostrar input de búsqueda global */
  globalFilter?: boolean
  /** Mostrar botón para ocultar/mostrar columnas */
  columnToggle?: boolean
  /** Filas con fondo alternado */
  striped?:      boolean
  /** Borde exterior del contenedor (default true) */
  border?:       boolean
  /** Bordes verticales entre columnas */
  bordered?:     boolean
  /** Permitir redimensionar columnas arrastrando el borde */
  resizable?:    boolean
  /** Mostrar botón de altura de fila */
  rowDensity?:   boolean
  /** Permitir reordenar columnas arrastrando el encabezado */
  reorder?:      boolean
  /** Callback al hacer clic en una fila */
  onRowClick?:   (row: TData) => void
  /** Callback del botón Agregar (primary). Si no se pasa, el botón no aparece */
  onAdd?:        () => void
  /** Etiqueta del botón Agregar (default: "Nueva") */
  addLabel?:     string
  /** Render de acciones por fila en columna fija derecha. Si no se pasa, la columna no aparece */
  rowActions?:      (row: TData) => React.ReactNode
  /** Acción única directa — muestra el ícono como botón con tooltip, sin menú de elipsis */
  rowDirectAction?: RowDirectAction<TData>
  /** Acción masiva editar (aparece cuando ≥2 filas seleccionadas) */
  onBulkEdit?:    (rows: TData[]) => void
  /** Acción masiva eliminar — muestra diálogo de confirmación antes de ejecutar */
  onBulkDelete?:  (rows: TData[]) => void
  /** Eliminar fila individual — muestra diálogo de confirmación antes de ejecutar */
  onDeleteRow?:   (row: TData) => void
  /** Callback del botón Actualizar. Si no se pasa, el botón no aparece */
  onRefresh?:     () => void
  /** Callback del botón Filtros. Si no se pasa, el botón no aparece */
  onFilter?:      () => void
  /** Render como lista de tarjetas expandibles (vista mobile) en lugar de tabla */
  mobileView?:    boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize     = 10,
  pagination   = true,
  emptyText    = "Sin resultados.",
  className,
  border       = true,
  sortable     = false,
  rowSelection = false,
  globalFilter = false,
  columnToggle = false,
  striped      = false,
  bordered     = false,
  resizable    = false,
  rowDensity   = false,
  reorder      = false,
  onRowClick,
  onAdd,
  addLabel,
  rowActions,
  rowDirectAction,
  onBulkEdit,
  onBulkDelete,
  onDeleteRow,
  onRefresh,
  onFilter,
  mobileView   = false,
}: DataTableProps<TData, TValue>) {
  const [sorting,          setSorting]          = React.useState<SortingState>([])
  const [columnFilters,    setColumnFilters]    = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelectionState,setRowSelectionState]= React.useState<RowSelectionState>({})
  const [searchValue,      setSearchValue]      = React.useState("")
  const [density,          setDensity]          = React.useState<RowDensity>("default")
  const [columnOrder,      setColumnOrder]      = React.useState<string[]>([])
  const [columnSizing,     setColumnSizing]     = React.useState<ColumnSizingState>({})
  const measuredSigRef                          = React.useRef<string | null>(null)
  // Tamaños medidos por contenido: sirven como "default" al hacer doble clic en el handle
  const contentSizesRef                         = React.useRef<Record<string, number>>({})
  const [draggingId,       setDraggingId]       = React.useState<string | null>(null)
  const [dragOverId,       setDragOverId]       = React.useState<string | null>(null)
  const [pendingDeleteRow, setPendingDeleteRow] = React.useState<TData | null>(null)
  const [bulkDeleteOpen,   setBulkDeleteOpen]   = React.useState(false)
  const [paginationState,  setPaginationState]  = React.useState({
    pageIndex: 0,
    pageSize:  pagination ? pageSize : 999999,
  })

  // Render-props de acciones vía refs estables: la columna __actions__ los lee sin
  // que cambie la identidad de `resolvedColumns` en cada render (evita reset de estado).
  const hasActions          = !!(rowActions || rowDirectAction || onDeleteRow)
  const rowActionsRef       = React.useRef(rowActions)
  rowActionsRef.current     = rowActions
  const rowDirectActionRef  = React.useRef<RowDirectAction<TData> | undefined>(rowDirectAction)
  rowDirectActionRef.current = rowDirectAction
  const deleteRowRef        = React.useRef<((row: TData) => void) | undefined>(undefined)
  deleteRowRef.current      = onDeleteRow ? (row) => setPendingDeleteRow(row) : undefined

  // Sync when pageSize or pagination prop changes
  React.useEffect(() => {
    setPaginationState(prev => ({ ...prev, pageSize: pagination ? pageSize : 999999 }))
  }, [pageSize, pagination])

  // Reset column order when resizable or reorder changes
  React.useEffect(() => {
    setColumnOrder([])
    setDraggingId(null)
    setDragOverId(null)
  }, [resizable, reorder])

  // Firma del conjunto columnas/datos. Cuando cambia, se vuelve a medir.
  // Usamos un ref (no estado) para evitar el efecto pasivo de reset que competía
  // con el layout effect de medición y dejaba la tabla atrapada en modo medición.
  const measureSig = `${resizable}|${rowSelection}|${hasActions}|${columns.length}|${data.length}`

  // measuring: primera pasada en modo resizable, mide el ancho natural por columna.
  // Tras medir, el modo fijo (table-fixed con anchos por contenido) se deriva de !fitContent.
  const measuring = resizable && measuredSigRef.current !== measureSig

  // El td no controla la altura — solo elimina el padding vertical para que el div
  // interno pueda tomar exactamente el espacio fijo definido por densityInnerClass.
  const densityCellClass = "!py-0"

  // Altura fija por densidad aplicada al div interno: sm=32px · default=38px · lg=44px.
  // El overflow-hidden corta el contenido al alto fijo sin afectar el auto-sizing de columnas
  // (el algoritmo table-layout:auto mide el ancho intrínseco antes de aplicar overflow).
  const densityInnerClass: Record<RowDensity, string> = {
    sm:      "h-8         overflow-hidden",
    default: "h-[38px]    overflow-hidden",
    lg:      "h-11        overflow-hidden",
  }

  const resolvedColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    const base = rowSelection
      ? [buildSelectionColumn<TData>() as ColumnDef<TData, TValue>, ...columns]
      : columns
    const withSpacer = [...base, buildSpacerColumn<TData>() as ColumnDef<TData, TValue>]
    return hasActions
      ? [...withSpacer, buildActionsColumn<TData>(rowActionsRef, deleteRowRef, rowDirectActionRef) as ColumnDef<TData, TValue>]
      : withSpacer
  }, [columns, rowSelection, hasActions])

  const table = useReactTable({
    data,
    columns:            resolvedColumns,
    enableSorting:      sortable,
    enableRowSelection: rowSelection,
    columnResizeMode:   "onChange",
    enableColumnResizing: resizable,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: rowSelectionState,
      globalFilter: searchValue,
      columnOrder,
      columnSizing,
      pagination:   paginationState,
    },
    onSortingChange:          setSorting,
    onColumnFiltersChange:    setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange:     setRowSelectionState,
    onGlobalFilterChange:     setSearchValue,
    onColumnOrderChange:      setColumnOrder,
    onColumnSizingChange:     setColumnSizing,
    onPaginationChange:       setPaginationState,
    globalFilterFn:           "includesString",
    // autoResetPageIndex=false: evita que TanStack resetee pageIndex (vía
    // onPaginationChange→setPaginationState) durante el montaje bajo React
    // StrictMode, lo que disparaba el warning "state update on a component that
    // hasn't mounted yet". Trade-off: tras filtrar/borrar la tabla no vuelve sola
    // a la página 1 (ver clamp de pageIndex más abajo).
    autoResetPageIndex:       false,
    getCoreRowModel:          getCoreRowModel(),
    getSortedRowModel:        getSortedRowModel(),
    getFilteredRowModel:      getFilteredRowModel(),
    getPaginationRowModel:    getPaginationRowModel(),
  })

  // Clamp de pageIndex: compensa autoResetPageIndex=false. Si el conjunto filtrado
  // se achica (filtrar/borrar) y la página actual queda fuera de rango, vuelve a la
  // última página válida. Es un efecto pasivo (corre tras el commit) → no reintroduce
  // el warning de StrictMode que resuelve autoResetPageIndex=false.
  const pageCount = table.getPageCount()
  React.useEffect(() => {
    if (paginationState.pageIndex > 0 && paginationState.pageIndex > pageCount - 1) {
      setPaginationState(p => ({ ...p, pageIndex: Math.max(0, pageCount - 1) }))
    }
  }, [pageCount, paginationState.pageIndex])

  const handleColumnDragStart = (id: string) => { setDraggingId(id); setDragOverId(null) }
  const handleColumnDragOver  = (id: string) => { if (draggingId !== id) setDragOverId(id) }
  const handleColumnDrop      = (toId: string) => {
    if (draggingId && draggingId !== toId) {
      const leaf   = table.getAllLeafColumns().map((c: { id: string }) => c.id)
      const fixed  = ["__select__", "__spacer__", "__actions__"]
      const middle = leaf.filter((id: string) => !fixed.includes(id))
      const next   = [
        ...(leaf.includes("__select__") ? ["__select__"] : []),
        ...reorderColumns(middle, draggingId, toId),
        "__spacer__",
        ...(leaf.includes("__actions__") ? ["__actions__"] : []),
      ]
      setColumnOrder(next)
    }
    setDraggingId(null)
    setDragOverId(null)
  }
  const handleColumnDragEnd   = () => { setDraggingId(null); setDragOverId(null) }

  const showPagination = pagination

  return (
    <div className={cn("flex flex-col flex-1 min-h-0 bg-background rounded-lg", className)}>
      <div className={cn("flex-1 rounded-lg overflow-hidden flex flex-col", border && "border border-border")}>
        {mobileView ? (
          <DataTableMobileView<TData>
            table={table}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            striped={striped}
            rowSelection={rowSelection}
            onAdd={onAdd}
            addLabel={addLabel}
            onBulkDelete={onBulkDelete ? () => setBulkDeleteOpen(true) : undefined}
            onRefresh={onRefresh}
            onFilter={onFilter}
            renderActions={rowActions}
            onDeleteRowRequest={onDeleteRow ? (row) => setPendingDeleteRow(row as TData) : undefined}
            emptyText={emptyText}
          />
        ) : (
          <>
            <DataTableToolbar
              table={table}
              showSearch={globalFilter}
              showToggle={columnToggle}
              showDensity={rowDensity}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              density={density}
              onDensityChange={setDensity}
              onResetOrder={() => setColumnOrder([])}
              onAdd={onAdd}
              addLabel={addLabel}
              onBulkDelete={onBulkDelete ? () => setBulkDeleteOpen(true) : undefined}
              onRefresh={onRefresh}
              onFilter={onFilter}
            />
            <DataTableContent
              table={table}
              bordered={bordered}
              resizable={resizable}
              measuring={measuring}
              reorder={reorder}
              striped={striped}
              density={density}
              densityCellClass={densityCellClass}
              densityInnerClass={densityInnerClass[density]}
              emptyText={emptyText}
              onMeasured={(sizes) => { measuredSigRef.current = measureSig; contentSizesRef.current = sizes; setColumnSizing(sizes) }}
              contentSizes={contentSizesRef.current}
              onOptimalPageSize={pagination ? (n) =>
                setPaginationState(p => p.pageSize === n ? p : { pageIndex: 0, pageSize: n })
              : undefined}
              dragOverId={dragOverId}
              draggingId={draggingId}
              onColumnDragStart={handleColumnDragStart}
              onColumnDragOver={handleColumnDragOver}
              onColumnDrop={handleColumnDrop}
              onColumnDragEnd={handleColumnDragEnd}
              onRowClick={onRowClick}
            />
            {showPagination && <DataTablePagination table={table} />}
          </>
        )}
      </div>

      {/* ── Diálogo: eliminar fila individual ────────────────────────────── */}
      <AlertDialog open={pendingDeleteRow !== null} onOpenChange={(o) => { if (!o) setPendingDeleteRow(null) }}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar elemento?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => {
              if (pendingDeleteRow !== null) { onDeleteRow!(pendingDeleteRow); setPendingDeleteRow(null) }
            }}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Diálogo: eliminación masiva ───────────────────────────────────── */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={(o) => { if (!o) setBulkDeleteOpen(false) }}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {`¿Eliminar ${table.getFilteredSelectedRowModel().rows.length} elemento(s)?`}
            </AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onBulkDelete!(table.getFilteredSelectedRowModel().rows.map((r: any) => r.original))
              setBulkDeleteOpen(false)
            }}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
