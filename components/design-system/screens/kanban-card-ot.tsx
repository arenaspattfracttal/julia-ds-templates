"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Flag,
  Clock,
  Calendar,
  ChevronsUp,
  ChevronUp,
  Equal,
  ChevronDown,
  ChevronsDown,
  OctagonAlert,
  Check,
  Diamond,
  Download,
  MoreVertical,
  CalendarClock,
  CalendarDays,
} from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { translations } from "../i18n"
import { useViewer } from "../viewer-context"

// ─── Priority ─────────────────────────────────────────────────────────────────

export type Priority = "critical" | "high" | "medium" | "low" | "veryLow"

const PRIORITY_MAP: Record<Priority, { Icon: React.ElementType; cls: string }> = {
  critical: { Icon: ChevronsUp,   cls: "text-destructive" },
  high:     { Icon: ChevronUp,    cls: "text-destructive" },
  medium:   { Icon: Equal,        cls: "text-warning"     },
  low:      { Icon: ChevronDown,  cls: "text-info"        },
  veryLow:  { Icon: ChevronsDown, cls: "text-info"        },
}

function PriorityIcon({ priority }: { priority: Priority }) {
  const { Icon, cls } = PRIORITY_MAP[priority]
  return <Icon className={`size-4 shrink-0 ml-2 ${cls}`} />
}

// ─── Helpers de estilos reactivos al flag ─────────────────────────────────────

function flaggedCardStyle(flagged: boolean): React.CSSProperties | undefined {
  if (!flagged) return undefined
  return { backgroundColor: "color-mix(in srgb, var(--warning) 15%, var(--background))" }
}

function badgeClass(flagged: boolean): string {
  return `transition-colors ${flagged ? "bg-warning/15 dark:bg-warning/20" : ""}`
}

function btnHoverClass(flagged: boolean): string {
  return flagged ? "hover:bg-warning/15 dark:hover:bg-warning/20" : ""
}

// ─── Shared: Footer ───────────────────────────────────────────────────────────

function OTFooter({
  flagged,
  assigneeName = "Susana Dominguez",
  assigneeAvatar = "https://i.pravatar.cc/150?img=47",
}: {
  flagged: boolean
  assigneeName?: string
  assigneeAvatar?: string
}) {
  const btnCls = btnHoverClass(flagged)
  const initials = assigneeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <CardFooter className="px-3 py-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <Avatar size="sm">
          <AvatarImage src={assigneeAvatar} alt={assigneeName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-foreground truncate">{assigneeName}</span>
      </div>
      <div className="flex items-center shrink-0">
        <Button variant="ghost" size="icon-sm" className={btnCls}>
          <Download className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" className={btnCls}>
          <MoreVertical className="size-4" />
        </Button>
      </div>
    </CardFooter>
  )
}

// ─── Shared: Flag button ──────────────────────────────────────────────────────

function FlagButton({ flagged, onToggle }: { flagged: boolean; onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={`shrink-0 transition-colors ${flagged ? "text-warning hover:text-warning hover:bg-warning/15 dark:hover:bg-warning/20" : "text-muted-foreground hover:text-warning hover:bg-warning/15 dark:hover:bg-warning/20"}`}
      onClick={onToggle}
    >
      <Flag className={`size-4 transition-all ${flagged ? "fill-warning" : "fill-transparent"}`} />
    </Button>
  )
}

// ─── Shared: Dates + Progress ─────────────────────────────────────────────────

function OTProgress({
  value,
  flagged,
  dateRowRight,
  horaEstimada = "10:00",
  fechaVencimiento = "10-12-2024",
}: {
  value: number
  flagged: boolean
  dateRowRight?: React.ReactNode
  horaEstimada?: string
  fechaVencimiento?: string
}) {
  const badgeCls = badgeClass(flagged)
  return (
    <>
      <div className="flex items-center gap-2">
        <Progress value={value} className={`flex-1 transition-colors ${flagged ? "bg-warning/15 dark:bg-warning/20" : ""}`} />
        <span className="text-xs font-bold text-foreground tabular-nums shrink-0">{value}%</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className={badgeCls}>
            <Clock className="size-3" />
            {horaEstimada}
          </Badge>
          <Badge variant="secondary" className={badgeCls}>
            <Calendar className="size-3" />
            {fechaVencimiento}
          </Badge>
        </div>
        {dateRowRight}
      </div>
    </>
  )
}

// ─── Shared: OT Header (número + creado por + flag) ──────────────────────────

function OTHeader({
  woNumber,
  createdBy,
  flagged,
  onToggleFlag,
}: {
  woNumber: string
  createdBy: string
  flagged: boolean
  onToggleFlag: () => void
}) {
  const t = translations[useViewer().lang]
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col min-w-0">
        <span className="text-base text-primary leading-snug">{woNumber}</span>
        <span className="text-xs text-muted-foreground leading-snug">{t.otCard.createdBy} {createdBy}</span>
      </div>
      <FlagButton flagged={flagged} onToggle={onToggleFlag} />
    </div>
  )
}

// ─── Shared: Card de activo ───────────────────────────────────────────────────

function OTAssetCard({ assetText }: { assetText: string }) {
  const t = translations[useViewer().lang]
  return (
    <Card className="border border-border shadow-none hover:shadow-none gap-0 p-2 rounded-md bg-transparent overflow-hidden">
      <p className="text-sm text-foreground line-clamp-2 leading-snug">
        <span className="font-semibold">{t.otCard.assetLabel}</span> {assetText}
      </p>
    </Card>
  )
}

// ─── Shared: Card de tarea + prioridad ───────────────────────────────────────

function OTTaskCard({
  taskText,
  priority,
  lineClamp = "truncate",
}: {
  taskText: string
  priority: Priority
  lineClamp?: "truncate" | "line-clamp-2"
}) {
  const t = translations[useViewer().lang]
  return (
    <Card className="border border-border shadow-none hover:shadow-none gap-0 p-2 rounded-md bg-transparent overflow-hidden flex-row items-center min-w-0">
      <p className={`text-sm text-foreground flex-1 ${lineClamp} leading-snug min-w-0`}>
        <span className="font-semibold">{t.otCard.taskLabel}</span> {taskText}
      </p>
      <PriorityIcon priority={priority} />
    </Card>
  )
}

// ─── Shared: Lista de etiquetas con color ─────────────────────────────────────

function OTLabels({
  labels,
  flagged,
}: {
  labels: { name: string; color: string }[]
  flagged: boolean
}) {
  const cls = badgeClass(flagged)
  return (
    <div className="flex items-center gap-1.5">
      {labels.map((label) => (
        <Badge key={label.name} variant="secondary" className={`shrink-0 gap-1.5 ${cls}`}>
          <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
          {label.name}
        </Badge>
      ))}
    </div>
  )
}

// ─── Shared: Badge OT Relacionada (opcional) ──────────────────────────────────

function OTRelatedBadge({
  show,
  flagged,
}: {
  show: boolean
  flagged: boolean
}) {
  const t = translations[useViewer().lang]
  if (!show) return null
  return (
    <Badge variant="secondary" className={`shrink-0 ${badgeClass(flagged)}`}>
      <Diamond className="size-3" />
      {t.otCard.relatedOT}
    </Badge>
  )
}

// ─── Variante 1: única tarea y activo ─────────────────────────────────────────

export type OTCardSingleProps = {
  initialFlagged?: boolean
  progress?: number
  className?: string
  woNumber?: string
  createdBy?: string
  assetText?: string
  taskText?: string
  priority?: Priority
  labels?: { name: string; color: string }[]
  assigneeName?: string
  assigneeAvatar?: string
  horaEstimada?: string
  fechaVencimiento?: string
  showRelatedOT?: boolean
}

const OT_SINGLE_DEFAULTS: Required<OTCardSingleProps> = {
  initialFlagged: true,
  progress: 50,
  className: "w-[460px]",
  woNumber: "WO-1234567-FTTL",
  createdBy: "Melissa Trujillo",
  assetText: "Refrigerador #10204 Santiago de chile, bajo la avenida de la ubicación cercana al garaje de las fabricado en la capa...",
  taskText: "Cambio de bujías para el camión numero 12221...",
  priority: "critical",
  labels: [
    { name: "Etiqueta 1", color: "var(--destructive)" },
    { name: "Etiqueta 2", color: "var(--warning)" },
    { name: "Etiqueta 3", color: "var(--success)" },
  ],
  assigneeName: "Susana Dominguez",
  assigneeAvatar: "https://i.pravatar.cc/150?img=47",
  horaEstimada: "10:00",
  fechaVencimiento: "10-12-2024",
  showRelatedOT: true,
}

export function OTCardSingle(rawProps: OTCardSingleProps = {}) {
  const {
    initialFlagged,
    progress,
    className,
    woNumber,
    createdBy,
    assetText,
    taskText,
    priority,
    labels,
    assigneeName,
    assigneeAvatar,
    horaEstimada,
    fechaVencimiento,
    showRelatedOT,
  } = { ...OT_SINGLE_DEFAULTS, ...rawProps }
  const [flagged, setFlagged] = useState(initialFlagged)
  const toggleFlag = () => setFlagged((f) => !f)

  return (
    <Card
      className={cn("gap-0 p-0 rounded-lg overflow-hidden transition-colors", className)}
      style={flaggedCardStyle(flagged)}
    >
      <CardContent className="flex flex-col gap-2 p-3">
        <OTHeader
          woNumber={woNumber}
          createdBy={createdBy}
          flagged={flagged}
          onToggleFlag={toggleFlag}
        />
        <OTAssetCard assetText={assetText} />
        <OTTaskCard taskText={taskText} priority={priority} />
        <OTProgress
          value={progress}
          flagged={flagged}
          horaEstimada={horaEstimada}
          fechaVencimiento={fechaVencimiento}
          dateRowRight={<OTRelatedBadge show={showRelatedOT} flagged={flagged} />}
        />
        <OTLabels labels={labels} flagged={flagged} />
      </CardContent>
      <div className="shrink-0 border-t border-border" />
      <OTFooter flagged={flagged} assigneeName={assigneeName} assigneeAvatar={assigneeAvatar} />
    </Card>
  )
}

// ─── Variante 2: múltiples tareas y activos ───────────────────────────────────

function IconCount({
  icon: Icon,
  count,
  iconClass,
  badgeCls,
}: {
  icon: React.ElementType
  count: number
  iconClass?: string
  badgeCls?: string
}) {
  return (
    <Badge variant="secondary" className={`flex-1 justify-center gap-1 pointer-events-none text-foreground ${badgeCls ?? ""}`}>
      <Icon className={`size-3.5 shrink-0 ${iconClass ?? ""}`} />
      <span className="font-semibold tabular-nums">{count}</span>
    </Badge>
  )
}

export type OTMultiActivos = { total: number; ok: number; fail: number }
export type OTMultiTareas  = { total: number; critical: number; high: number; medium: number; low: number; veryLow: number }

function OTActivosCard({
  activos,
  flagged,
}: {
  activos: OTMultiActivos
  flagged: boolean
}) {
  const t = translations[useViewer().lang]
  const cls = badgeClass(flagged)
  return (
    <Card className="border border-border shadow-none hover:shadow-none gap-0 p-0 rounded-md bg-transparent overflow-hidden basis-1/3 shrink-0">
      <div className="h-8 flex items-center px-2">
        <span className="text-sm font-semibold text-foreground">{activos.total} {t.otCard.assets}</span>
      </div>
      <div className="shrink-0 border-t border-border" />
      <div className="h-8 flex items-center gap-1 px-1">
        <IconCount icon={Check}        count={activos.ok}   iconClass="text-success"     badgeCls={cls} />
        <IconCount icon={OctagonAlert} count={activos.fail} iconClass="text-destructive" badgeCls={cls} />
      </div>
    </Card>
  )
}

function OTTareasCard({
  tareas,
  flagged,
}: {
  tareas: OTMultiTareas
  flagged: boolean
}) {
  const t = translations[useViewer().lang]
  const cls = badgeClass(flagged)
  return (
    <Card className="border border-border shadow-none hover:shadow-none gap-0 p-0 rounded-md bg-transparent overflow-hidden basis-2/3">
      <div className="h-8 flex items-center px-2">
        <span className="text-sm font-semibold text-foreground">{tareas.total} {t.otCard.tasks}</span>
      </div>
      <div className="shrink-0 border-t border-border" />
      <div className="h-8 flex items-center gap-1 px-1">
        <IconCount icon={ChevronsUp}   count={tareas.critical} iconClass="text-destructive" badgeCls={cls} />
        <IconCount icon={ChevronUp}    count={tareas.high}     iconClass="text-destructive" badgeCls={cls} />
        <IconCount icon={Equal}        count={tareas.medium}   iconClass="text-warning"     badgeCls={cls} />
        <IconCount icon={ChevronDown}  count={tareas.low}      iconClass="text-info"        badgeCls={cls} />
        <IconCount icon={ChevronsDown} count={tareas.veryLow}  iconClass="text-info"        badgeCls={cls} />
      </div>
    </Card>
  )
}

export type OTCardMultiProps = {
  initialFlagged?: boolean
  progress?: number
  className?: string
  woNumber?: string
  createdBy?: string
  activos?: OTMultiActivos
  tareas?: OTMultiTareas
  urgencyTags?: { name: string; color: string }[]
  assigneeName?: string
  assigneeAvatar?: string
  horaEstimada?: string
  fechaVencimiento?: string
  showRelatedOT?: boolean
}

const OT_MULTI_DEFAULTS: Required<OTCardMultiProps> = {
  initialFlagged: false,
  progress: 50,
  className: "w-[460px]",
  woNumber: "WO-1234567-FTTL",
  createdBy: "Melissa Trujillo",
  activos: { total: 5, ok: 4, fail: 1 },
  tareas: { total: 34, critical: 1, high: 1, medium: 20, low: 10, veryLow: 2 },
  urgencyTags: [
    { name: "Para ayer",     color: "var(--destructive)" },
    { name: "Puede esperar", color: "var(--success)" },
  ],
  assigneeName: "Susana Dominguez",
  assigneeAvatar: "https://i.pravatar.cc/150?img=47",
  horaEstimada: "10:00",
  fechaVencimiento: "10-12-2024",
  showRelatedOT: true,
}

export function OTCardMulti(rawProps: OTCardMultiProps = {}) {
  const {
    initialFlagged,
    progress,
    className,
    woNumber,
    createdBy,
    activos,
    tareas,
    urgencyTags,
    assigneeName,
    assigneeAvatar,
    horaEstimada,
    fechaVencimiento,
    showRelatedOT,
  } = { ...OT_MULTI_DEFAULTS, ...rawProps }
  const [flagged, setFlagged] = useState(initialFlagged)
  const toggleFlag = () => setFlagged((f) => !f)

  return (
    <Card
      className={cn("gap-0 p-0 rounded-lg overflow-hidden transition-colors", className)}
      style={flaggedCardStyle(flagged)}
    >
      <CardContent className="flex flex-col gap-2 p-3">
        <OTHeader
          woNumber={woNumber}
          createdBy={createdBy}
          flagged={flagged}
          onToggleFlag={toggleFlag}
        />
        <div className="flex gap-2">
          <OTActivosCard activos={activos} flagged={flagged} />
          <OTTareasCard tareas={tareas} flagged={flagged} />
        </div>
        <OTProgress
          value={progress}
          flagged={flagged}
          horaEstimada={horaEstimada}
          fechaVencimiento={fechaVencimiento}
          dateRowRight={<OTRelatedBadge show={showRelatedOT} flagged={flagged} />}
        />
        <OTLabels labels={urgencyTags} flagged={flagged} />
      </CardContent>
      <div className="shrink-0 border-t border-border" />
      <OTFooter flagged={flagged} assigneeName={assigneeName} assigneeAvatar={assigneeAvatar} />
    </Card>
  )
}

// ─── Variante 3: tarea sin tomar ──────────────────────────────────────────────

export function OTCardTareaSinTomar({
  initialFlagged = false,
  className = "w-[460px]",
  requestNumber = "Solicitud de trabajo #2451",
  assetText = "Refrigerador #10204, ubicado en Santiago de Chile, justo debajo de la avenida, cerca del garaje donde se fabrican las capas.",
  taskText = "Cambio de bujías para el camión numero 1222135 ubicada en la sección angular de la tercera cuadra al...",
  priority = "critical" as Priority,
  hora = "10:00",
  fecha = "10-12-2023",
  recurringLabel = "Cada 1 mes",
}: {
  initialFlagged?: boolean
  className?: string
  requestNumber?: string
  assetText?: string
  taskText?: string
  priority?: Priority
  hora?: string
  fecha?: string
  recurringLabel?: string
} = {}) {
  const [checked, setChecked] = useState(false)
  const [flagged, setFlagged] = useState(initialFlagged)

  const badgeCls = badgeClass(flagged)
  const btnCls = btnHoverClass(flagged)

  return (
    <Card
      className={cn("gap-0 p-0 rounded-lg overflow-hidden transition-colors", className)}
      style={flaggedCardStyle(flagged)}
    >
      <CardContent className="flex flex-col gap-2 p-3">

        {/* Checkbox + número + flag */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => setChecked(!!v)}
              className="size-5 shrink-0"
            />
            <span className="text-base text-primary leading-snug truncate">{requestNumber}</span>
          </div>
          <FlagButton flagged={flagged} onToggle={() => setFlagged((f) => !f)} />
        </div>

        {/* Activo */}
        <OTAssetCard assetText={assetText} />

        {/* Tarea + prioridad */}
        <OTTaskCard taskText={taskText} priority={priority} lineClamp="line-clamp-2" />

        {/* Fechas */}
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className={badgeCls}>
            <Clock className="size-3" />
            {hora}
          </Badge>
          <Badge variant="secondary" className={badgeCls}>
            <Calendar className="size-3" />
            {fecha}
          </Badge>
        </div>

      </CardContent>
      <div className="shrink-0 border-t border-border" />

      {/* Footer */}
      <CardFooter className="px-3 py-2 flex items-center justify-between gap-2">
        <Badge variant="secondary" className={badgeCls}>
          <CalendarClock className="size-3.5" />
          {recurringLabel}
        </Badge>
        <Button variant="ghost" size="icon-sm" className={btnCls}>
          <CalendarDays className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium text-muted-foreground px-0.5">{children}</p>
  )
}

export function KanbanCardOT() {
  const t = translations[useViewer().lang]
  return (
    <div className="flex flex-wrap items-start justify-center gap-6 p-8">
      <div className="flex flex-col gap-2">
        <CardLabel>{t.otCard.demoSingle}</CardLabel>
        <OTCardSingle />
      </div>
      <div className="flex flex-col gap-2">
        <CardLabel>{t.otCard.demoMulti}</CardLabel>
        <OTCardMulti />
      </div>
      <div className="flex flex-col gap-2">
        <CardLabel>{t.otCard.demoUnclaimed}</CardLabel>
        <OTCardTareaSinTomar />
      </div>
    </div>
  )
}
