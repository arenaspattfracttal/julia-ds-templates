"use client"

import { useState }                              from "react"
import { ArrowLeft, FileDown, Plus, MoreVertical, Trash2 } from "lucide-react"
import { Button }     from "@/components/ui/button"
import { Input }      from "@/components/ui/input"
import { Label }      from "@/components/ui/label"
import { Textarea }   from "@/components/ui/textarea"
import { Separator }  from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { useScreenMode }              from "../screen-mode-context"
import { cn }                         from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────

type ItemData = {
  id:          string
  description: string
  quantity:    string
  unitCost:    string
  tax:         string
  total:       string
}

const ITEMS_DATA: ItemData[] = [
  {
    id:          "1",
    description: "TOTAL OIL 10w-60 / 1/4 Total prueab { A15 }",
    quantity:    "65,222",
    unitCost:    "$ COP 10,768.29",
    tax:         "Exento",
    total:       "$ COP 702,329,412.93",
  },
]

type TotalEntry = {
  label:  string
  value:  string
  sub?:   string
  input?: boolean
  bold?:  boolean
}

const TOTALS: TotalEntry[] = [
  { label: "Neto",      value: "$ COP 702,329,412.93"                },
  { label: "Descuento", value: "$ COP 0",               input: true  },
  { label: "Sub total", value: "$ COP 702,329,412.93"                },
  { label: "Exento",    value: "$ COP 702,329,412.93",  sub:   "0 %" },
  { label: "Total",     value: "$ COP 702,329,412.93",  bold:  true  },
]

// ─── Vista mobile: lista expandible de ítems ─────────────────────────────────

function MobileFieldRow({ label, value, children }: {
  label: string; value?: string; children?: React.ReactNode
}) {
  return (
    <div className="flex gap-1.5 min-w-0 items-center">
      <span className="text-xs font-medium text-muted-foreground shrink-0">{label}:</span>
      {children ?? <span className="text-xs text-foreground truncate">{value}</span>}
    </div>
  )
}

function ItemsMobileList({ rows }: { rows: ItemData[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="flex flex-col">
        {rows.map((item, i) => {
          const isExpanded = expanded.has(item.id)
          return (
            <div key={item.id}>
              <div
                className="flex gap-2 px-3 py-2.5 cursor-pointer transition-colors"
                onClick={() => toggleExpand(item.id)}
              >
                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.description}</p>
                  <MobileFieldRow label="Cantidad" value={item.quantity} />

                  {/* Expandido animado con grid-rows */}
                  <div className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}>
                    <div className="overflow-hidden">
                      <div className="mt-1 flex flex-col gap-1">
                        <MobileFieldRow label="Costo unitario" value={item.unitCost} />
                        <MobileFieldRow label="Impuesto"       value={item.tax} />
                        <MobileFieldRow label="Costo Total"    value={item.total} />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground/50 mt-1">
                    {isExpanded ? "Toca para ver menos" : "Toca para ver más"}
                  </p>
                </div>

                {/* Elipsis */}
                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Acciones">
                        <MoreVertical className="size-3.5 text-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="size-4 text-destructive" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {i < rows.length - 1 && <Separator />}
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-xs text-muted-foreground">{children}</Label>
}

function FormField({
  label, value, disabled, className,
}: {
  label: string; value?: string; disabled?: boolean; className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <FieldLabel>{label}</FieldLabel>
      <Input defaultValue={value} disabled={disabled} />
    </div>
  )
}

function TotalRow({ label, value, sub, input: isInput, bold }: TotalEntry) {
  return (
    <div className="flex items-center justify-between gap-4 min-h-[32px]">
      <div className="flex items-center gap-2 shrink-0">
        <span className={cn(
          "text-sm",
          bold ? "font-semibold text-foreground" : "text-muted-foreground",
        )}>
          {label}
        </span>
        {sub && <span className="text-xs text-muted-foreground tabular-nums">{sub}</span>}
      </div>
      {isInput ? (
        <Input className="h-7 w-36 text-right tabular-nums text-sm" defaultValue={value} />
      ) : (
        <span className={cn(
          "text-sm tabular-nums",
          bold ? "font-semibold text-foreground" : "text-muted-foreground",
        )}>
          {value}
        </span>
      )}
    </div>
  )
}

// ─── Card 1: Formulario de cabecera ───────────────────────────────────────────

function FormCard() {
  const screenMode          = useScreenMode()
  const isMobile            = screenMode === "mobile"
  const isDesktop           = screenMode === "desktop"
  const [proveedor, setProveedor] = useState("aaaa")

  const gridCls  = isMobile ? "grid-cols-1" : screenMode === "tablet" ? "grid-cols-2" : "grid-cols-4"
  const halfSpan = isDesktop ? "col-span-2" : "col-span-1"

  return (
    <div className={cn("rounded-lg border bg-background p-4 shrink-0 grid gap-x-4 gap-y-3", gridCls)}>

      {/* Fila 1 */}
      <FormField label="Orden de Trabajo" value="WO-268-2026" disabled />
      <FormField
        label="Activo"
        value="Aire Acondicionado · Habitación 104 · Barranquilla ( HLP-BAQ-H104-AA )"
        disabled
      />

      {/* Proveedor — clearable integrado en el trigger */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Proveedor</FieldLabel>
        <Select value={proveedor} onValueChange={setProveedor}>
          <SelectTrigger
            className="w-full"
            clearable
            onClear={proveedor ? () => setProveedor("") : undefined}
          >
            <SelectValue placeholder="Seleccionar proveedor..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aaaa">AAAA COMERCIAL HISPANA LIMITADA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FormField label="Referencia" />

      {/* Fila 2 */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Centro de costo</FieldLabel>
        <Select>
          <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cc1">Centro 1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Condiciones</FieldLabel>
        <Select>
          <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="c1">Condición 1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FormField label="Moneda" value="Colombian Peso" disabled />
      <FormField label="Valor de Cambio" value="$ COP  1" />

      {/* Fila 3 — mitad de ancho */}
      <div className={cn("flex flex-col gap-1.5", halfSpan)}>
        <FieldLabel>Prioridad</FieldLabel>
        <Select defaultValue="media">
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="baja">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={cn("flex flex-col gap-1.5", halfSpan)}>
        <FieldLabel>Nota</FieldLabel>
        <Textarea className="resize-none" placeholder="Escribe una nota..." />
      </div>

      {/* Fila 4 — mitad de ancho */}
      <div className={cn("flex flex-col gap-1.5", halfSpan)}>
        <FieldLabel>Nota Estado</FieldLabel>
        <Textarea className="resize-none" placeholder="Escribe una nota de estado..." />
      </div>

    </div>
  )
}

// ─── Card 2: Ítems ────────────────────────────────────────────────────────────

function ItemsCard() {
  const screenMode = useScreenMode()
  const isMobile   = screenMode === "mobile"

  return (
    <div className="rounded-lg border bg-background overflow-hidden shrink-0 flex flex-col">

      {/* Cabecera */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-foreground">Ítems</span>
        <Button size="sm">
          <Plus className="size-3.5" />
          Agregar
        </Button>
      </div>

      <Separator />

      {/* Vista mobile: lista expandible */}
      {isMobile && <ItemsMobileList rows={ITEMS_DATA} />}

      {/* Vista desktop/tablet: tabla */}
      {!isMobile && (
        <ScrollArea horizontal>
          <Table wrapperClassName="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[280px]">Descripción</TableHead>
                <TableHead className="min-w-[100px] text-right">Cantidad</TableHead>
                <TableHead className="min-w-[160px] text-right">Costo unitario</TableHead>
                <TableHead className="min-w-[100px]">Impuesto</TableHead>
                <TableHead className="min-w-[180px] text-right pr-6">Costo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ITEMS_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {item.unitCost}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.tax}</TableCell>
                  <TableCell className="text-right tabular-nums pr-6">{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}

      {/* Totales — panel derecho */}
      <div className="border-t px-6 py-4 flex justify-end">
        <div className="w-80 flex flex-col gap-2">
          {TOTALS.map((entry, i) => (
            <div key={entry.label}>
              {i === TOTALS.length - 1 && <Separator className="mb-1" />}
              <TotalRow {...entry} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── Exported screen ──────────────────────────────────────────────────────────

export function PresupuestoDetalle() {
  const screenMode = useScreenMode()
  const isMobile   = screenMode === "mobile"
  const isCompact  = screenMode !== "desktop"

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      {isMobile
        ? <TopbarBarMobile title="Tareas" subtitle="Presupuestos" />
        : <TopbarBar title="Tareas" subtitle="Presupuestos" showSearch={false} />
      }

      {/* 2 — Contenido principal sobre fondo muted */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* 2a — Toolbar card */}
        <div className="shrink-0 flex items-center justify-between rounded-lg border bg-background p-3 gap-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium text-foreground">Presupuesto</span>
          </div>
          <Button size={isCompact ? "icon-sm" : "sm"}>
            <FileDown className="size-4" />
            {!isCompact && "Abrir PDF"}
          </Button>
        </div>

        {/* 2b — Dos cards scrolleables */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col gap-2 pb-2">
            <FormCard />
            <ItemsCard />
          </div>
        </ScrollArea>

      </div>
    </div>
  )
}
