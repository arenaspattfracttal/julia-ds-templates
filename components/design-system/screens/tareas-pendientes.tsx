"use client"

import { useState } from "react"
import {
  Eye, Trash2, ListFilter,
  Columns3, CalendarDays, ListChecks, Layers, EllipsisVertical,
} from "lucide-react"
import { Button }      from "@/components/ui/button"
import { Badge }       from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DataTable, type ColumnDef } from "@/components/ui/data-table"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { useScreenMode } from "../screen-mode-context"

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type ViewTab = "kanban" | "calendario" | "tareas" | "ordenes"
const TABS: { id: ViewTab; label: string; icon: React.ElementType }[] = [
  { id: "kanban",     label: "Kanban",            icon: Columns3     },
  { id: "calendario", label: "Calendario",         icon: CalendarDays },
  { id: "tareas",     label: "Tareas pendientes",  icon: ListChecks   },
  { id: "ordenes",    label: "Órdenes de trabajo", icon: Layers       },
]

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────

type Tarea = {
  id:             number
  codigo:         string
  activo:         string
  tarea:          string
  activador:      string
  subtareas:      number
  atraso:         number
  plan:           string
  fechaCalc:      string
  fechaProg:      string
  fueraServicio:  number
  enServicio:     boolean
  recursos:       number
  ubicado:        string
}

const ROWS: Tarea[] = [
  { id:  1, codigo: "abc-9876543-321xyz", activo: "Refrigerador portatil",    tarea: "Inspección de man.",    activador: "Cada 24 horas",  subtareas: 5, atraso: 30, plan: "Revisión semanal",  fechaCalc: "2026-01-15", fechaProg: "2026-01-15", fueraServicio: 5, enServicio: true,  recursos: 5, ubicado: "Grupo/Italia/audi/norte" },
  { id:  2, codigo: "xyz-9876543-321abc", activo: "Refrigerador para u.",     tarea: "Revisar mantenimi.",   activador: "Cada 24 horas",  subtareas: 6, atraso: 20, plan: "Revisión semanal",  fechaCalc: "2026-01-15", fechaProg: "2026-01-15", fueraServicio: 6, enServicio: true,  recursos: 6, ubicado: "Grupo/Italia/audi/norte" },
  { id:  3, codigo: "def-9876543-321uv.", activo: "Refrigerador industr.",    tarea: "Revisar el sistema.", activador: "Cada 12 horas",  subtareas: 3, atraso: 50, plan: "Revisión diaria",   fechaCalc: "2026-01-16", fechaProg: "2026-01-16", fueraServicio: 3, enServicio: true,  recursos: 3, ubicado: "Grupo/Italia/audi/norte" },
  { id:  4, codigo: "uvw-9876543-321d",   activo: "Refrigerador domé.",       tarea: "Inspección de func.", activador: "Cada semana",    subtareas: 4, atraso: 15, plan: "Revisión mensual", fechaCalc: "2026-01-20", fechaProg: "2026-01-20", fueraServicio: 4, enServicio: true,  recursos: 4, ubicado: "Grupo/Italia/audi/norte" },
  { id:  5, codigo: "mno-9876543-321",    activo: "Refrigerador de ex.",      tarea: "Calibración de tem.", activador: "Cada 48 horas",  subtareas: 2, atraso: 40, plan: "Revisión semanal",  fechaCalc: "2026-01-25", fechaProg: "2026-01-25", fueraServicio: 2, enServicio: false, recursos: 2, ubicado: "Grupo/Italia/audi/norte" },
  { id:  6, codigo: "pqr-9876543-321xyz", activo: "Refrigerador de vin.",     tarea: "Mantenimiento pre.",  activador: "Cada mes",       subtareas: 7, atraso: 25, plan: "Revisión mensual", fechaCalc: "2026-02-01", fechaProg: "2026-02-01", fueraServicio: 7, enServicio: true,  recursos: 7, ubicado: "Grupo/Italia/audi/norte" },
  { id:  7, codigo: "stu-9876543-321hij", activo: "Refrigerador de lab.",     tarea: "Chequeo de seguri.",  activador: "Cada 72 horas",  subtareas: 1, atraso: 60, plan: "Revisión diaria",   fechaCalc: "2026-01-30", fechaProg: "2026-01-30", fueraServicio: 1, enServicio: false, recursos: 1, ubicado: "Grupo/Italia/audi/norte" },
  { id:  8, codigo: "ghi-9876543-321klm", activo: "Refrigerador con c.",      tarea: "Revisión de sellos.", activador: "Cada 2 semanas", subtareas: 5, atraso: 10, plan: "Revisión mensual", fechaCalc: "2026-02-05", fechaProg: "2026-02-05", fueraServicio: 5, enServicio: true,  recursos: 5, ubicado: "Grupo/Italia/audi/norte" },
  { id:  9, codigo: "jkl-9876543-321nop", activo: "Refrigerador comer.",      tarea: "Inspección de ruid.", activador: "Cada semana",    subtareas: 4, atraso: 35, plan: "Revisión semanal",  fechaCalc: "2026-02-10", fechaProg: "2026-02-10", fueraServicio: 4, enServicio: true,  recursos: 4, ubicado: "Grupo/Italia/audi/norte" },
  { id: 10, codigo: "abc-1234567-890xyz", activo: "Refrigerador de hel.",     tarea: "Verificación de co.", activador: "Cada 24 horas",  subtareas: 2, atraso: 45, plan: "Revisión diaria",   fechaCalc: "2026-01-22", fechaProg: "2026-01-22", fueraServicio: 2, enServicio: false, recursos: 2, ubicado: "Grupo/Italia/audi/norte" },
  { id: 11, codigo: "xyz-1234567-890abc", activo: "Refrigerador portatil",    tarea: "Cambio de filtro re.", activador: "Cada mes",      subtareas: 7, atraso: 20, plan: "Revisión mensual", fechaCalc: "2026-02-15", fechaProg: "2026-02-15", fueraServicio: 7, enServicio: true,  recursos: 7, ubicado: "Grupo/Italia/audi/norte" },
  { id: 12, codigo: "def-1234567-890uv.", activo: "Refrigerador de me.",      tarea: "Mantenimiento del.",  activador: "Cada 48 horas",  subtareas: 3, atraso: 30, plan: "Revisión mensual", fechaCalc: "2026-02-20", fechaProg: "2026-02-20", fueraServicio: 3, enServicio: false, recursos: 3, ubicado: "Grupo/Italia/audi/norte" },
  { id: 13, codigo: "uvw-1234567-890d",   activo: "Refrigerador para c.",     tarea: "Revisión de filtros.", activador: "Cada 2 semanas",subtareas: 4, atraso: 15, plan: "Revisión mensual", fechaCalc: "2026-02-25", fechaProg: "2026-02-25", fueraServicio: 4, enServicio: true,  recursos: 5, ubicado: "Grupo/Italia/audi/norte" },
  { id: 14, codigo: "mno-1234567-890",    activo: "Refrigerador de frut.",    tarea: "Inspección de hum.",  activador: "Cada 24 horas",  subtareas: 5, atraso: 35, plan: "Revisión semanal",  fechaCalc: "2026-02-28", fechaProg: "2026-02-28", fueraServicio: 5, enServicio: true,  recursos: 6, ubicado: "Grupo/Italia/audi/norte" },
  { id: 15, codigo: "pqr-1234567-890xyz", activo: "Refrigerador de fru.",     tarea: "Verificación de fun.", activador: "Cada semana",   subtareas: 6, atraso: 40, plan: "Revisión diaria",   fechaCalc: "2026-03-05", fechaProg: "2026-03-05", fueraServicio: 6, enServicio: false, recursos: 3, ubicado: "Grupo/Italia/audi/norte" },
  { id: 16, codigo: "ghi-1234567-890klm", activo: "Refrigerador de yo.",      tarea: "Control de tempera.", activador: "Cada 48 horas",  subtareas: 3, atraso: 50, plan: "Revisión mensual", fechaCalc: "2026-03-10", fechaProg: "2026-03-10", fueraServicio: 2, enServicio: false, recursos: 2, ubicado: "Grupo/Italia/audi/norte" },
  { id: 17, codigo: "pqr-9876543-321xyz", activo: "Refrigerador de vin.",     tarea: "Mantenimiento pre.",  activador: "Cada mes",       subtareas: 7, atraso: 25, plan: "Revisión mensual", fechaCalc: "2026-02-01", fechaProg: "2026-02-01", fueraServicio: 7, enServicio: true,  recursos: 7, ubicado: "Grupo/Italia/audi/norte" },
  { id: 18, codigo: "stu-9876543-321hij", activo: "Refrigerador de lab.",     tarea: "Chequeo de seguri.",  activador: "Cada 72 horas",  subtareas: 1, atraso: 60, plan: "Revisión diaria",   fechaCalc: "2026-01-30", fechaProg: "2026-01-30", fueraServicio: 1, enServicio: false, recursos: 1, ubicado: "Grupo/Italia/audi/norte" },
  { id: 19, codigo: "ghi-9876543-321klm", activo: "Refrigerador con c.",      tarea: "Revisión de sellos.", activador: "Cada 2 semanas", subtareas: 5, atraso: 10, plan: "Revisión mensual", fechaCalc: "2026-02-05", fechaProg: "2026-02-05", fueraServicio: 5, enServicio: true,  recursos: 5, ubicado: "Grupo/Italia/audi/norte" },
  { id: 20, codigo: "jkl-9876543-321nop", activo: "Refrigerador comer.",      tarea: "Inspección de ruid.", activador: "Cada semana",    subtareas: 4, atraso: 35, plan: "Revisión semanal",  fechaCalc: "2026-02-10", fechaProg: "2026-02-10", fueraServicio: 4, enServicio: true,  recursos: 4, ubicado: "Grupo/Italia/audi/norte" },
]

// ─── Helpers de color ─────────────────────────────────────────────────────────

type BadgeVariant = "info" | "warning" | "destructive" | "success"

function atrasoBadgeVariant(value: number): BadgeVariant {
  if (value <= 20) return "info"
  if (value <= 40) return "warning"
  return "destructive"
}

function subtareasBadgeVariant(value: number): BadgeVariant {
  if (value <= 2) return "success"
  if (value <= 4) return "info"
  return "warning"
}

// ─── Columns ──────────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef<Tarea>[] = [
  {
    accessorKey: "codigo",
    header: "Código",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "activo",
    header: "Activo",
    cell: ({ getValue }) => (
      <span className="text-sm">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "tarea",
    header: "Tarea",
    cell: ({ getValue }) => (
      <span className="text-sm">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "activador",
    header: "Activador",
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "subtareas",
    header: "Subtareas",
    cell: ({ getValue }) => {
      const v = getValue() as number
      return (
        <Badge variant={subtareasBadgeVariant(v)} className="tabular-nums">{v}</Badge>
      )
    },
  },
  {
    accessorKey: "atraso",
    header: "Atraso",
    cell: ({ getValue }) => {
      const v = getValue() as number
      return (
        <Badge variant={atrasoBadgeVariant(v)} className="tabular-nums">{v}d</Badge>
      )
    },
  },
  {
    accessorKey: "plan",
    header: "Plan de tareas",
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "fechaCalc",
    header: "Fecha calculada",
    cell: ({ getValue }) => (
      <span className="tabular-nums">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "fechaProg",
    header: "Fecha programada",
    cell: ({ getValue }) => (
      <span className="tabular-nums">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "fueraServicio",
    header: "Fuera de servicio",
    cell: ({ getValue }) => (
      <Badge variant="secondary" className="tabular-nums">{getValue() as number}</Badge>
    ),
  },
  {
    accessorKey: "enServicio",
    header: "En servicio",
    cell: ({ getValue }) => {
      const v = getValue() as boolean
      return v
        ? <Badge variant="default">Sí</Badge>
        : <Badge variant="destructive">No</Badge>
    },
  },
  {
    accessorKey: "recursos",
    header: "Recursos",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="tabular-nums">{getValue() as number}</Badge>
    ),
  },
  {
    accessorKey: "ubicado",
    header: "Ubicado o es parte de",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue() as string}</span>
    ),
  },
]

// ─── Pantalla ─────────────────────────────────────────────────────────────────

export function TareasPendientes() {
  const [activeTab, setActiveTab] = useState<ViewTab>("tareas")
  const screenMode = useScreenMode()
  const isMobile   = screenMode === "mobile"
  const isCompact  = screenMode !== "desktop"

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      {isMobile
        ? <TopbarBarMobile title="Tareas" subtitle="Tareas pendientes" />
        : <TopbarBar title="Tareas" subtitle="Tareas pendientes" showSearch={false} />
      }

      {/* 2 — Contenido principal */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* 2a — Toolbar flotante */}
        <div className="flex items-center justify-between rounded-lg border bg-background p-3 shrink-0">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={0}
            value={activeTab}
            onValueChange={(v) => v && setActiveTab(v as ViewTab)}
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <ToggleGroupItem key={id} value={id}>
                <Icon className="size-4" />
                {!isCompact && label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Button variant="ghost" size="icon-sm">
            <ListFilter className="size-4" />
          </Button>
        </div>

        {/* 2b — DataTable */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <DataTable
            columns={COLUMNS}
            data={ROWS}
            border={false}
            resizable
            reorder
            rowSelection
            globalFilter
            columnToggle
            rowDensity
            onAdd={() => {}}
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive"><Trash2 className="size-3.5" />Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            onBulkDelete={() => {}}
            mobileView={isMobile}
          />
        </div>

      </div>
    </div>
  )
}
