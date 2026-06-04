"use client"

import { useState, useEffect, useLayoutEffect, useRef } from "react"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Camera, Save, Bell, MessageCircle,
  Sparkles, PanelLeftClose, PanelLeftOpen, ChevronLeft,
} from "lucide-react"
import { Button }      from "@/components/ui/button"
import { Input }       from "@/components/ui/input"
import { Label }       from "@/components/ui/label"
import { ScrollArea }  from "@/components/ui/scroll-area"
import { Separator }   from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge }       from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ScreenModeProvider } from "@/components/design-system/screen-mode-context"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ScreenMode = "desktop" | "tablet" | "mobile"

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

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ title, mode }: { title: string; mode: ScreenMode }) {
  const isMobile = mode === "mobile"
  return (
    <div className={cn(
      "flex w-full items-center gap-2 border-b bg-background px-3 shrink-0",
      isMobile ? "h-14" : "h-[60px]",
    )}>
      {/* Logo Fracttal */}
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

// ─── Logo upload ──────────────────────────────────────────────────────────────

function LogoUpload({ isMobile }: { isMobile: boolean }) {
  return (
    <div className={cn(
      "relative shrink-0 rounded-lg border border-border bg-card flex items-center justify-center overflow-hidden",
      isMobile ? "w-full h-[180px]" : "w-[180px] h-28",
    )}>
      <svg viewBox="0 0 500 500" className={cn("text-primary", isMobile ? "size-[83px]" : "size-16")} aria-label="Logo Fracttal">
        <path fill="currentColor" d="M243.57,301c-14.32,0-25.92,11.61-25.92,25.92s11.61,25.92,25.92,25.92,25.92-11.61,25.92-25.92-11.61-25.92-25.92-25.92Z"/>
        <path fill="currentColor" d="M310.05,260.54c-15.41,0-27.89,12.48-27.89,27.89s12.48,27.89,27.89,27.89,27.89-12.48,27.89-27.89-12.48-27.89-27.89-27.89Z"/>
        <path fill="currentColor" d="M310.05,183.59c-15.41,0-27.89,12.48-27.89,27.89s12.48,27.89,27.89,27.89,27.89-12.48,27.89-27.89-12.48-27.89-27.89-27.89Z"/>
        <path fill="currentColor" d="M243.57,147.11c-14.3,0-25.92,11.62-25.92,25.92s11.62,25.92,25.92,25.92,25.92-11.62,25.92-25.92-11.62-25.92-25.92-25.92Z"/>
        <path fill="currentColor" d="M177.08,233.8c12.34,0,22.32-9.98,22.32-22.32s-9.99-22.32-22.32-22.32-22.32,9.98-22.32,22.32,9.99,22.32,22.32,22.32Z"/>
        <path fill="currentColor" d="M177.08,310.75c12.34,0,22.32-9.98,22.32-22.32s-9.99-22.32-22.32-22.32-22.32,9.98-22.32,22.32,9.99,22.32,22.32,22.32Z"/>
        <path fill="currentColor" d="M310.05,338.97c-14.3,0-25.92,11.62-25.92,25.92s11.62,25.92,25.92,25.92,25.92-11.62,25.92-25.92-11.62-25.92-25.92-25.92Z"/>
        <path fill="currentColor" d="M376.25,220.07c-16.52,0-29.91,13.39-29.91,29.9s13.39,29.91,29.91,29.91,29.91-13.39,29.91-29.91-13.39-29.9-29.91-29.9Z"/>
      </svg>
      <Button type="button" size="icon" className="absolute bottom-1.5 right-1.5 size-7" aria-label="Cambiar logo">
        <Camera className="size-3.5" />
      </Button>
    </div>
  )
}

// ─── Map (OpenStreetMap iframe) ───────────────────────────────────────────────

const LAT = 6.2017336
const LNG = -75.576614
const DELTA = 0.008

const MAP_URL =
  `https://www.openstreetmap.org/export/embed.html` +
  `?bbox=${LNG - DELTA}%2C${LAT - DELTA}%2C${LNG + DELTA}%2C${LAT + DELTA}` +
  `&layer=mapnik&marker=${LAT}%2C${LNG}`

function MapEmbed() {
  return (
    <div className="relative rounded-lg border overflow-hidden min-h-64 h-full bg-muted">
      <iframe
        src={MAP_URL}
        title="Ubicación en el mapa"
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}

// ─── Field atoms ──────────────────────────────────────────────────────────────

function Field({ label, value, className }: { label: string; value?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input className="w-full" defaultValue={value} />
    </div>
  )
}

function SelectField({
  label, value, options = [], className,
}: { label: string; value?: string; options?: string[]; className?: string }) {
  const items = options.length ? options : value ? [value] : []
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select defaultValue={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          {items.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
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
                variant="ghost"
                size="icon-sm"
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

// ─── General form ─────────────────────────────────────────────────────────────

function GeneralForm({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="flex flex-col gap-3 p-3">

      {/* 1. Identidad */}
      <div className={cn("flex gap-3", isMobile ? "flex-col" : "items-start")}>
        <LogoUpload isMobile={isMobile} />
        <div className={cn("flex-1 grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          <Field label="Código"     value="451" />
          <Field label="Nombre"     value="Fracttal Demo" />
          <Field label="Email"      value="pablo.moreno@fracttal.com" />
          <SelectField
            label="Moneda"
            value="Colombian Peso"
            options={["Colombian Peso", "US Dollar", "Euro"]}
          />
          <SelectField
            label="Separador de miles"
            value="(.) El carácter utilizado es una coma"
            options={[
              "(.) El carácter utilizado es una coma",
              "(,) El carácter utilizado es un punto",
            ]}
            className={isMobile ? "" : "col-span-2"}
          />
        </div>
      </div>

      <Separator className="my-1.5" />

      {/* 2. Ubicación */}
      <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-2 items-stretch")}>
        {/* Columna izquierda: campos */}
        <div className="flex flex-col gap-y-1.5">
          <Field label="Dirección"                      value="Arrengo #451 COL" />
          <Field label="Ciudad"                         value="Medellín" />
          <Field label="Departamento / Estado / Región" value="NA" />
          <Field label="País"                           value="COL" />
          <Field label="Código Área"                    value="7656544" />
        </div>
        {/* Columna derecha: mapa */}
        <MapEmbed />
      </div>

      <Separator className="my-1.5" />

      {/* 3. Coordenadas y zona horaria */}
      <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-3")}>
        <SelectField
          label="Zonas horarias UTC"
          value="America/Sao_Paulo"
          options={["America/Sao_Paulo", "America/Bogota", "America/New_York", "Europe/Madrid"]}
        />
        <Field label="Latitud"  value="6.2017336" />
        <Field label="Longitud" value="-75.576614" />
      </div>

      <Separator className="my-1.5" />

      {/* 4. Teléfonos */}
      <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-3")}>
        <Field label="Telf. Principal"  value="+57 3193615662" />
        <Field label="Telf. Secundario" />
        <Field label="Teléfono SMS" />
      </div>

      <Separator className="my-1.5" />

      {/* 5. Configuración adicional */}
      <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-3")}>
        <SelectField
          label="Idioma Para envío de correos"
          value="Español"
          options={["Español", "English", "Português"]}
        />
        <SelectField
          label="Valoración de Existencias"
          value="PMP (Promedio)"
          options={["PMP (Promedio)", "FIFO", "LIFO"]}
        />
        <Field label="Página Web" value="www.fracttal.com" />
      </div>

    </div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

function ConfiguracionGeneralInner() {
  const [screenMode, setScreenMode] = useState<ScreenMode>("desktop")
  const [activeNav,  setActiveNav]  = useState("general")
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
    if (screenMode !== "mobile") setActiveNav(prev => prev || "general")
  }, [screenMode])

  const isMobile  = screenMode === "mobile"
  const isCompact = screenMode !== "desktop"

  const activeItem = NAV_ITEMS.find(n => n.id === activeNav)

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
              {activeItem && (
                <div className="h-12 px-3 border-b border-border shrink-0 flex items-center gap-2">
                  <activeItem.icon className="size-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">{activeItem.label}</h2>
                </div>
              )}
              <ScrollArea className="flex-1">
                <GeneralForm isMobile={isMobile} />
              </ScrollArea>
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
            <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-w-0">
              {activeItem && (
                <div className="h-12 px-3 border-b border-border shrink-0 flex items-center gap-2">
                  <activeItem.icon className="size-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">{activeItem.label}</h2>
                </div>
              )}
              <ScrollArea className="flex-1">
                <GeneralForm isMobile={isMobile} />
              </ScrollArea>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export function ConfiguracionGeneral() {
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
      <ConfiguracionGeneralInner />
    </ScreenModeProvider>
  )
}
