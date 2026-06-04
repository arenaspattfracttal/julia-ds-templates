"use client"

import { useState } from "react"
import {
  Eye, RotateCcw, Trash2, ListFilter,
  Columns3, CalendarDays, ListChecks, Layers, Plus, MoreVertical,
} from "lucide-react"
import { Button }      from "@/components/ui/button"
import { Badge }       from "@/components/ui/badge"
import { Checkbox }    from "@/components/ui/checkbox"
import { ScrollArea }  from "@/components/ui/scroll-area"
import { Separator }   from "@/components/ui/separator"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { useScreenMode } from "../screen-mode-context"
import { cn } from "@/lib/utils"

// ─── Tabs (mismos que Kanban) ─────────────────────────────────────────────────
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

// ─── Vista mobile: lista expandible ──────────────────────────────────────────

function MobileFieldRow({ label, value, mono = false, children }: {
  label: string; value?: string; mono?: boolean; children?: React.ReactNode
}) {
  return (
    <div className="flex gap-1.5 min-w-0 items-center">
      <span className="text-xs font-medium text-muted-foreground shrink-0">{label}:</span>
      {children ?? <span className={cn("text-xs text-foreground truncate", mono && "font-mono")}>{value}</span>}
    </div>
  )
}

function TareasMobileList({
  rows, selected, onToggle, onToggleAll,
}: {
  rows:         Tarea[]
  selected:     Set<number>
  onToggle:     (id: number) => void
  onToggleAll:  () => void
}) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  function toggleExpand(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  return (
    <>
      {/* Barra superior: select-all + papelera */}
      <div className="flex items-center gap-2 px-3 h-12 border-b shrink-0">
        <Checkbox
          checked={selected.size > 0 ? "indeterminate" : false}
          onCheckedChange={onToggleAll}
          aria-label="Seleccionar todos"
        />
        <span className="text-sm text-muted-foreground flex-1">
          {selected.size > 0
            ? `${selected.size} seleccionado${selected.size > 1 ? "s" : ""}`
            : "Seleccionar todos"
          }
        </span>
        {selected.size > 0 && (
          <Button variant="ghost" size="icon-sm" aria-label="Eliminar seleccionados">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col">
          {rows.map((row, i) => {
            const isExpanded = expanded.has(row.id)
            return (
              <div key={row.id}>
                <div
                  className={cn(
                    "flex gap-2 px-3 py-2.5 cursor-pointer transition-colors",
                    selected.has(row.id) && "bg-primary/5",
                  )}
                  onClick={() => toggleExpand(row.id)}
                >
                  {/* Checkbox */}
                  <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(row.id)}
                      onCheckedChange={() => onToggle(row.id)}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* Preview siempre visible */}
                    <p className="text-sm font-semibold text-foreground truncate">{row.activo}</p>
                    <MobileFieldRow label="Tarea"     value={row.tarea} />
                    <MobileFieldRow label="Activador" value={row.activador} />

                    {/* Expandido animado con grid-rows */}
                    <div className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}>
                      <div className="overflow-hidden">
                        <div className="flex flex-col gap-1">
                          <MobileFieldRow label="Código"            value={row.codigo}    mono />
                          <MobileFieldRow label="Plan"              value={row.plan} />
                          <MobileFieldRow label="Fecha calculada"   value={row.fechaCalc} />
                          <MobileFieldRow label="Fecha programada"  value={row.fechaProg} />
                          <MobileFieldRow label="Ubicado"           value={row.ubicado} />
                          <MobileFieldRow label="Subtareas">
                            <Badge variant={subtareasBadgeVariant(row.subtareas)} size="sm" className="tabular-nums">{row.subtareas}</Badge>
                          </MobileFieldRow>
                          <MobileFieldRow label="Atraso">
                            <Badge variant={atrasoBadgeVariant(row.atraso)} size="sm" className="tabular-nums">{row.atraso}d</Badge>
                          </MobileFieldRow>
                          <MobileFieldRow label="Fuera de servicio">
                            <Badge variant="secondary" size="sm" className="tabular-nums">{row.fueraServicio}</Badge>
                          </MobileFieldRow>
                          <MobileFieldRow label="En servicio">
                            <Badge variant={row.enServicio ? "success" : "destructive"} size="sm">{row.enServicio ? "Sí" : "No"}</Badge>
                          </MobileFieldRow>
                          <MobileFieldRow label="Recursos">
                            <Badge variant="outline" size="sm" className="tabular-nums">{row.recursos}</Badge>
                          </MobileFieldRow>
                        </div>
                      </div>
                    </div>

                    {/* Texto expandir/contraer */}
                    <p className="text-xs text-muted-foreground/50">
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
                        <DropdownMenuItem>
                          <Eye className="size-4 text-muted-foreground" />
                          Ver activo
                        </DropdownMenuItem>
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
    </>
  )
}

// ─── Pantalla ─────────────────────────────────────────────────────────────────

export function TareasPendientes() {
  const [activeTab, setActiveTab] = useState<ViewTab>("tareas")
  const [selected,  setSelected]  = useState<Set<number>>(new Set())
  const screenMode = useScreenMode()
  const isMobile   = screenMode === "mobile"
  const isCompact  = screenMode !== "desktop"

  function toggleRow(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === ROWS.length ? new Set() : new Set(ROWS.map((r) => r.id))
    )
  }

  const allSelected = selected.size === ROWS.length

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      {isMobile
        ? <TopbarBarMobile title="Tareas" subtitle="Tareas pendientes" />
        : <TopbarBar title="Tareas" subtitle="Tareas pendientes" showSearch={false} />
      }

      {/* 2 — Contenido principal */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* 2a — Toolbar flotante (mismo patrón que Kanban) */}
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

        {/* 2b — Contenido: tabla (desktop/tablet) o cards (mobile) */}
        <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-h-0">

          {isMobile && (
            <TareasMobileList rows={ROWS} selected={selected} onToggle={toggleRow} onToggleAll={toggleAll} />
          )}

          {!isMobile && <ScrollArea className="flex-1 min-h-0" horizontal>
            <Table wrapperClassName="min-w-max">
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead className="w-12 min-w-12 pl-4 pr-2">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Seleccionar todo"
                    />
                  </TableHead>
                  <TableHead className="w-20 min-w-20">Acciones</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Activador</TableHead>
                  <TableHead className="text-center">Subtareas</TableHead>
                  <TableHead className="text-center">Atraso</TableHead>
                  <TableHead>Plan de tareas</TableHead>
                  <TableHead>Fecha calculada</TableHead>
                  <TableHead>Fecha programada</TableHead>
                  <TableHead className="text-center">Fuera de servicio</TableHead>
                  <TableHead className="text-center">En serv.</TableHead>
                  <TableHead className="text-center">Recursos</TableHead>
                  <TableHead>Ubicado o es parte de</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {ROWS.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={selected.has(row.id) ? "selected" : undefined}
                  >
                    {/* Checkbox */}
                    <TableCell className="pl-4 pr-2">
                      <Checkbox
                        checked={selected.has(row.id)}
                        onCheckedChange={() => toggleRow(row.id)}
                        aria-label={`Seleccionar fila ${row.id}`}
                      />
                    </TableCell>

                    {/* Acciones */}
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon-sm" aria-label="Ver">
                          <Eye className="size-3.5 text-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Sincronizar">
                          <RotateCcw className="size-3.5 text-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Eliminar">
                          <Trash2 className="size-3.5 text-foreground" />
                        </Button>
                      </div>
                    </TableCell>

                    {/* Código */}
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.codigo}
                    </TableCell>

                    {/* Activo */}
                    <TableCell className="max-w-36 truncate text-sm">
                      {row.activo}
                    </TableCell>

                    {/* Tarea */}
                    <TableCell className="max-w-36 truncate text-sm">
                      {row.tarea}
                    </TableCell>

                    {/* Activador */}
                    <TableCell className="text-sm text-muted-foreground">
                      {row.activador}
                    </TableCell>

                    {/* Subtareas */}
                    <TableCell className="text-center">
                      <Badge variant={subtareasBadgeVariant(row.subtareas)} className="font-mono tabular-nums">
                        {row.subtareas}
                      </Badge>
                    </TableCell>

                    {/* Atraso */}
                    <TableCell className="text-center">
                      <Badge variant={atrasoBadgeVariant(row.atraso)} className="font-mono tabular-nums">
                        {row.atraso}
                      </Badge>
                    </TableCell>

                    {/* Plan de tareas */}
                    <TableCell className="text-sm text-muted-foreground">
                      {row.plan}
                    </TableCell>

                    {/* Fecha calculada */}
                    <TableCell className="text-sm tabular-nums">
                      {row.fechaCalc}
                    </TableCell>

                    {/* Fecha programada */}
                    <TableCell className="text-sm tabular-nums">
                      {row.fechaProg}
                    </TableCell>

                    {/* Fuera de servicio */}
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono tabular-nums">
                        {row.fueraServicio}
                      </Badge>
                    </TableCell>

                    {/* En servicio */}
                    <TableCell className="text-center">
                      {row.enServicio ? (
                        <Badge variant="default">Sí</Badge>
                      ) : (
                        <Badge variant="destructive">NO</Badge>
                      )}
                    </TableCell>

                    {/* Recursos */}
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono tabular-nums">
                        {row.recursos}
                      </Badge>
                    </TableCell>

                    {/* Ubicado */}
                    <TableCell className="max-w-40 truncate text-xs text-muted-foreground">
                      {row.ubicado}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          }

          {/* Footer fijo */}
          <div className="shrink-0 border-t bg-muted/50 p-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-normal">
              Mostrando <span className="font-medium text-foreground">50</span> de{" "}
              <span className="font-medium text-foreground">2000</span>
            </span>
            <Button size="sm">
              <Plus className="size-3.5" />
              Nueva
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
