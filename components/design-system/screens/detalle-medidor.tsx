"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home, LayoutDashboard, Activity, Bell, Link2,
  Save, RotateCcw, Wifi, PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { Button }     from "@/components/ui/button"
import { Input }      from "@/components/ui/input"
import { Label }      from "@/components/ui/label"
import { Switch }     from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator }  from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { useScreenMode } from "../screen-mode-context"
import { cn }         from "@/lib/utils"

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "general",   label: "General",                    icon: Home          },
  { id: "dashboard", label: "Dashboard",                  icon: LayoutDashboard },
  { id: "lecturas",  label: "Lecturas",                   icon: Activity      },
  { id: "alarmas",   label: "Alarmas-Activador de Tareas",icon: Bell          },
  { id: "vinculados",label: "Elementos vinculados",       icon: Link2         },
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

function MedidorNav({
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

// ─── Field helpers ────────────────────────────────────────────────────────────

function Field({ label, value, disabled, className }: { label: string; value?: string; disabled?: boolean; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input className="w-full" defaultValue={value} disabled={disabled} />
    </div>
  )
}

// ─── General form ─────────────────────────────────────────────────────────────

function GeneralForm() {
  const [habilitado, setHabilitado] = useState(true)
  const [esContador, setEsContador] = useState(false)
  const [automatico, setAutomatico] = useState(false)
  const isMobile = useScreenMode() === "mobile"

  return (
    <div className="flex flex-col gap-1.5 p-3">

      {/* Switch Habilitado */}
      <div className="flex items-center gap-2">
        <Switch
          checked={habilitado}
          onCheckedChange={setHabilitado}
          id="habilitado"
        />
        <Label htmlFor="habilitado" className="text-sm font-medium">
          Medidor habilitado
        </Label>
      </div>

      <Separator className="my-1.5" />

      {/* Depende de otro medidor + Ubicado en ó es Parte de */}
      <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-2")}>
        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-xs text-muted-foreground">Depende de otro medidor</Label>
          <Select defaultValue="0">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="medidor-1">Medidor 1</SelectItem>
              <SelectItem value="medidor-2">Medidor 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-xs text-muted-foreground">Ubicado en ó es Parte de</Label>
          <div className="relative">
            <Wifi className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input className="w-full pl-8" defaultValue="Oficina central 429 LYCEUM AVE ( 121.ALEJO )" disabled />
          </div>
        </div>
      </div>

      {/* Descripción + Serial */}
      <div className={cn("grid gap-x-2 gap-y-1", isMobile ? "grid-cols-1" : "grid-cols-2")}>
        <Field key="descripcion" label="Descripción Sensor / Medidor" value="horometro 12" />
        <Field key="serial"      label="Serial"                       value="RS-50 EQUIPO" />
      </div>

      {/* Unidad + Es Contador */}
      <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-2")}>
        <Field key="unidad" label="Unidad" value="Horas 3" />
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Es Contador / Acumulador</Label>
          <div className={cn("flex items-center gap-2 h-8 px-3 rounded-md transition-colors", esContador ? "bg-primary/10" : "bg-muted")}>
            <Switch
              size="sm"
              checked={esContador}
              onCheckedChange={setEsContador}
              id="es-contador"
            />
            <Label htmlFor="es-contador" className={cn("text-sm font-normal cursor-pointer transition-colors", esContador ? "text-primary" : "text-foreground")}>
              El medidor es contador o acumulador
            </Label>
          </div>
        </div>
      </div>

      {/* Última lectura + Fecha */}
      <div className={cn("grid gap-x-2 gap-y-1", isMobile ? "grid-cols-1" : "grid-cols-2")}>
        <Field key="ultima-lectura" label="Última lectura" value="29,106" disabled />
        <Field key="fecha"          label="Fecha"          value="2026-04-06" />
      </div>

      {/* Calcular Promedio + Promedio Mensual */}
      <div className={cn("grid gap-x-2 gap-y-1.5", isMobile ? "grid-cols-1" : "grid-cols-2 items-end")}>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Cálculo automático</Label>
          <div className={cn("flex items-center gap-2 h-8 px-3 rounded-md transition-colors", automatico ? "bg-primary/10" : "bg-muted")}>
            <Switch
              size="sm"
              id="automatico"
              checked={automatico}
              onCheckedChange={setAutomatico}
            />
            <Label htmlFor="automatico" className={cn("text-sm font-normal cursor-pointer transition-colors", automatico ? "text-primary" : "text-foreground")}>
              Calcular promedio automáticamente
            </Label>
          </div>
        </div>
        <Field key="promedio-mensual" label="Promedio Mensual" value="1" />
      </div>

      {/* Reiniciar Contador */}
      <Button variant="ghost" className={cn("text-primary hover:text-primary hover:bg-primary/10 px-2 gap-2", isMobile ? "w-full justify-center" : "w-fit")}>
        <RotateCcw className="size-4" />
        Reiniciar Contador / Acumulador
      </Button>

    </div>
  )
}

// ─── Pantalla ─────────────────────────────────────────────────────────────────

export function DetalleMedidor() {
  const screenMode = useScreenMode()
  const [activeNav, setActiveNav] = useState("general")
  const [navMinimized, setNavMinimized] = useState(screenMode === "tablet")
  useEffect(() => { setNavMinimized(screenMode === "tablet") }, [screenMode])
  const isMobile   = screenMode === "mobile"
  const isDesktop  = screenMode === "desktop"
  const isCompact  = screenMode !== "desktop"

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* Topbar */}
      {isMobile
        ? <TopbarBarMobile title="Monitoreo" subtitle="Medidores" />
        : <TopbarBar title="Monitoreo" subtitle="Medidores" showSearch={false} />
      }

      {/* Contenido */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* Toolbar card */}
        <div className="flex items-center justify-between h-[60px] flex items-center rounded-lg border bg-background px-3 gap-3 shrink-0">
          <span className="text-sm font-medium text-foreground truncate">
            horometro 12 — Oficina central 429 LYCEUM AVE ( 121.ALEJO )
          </span>
          <Button size={isCompact ? "icon-sm" : "sm"} disabled>
            <Save className="size-4" />
            {!isCompact && "Guardar"}
          </Button>
        </div>

        {/* Nav + Form */}
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
            <MedidorNav
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
