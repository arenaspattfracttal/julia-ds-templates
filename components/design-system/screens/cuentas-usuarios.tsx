"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Save, Eye, Pencil, Trash2,
  EllipsisVertical, PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { Button }     from "@/components/ui/button"
import { Badge }      from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DataTable, type ColumnDef } from "@/components/ui/data-table"
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

// ─── Columnas DataTable ───────────────────────────────────────────────────────

const COLUMNS: ColumnDef<Usuario>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ getValue }) => (
      <span className="text-sm font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "apellido",
    header: "Apellido",
    cell: ({ getValue }) => (
      <span className="text-sm">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground font-mono">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ getValue }) => {
      const v = getValue() as Rol
      return <Badge variant={rolBadgeVariant(v)}>{v}</Badge>
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ getValue }) => {
      const v = getValue() as EstadoUsuario
      return <Badge variant={estadoBadgeVariant(v)}>{estadoBadgeLabel(v)}</Badge>
    },
  },
  {
    accessorKey: "modulos",
    header: "Módulos",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="tabular-nums">{getValue() as number}</Badge>
    ),
  },
  {
    accessorKey: "ultimoAcceso",
    header: "Último acceso",
    cell: ({ getValue }) => (
      <span className="text-sm tabular-nums text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "fechaCreacion",
    header: "Fecha creación",
    cell: ({ getValue }) => (
      <span className="text-sm tabular-nums text-muted-foreground">{getValue() as string}</span>
    ),
  },
]

// ─── Pantalla ─────────────────────────────────────────────────────────────────

export function CuentasUsuarios() {
  const [activeNav, setActiveNav] = useState("users")
  const screenMode = useScreenMode()
  const [navMinimized, setNavMinimized] = useState(screenMode === "tablet")
  useEffect(() => { setNavMinimized(screenMode === "tablet") }, [screenMode])
  const isMobile   = screenMode === "mobile"
  const isCompact  = screenMode !== "desktop"

  const dataTableContent = (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      <DataTable
        columns={COLUMNS}
        data={USUARIOS}
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
              <DropdownMenuItem><Pencil className="size-3.5" />Editar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive"><Trash2 className="size-3.5" />Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        onBulkDelete={() => {}}
        mobileView={isMobile}
      />
    </div>
  )

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
              {dataTableContent}
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
              {dataTableContent}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
