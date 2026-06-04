"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
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
  ChevronLeft, ChevronRight, Search, SlidersHorizontal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
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

// ─── Re-export for convenience ────────────────────────────────────────────────
export type { ColumnDef }
export { flexRender }

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ChevronUp   className="size-3.5 shrink-0" />
  if (direction === "desc") return <ChevronDown className="size-3.5 shrink-0" />
  return <ChevronsUpDown className="size-3.5 shrink-0 opacity-40" />
}

// ─── Selection column factory ─────────────────────────────────────────────────

function buildSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "__select__",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Seleccionar todo"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Seleccionar fila"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    ),
  }
}

// ─── Column visibility toggle ─────────────────────────────────────────────────

type AnyTable = ReturnType<typeof useReactTable<any>> // eslint-disable-line @typescript-eslint/no-explicit-any

function ColumnToggle({ table }: { table: AnyTable }) {
  const hideable = table.getAllColumns().filter((c: { getCanHide: () => boolean }) => c.getCanHide())
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <SlidersHorizontal className="size-3.5" />
          Columnas
          <ChevronDown className="size-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
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

// ─── Toolbar (search + column toggle) ────────────────────────────────────────

interface ToolbarProps {
  table:          AnyTable
  showSearch:     boolean
  showToggle:     boolean
  searchValue:    string
  onSearchChange: (v: string) => void
}

function DataTableToolbar({ table, showSearch, showToggle, searchValue, onSearchChange }: ToolbarProps) {
  if (!showSearch && !showToggle) return null
  return (
    <div className="flex items-center gap-2 pb-3 shrink-0">
      {showSearch && (
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      )}
      {showToggle && <ColumnToggle table={table} />}
    </div>
  )
}

// ─── Pagination footer ────────────────────────────────────────────────────────

function DataTablePagination({ table }: { table: AnyTable }) {
  const { pageIndex, pageSize } = table.getState().pagination
  const total = table.getFilteredRowModel().rows.length
  const from  = total === 0 ? 0 : pageIndex * pageSize + 1
  const to    = Math.min((pageIndex + 1) * pageSize, total)

  return (
    <div className="flex items-center justify-between pt-3 shrink-0">
      <span className="text-xs text-muted-foreground">
        Mostrando{" "}
        <span className="font-medium text-foreground">{from}–{to}</span>
        {" "}de{" "}
        <span className="font-medium text-foreground">{total}</span>
        {" "}filas
      </span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-xs px-1 tabular-nums text-muted-foreground">
          {pageIndex + 1} / {table.getPageCount()}
        </span>
        <Button variant="outline" size="icon-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Selection summary ────────────────────────────────────────────────────────

function SelectionSummary({ table }: { table: AnyTable }) {
  const selected = table.getFilteredSelectedRowModel().rows.length
  const total    = table.getFilteredRowModel().rows.length
  if (selected === 0) return null
  return (
    <p className="text-xs text-muted-foreground pt-1.5 shrink-0">
      {selected} de {total} fila(s) seleccionada(s)
    </p>
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
  /** Bordes verticales entre columnas */
  bordered?:     boolean
  /** Callback al hacer clic en una fila */
  onRowClick?:   (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize     = 10,
  pagination   = true,
  emptyText    = "Sin resultados.",
  className,
  sortable     = true,
  rowSelection = false,
  globalFilter = false,
  columnToggle = false,
  striped      = false,
  bordered     = false,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting,          setSorting]          = React.useState<SortingState>([])
  const [columnFilters,    setColumnFilters]    = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelectionState,setRowSelectionState]= React.useState<RowSelectionState>({})
  const [searchValue,      setSearchValue]      = React.useState("")

  const resolvedColumns = React.useMemo<ColumnDef<TData, TValue>[]>(
    () => rowSelection
      ? [buildSelectionColumn<TData>() as ColumnDef<TData, TValue>, ...columns]
      : columns,
    [columns, rowSelection],
  )

  const table = useReactTable({
    data,
    columns:      resolvedColumns,
    enableSorting: sortable,
    enableRowSelection: rowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: rowSelectionState,
      globalFilter: searchValue,
    },
    onSortingChange:          setSorting,
    onColumnFiltersChange:    setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange:     setRowSelectionState,
    onGlobalFilterChange:     setSearchValue,
    getCoreRowModel:          getCoreRowModel(),
    getSortedRowModel:        getSortedRowModel(),
    getFilteredRowModel:      getFilteredRowModel(),
    getPaginationRowModel:    getPaginationRowModel(),
    initialState:             { pagination: { pageSize } },
  })

  const showPagination = pagination && data.length > pageSize

  return (
    <div className={cn("flex flex-col", className)}>
      <DataTableToolbar
        table={table}
        showSearch={globalFilter}
        showToggle={columnToggle}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <div className="flex-1 rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/50 hover:bg-muted/50">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        canSort && "cursor-pointer select-none",
                        bordered && "border-r last:border-r-0",
                      )}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1.5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && <SortIcon direction={header.column.getIsSorted()} />}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={cn(
                    striped && i % 2 === 1 && "bg-muted/30",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn(bordered && "border-r last:border-r-0")}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={resolvedColumns.length} className="h-24 text-center text-muted-foreground">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {rowSelection && <SelectionSummary table={table} />}
      {showPagination && <DataTablePagination table={table} />}
    </div>
  )
}
