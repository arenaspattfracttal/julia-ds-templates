"use client"

import { useState } from "react"
import { Star, EllipsisVertical, Eye, Pencil, Trash2, DollarSign, ArrowLeftRight } from "lucide-react"
import { Button }       from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable, type ColumnDef } from "@/components/ui/data-table"
import { cn } from "@/lib/utils"

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Impuesto = {
  id:             number
  favorito:       boolean
  nombreEsquema:  string
  nombreImpuesto: string
  tasa:           number
}

type Moneda = {
  id:     number
  divisa: string
  valor:  string
  fecha:  string
}

// ─── Datos ────────────────────────────────────────────────────────────────────

const IMPUESTOS_DATA: Impuesto[] = [
  { id:  1, favorito: true,  nombreEsquema: "Exento",                              nombreImpuesto: "Exento",          tasa:  0 },
  { id:  2, favorito: false, nombreEsquema: "Hackaton",                            nombreImpuesto: "Hackaton ejm",    tasa: 25 },
  { id:  3, favorito: false, nombreEsquema: "Impuesto al valor agregado",          nombreImpuesto: "IVA 5",           tasa:  5 },
  { id:  4, favorito: false, nombreEsquema: "Impuesto al valor agregado",          nombreImpuesto: "IVA",             tasa: 16 },
  { id:  5, favorito: false, nombreEsquema: "Impuesto al Valor Agregado Chile",    nombreImpuesto: "IVA cl",          tasa: 19 },
  { id:  6, favorito: false, nombreEsquema: "Impuesto al Valor Agregado Colombia", nombreImpuesto: "IVA co",          tasa: 19 },
  { id:  7, favorito: false, nombreEsquema: "Impuesto al valor agregado Honduras", nombreImpuesto: "IVA HONDURAS",    tasa: 12 },
  { id:  8, favorito: false, nombreEsquema: "IMPUESTO BRASIL",                     nombreImpuesto: "IMPOSTO BRASIL",  tasa: 15 },
  { id:  9, favorito: false, nombreEsquema: "Impuesto del valo",                   nombreImpuesto: "Aiva",            tasa: 21 },
  { id: 10, favorito: false, nombreEsquema: "Impuesto Valor Agregado Argentina",   nombreImpuesto: "IVA Argentina",   tasa: 21 },
  { id: 11, favorito: false, nombreEsquema: "IVA BQUILLA",                         nombreImpuesto: "IVA",             tasa: 10 },
  { id: 12, favorito: false, nombreEsquema: "Iva iva",                             nombreImpuesto: "iva",             tasa: 21 },
  { id: 13, favorito: false, nombreEsquema: "No usar",                             nombreImpuesto: "No usar",         tasa: 10 },
  { id: 14, favorito: false, nombreEsquema: "Taxa Máxima",                         nombreImpuesto: "Taxa Máxima",     tasa: 23 },
]

const MONEDAS_DATA: Moneda[] = [
  { id: 1, divisa: "US Dollar", valor: "$ COP 3,759.00", fecha: "2026-03-10 12:21" },
]

// ─── Columnas impuestos ───────────────────────────────────────────────────────

function ImpuestosTable({ isCompact }: { isCompact: boolean }) {
  const [data, setData] = useState<Impuesto[]>(IMPUESTOS_DATA)

  function toggleFavorito(id: number) {
    setData(prev => prev.map(r => r.id === id ? { ...r, favorito: !r.favorito } : r))
  }

  const columns: ColumnDef<Impuesto>[] = [
    {
      id: "favorito",
      size: 44,
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-xs"
          className={cn(
            "transition-colors",
            row.original.favorito ? "text-primary" : "text-muted-foreground/40 hover:text-muted-foreground",
          )}
          onClick={() => toggleFavorito(row.original.id)}
          aria-label={row.original.favorito ? "Quitar favorito" : "Marcar favorito"}
        >
          <Star className={cn("size-4", row.original.favorito && "fill-current")} />
        </Button>
      ),
    },
    {
      accessorKey: "nombreEsquema",
      header: "Nombre del esquema de impuestos",
    },
    {
      accessorKey: "nombreImpuesto",
      header: "Nombre del impuesto",
    },
    {
      accessorKey: "tasa",
      header: "Tasa de impuesto (%)",
      cell: ({ row }) => `${row.original.tasa.toFixed(3)} %`,
    },
  ]

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      <DataTable
        columns={columns}
        data={data}
        border={false}
        resizable
        reorder
        rowSelection
        globalFilter
        columnToggle
        rowDensity
        onAdd={() => {}}
        addLabel={isCompact ? undefined : "Nuevo impuesto"}
        onRefresh={() => {}}
        rowActions={(_row) => (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs" aria-label="Acciones">
                    <EllipsisVertical className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="left" avoidCollisions={false}>Acciones</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Eye className="size-3.5" />Ver</DropdownMenuItem>
              <DropdownMenuItem><Pencil className="size-3.5" />Editar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive"><Trash2 className="size-3.5" />Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        onBulkDelete={() => {}}
        mobileView={isCompact}
      />
    </div>
  )
}

// ─── Columnas monedas ─────────────────────────────────────────────────────────

const MONEDAS_COLUMNS: ColumnDef<Moneda>[] = [
  { accessorKey: "divisa", header: "Divisas (FOREX, FX)" },
  { accessorKey: "valor",  header: "Valor de Cambio" },
  { accessorKey: "fecha",  header: "Fecha" },
]

function MonedasTable({ isCompact }: { isCompact: boolean }) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      <DataTable
        columns={MONEDAS_COLUMNS}
        data={MONEDAS_DATA}
        border={false}
        resizable
        reorder
        rowSelection
        globalFilter
        columnToggle
        rowDensity
        onAdd={() => {}}
        addLabel={isCompact ? undefined : "Nuevo cambio"}
        onRefresh={() => {}}
        rowActions={(_row) => (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs" aria-label="Acciones">
                    <EllipsisVertical className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="left" avoidCollisions={false}>Acciones</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Eye className="size-3.5" />Ver</DropdownMenuItem>
              <DropdownMenuItem><Pencil className="size-3.5" />Editar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive"><Trash2 className="size-3.5" />Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        onBulkDelete={() => {}}
        mobileView={isCompact}
      />
    </div>
  )
}

// ─── Export principal ─────────────────────────────────────────────────────────

export function FinancieroContent({ isCompact, navId }: { isCompact: boolean; navId?: string }) {
  if (navId === "fin-moneda") {
    return <MonedasTable isCompact={isCompact} />
  }
  return <ImpuestosTable isCompact={isCompact} />
}
