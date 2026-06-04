"use client"

import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Save, Plus, Bell, MessageCircle,
  Sparkles, PanelLeftClose, PanelLeftOpen,
  RefreshCw, SlidersHorizontal, Columns3, MoreHorizontal,
  Eye, Pencil, Trash2, Lock,
  ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, X, Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button }      from "@/components/ui/button"
import { Badge }       from "@/components/ui/badge"
import { Checkbox }    from "@/components/ui/checkbox"
import { ScrollArea }  from "@/components/ui/scroll-area"
import { Separator }   from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScreenModeProvider } from "@/components/design-system/screen-mode-context"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ScreenMode = "desktop" | "tablet" | "mobile"

type Perfil = "Administrador" | "Técnico" | "Sólo Lectura" | "Solicitudes" | "Personalizado"

type Usuario = {
  id:             number
  habilitado:     boolean
  nombre:         string
  email:          string
  tipoUsuario:    string
  perfil:         Perfil
  grupoPermisos:  string
  verificado:     boolean
  bloqueado:      boolean
}

// ─── Nav items ────────────────────────────────────────────────────────────────

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

// ─── Data ─────────────────────────────────────────────────────────────────────

const USUARIOS: Usuario[] = [
  { id:  1, habilitado: true,  nombre: "AAAA USUARIO USUARIO USUARIO USUARIO o DEMO FRACTTAL", email: "derpickel@gmail.com",                    tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  2, habilitado: true,  nombre: "Adri Z",                                                email: "adriana.zambrano@fracttal.com",           tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  3, habilitado: true,  nombre: "ALEJANDRO AGUILAR",                                     email: "alejandro.aguilar@fracttal.com",          tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  4, habilitado: true,  nombre: "Alejandro Caro",                                        email: "alejandro.caro@fracttal.com",             tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  5, habilitado: true,  nombre: "Alejandro caro tecnico 1",                              email: "alejocaro-qa@yopmail.com",                tipoUsuario: "Recursos Humanos", perfil: "Técnico",       grupoPermisos: "ADMIN TAMAYO",        verificado: true, bloqueado: false },
  { id:  6, habilitado: true,  nombre: "Alejandro Tamayo",                                      email: "altamayoag@gmail.com",                    tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  7, habilitado: true,  nombre: "Alejandro Tamayo",                                      email: "alejandrotamayoagudelo@gmail.com",        tipoUsuario: "Recursos Humanos", perfil: "Sólo Lectura",  grupoPermisos: "Solo Lectura Tamayo", verificado: true, bloqueado: false },
  { id:  8, habilitado: true,  nombre: "Alexander Fuentes",                                     email: "alexander.fuentes@fracttal.com",          tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  9, habilitado: true,  nombre: "Alfred",                                                email: "up170660@alumnos.upa.edu.mx",             tipoUsuario: "Recursos Humanos", perfil: "Solicitudes",   grupoPermisos: "",                    verificado: true, bloqueado: false },
  { id: 10, habilitado: true,  nombre: "Alfredo Sandoval",                                      email: "alfredo.sandoval@fracttal.com",           tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 11, habilitado: true,  nombre: "Alfred SV",                                             email: "alfredosandoval76@gmail.com",             tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 12, habilitado: true,  nombre: "Andrea Angarita",                                       email: "andrea.angarita@fracttal.com",            tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 13, habilitado: true,  nombre: "arturo.castro@fracttal.com",                            email: "arturo.castro@fracttal.com",              tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 14, habilitado: true,  nombre: "AZR",                                                   email: "adrianay.zambrano@gmail.com",             tipoUsuario: "Recursos Humanos", perfil: "Personalizado", grupoPermisos: "ADMIN TAMAYO",        verificado: true, bloqueado: false },
  { id: 15, habilitado: true,  nombre: "Beatriz Quintero",                                      email: "beatriz.quintero@fracttal.com",           tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 16, habilitado: true,  nombre: "Carlos Mendoza",                                        email: "carlos.mendoza@fracttal.com",             tipoUsuario: "Recursos Humanos", perfil: "Técnico",       grupoPermisos: "ADMIN TAMAYO",        verificado: true, bloqueado: false },
  { id: 17, habilitado: false, nombre: "Carmen Ruiz",                                           email: "carmen.ruiz@fracttal.com",                tipoUsuario: "Recursos Humanos", perfil: "Sólo Lectura",  grupoPermisos: "Solo Lectura Tamayo", verificado: true, bloqueado: false },
  { id: 18, habilitado: true,  nombre: "Daniel Moreno",                                         email: "daniel.moreno@fracttal.com",              tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 19, habilitado: true,  nombre: "Diana Castillo",                                        email: "diana.castillo@fracttal.com",             tipoUsuario: "Recursos Humanos", perfil: "Técnico",       grupoPermisos: "ADMIN TAMAYO",        verificado: true, bloqueado: false },
  { id: 20, habilitado: true,  nombre: "Eduardo Silva",                                         email: "eduardo.silva@fracttal.com",              tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
]

const STATS = [
  { label: "Cuentas de Usuarios",        used: 0, max: "120"       },
  { label: "Cuentas Técnico limitado",   used: 0, max: "30"        },
  { label: "Cuentas de solicitudes",     used: 0, max: "Ilimitado" },
  { label: "Cuentas de solo lectura",    used: 0, max: "Ilimitado" },
]

// ─── Datos de permisos ────────────────────────────────────────────────────────

type GrupoPermiso = {
  id:          number
  descripcion: string
  nota:        string
  soloLectura: boolean
}

const GRUPOS: GrupoPermiso[] = [
  { id:  1, descripcion: "AAA Grupo MRX",                          nota: "",                                          soloLectura: false },
  { id:  2, descripcion: "Administrador",                          nota: "Grupo de permisos predeterminado",          soloLectura: false },
  { id:  3, descripcion: "Admin Oauth Alfred",                     nota: "",                                          soloLectura: false },
  { id:  4, descripcion: "Adminstrador de Negocios",               nota: "Todas las opciones son seleccionadas",      soloLectura: false },
  { id:  5, descripcion: "ADMIN TAMAYO",                           nota: "",                                          soloLectura: false },
  { id:  6, descripcion: "Admouath",                               nota: "",                                          soloLectura: false },
  { id:  7, descripcion: "Alfred TEC",                             nota: "",                                          soloLectura: false },
  { id:  8, descripcion: "Alfred TI- MTTO",                        nota: "",                                          soloLectura: false },
  { id:  9, descripcion: "ALL_PERMISSIONS",                        nota: "",                                          soloLectura: false },
  { id: 10, descripcion: "AUDITOR PARKS",                          nota: "ahora si se pudo reducir la lista de perm", soloLectura: true  },
  { id: 11, descripcion: "CARLOS ALFREDO - GRUPO 1 TESTE",         nota: "GRUPO 1 TESTE",                             soloLectura: false },
  { id: 12, descripcion: "Carlos Alfredo - Perfil pedidos",        nota: "",                                          soloLectura: false },
  { id: 13, descripcion: "Carlos alfredo Perfil Técnico",          nota: "",                                          soloLectura: false },
  { id: 14, descripcion: "CARLOS SOLICITAÇÃO DE SERVIÇOS TESTE",   nota: "",                                          soloLectura: false },
  { id: 15, descripcion: "CARLOS TESTES PLANEJADORES",             nota: "",                                          soloLectura: false },
  { id: 16, descripcion: "chefe de manutenção",                    nota: "",                                          soloLectura: false },
  { id: 17, descripcion: "Demo Grupo Lectura",                     nota: "",                                          soloLectura: true  },
  { id: 18, descripcion: "Grupo Básico",                           nota: "Acceso a módulos básicos",                  soloLectura: false },
  { id: 19, descripcion: "Grupo Operativo",                        nota: "",                                          soloLectura: false },
  { id: 20, descripcion: "Solo Lectura Tamayo",                    nota: "Permisos de consulta únicamente",           soloLectura: true  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function perfilVariant(p: Perfil) {
  if (p === "Administrador") return "default"   as const
  if (p === "Técnico")       return "secondary" as const
  if (p === "Sólo Lectura")  return "outline"   as const
  if (p === "Solicitudes")   return "info"      as const
  return "outline" as const
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ title, mode }: { title: string; mode: ScreenMode }) {
  const isMobile = mode === "mobile"
  return (
    <div className={cn(
      "flex w-full items-center gap-2 border-b bg-background px-3 shrink-0",
      isMobile ? "h-14" : "h-[60px]",
    )}>
      <svg viewBox="0 0 500 500" className="size-6 text-primary shrink-0" aria-label="Fracttal">
        <path fill="currentColor" d="M243.57,301c-14.32,0-25.92,11.61-25.92,25.92s11.61,25.92,25.92,25.92,25.92-11.61,25.92-25.92-11.61-25.92-25.92-25.92Z"/>
        <path fill="currentColor" d="M310.05,260.54c-15.41,0-27.89,12.48-27.89,27.89s12.48,27.89,27.89,27.89,27.89-12.48,27.89-27.89-12.48-27.89-27.89-27.89Z"/>
        <path fill="currentColor" d="M310.05,183.59c-15.41,0-27.89,12.48-27.89,27.89s12.48,27.89,27.89,27.89,27.89-12.48,27.89-27.89-12.48-27.89-27.89-27.89Z"/>
        <path fill="currentColor" d="M243.57,147.11c-14.3,0-25.92,11.62-25.92,25.92s11.62,25.92,25.92,25.92,25.92-11.62,25.92-25.92-11.62-25.92-25.92-25.92Z"/>
        <path fill="currentColor" d="M177.08,233.8c12.34,0,22.32-9.98,22.32-22.32s-9.99-22.32-22.32-22.32-22.32,9.98-22.32,22.32,9.99,22.32,22.32,22.32Z"/>
        <path fill="currentColor" d="M177.08,310.75c12.34,0,22.32-9.98,22.32-22.32s-9.99-22.32-22.32-22.32-22.32,9.98-22.32,22.32,9.99,22.32,22.32,22.32Z"/>
        <path fill="currentColor" d="M376.25,220.07c-16.52,0-29.91,13.39-29.91,29.9s13.39,29.91,29.91,29.91,29.91-13.39,29.91-29.91-13.39-29.9-29.91-29.9Z"/>
      </svg>
      <span className="text-sm font-semibold text-foreground">{title}</span>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="icon-sm" className="relative">
          <Bell className="size-4" />
          <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 py-0 text-[10px] leading-none bg-primary text-primary-foreground border-2 border-background">
            3
          </Badge>
        </Button>
        <Button variant="secondary" size="icon-sm">
          <MessageCircle className="size-4" />
        </Button>
        {!isMobile && (
          <Button size="sm" className="gap-1.5">
            <Sparkles className="size-3.5" />
            AI
          </Button>
        )}
      </div>
      <Avatar className="size-8 cursor-pointer">
        <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
          UR
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

// ─── Settings nav ─────────────────────────────────────────────────────────────

function SettingsNav({
  active, onSelect, mode, minimized = false, onToggleMinimize,
}: {
  active: string
  onSelect: (id: string) => void
  mode: ScreenMode
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
      {!isMobileNav && onToggleMinimize && (
        <div className={cn(
          "h-12 px-2 flex items-center border-b border-border shrink-0",
          minimized ? "justify-center" : "justify-between",
        )}>
          {!minimized && (
            <span className="text-xs font-medium text-foreground/60 px-1">Secciones</span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost" size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={onToggleMinimize}
              >
                {minimized ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {minimized ? "Expandir menú" : "Minimizar menú"}
            </TooltipContent>
          </Tooltip>
        </div>
      )}
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

// ─── Horizontal nav (mobile) ──────────────────────────────────────────────────

function HorizontalNav({ active, onSelect }: {
  active:   string
  onSelect: (id: string) => void
}) {
  const scrollRef             = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd,   setAtEnd]   = useState(false)

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

  const mask =
    atStart && atEnd ? undefined
    : atStart ? "linear-gradient(to right, black 91%, transparent 100%)"
    : atEnd   ? "linear-gradient(to right, transparent 0%, black 9%, black 100%)"
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
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
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

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ isCompact }: { isCompact: boolean }) {
  return (
    <div className={cn(
      "flex shrink-0 border-b",
      isCompact ? "flex-col divide-y" : "divide-x",
    )}>
      {STATS.map(({ label, used, max }) => (
        <div key={label} className="flex flex-col gap-0.5 px-4 py-2.5 flex-1 min-w-0">
          <span className="text-xs text-muted-foreground truncate">{label}</span>
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {used} / {max}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc" | null

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc")  return <ChevronUp   className="size-3 shrink-0" />
  if (dir === "desc") return <ChevronDown className="size-3 shrink-0" />
  return <ChevronsUpDown className="size-3 shrink-0 opacity-30" />
}

function nextDir(current: SortDir): SortDir {
  if (current === null)  return "asc"
  if (current === "asc") return "desc"
  return null
}

// ─── Tabla de usuarios ────────────────────────────────────────────────────────

const U_PAGE = 10
type UserSortKey = "nombre" | "email" | "perfil"

function UsersTable({ isCompact }: { isCompact: boolean }) {
  const [rows,       setRows]       = useState(USUARIOS)
  const [selected,   setSelected]   = useState<Set<number>>(new Set())
  const [sort,       setSort]       = useState<{ key: UserSortKey; dir: SortDir }>({ key: "nombre", dir: null })
  const [query,      setQuery]      = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [page,       setPage]       = useState(0)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return rows.filter(u =>
      !q ||
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.perfil.toLowerCase().includes(q) ||
      u.grupoPermisos.toLowerCase().includes(q)
    )
  }, [rows, query])

  const sorted = useMemo(() => {
    if (!sort.dir) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[sort.key] as string
      const bv = b[sort.key] as string
      return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / U_PAGE))
  const safePage   = Math.min(page, totalPages - 1)
  const pageRows   = sorted.slice(safePage * U_PAGE, (safePage + 1) * U_PAGE)
  const from       = sorted.length === 0 ? 0 : safePage * U_PAGE + 1
  const to         = Math.min((safePage + 1) * U_PAGE, sorted.length)

  const allSelected   = selected.size > 0 && pageRows.every(u => selected.has(u.id))
  const someSelected  = selected.size > 0

  function toggleRow(id: number) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleAll() {
    const pageIds = new Set(pageRows.map(u => u.id))
    const allOn   = pageRows.every(u => selected.has(u.id))
    setSelected(prev => {
      const n = new Set(prev)
      allOn ? pageIds.forEach(id => n.delete(id)) : pageIds.forEach(id => n.add(id))
      return n
    })
  }
  function handleSort(key: UserSortKey) {
    setSort(prev => ({ key, dir: prev.key === key ? nextDir(prev.dir) : "asc" }))
    setPage(0)
  }
  function handleRefresh() {
    setRows(USUARIOS); setQuery(""); setSort({ key: "nombre", dir: null })
    setPage(0); setSelected(new Set()); setShowSearch(false)
  }
  function deleteSelected() {
    setRows(prev => prev.filter(u => !selected.has(u.id)))
    setSelected(new Set()); setPage(0)
  }

  function SortTh({ label, col, className }: { label: string; col: UserSortKey; className?: string }) {
    return (
      <TableHead className={cn("cursor-pointer select-none", className)} onClick={() => handleSort(col)}>
        <div className="flex items-center gap-1">
          {label}
          <SortIcon dir={sort.key === col ? sort.dir : null} />
        </div>
      </TableHead>
    )
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 h-10 border-b shrink-0">
        {showSearch && (
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              autoFocus
              placeholder="Buscar usuario..."
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(0) }}
              className="pl-8 h-7 text-xs"
            />
          </div>
        )}
        {someSelected && (
          <span className="text-xs text-muted-foreground flex-1">
            {selected.size} seleccionado{selected.size > 1 ? "s" : ""}
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto">
          {someSelected && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={deleteSelected} aria-label="Eliminar seleccionados">
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Eliminar seleccionados</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={handleRefresh} aria-label="Actualizar">
                <RefreshCw className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Actualizar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showSearch || query ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setShowSearch(v => !v)}
                aria-label="Buscar"
              >
                {showSearch ? <X className="size-3.5" /> : <SlidersHorizontal className="size-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{showSearch ? "Cerrar búsqueda" : "Filtrar"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Columnas">
                <Columns3 className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Columnas</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Más opciones">
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Exportar CSV</DropdownMenuItem>
              <DropdownMenuItem>Importar usuarios</DropdownMenuItem>
              {someSelected && (
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={deleteSelected}>
                  Eliminar seleccionados ({selected.size})
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabla */}
      <ScrollArea className="flex-1 min-h-0" horizontal>
        <Table wrapperClassName="min-w-max">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-10 pl-4 pr-2">
                <Checkbox
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  aria-label="Seleccionar página"
                />
              </TableHead>
              <TableHead className="w-20 min-w-20">Habilitado</TableHead>
              <SortTh label="Nombre"   col="nombre" className="min-w-44" />
              <SortTh label="Email"    col="email"  className="min-w-52" />
              <TableHead className="min-w-36">Tipo de usuario</TableHead>
              <SortTh label="Perfil"   col="perfil" className="min-w-28" />
              <TableHead className="min-w-40">Grupo de Permisos</TableHead>
              <TableHead className="w-24 text-center">Verificado</TableHead>
              <TableHead className="w-24 text-center">Bloqueado</TableHead>
              <TableHead className="w-20 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10 text-sm text-muted-foreground">
                  No hay resultados para &ldquo;{query}&rdquo;
                </TableCell>
              </TableRow>
            ) : pageRows.map((u) => (
              <TableRow key={u.id} data-state={selected.has(u.id) ? "selected" : undefined}>
                <TableCell className="pl-4 pr-2">
                  <Checkbox checked={selected.has(u.id)} onCheckedChange={() => toggleRow(u.id)} aria-label={`Seleccionar ${u.nombre}`} />
                </TableCell>
                <TableCell>
                  <Badge variant={u.habilitado ? "success" : "outline"} size="sm">{u.habilitado ? "Sí" : "No"}</Badge>
                </TableCell>
                <TableCell className="text-sm font-medium max-w-44 truncate">{u.nombre}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-52 truncate font-mono">{u.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.tipoUsuario}</TableCell>
                <TableCell><Badge variant={perfilVariant(u.perfil)} size="sm">{u.perfil}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.grupoPermisos || "—"}</TableCell>
                <TableCell className="text-center">
                  <span className={cn("text-sm font-medium", u.verificado ? "text-success" : "text-muted-foreground")}>
                    {u.verificado ? "Sí" : "No"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn("text-sm font-medium", u.bloqueado ? "text-destructive" : "text-muted-foreground")}>
                    {u.bloqueado ? "Sí" : "No"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-0.5">
                    <Button variant="ghost" size="icon-sm" aria-label="Ver"><Eye className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Editar"><Pencil className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Eliminar" onClick={() => { setRows(p => p.filter(r => r.id !== u.id)); setSelected(p => { const n = new Set(p); n.delete(u.id); return n }) }}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-3 py-2 shrink-0 bg-muted/30">
        <span className="text-xs text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{from}–{to}</span> de{" "}
          <span className="font-medium text-foreground">{sorted.length}</span>
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}>
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="text-xs tabular-nums text-muted-foreground px-1">
              {safePage + 1} / {totalPages}
            </span>
            <Button variant="outline" size="icon-sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="size-3.5" />
            {!isCompact && "Nuevo usuario"}
          </Button>
        </div>
      </div>
    </>
  )
}

// ─── Tabla de permisos ────────────────────────────────────────────────────────

const G_PAGE = 10

function PermisosTable({ isCompact }: { isCompact: boolean }) {
  const [rows,       setRows]       = useState(GRUPOS)
  const [selected,   setSelected]   = useState<Set<number>>(new Set())
  const [sortDir,    setSortDir]    = useState<SortDir>(null)
  const [query,      setQuery]      = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [page,       setPage]       = useState(0)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return rows.filter(g => !q || g.descripcion.toLowerCase().includes(q) || g.nota.toLowerCase().includes(q))
  }, [rows, query])

  const sorted = useMemo(() => {
    if (!sortDir) return filtered
    return [...filtered].sort((a, b) =>
      sortDir === "asc"
        ? a.descripcion.localeCompare(b.descripcion)
        : b.descripcion.localeCompare(a.descripcion)
    )
  }, [filtered, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / G_PAGE))
  const safePage   = Math.min(page, totalPages - 1)
  const pageRows   = sorted.slice(safePage * G_PAGE, (safePage + 1) * G_PAGE)
  const from       = sorted.length === 0 ? 0 : safePage * G_PAGE + 1
  const to         = Math.min((safePage + 1) * G_PAGE, sorted.length)

  const allSelected  = pageRows.length > 0 && pageRows.every(g => selected.has(g.id))
  const someSelected = selected.size > 0

  function toggleRow(id: number) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleAll() {
    const pageIds = new Set(pageRows.map(g => g.id))
    const allOn   = pageRows.every(g => selected.has(g.id))
    setSelected(prev => {
      const n = new Set(prev)
      allOn ? pageIds.forEach(id => n.delete(id)) : pageIds.forEach(id => n.add(id))
      return n
    })
  }
  function handleRefresh() {
    setRows(GRUPOS); setQuery(""); setSortDir(null)
    setPage(0); setSelected(new Set()); setShowSearch(false)
  }
  function deleteSelected() {
    setRows(prev => prev.filter(g => !selected.has(g.id)))
    setSelected(new Set()); setPage(0)
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 h-10 border-b shrink-0">
        {showSearch && (
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              autoFocus
              placeholder="Buscar grupo..."
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(0) }}
              className="pl-8 h-7 text-xs"
            />
          </div>
        )}
        {someSelected && !showSearch && (
          <span className="text-xs text-muted-foreground flex-1">
            {selected.size} seleccionado{selected.size > 1 ? "s" : ""}
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto">
          {someSelected && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={deleteSelected} aria-label="Eliminar seleccionados">
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Eliminar seleccionados</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={handleRefresh} aria-label="Actualizar">
                <RefreshCw className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Actualizar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showSearch || query ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setShowSearch(v => !v)}
                aria-label="Buscar"
              >
                {showSearch ? <X className="size-3.5" /> : <SlidersHorizontal className="size-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{showSearch ? "Cerrar búsqueda" : "Filtrar"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Columnas">
                <Columns3 className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Columnas</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Tabla */}
      <ScrollArea className="flex-1 min-h-0">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-10 pl-4 pr-2">
                <Checkbox
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  aria-label="Seleccionar página"
                />
              </TableHead>
              <TableHead
                className="min-w-64 cursor-pointer select-none"
                onClick={() => { setSortDir(d => nextDir(d)); setPage(0) }}
              >
                <div className="flex items-center gap-1">
                  Descripción
                  <SortIcon dir={sortDir} />
                </div>
              </TableHead>
              <TableHead className="min-w-56">Nota</TableHead>
              <TableHead className="w-28">Solo lectura</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-sm text-muted-foreground">
                  No hay resultados para &ldquo;{query}&rdquo;
                </TableCell>
              </TableRow>
            ) : pageRows.map((g) => (
              <TableRow key={g.id} data-state={selected.has(g.id) ? "selected" : undefined}>
                <TableCell className="pl-4 pr-2">
                  <Checkbox checked={selected.has(g.id)} onCheckedChange={() => toggleRow(g.id)} aria-label={`Seleccionar ${g.descripcion}`} />
                </TableCell>
                <TableCell className="text-sm font-medium">{g.descripcion}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-56 truncate">{g.nota || ""}</TableCell>
                <TableCell>
                  <span className={cn("text-sm font-medium", g.soloLectura ? "text-success" : "text-destructive")}>
                    {g.soloLectura ? "Sí" : "No"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-3 py-2 shrink-0 bg-muted/30">
        <span className="text-xs text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{from}–{to}</span> de{" "}
          <span className="font-medium text-foreground">{sorted.length}</span>
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}>
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="text-xs tabular-nums text-muted-foreground px-1">
              {safePage + 1} / {totalPages}
            </span>
            <Button variant="outline" size="icon-sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="size-3.5" />
            {!isCompact && "Nuevo grupo"}
          </Button>
        </div>
      </div>
    </>
  )
}

// ─── Content panel ────────────────────────────────────────────────────────────

export function CuentasContent({ isCompact }: { isCompact: boolean }) {
  return (
    <Tabs defaultValue="cuentas" className="flex flex-col flex-1 min-h-0">
      <div className="border-b shrink-0">
        <TabsList variant="line" className="px-3 h-12">
          <TabsTrigger value="cuentas" className="gap-2">
            <Users className="size-4" />
            {!isCompact && "Cuentas de Usuarios"}
          </TabsTrigger>
          <TabsTrigger value="permisos" className="gap-2">
            <Lock className="size-4" />
            {!isCompact && "Permisos"}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="cuentas" className="flex flex-col flex-1 min-h-0 mt-0">
        <StatsBar isCompact={isCompact} />
        <UsersTable isCompact={isCompact} />
      </TabsContent>

      <TabsContent value="permisos" className="flex flex-col flex-1 min-h-0 mt-0">
        <PermisosTable isCompact={isCompact} />
      </TabsContent>
    </Tabs>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

function CuentasUsuariosInner() {
  const [screenMode,   setScreenMode]   = useState<ScreenMode>("desktop")
  const [activeNav,    setActiveNav]    = useState("users")
  const [navMinimized, setNavMinimized] = useState(false)

  useEffect(() => {
    function check() {
      const w = window.innerWidth
      setScreenMode(w >= 1024 ? "desktop" : w >= 768 ? "tablet" : "mobile")
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useLayoutEffect(() => {
    setNavMinimized(screenMode === "tablet")
  }, [screenMode])

  const isMobile  = screenMode === "mobile"
  const isCompact = screenMode !== "desktop"

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      <Topbar title="Configuración" mode={screenMode} />

      {/* 2 — Área principal */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* 2a — Toolbar */}
        <div className="flex items-center justify-between h-[60px] rounded-lg border bg-background px-3 gap-3 shrink-0">
          <span className="text-sm font-medium text-foreground">Fracttal Demo</span>
          <Button size={isCompact ? "icon-sm" : "sm"} disabled>
            <Save className="size-4" />
            {!isCompact && " Guardar"}
          </Button>
        </div>

        {/* 2b — Nav + contenido */}
        {isMobile ? (
          <div className="flex-1 flex flex-col min-h-0 gap-2 overflow-hidden">
            <HorizontalNav active={activeNav} onSelect={setActiveNav} />
            <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-h-0">
              <CuentasContent isCompact={isCompact} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 min-h-0 gap-2 overflow-hidden">
            <SettingsNav
              active={activeNav}
              onSelect={setActiveNav}
              mode={screenMode}
              minimized={navMinimized}
              onToggleMinimize={() => setNavMinimized(v => !v)}
            />
            <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-w-0 min-h-0">
              <CuentasContent isCompact={isCompact} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function CuentasUsuarios() {
  const [mode, setMode] = useState<ScreenMode>("desktop")
  useEffect(() => {
    function check() {
      const w = window.innerWidth
      setMode(w >= 1024 ? "desktop" : w >= 768 ? "tablet" : "mobile")
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return (
    <ScreenModeProvider mode={mode}>
      <CuentasUsuariosInner />
    </ScreenModeProvider>
  )
}
