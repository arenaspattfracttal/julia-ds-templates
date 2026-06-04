"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Camera, Save, Plus, Minus, PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { Button }                            from "@/components/ui/button"
import { ButtonGroup }                       from "@/components/ui/button-group"
import { Input }      from "@/components/ui/input"
import { Label }      from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator }  from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { useScreenMode } from "../screen-mode-context"
import { cn } from "@/lib/utils"

// ─── Sidebar nav items ────────────────────────────────────────────────────────

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

// ─── Atoms reutilizables ──────────────────────────────────────────────────────

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
}: {
  label: string; value?: string; options?: string[]; className?: string
}) {
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

// ─── Logo upload ──────────────────────────────────────────────────────────────

function LogoUpload() {
  const isMobile = useScreenMode() === "mobile"
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
          <path fill="currentColor" d="M110.89,265.1c8.35,0,15.12-6.77,15.12-15.12s-6.77-15.12-15.12-15.12-15.12,6.77-15.12,15.12,6.77,15.12,15.12,15.12Z"/>
          <circle fill="currentColor" cx="177.08" cy="364.89" r="23.9"/>
          <path fill="currentColor" d="M310.05,338.97c-14.3,0-25.92,11.62-25.92,25.92s11.62,25.92,25.92,25.92,25.92-11.62,25.92-25.92-11.62-25.92-25.92-25.92Z"/>
          <path fill="currentColor" d="M376.25,220.07c-16.52,0-29.91,13.39-29.91,29.9s13.39,29.91,29.91,29.91,29.91-13.39,29.91-29.91-13.39-29.9-29.91-29.9Z"/>
          <path fill="currentColor" d="M310.05,161.03c14.3,0,25.92-11.62,25.92-25.92s-11.62-25.92-25.92-25.92-25.92,11.62-25.92,25.92,11.62,25.92,25.92,25.92Z"/>
          <circle fill="currentColor" cx="177.08" cy="135.11" r="23.91"/>
          <path fill="currentColor" d="M243.57,117.15c10.26,0,18.58-8.32,18.58-18.58s-8.32-18.58-18.58-18.58-18.58,8.32-18.58,18.58,8.32,18.58,18.58,18.58Z"/>
          <path fill="currentColor" d="M112.43,155.7c-10.27,0-18.58,8.3-18.58,18.58s8.3,18.58,18.58,18.58,18.58-8.3,18.58-18.58-8.3-18.58-18.58-18.58Z"/>
          <path fill="currentColor" d="M112.43,307.1c-10.27,0-18.58,8.3-18.58,18.58s8.3,18.58,18.58,18.58,18.58-8.3,18.58-18.58-8.3-18.58-18.58-18.58Z"/>
          <path fill="currentColor" d="M243.57,382.85c-10.27,0-18.58,8.3-18.58,18.58s8.3,18.58,18.58,18.58,18.58-8.3,18.58-18.58-8.3-18.58-18.58-18.58Z"/>
          <path fill="currentColor" d="M374.66,307.1c-10.27,0-18.58,8.3-18.58,18.58s8.3,18.58,18.58,18.58,18.58-8.3,18.58-18.58-8.3-18.58-18.58-18.58Z"/>
          <path fill="currentColor" d="M374.66,192.85c10.27,0,18.58-8.3,18.58-18.58s-8.3-18.58-18.58-18.58-18.58,8.3-18.58,18.58,8.3,18.58,18.58,18.58Z"/>
        </svg>
      <Button
        type="button"
        size="icon"
        className="absolute bottom-1.5 right-1.5 size-7"
        aria-label="Cambiar logo"
      >
        <Camera className="size-3.5" />
      </Button>
    </div>
  )
}

// ─── Map ──────────────────────────────────────────────────────────────────────

const LAT = 6.2017336
const LNG = -75.576614

// SVG marker: pin clásico minimalista con color primary del DS
function buildMarkerUrl() {
  const color = typeof window !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#2929FF"
    : "#2929FF"

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="30" viewBox="0 0 22 30">
  <path d="M11 0C4.925 0 0 4.925 0 11c0 8.25 11 19 11 19S22 19.25 22 11C22 4.925 17.075 0 11 0z"
        fill="${color}" stroke="white" stroke-width="2" stroke-linejoin="round"/>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

type LeafletMap = { setView: unknown; zoomIn: () => void; zoomOut: () => void; remove: () => void }

function MapPlaceholder() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<LeafletMap | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || mapRef.current) return

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        zoomControl:        false,
        attributionControl: false,
      }).setView([LAT, LNG], 15)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

      L.marker([LAT, LNG], {
        icon: L.icon({ iconUrl: buildMarkerUrl(), iconSize: [22, 30], iconAnchor: [11, 30] }),
      }).addTo(map)

      mapRef.current = map as unknown as LeafletMap
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="relative isolate rounded-lg border overflow-hidden min-h-64 h-full [&_.leaflet-control-zoom]:hidden [&_.leaflet-control-attribution]:hidden">
      {/* Tiles */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full [&_.leaflet-tile-pane]:grayscale" />

      {/* Zoom control — DS atoms */}
      <div className="absolute bottom-3 left-3 z-[1000]">
        <ButtonGroup orientation="vertical">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 bg-background/95 backdrop-blur-sm"
            onClick={() => mapRef.current?.zoomIn()}
          >
            <Plus className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 bg-background/95 backdrop-blur-sm"
            onClick={() => mapRef.current?.zoomOut()}
          >
            <Minus className="size-3.5" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

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

  // Animación "peek" — se cancela si el usuario interactúa
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

// ─── Settings nav card ────────────────────────────────────────────────────────

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

// ─── General form ─────────────────────────────────────────────────────────────

function GeneralForm() {
  const isMobile = useScreenMode() === "mobile"

  return (
    <div className="flex flex-col gap-3 p-3">

      {/* ── 1. Identidad ─────────────────────────────────────────────────────── */}
      <div className={cn("flex gap-3", isMobile ? "flex-col" : "items-start")}>
        <LogoUpload />
        <div className={cn("flex-1 grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          <Field label="Nombre"     value="Fracttal Demo" />
          <Field label="Código"     value="451" />
          <Field label="Email"      value="pablo.moreno@fracttal.com" />
          <Field label="Página Web" value="www.fracttal.com" />
        </div>
      </div>

      <Separator className="my-1.5" />

      {/* ── 2. Configuración regional ────────────────────────────────────────── */}
      <div className="flex flex-col gap-y-1.5">
        <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          <SelectField
            label="Moneda"
            value="Colombian Peso"
            options={["Colombian Peso", "US Dollar", "Euro"]}
          />
          <SelectField
            label="Separador de miles"
            value="(,) El carácter utilizado es una coma"
            options={[
              "(,) El carácter utilizado es una coma",
              "(.) El carácter utilizado es un punto",
            ]}
          />
        </div>
        <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-3")}>
          <SelectField
            label="Zonas horarias UTC"
            value="America/Bogota"
            options={["America/Bogota", "America/New_York", "Europe/Madrid"]}
          />
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
        </div>
      </div>


      {/* ── 3. Ubicación ─────────────────────────────────────────────────────── */}
      <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-2 items-stretch")}>
        {/* Mapa */}
        <MapPlaceholder />
        {/* Campos */}
        <div className="flex flex-col gap-y-1.5">
          <Field label="Dirección"                      value="Arrengo #451 COL" />
          <Field label="Ciudad"                         value="Medellín" />
          <Field label="País"                           value="COL" />
          <Field label="Departamento / Estado / Región" value="NA" />
          <Field label="Código Área"                    value="7656544" />
          <Field label="Latitud"                        value="6.2017336" />
          <Field label="Longitud"                       value="-75.576614" />
        </div>
      </div>


      {/* ── 4. Contacto ──────────────────────────────────────────────────────── */}
      <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-3")}>
        <Field label="Telf. Principal"  value="+57 3193615662" />
        <Field label="Telf. Secundario" />
        <Field label="Teléfono SMS"     />
      </div>

    </div>
  )
}

// ─── Exported screen ──────────────────────────────────────────────────────────

export function ConfiguracionGeneral() {
  const [activeNav, setActiveNav] = useState("general")
  const screenMode = useScreenMode()
  const [navMinimized, setNavMinimized] = useState(screenMode === "tablet")
  useEffect(() => { setNavMinimized(screenMode === "tablet") }, [screenMode])
  const isMobile   = screenMode === "mobile"
  const isDesktop  = screenMode === "desktop"
  const isCompact  = screenMode !== "desktop"

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
        <div className="flex items-center justify-between h-[60px] flex items-center rounded-lg border bg-background px-3 gap-3 shrink-0">
          <span className="text-sm font-medium text-foreground">Fracttal Demo</span>
          <Button size={isCompact ? "icon-sm" : "sm"} disabled>
            <Save className="size-4" />
            {!isCompact && "Guardar"}
          </Button>
        </div>

        {/* 2b — Nav card + Form card */}
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
              <ScrollArea className="flex-1">
                <GeneralForm />
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
              onToggleMinimize={!isMobile ? () => setNavMinimized((v) => !v) : undefined}
            />
            <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-w-0">
              <div className="h-12 px-2 border-b border-border shrink-0 flex items-center">
                {NAV_ITEMS.filter((n) => n.id === activeNav).map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">{label}</h2>
                  </div>
                ))}
              </div>
              <ScrollArea className="flex-1">
                <GeneralForm />
              </ScrollArea>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
