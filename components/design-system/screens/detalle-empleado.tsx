"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  UserRound, ClipboardList, ClipboardCheck, Paperclip,
  FileText, Users, Save, Camera, Plus, Minus, Globe, Image,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
// UserRound used in EmpleadoNav; Camera used in PhotoUpload; Image used in Firma
import { Button }       from "@/components/ui/button"
import { ButtonGroup }  from "@/components/ui/button-group"
import { Input }        from "@/components/ui/input"
import { Label }        from "@/components/ui/label"
import { Switch }       from "@/components/ui/switch"
import { ScrollArea }   from "@/components/ui/scroll-area"
import { Separator }    from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { useScreenMode }              from "../screen-mode-context"
import { cn }                         from "@/lib/utils"

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "general",    label: "General",                 icon: UserRound      },
  { id: "formulario", label: "Formulario Personalizado",icon: ClipboardList  },
  { id: "asignaciones", label: "Asignaciones",          icon: ClipboardCheck },
  { id: "adjuntos",   label: "Adjuntos",                icon: Paperclip      },
  { id: "gestion",    label: "Gestión Documental",      icon: FileText       },
  { id: "teams",      label: "Teams",                   icon: Users          },
] as const

type NavId   = typeof NAV_ITEMS[number]["id"]
type NavMode = "desktop" | "tablet" | "mobile"

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

// ─── Nav lateral ─────────────────────────────────────────────────────────────

function EmpleadoNav({ active, onSelect, mode, minimized = false, onToggleMinimize }: {
  active:   NavId
  onSelect: (id: NavId) => void
  mode:     NavMode
  minimized?: boolean
  onToggleMinimize?: () => void
}) {
  const isMobileNav = mode === "mobile"
  const iconOnly    = minimized

  return (
    <div className={cn(
      "flex flex-col rounded-lg border bg-background overflow-hidden shrink-0 transition-all duration-300",
      minimized     ? "w-[56px]"
      : isMobileNav ? "w-full h-full"
      : "w-[250px]",
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

// ─── Photo upload ────────────────────────────────────────────────────────────

function PhotoUpload({ checked, onCheckedChange }: {
  checked:          boolean
  onCheckedChange:  (v: boolean) => void
}) {
  const isMobile = useScreenMode() === "mobile"
  return (
    <div className={cn(
      "relative shrink-0 h-28 rounded-lg border bg-card flex items-center justify-center overflow-hidden",
      isMobile ? "w-full h-[180px]" : "w-[180px]",
    )}>
      <Image className="size-7 text-muted-foreground/30" />

      {/* Switch habilitado — bottom izquierda */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          id="emp-habilitado"
        />
        <Label htmlFor="emp-habilitado" className="text-sm font-medium cursor-pointer">
          Habilitado
        </Label>
      </div>

      {/* Cámara — bottom derecha */}
      <Button
        type="button"
        size="icon"
        className="absolute bottom-1.5 right-1.5 size-7"
        aria-label="Cambiar foto"
      >
        <Camera className="size-3.5" />
      </Button>
    </div>
  )
}



// ─── Mapa ─────────────────────────────────────────────────────────────────────

const LAT = 4.711
const LNG = -74.0721

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

type LeafletMap = { zoomIn: () => void; zoomOut: () => void; remove: () => void }

function EmpleadoMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<LeafletMap | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || mapRef.current) return

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        zoomControl:        false,
        attributionControl: false,
      }).setView([LAT, LNG], 5)

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
    <div className="relative isolate rounded-lg border overflow-hidden min-h-[220px]
      [&_.leaflet-control-zoom]:hidden [&_.leaflet-control-attribution]:hidden">
      <div ref={containerRef} className="absolute inset-0 w-full h-full [&_.leaflet-tile-pane]:grayscale" />
      <div className="absolute bottom-3 left-3 z-[1000]">
        <ButtonGroup orientation="vertical">
          <Button type="button" variant="outline" size="icon"
            className="size-8 bg-background/95 backdrop-blur-sm"
            onClick={() => mapRef.current?.zoomIn()}>
            <Plus className="size-3.5" />
          </Button>
          <Button type="button" variant="outline" size="icon"
            className="size-8 bg-background/95 backdrop-blur-sm"
            onClick={() => mapRef.current?.zoomOut()}>
            <Minus className="size-3.5" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

// ─── Helpers de formulario ────────────────────────────────────────────────────

function Field({ label, defaultValue = "", className }: {
  label:        string
  defaultValue?: string
  className?:   string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input className="w-full" defaultValue={defaultValue} />
    </div>
  )
}

function ClearField({ label, defaultValue, options, className }: {
  label:        string
  defaultValue?: string
  options:      { value: string; label: string }[]
  className?:   string
}) {
  const [val, setVal] = useState(defaultValue ?? "")
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={val} onValueChange={setVal}>
        <SelectTrigger className="w-full" clearable onClear={val ? () => setVal("") : undefined}>
          <SelectValue placeholder={`Seleccionar...`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

// ─── Formulario General ───────────────────────────────────────────────────────

function GeneralForm() {
  const [habilitado, setHabilitado] = useState(true)
  const screenMode = useScreenMode()
  const isMobile   = screenMode === "mobile"

  return (
    <div className="flex flex-col gap-1.5 p-3">

      {/* Foto (izq) + Nombres/Apellidos + Código/Email (der) */}
      <div className={cn("flex gap-3", isMobile ? "flex-col" : "items-start")}>
        <PhotoUpload checked={habilitado} onCheckedChange={setHabilitado} />
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <div className={cn("grid gap-x-2 gap-y-1.5", !isMobile ? "grid-cols-2" : "grid-cols-1")}>
            <Field label="Nombres"   defaultValue="AAAA USUARIO USUARIO USUARIO USUARIO o" />
            <Field label="Apellidos" defaultValue="DEMO FRACTTAL" />
          </div>
          <div className={cn("grid gap-x-2 gap-y-1.5", !isMobile ? "grid-cols-2" : "grid-cols-1")}>
            <Field label="Código" defaultValue="AAAA88" />
            <Field label="Email"  defaultValue="derpickel@gmail.com" />
          </div>
        </div>
      </div>

      <Separator className="my-1.5" />

      {/* Clasificaciones */}
      <div className={cn("grid gap-x-2 gap-y-1.5", !isMobile ? "grid-cols-2" : "grid-cols-1")}>
        <ClearField
          label="Clasificación 1"
          defaultValue="administracion2"
          options={[{ value: "administracion2", label: "Administracion2" }]}
        />
        <ClearField
          label="Clasificación 2"
          defaultValue="analista"
          options={[{ value: "analista", label: "Analista" }]}
        />
      </div>

      {/* Dirección + Mapa */}
      <div className={cn("grid gap-x-3 gap-y-3", !isMobile ? "grid-cols-2" : "grid-cols-1")}>
        <div className="flex flex-col gap-1.5">
          <Field label="Dirección" />
          <Field label="Ciudad" />
          <Field label="Departamento / Estado / Región" />
          <Field label="País" />
          <Field label="Código Área" />
        </div>
        <EmpleadoMap />
      </div>

      {/* Latitud + Longitud */}
      <div className={cn("grid gap-x-2 gap-y-1.5", !isMobile ? "grid-cols-2" : "grid-cols-1")}>
        <Field label="Latitud" />
        <Field label="Longitud" />
      </div>

      {/* Valor Hora Ordinaria + Horario laboral */}
      <div className={cn("grid gap-x-2 gap-y-1.5", !isMobile ? "grid-cols-2" : "grid-cols-1")}>
        <ClearField
          label="Valor Hora Ordinaria"
          defaultValue="demo-test"
          options={[{ value: "demo-test", label: "DEMO TEST PERFIL LABORAL" }]}
        />
        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-xs text-muted-foreground">Horario laboral</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar horario..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="horario-1">Horario estándar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Teléfonos */}
      <div className={cn("grid gap-x-2 gap-y-1.5", !isMobile ? "grid-cols-3" : "grid-cols-1")}>
        <Field label="Telf. Principal" />
        <Field label="Telf. Secundario" />
        <Field label="Teléfono SMS" />
      </div>

      {/* Localización */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Localización</Label>
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 h-9 min-w-0">
          <Globe className="size-4 text-primary shrink-0" />
          <span className="text-sm text-foreground truncate flex-1">// Mundo de Alfredo/</span>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Firma */}
      <div className="flex flex-col gap-2">
        <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Firma
        </Label>
        <div className="w-36 h-24 rounded-lg border bg-muted flex items-center justify-center">
          <Image className="size-8 text-muted-foreground/30" />
        </div>
      </div>

    </div>
  )
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export function DetalleEmpleado() {
  const screenMode = useScreenMode()
  const [activeNav, setActiveNav] = useState<NavId>("general")
  const [navMinimized, setNavMinimized] = useState(screenMode === "tablet")
  useEffect(() => { setNavMinimized(screenMode === "tablet") }, [screenMode])
  const isMobile   = screenMode === "mobile"
  const isDesktop  = screenMode === "desktop"
  const isCompact  = screenMode !== "desktop"

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {isMobile
        ? <TopbarBarMobile title="Recursos Humanos" />
        : <TopbarBar title="Recursos Humanos" showSearch={false} />
      }

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* Toolbar */}
        <div className="flex items-center justify-between h-[60px] flex items-center rounded-lg border bg-background px-3 gap-3 shrink-0">
          <span className="text-sm font-medium text-foreground truncate">
            AAAA USUARIO USUARIO USUARIO USUARIO o DEMO FRACTTAL
          </span>
          <Button size={isCompact ? "icon-sm" : "sm"} disabled>
            <Save />
            {!isCompact && "Guardar"}
          </Button>
        </div>

        {/* Layout condicional */}
        {isMobile ? (
          <div className="flex-1 flex flex-col min-h-0 gap-2 overflow-hidden">
            <HorizontalNav items={[...NAV_ITEMS]} active={activeNav} onSelect={(id) => setActiveNav(id as NavId)} />
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
            <EmpleadoNav
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
