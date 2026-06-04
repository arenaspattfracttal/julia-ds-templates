"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Save, Plus, Eye, Pencil, Trash2,
  MoreVertical, PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { Button }     from "@/components/ui/button"
import { Badge }      from "@/components/ui/badge"
import { Checkbox }   from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator }  from "@/components/ui/separator"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { useScreenMode } from "../screen-mode-context"
import { cn }        from "@/lib/utils"

// ─── Sidebar nav items (mismo que configuracion-general) ──────────────────────

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

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────

type Rol = "Administrador" | "Técnico" | "Supervisor" | "Visualizador"
type EstadoUsuario = "activo" | "inactivo" | "pendiente"

type Usuario = {
  id:            number
  nombre:        string
  apellido:      string
  email:         string
  rol:           Rol
  estado:        EstadoUsuario
  ultimoAcceso:  string
  fechaCreacion: string
  modulos:       number
}

const USUARIOS: Usuario[] = [
  { id:  1, nombre: "Carlos",    apellido: "Mendoza",   email: "carlos.mendoza@fracttal.com",   rol: "Administrador", estado: "activo",    ultimoAcceso: "2026-05-27", fechaCreacion: "2024-01-10", modulos: 12 },
  { id:  2, nombre: "Ana",       apellido: "García",    email: "ana.garcia@fracttal.com",        rol: "Supervisor",    estado: "activo",    ultimoAcceso: "2026-05-26", fechaCreacion: "2024-02-15", modulos:  8 },
  { id:  3, nombre: "Luis",      apellido: "Torres",    email: "luis.torres@fracttal.com",       rol: "Técnico",       estado: "activo",    ultimoAcceso: "2026-05-25", fechaCreacion: "2024-03-01", modulos:  5 },
  { id:  4, nombre: "María",     apellido: "Rodríguez", email: "maria.rodriguez@fracttal.com",   rol: "Visualizador",  estado: "inactivo",  ultimoAcceso: "2026-04-10", fechaCreacion: "2024-01-20", modulos:  3 },
  { id:  5, nombre: "Jorge",     apellido: "Ramírez",   email: "jorge.ramirez@fracttal.com",     rol: "Técnico",       estado: "activo",    ultimoAcceso: "2026-05-28", fechaCreacion: "2024-04-05", modulos:  5 },
  { id:  6, nombre: "Laura",     apellido: "Jiménez",   email: "laura.jimenez@fracttal.com",     rol: "Supervisor",    estado: "pendiente", ultimoAcceso: "—",          fechaCreacion: "2026-05-20", modulos:  0 },
  { id:  7, nombre: "Pedro",     apellido: "Herrera",   email: "pedro.herrera@fracttal.com",     rol: "Técnico",       estado: "activo",    ultimoAcceso: "2026-05-22", fechaCreacion: "2024-06-11", modulos:  5 },
  { id:  8, nombre: "Sofía",     apellido: "Vargas",    email: "sofia.vargas@fracttal.com",      rol: "Administrador", estado: "activo",    ultimoAcceso: "2026-05-27", fechaCreacion: "2024-07-03", modulos: 12 },
  { id:  9, nombre: "Andrés",    apellido: "Castro",    email: "andres.castro@fracttal.com",     rol: "Visualizador",  estado: "activo",    ultimoAcceso: "2026-05-15", fechaCreacion: "2024-08-18", modulos:  3 },
  { id: 10, nombre: "Valentina", apellido: "Ortiz",     email: "valentina.ortiz@fracttal.com",   rol: "Técnico",       estado: "inactivo",  ultimoAcceso: "2026-03-30", fechaCreacion: "2024-09-01", modulos:  5 },
  { id: 11, nombre: "Felipe",    apellido: "Morales",   email: "felipe.morales@fracttal.com",    rol: "Supervisor",    estado: "activo",    ultimoAcceso: "2026-05-24", fechaCreacion: "2024-10-07", modulos:  8 },
  { id: 12, nombre: "Isabella",  apellido: "Díaz",      email: "isabella.diaz@fracttal.com",     rol: "Visualizador",  estado: "activo",    ultimoAcceso: "2026-05-18", fechaCreacion: "2024-11-14", modulos:  3 },
  { id: 13, nombre: "Camilo",    apellido: "Reyes",     email: "camilo.reyes@fracttal.com",      rol: "Técnico",       estado: "pendiente", ultimoAcceso: "—",          fechaCreacion: "2026-05-22", modulos:  0 },
  { id: 14, nombre: "Daniela",   apellido: "Flores",    email: "daniela.flores@fracttal.com",    rol: "Supervisor",    estado: "activo",    ultimoAcceso: "2026-05-26", fechaCreacion: "2024-12-01", modulos:  8 },
  { id: 15, nombre: "Tomás",     apellido: "Gutiérrez", email: "tomas.gutierrez@fracttal.com",   rol: "Técnico",       estado: "activo",    ultimoAcceso: "2026-05-21", fechaCreacion: "2025-01-09", modulos:  5 },
  { id: 16, nombre: "Natalia",   apellido: "Soto",      email: "natalia.soto@fracttal.com",      rol: "Visualizador",  estado: "inactivo",  ultimoAcceso: "2026-02-14", fechaCreacion: "2025-02-03", modulos:  3 },
  { id: 17, nombre: "Ricardo",   apellido: "Lara",      email: "ricardo.lara@fracttal.com",      rol: "Administrador", estado: "activo",    ultimoAcceso: "2026-05-28", fechaCreacion: "2025-03-15", modulos: 12 },
  { id: 18, nombre: "Gabriela",  apellido: "Peña",      email: "gabriela.pena@fracttal.com",     rol: "Técnico",       estado: "activo",    ultimoAcceso: "2026-05-20", fechaCreacion: "2025-04-22", modulos:  5 },
  { id: 19, nombre: "Sebastián", apellido: "Aguilar",   email: "sebastian.aguilar@fracttal.com", rol: "Supervisor",    estado: "pendiente", ultimoAcceso: "—",          fechaCreacion: "2026-05-25", modulos:  0 },
  { id: 20, nombre: "Mariana",   apellido: "Ríos",      email: "mariana.rios@fracttal.com",      rol: "Visualizador",  estado: "activo",    ultimoAcceso: "2026-05-19", fechaCreacion: "2025-06-30", modulos:  3 },
]

// ─── Helpers de badge ─────────────────────────────────────────────────────────

function estadoBadgeVariant(estado: EstadoUsuario) {
  if (estado === "activo")    return "success"   as const
  if (estado === "inactivo")  return "destructive" as const
  return "warning" as const
}

function estadoBadgeLabel(estado: EstadoUsuario) {
  if (estado === "activo")    return "Activo"
  if (estado === "inactivo")  return "Inactivo"
  return "Pendiente"
}

function rolBadgeVariant(rol: Rol) {
  if (rol === "Administrador") return "default"   as const
  if (rol === "Supervisor")    return "info"      as const
  if (rol === "Técnico")       return "secondary" as const
  return "outline" as const
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

function UsuariosMobileList({
  rows, selected, onToggle, onToggleAll,
}: {
  rows:        Usuario[]
  selected:    Set<number>
  onToggle:    (id: number) => void
  onToggleAll: () => void
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
          {rows.map((usuario, i) => {
            const isExpanded = expanded.has(usuario.id)
            return (
              <div key={usuario.id}>
                <div
                  className={cn(
                    "flex gap-2 px-3 py-2.5 cursor-pointer transition-colors",
                    selected.has(usuario.id) && "bg-primary/5",
                  )}
                  onClick={() => toggleExpand(usuario.id)}
                >
                  {/* Checkbox */}
                  <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(usuario.id)}
                      onCheckedChange={() => onToggle(usuario.id)}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {usuario.nombre} {usuario.apellido}
                    </p>
                    <MobileFieldRow label="Email" value={usuario.email} />
                    <MobileFieldRow label="Rol">
                      <Badge variant={rolBadgeVariant(usuario.rol)} size="sm">{usuario.rol}</Badge>
                    </MobileFieldRow>

                    {/* Expandido animado con grid-rows */}
                    <div className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}>
                      <div className="overflow-hidden">
                        <div className="flex flex-col gap-1">
                          <MobileFieldRow label="Estado">
                            <Badge variant={estadoBadgeVariant(usuario.estado)} size="sm">{estadoBadgeLabel(usuario.estado)}</Badge>
                          </MobileFieldRow>
                          <MobileFieldRow label="Módulos">
                            <Badge variant="outline" size="sm" className="tabular-nums">{usuario.modulos}</Badge>
                          </MobileFieldRow>
                          <MobileFieldRow label="Último acceso"  value={usuario.ultimoAcceso} />
                          <MobileFieldRow label="Fecha creación" value={usuario.fechaCreacion} />
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
                          Ver usuario
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="size-4 text-muted-foreground" />
                          Editar
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

// ─── Tabla card ──────────────────────────────────────────────────────────────

function TablaCard({
  selected, allSelected, onToggleRow, onToggleAll, className,
}: {
  selected: Set<number>
  allSelected: boolean
  onToggleRow: (id: number) => void
  onToggleAll: () => void
  className?: string
}) {
  return (
    <div className={cn("rounded-lg border bg-background overflow-hidden flex flex-col", className)}>
      <ScrollArea className="flex-1 min-h-0" horizontal>
        <Table wrapperClassName="min-w-max">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-12 min-w-12 pl-4 pr-2">
                <Checkbox checked={allSelected} onCheckedChange={onToggleAll} aria-label="Seleccionar todos" />
              </TableHead>
              <TableHead className="w-20 min-w-20">Acciones</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Módulos</TableHead>
              <TableHead>Último acceso</TableHead>
              <TableHead>Fecha creación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {USUARIOS.map((usuario) => (
              <TableRow key={usuario.id} data-state={selected.has(usuario.id) ? "selected" : undefined}>
                <TableCell className="pl-4 pr-2">
                  <Checkbox checked={selected.has(usuario.id)} onCheckedChange={() => onToggleRow(usuario.id)} aria-label={`Seleccionar ${usuario.nombre}`} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon-sm" aria-label="Ver"><Eye className="size-3.5 text-foreground" /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Editar"><Pencil className="size-3.5 text-foreground" /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Eliminar"><Trash2 className="size-3.5 text-foreground" /></Button>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium">{usuario.nombre}</TableCell>
                <TableCell className="text-sm">{usuario.apellido}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-52 truncate">{usuario.email}</TableCell>
                <TableCell><Badge variant={rolBadgeVariant(usuario.rol)}>{usuario.rol}</Badge></TableCell>
                <TableCell className="text-center"><Badge variant={estadoBadgeVariant(usuario.estado)}>{estadoBadgeLabel(usuario.estado)}</Badge></TableCell>
                <TableCell className="text-center"><Badge variant="outline" className="font-mono tabular-nums">{usuario.modulos}</Badge></TableCell>
                <TableCell className="text-sm tabular-nums text-muted-foreground">{usuario.ultimoAcceso}</TableCell>
                <TableCell className="text-sm tabular-nums text-muted-foreground">{usuario.fechaCreacion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="shrink-0 border-t bg-muted/50 p-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-normal">
          Mostrando <span className="font-medium text-foreground">20</span> de{" "}
          <span className="font-medium text-foreground">20</span>
        </span>
        <Button size="sm"><Plus className="size-3.5" />Nuevo</Button>
      </div>
    </div>
  )
}

// ─── Pantalla ─────────────────────────────────────────────────────────────────

export function CuentasUsuarios() {
  const [activeNav, setActiveNav] = useState("users")
  const [selected,  setSelected]  = useState<Set<number>>(new Set())
  const screenMode = useScreenMode()
  const [navMinimized, setNavMinimized] = useState(screenMode === "tablet")
  useEffect(() => { setNavMinimized(screenMode === "tablet") }, [screenMode])
  const isMobile   = screenMode === "mobile"
  const isDesktop  = screenMode === "desktop"
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
      prev.size === USUARIOS.length ? new Set() : new Set(USUARIOS.map((u) => u.id))
    )
  }

  const allSelected = selected.size === USUARIOS.length

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      {isMobile
        ? <TopbarBarMobile title="Configuración" />
        : <TopbarBar title="Configuración" subtitle="" showSearch={false} />
      }

      {/* 2 — Contenido principal sobre fondo muted */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* 2a — Toolbar card: breadcrumb + acción */}
        <div className="flex items-center justify-between rounded-lg border bg-background p-3 gap-3 shrink-0">
          <span className="text-sm font-medium text-foreground">Fracttal Demo</span>
          <Button size={isCompact ? "icon-sm" : "sm"} disabled>
            <Save className="size-4" />
            {!isCompact && "Guardar"}
          </Button>
        </div>

        {/* 2b — Nav card + Tabla card */}
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
              <UsuariosMobileList
                rows={USUARIOS}
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
              <TablaCard
                selected={selected} allSelected={allSelected}
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
