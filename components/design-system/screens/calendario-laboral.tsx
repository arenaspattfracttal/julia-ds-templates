"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Save, Plus,
  RefreshCw, SlidersHorizontal, SlidersVertical,
  MoreVertical, Eye, Pencil, Trash2, PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { Button }    from "@/components/ui/button"
import { Badge }     from "@/components/ui/badge"
import { Checkbox }  from "@/components/ui/checkbox"
import { Label }     from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { useScreenMode } from "../screen-mode-context"
import { cn } from "@/lib/utils"

// ─── Nav items (mismo que otras pantallas de Configuración) ───────────────────

const NAV_ITEMS = [
  { id: "general",   label: "General",                icon: Settings   },
  { id: "users",     label: "Cuentas de Usuarios",    icon: Users      },
  { id: "calendar",  label: "Calendario laboral",     icon: Calendar   },
  { id: "modules",   label: "Módulos",                icon: LayoutGrid },
  { id: "financial", label: "Financiero",             icon: CreditCard },
  { id: "catalogs",  label: "Catálogos Auxiliares",   icon: BookOpen   },
  { id: "docs",      label: "Gestión Documental",     icon: FileText   },
  { id: "logs",      label: "Log de Transacciones",   icon: History    },
  { id: "security",  label: "Seguridad",              icon: Shield     },
  { id: "api",       label: "Conexiones API",         icon: Plug       },
  { id: "guests",    label: "Portal de invitados",    icon: UserCheck  },
  { id: "account",   label: "Cuenta",                 icon: User       },
  { id: "printing",  label: "Impresiones de OTs",     icon: Printer    },
] as const

// ─── Horizontal icon nav (mobile only) ───────────────────────────────────────

function HorizontalNav({ items, active, onSelect }: {
  items:    { id: string; label: string; icon: React.ElementType }[]
  active:   string
  onSelect: (id: string) => void
}) {
  const scrollRef              = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart]  = useState(true)
  const [atEnd,   setAtEnd]    = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    function update() {
      if (!el) return
      setAtStart(el.scrollLeft <= 0)
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
    }
    update()
    el.addEventListener("scroll", update)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => { el.removeEventListener("scroll", update); ro.disconnect() }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let cancelled = false
    const cancel = () => { cancelled = true }
    el.addEventListener("pointerdown", cancel, { once: true })
    el.addEventListener("touchstart",  cancel, { once: true, passive: true })
    function animate(from: number, to: number, ms: number, done?: () => void) {
      const start = performance.now()
      function step(now: number) {
        if (cancelled || !el) return
        const t = Math.min((now - start) / ms, 1)
        const ease = -(Math.cos(Math.PI * t) - 1) / 2
        el.scrollLeft = from + (to - from) * ease
        if (t < 1) requestAnimationFrame(step)
        else done?.()
      }
      requestAnimationFrame(step)
    }
    const t = setTimeout(() => {
      if (!el || el.scrollWidth <= el.clientWidth) return
      animate(0, 28, 412, () =>
        setTimeout(() => animate(28, 0, 487), 487)
      )
    }, 675)
    return () => {
      cancelled = true
      clearTimeout(t)
      el.removeEventListener("pointerdown", cancel)
      el.removeEventListener("touchstart",  cancel)
    }
  }, [])

  const mask = atStart && atEnd
    ? undefined
    : atStart
      ? "linear-gradient(to right, black 91%, transparent 100%)"
      : atEnd
        ? "linear-gradient(to right, transparent 0%, black 9%, black 100%)"
        : "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)"

  return (
    <Tabs value={active} onValueChange={onSelect} className="shrink-0">
      <div className="rounded-lg border border-border bg-background overflow-hidden">
        <div
          ref={scrollRef}
          className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ maskImage: mask, WebkitMaskImage: mask }}
        >
          <TabsList variant="white" className="!h-fit !border-0 !rounded-none !bg-transparent">
            {items.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="flex-col gap-1 px-2.5 py-2">
                <Icon className="size-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
    </Tabs>
  )
}

type NavMode = "desktop" | "tablet" | "mobile"

// ─── Settings nav ─────────────────────────────────────────────────────────────

function SettingsNav({
  active, onSelect, mode, minimized = false, onToggleMinimize,
}: {
  active: string
  onSelect: (id: string) => void
  mode: NavMode
  minimized?: boolean
  onToggleMinimize?: () => void
}) {
  const isMobileNav = mode === "mobile"
  const iconOnly    = minimized
  return (
    <div className={cn(
      "flex flex-col rounded-lg border bg-background overflow-hidden transition-all duration-300",
      minimized     ? "w-[56px] shrink-0"
      : isMobileNav ? "w-full h-full"
      : "w-[250px] shrink-0",
    )}>
      {/* Header: Secciones + botón toggle — FUERA del ScrollArea */}
      {!isMobileNav && onToggleMinimize && (
        <div className={cn("h-12 px-2 flex items-center border-b border-border shrink-0", minimized ? "justify-center" : "justify-between")}>
          {!minimized && (
            <span className="text-xs font-medium text-foreground/60 px-1">
              Secciones
            </span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={onToggleMinimize}
              >
                {minimized
                  ? <PanelLeftOpen className="size-4" />
                  : <PanelLeftClose className="size-4" />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {minimized ? "Expandir menú" : "Minimizar menú"}
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      {/* Nav items — DENTRO del ScrollArea */}
      <ScrollArea className="flex-1">
        <div className={cn("flex flex-col gap-0.5 p-2", minimized && "items-center")}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              size={iconOnly ? "icon-sm" : "sm"}
              className={cn(
                !iconOnly && "w-full justify-start",
                active === id
                  ? "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary"
                  : "text-foreground/80",
              )}
              onClick={() => onSelect(id)}
            >
              <Icon className={cn("size-4 shrink-0", active === id ? "text-primary" : "text-muted-foreground")} />
              {!iconOnly && label}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type Holiday = {
  id:          string
  description: string
  date:        string
  isWorkday:   boolean
  isRecurring: boolean
}

const HOLIDAYS: Holiday[] = [
  { id: "1", description: "Dia feriado, test.",           date: "2025-05-06", isWorkday: false, isRecurring: true  },
  { id: "2", description: "FERIADO DE PRUEBA PARA SALTO", date: "2025-05-01", isWorkday: false, isRecurring: false },
  { id: "3", description: "Navidad",                      date: "2025-12-25", isWorkday: false, isRecurring: false },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BoolBadge({ value, size = "default" }: { value: boolean; size?: "default" | "sm" }) {
  return (
    <Badge variant={value ? "success" : "destructive"} size={size}>
      {value ? "Sí" : "No"}
    </Badge>
  )
}

// ─── Vista mobile: lista expandible de feriados ───────────────────────────────

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

function HolidaysMobileList({
  rows, selected, onToggle, onToggleAll,
}: {
  rows:        Holiday[]
  selected:    Set<string>
  onToggle:    (id: string) => void
  onToggleAll: () => void
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
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
          {rows.map((h, i) => {
            const isExpanded = expanded.has(h.id)
            return (
              <div key={h.id}>
                <div
                  className={cn(
                    "flex gap-2 px-3 py-2.5 cursor-pointer transition-colors",
                    selected.has(h.id) && "bg-primary/5",
                  )}
                  onClick={() => toggleExpand(h.id)}
                >
                  {/* Checkbox */}
                  <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(h.id)}
                      onCheckedChange={() => onToggle(h.id)}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground truncate">{h.description}</p>
                    <MobileFieldRow label="Fecha" value={h.date} />
                    <MobileFieldRow label="Recurrente">
                      <BoolBadge value={h.isRecurring} size="sm" />
                    </MobileFieldRow>

                    {/* Expandido animado con grid-rows */}
                    <div className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}>
                      <div className="overflow-hidden">
                        <div className="flex flex-col gap-1">
                          <MobileFieldRow label="Día laboral">
                            <BoolBadge value={h.isWorkday} size="sm" />
                          </MobileFieldRow>
                        </div>
                      </div>
                    </div>

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
                          Ver feriado
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

// ─── Calendario card (tabla + header + footer anclado) ────────────────────────

function CalendarioCard({
  selected, allSelected, onToggleRow, onToggleAll, className,
}: {
  selected:    Set<string>
  allSelected: boolean
  onToggleRow: (id: string) => void
  onToggleAll: () => void
  className?:  string
}) {
  return (
    <div className={cn("rounded-lg border bg-background overflow-hidden flex flex-col", className)}>

      {/* Días laborales */}
      <div className="shrink-0 p-4 flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Días laborales</Label>
        <Select defaultValue="lmxjv">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lmxjv">Lunes, Martes, Miércoles, Jueves, Viernes</SelectItem>
            <SelectItem value="lmxjvs">Lunes, Martes, Miércoles, Jueves, Viernes, Sábado</SelectItem>
            <SelectItem value="todos">Lunes a Domingo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Header sección Días festivos */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-foreground">Días festivos</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Recargar">
            <RefreshCw className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Filtrar columnas">
            <SlidersHorizontal className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Configurar">
            <SlidersVertical className="size-4" />
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <ScrollArea className="flex-1 min-h-0" horizontal>
        <Table wrapperClassName="min-w-max">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-12 min-w-12 pl-4 pr-2">
                <Checkbox checked={allSelected} onCheckedChange={onToggleAll} aria-label="Seleccionar todos" />
              </TableHead>
              <TableHead className="w-20 min-w-20">Acciones</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Día laboral</TableHead>
              <TableHead className="text-center">Recurrente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {HOLIDAYS.map((h) => (
              <TableRow key={h.id} data-state={selected.has(h.id) ? "selected" : undefined}>
                <TableCell className="pl-4 pr-2">
                  <Checkbox checked={selected.has(h.id)} onCheckedChange={() => onToggleRow(h.id)} aria-label={`Seleccionar ${h.description}`} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon-sm" aria-label="Ver"><Eye className="size-3.5 text-foreground" /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Editar"><Pencil className="size-3.5 text-foreground" /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Eliminar"><Trash2 className="size-3.5 text-foreground" /></Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{h.description}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{h.date}</TableCell>
                <TableCell className="text-center"><BoolBadge value={h.isWorkday} /></TableCell>
                <TableCell className="text-center"><BoolBadge value={h.isRecurring} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Footer anclado */}
      <div className="shrink-0 border-t bg-muted/50 p-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-normal">
          Mostrando <span className="font-medium text-foreground">{HOLIDAYS.length}</span> de{" "}
          <span className="font-medium text-foreground">{HOLIDAYS.length}</span>
        </span>
        <Button size="sm">
          <Plus className="size-3.5" />
          Nuevo
        </Button>
      </div>

    </div>
  )
}

// ─── Exported screen ──────────────────────────────────────────────────────────

export function CalendarioLaboral() {
  const [activeNav, setActiveNav] = useState("calendar")
  const [selected,  setSelected]  = useState<Set<string>>(new Set())
  const screenMode = useScreenMode()
  const [navMinimized, setNavMinimized] = useState(screenMode === "tablet")
  useEffect(() => { setNavMinimized(screenMode === "tablet") }, [screenMode])
  const isMobile   = screenMode === "mobile"
  const isDesktop  = screenMode === "desktop"
  const isCompact  = screenMode !== "desktop"

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === HOLIDAYS.length ? new Set() : new Set(HOLIDAYS.map((h) => h.id))
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      {isMobile
        ? <TopbarBarMobile title="Configuración" />
        : <TopbarBar title="Configuración" subtitle="" showSearch={false} />
      }

      {/* 2 — Contenido principal sobre fondo muted */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* 2a — Toolbar card */}
        <div className="flex items-center justify-between h-[60px] flex items-center rounded-lg border bg-background px-3 gap-3 shrink-0">
          <span className="text-sm font-medium text-foreground">Fracttal Demo</span>
          <Button size={isCompact ? "icon-sm" : "sm"} disabled>
            <Save className="size-4" />
            {!isCompact && "Guardar"}
          </Button>
        </div>

        {/* 2b — Nav + CalendarioCard */}
        {isMobile ? (
          <div className="flex-1 flex flex-col min-h-0 gap-2 overflow-hidden">
            <HorizontalNav items={[...NAV_ITEMS]} active={activeNav} onSelect={setActiveNav} />
            <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-h-0">
              <div className="h-12 px-2 border-b border-border shrink-0 flex items-center">
                {NAV_ITEMS.filter((n) => n.id === activeNav).map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">{label}</h2>
                  </div>
                ))}
              </div>
              <HolidaysMobileList
                rows={HOLIDAYS}
                selected={selected}
                onToggle={toggleRow}
                onToggleAll={toggleAll}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 min-h-0 gap-2 overflow-hidden">
            <SettingsNav
              active={activeNav}
              onSelect={setActiveNav}
              mode={screenMode}
              minimized={navMinimized}
              onToggleMinimize={!isMobile ? () => setNavMinimized((v) => !v) : undefined}
            />
            <div className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden rounded-lg border bg-background">
              <div className="h-12 px-2 border-b border-border shrink-0 flex items-center">
                {NAV_ITEMS.filter((n) => n.id === activeNav).map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">{label}</h2>
                  </div>
                ))}
              </div>
              <CalendarioCard
                selected={selected} allSelected={selected.size === HOLIDAYS.length}
                onToggleRow={toggleRow} onToggleAll={toggleAll}
                className="flex-1 min-w-0 !rounded-none !border-0"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
