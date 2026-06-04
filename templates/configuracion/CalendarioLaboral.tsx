"use client"

import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Save, Plus, Bell, MessageCircle, Sparkles,
  PanelLeftClose, PanelLeftOpen,
  RefreshCw, SlidersHorizontal, Columns3,
  ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, X, Search,
  Trash2, Pencil, Eye,
} from "lucide-react"
import { Button }      from "@/components/ui/button"
import { Badge }       from "@/components/ui/badge"
import { Checkbox }    from "@/components/ui/checkbox"
import { Input }       from "@/components/ui/input"
import { ScrollArea }  from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScreenModeProvider } from "@/components/design-system/screen-mode-context"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ScreenMode = "desktop" | "tablet" | "mobile"

type DiaFestivo = {
  id:          number
  descripcion: string
  fecha:       string
  diaLaboral:  boolean
  recurrente:  boolean
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

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

const FESTIVOS_INICIAL: DiaFestivo[] = [
  { id: 1, descripcion: "Día feriado, test.",          fecha: "2025-05-06", diaLaboral: false, recurrente: true  },
  { id: 2, descripcion: "FERIADO DE PRUEBA PARA SALTO", fecha: "2025-05-01", diaLaboral: false, recurrente: false },
  { id: 3, descripcion: "Navidad",                     fecha: "2025-12-25", diaLaboral: false, recurrente: false },
]

// ─── Sort icon ────────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc" | null

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc")  return <ChevronUp   className="size-3 shrink-0" />
  if (dir === "desc") return <ChevronDown className="size-3 shrink-0" />
  return <ChevronsUpDown className="size-3 shrink-0 opacity-30" />
}

function nextDir(d: SortDir): SortDir {
  return d === null ? "asc" : d === "asc" ? "desc" : null
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
        <Button variant="secondary" size="icon-sm"><MessageCircle className="size-4" /></Button>
        {!isMobile && (
          <Button size="sm" className="gap-1.5">
            <Sparkles className="size-3.5" />AI
          </Button>
        )}
      </div>
      <Avatar className="size-8 cursor-pointer">
        <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">UR</AvatarFallback>
      </Avatar>
    </div>
  )
}

// ─── Settings nav ─────────────────────────────────────────────────────────────

function SettingsNav({
  active, onSelect, mode, minimized = false, onToggleMinimize,
}: {
  active: string; onSelect: (id: string) => void
  mode: ScreenMode; minimized?: boolean; onToggleMinimize?: () => void
}) {
  const isMobileNav = mode === "mobile"
  const iconOnly    = minimized
  return (
    <div className={cn(
      "flex flex-col rounded-lg border bg-background overflow-hidden transition-all duration-300",
      minimized ? "w-[56px] shrink-0" : isMobileNav ? "w-full h-full" : "w-[250px] shrink-0",
    )}>
      {!isMobileNav && onToggleMinimize && (
        <div className={cn("h-12 px-2 flex items-center border-b shrink-0", minimized ? "justify-center" : "justify-between")}>
          {!minimized && <span className="text-xs font-medium text-foreground/60 px-1">Secciones</span>}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground" onClick={onToggleMinimize}>
                {minimized ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{minimized ? "Expandir menú" : "Minimizar menú"}</TooltipContent>
          </Tooltip>
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className={cn("flex flex-col gap-0.5 p-2", minimized && "items-center")}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id} variant="ghost" size={iconOnly ? "icon-sm" : "sm"}
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

function HorizontalNav({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
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
                <Icon className="size-4" />{label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
    </Tabs>
  )
}

// ─── Días laborales selector ──────────────────────────────────────────────────

function DiasLaboralesSelect() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"])
  )

  function toggle(dia: string) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(dia) ? n.delete(dia) : n.add(dia)
      return n
    })
  }

  const label = DIAS_SEMANA.filter(d => selected.has(d)).join(", ") || "Ningún día seleccionado"

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">Días laborales</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-between w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground cursor-pointer hover:bg-muted/50 transition-colors">
            <span className="truncate">{label}</span>
            <ChevronDown className="size-4 text-muted-foreground shrink-0 ml-2" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Seleccionar días</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {DIAS_SEMANA.map(dia => (
            <DropdownMenuCheckboxItem
              key={dia}
              checked={selected.has(dia)}
              onCheckedChange={() => toggle(dia)}
            >
              {dia}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ─── Tabla de festivos (interactiva) ─────────────────────────────────────────

const F_PAGE = 10

function FestivosTable({ isCompact }: { isCompact: boolean }) {
  const [rows,       setRows]       = useState(FESTIVOS_INICIAL)
  const [selected,   setSelected]   = useState<Set<number>>(new Set())
  const [sortKey,    setSortKey]    = useState<"descripcion" | "fecha" | null>(null)
  const [sortDir,    setSortDir]    = useState<SortDir>(null)
  const [query,      setQuery]      = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [page,       setPage]       = useState(0)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return rows.filter(f => !q || f.descripcion.toLowerCase().includes(q) || f.fecha.includes(q))
  }, [rows, query])

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey]
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / F_PAGE))
  const safePage   = Math.min(page, totalPages - 1)
  const pageRows   = sorted.slice(safePage * F_PAGE, (safePage + 1) * F_PAGE)
  const from       = sorted.length === 0 ? 0 : safePage * F_PAGE + 1
  const to         = Math.min((safePage + 1) * F_PAGE, sorted.length)

  const allSelected  = pageRows.length > 0 && pageRows.every(f => selected.has(f.id))
  const someSelected = selected.size > 0

  function toggleRow(id: number) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleAll() {
    const ids = new Set(pageRows.map(f => f.id))
    const allOn = pageRows.every(f => selected.has(f.id))
    setSelected(prev => {
      const n = new Set(prev)
      allOn ? ids.forEach(id => n.delete(id)) : ids.forEach(id => n.add(id))
      return n
    })
  }
  function handleSort(key: "descripcion" | "fecha") {
    if (sortKey === key) setSortDir(d => nextDir(d))
    else { setSortKey(key); setSortDir("asc") }
    setPage(0)
  }
  function handleRefresh() {
    setRows(FESTIVOS_INICIAL); setQuery(""); setSortKey(null); setSortDir(null)
    setPage(0); setSelected(new Set()); setShowSearch(false)
  }
  function deleteSelected() {
    setRows(prev => prev.filter(f => !selected.has(f.id)))
    setSelected(new Set()); setPage(0)
  }

  return (
    <>
      {/* Encabezado sección + toolbar */}
      <div className="flex items-center justify-between px-3 h-10 border-b shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">Días festivos</span>
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                autoFocus
                placeholder="Buscar festivo..."
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(0) }}
                className="pl-8 h-7 text-xs w-48"
              />
            </div>
          )}
          {someSelected && !showSearch && (
            <span className="text-xs text-muted-foreground">
              {selected.size} seleccionado{selected.size > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {someSelected && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={deleteSelected}>
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Eliminar seleccionados</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={handleRefresh}>
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
              >
                {showSearch ? <X className="size-3.5" /> : <SlidersHorizontal className="size-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{showSearch ? "Cerrar búsqueda" : "Filtrar"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm"><Columns3 className="size-3.5" /></Button>
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
              <TableHead className="min-w-64 cursor-pointer select-none" onClick={() => handleSort("descripcion")}>
                <div className="flex items-center gap-1">
                  Descripción
                  <SortIcon dir={sortKey === "descripcion" ? sortDir : null} />
                </div>
              </TableHead>
              <TableHead className="w-36 cursor-pointer select-none" onClick={() => handleSort("fecha")}>
                <div className="flex items-center gap-1">
                  Fecha
                  <SortIcon dir={sortKey === "fecha" ? sortDir : null} />
                </div>
              </TableHead>
              <TableHead className="w-28 text-center">Día laboral</TableHead>
              <TableHead className="w-28 text-center">Recurrente</TableHead>
              <TableHead className="w-20 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-sm text-muted-foreground">
                  {query ? `No hay resultados para "${query}"` : "Sin días festivos registrados"}
                </TableCell>
              </TableRow>
            ) : pageRows.map((f) => (
              <TableRow key={f.id} data-state={selected.has(f.id) ? "selected" : undefined}>
                <TableCell className="pl-4 pr-2">
                  <Checkbox checked={selected.has(f.id)} onCheckedChange={() => toggleRow(f.id)} />
                </TableCell>
                <TableCell className="text-sm font-medium">{f.descripcion}</TableCell>
                <TableCell className="text-sm tabular-nums text-muted-foreground">{f.fecha}</TableCell>
                <TableCell className="text-center">
                  <span className={cn("text-sm font-medium", f.diaLaboral ? "text-success" : "text-destructive")}>
                    {f.diaLaboral ? "Sí" : "No"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn("text-sm font-medium", f.recurrente ? "text-success" : "text-destructive")}>
                    {f.recurrente ? "Sí" : "No"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-0.5">
                    <Button variant="ghost" size="icon-sm" aria-label="Ver"><Eye className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Editar"><Pencil className="size-3.5" /></Button>
                    <Button
                      variant="ghost" size="icon-sm" aria-label="Eliminar"
                      onClick={() => { setRows(p => p.filter(r => r.id !== f.id)); setSelected(p => { const n = new Set(p); n.delete(f.id); return n }) }}
                    >
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
          Mostrando <span className="font-medium text-foreground">{from}–{to === 0 ? 0 : to}</span> de{" "}
          <span className="font-medium text-foreground">{sorted.length}</span>
        </span>
        <div className="flex items-center gap-2">
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon-sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}>
                <ChevronLeft className="size-3.5" />
              </Button>
              <span className="text-xs tabular-nums text-muted-foreground px-1">{safePage + 1} / {totalPages}</span>
              <Button variant="outline" size="icon-sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          )}
          <Button size="sm" className="gap-1.5">
            <Plus className="size-3.5" />
            {!isCompact && "Nuevo festivo"}
          </Button>
        </div>
      </div>
    </>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

function CalendarioLaboralInner() {
  const [screenMode,   setScreenMode]   = useState<ScreenMode>("desktop")
  const [activeNav,    setActiveNav]    = useState("calendar")
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

  const contentPanel = (
    <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-w-0 min-h-0">
      {/* Sección header */}
      <div className="h-12 px-3 border-b shrink-0 flex items-center gap-2">
        <Calendar className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Calendario laboral</h2>
      </div>

      {/* Días laborales */}
      <div className="px-3 py-3 border-b shrink-0">
        <DiasLaboralesSelect />
      </div>

      {/* Tabla de festivos */}
      <FestivosTable isCompact={isCompact} />
    </div>
  )

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
            {contentPanel}
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
            {contentPanel}
          </div>
        )}
      </div>
    </div>
  )
}

export function CalendarioLaboral() {
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
      <CalendarioLaboralInner />
    </ScreenModeProvider>
  )
}
