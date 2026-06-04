"use client"

import { useState, useEffect, useLayoutEffect, useRef } from "react"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Save, Bell, MessageCircle, Sparkles,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { Button }     from "@/components/ui/button"
import { Badge }      from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ScreenModeProvider } from "@/components/design-system/screen-mode-context"
import { cn } from "@/lib/utils"

import { GeneralForm }      from "./ConfiguracionGeneral"
import { CuentasContent }   from "./CuentasUsuarios"
import { CalendarioContent } from "./CalendarioLaboral"

// ─── Types ────────────────────────────────────────────────────────────────────

type ScreenMode = "desktop" | "tablet" | "mobile"

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "general",   label: "General",                icon: Settings,  content: true  },
  { id: "users",     label: "Cuentas de Usuarios",    icon: Users,     content: true  },
  { id: "calendar",  label: "Calendario laboral",     icon: Calendar,  content: true  },
  { id: "modules",   label: "Módulos",                icon: LayoutGrid, content: false },
  { id: "financial", label: "Financiero",             icon: CreditCard, content: false },
  { id: "catalogs",  label: "Catálogos Auxiliares",   icon: BookOpen,  content: false },
  { id: "docs",      label: "Gestión Documental",     icon: FileText,  content: false },
  { id: "logs",      label: "Log de Transacciones",   icon: History,   content: false },
  { id: "security",  label: "Seguridad",              icon: Shield,    content: false },
  { id: "api",       label: "Conexiones API",         icon: Plug,      content: false },
  { id: "guests",    label: "Portal de invitados",    icon: UserCheck, content: false },
  { id: "account",   label: "Cuenta",                 icon: User,      content: false },
  { id: "printing",  label: "Impresiones de OTs",     icon: Printer,   content: false },
] as const

type NavId = typeof NAV_ITEMS[number]["id"]

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ mode }: { mode: ScreenMode }) {
  return (
    <div className={cn(
      "flex w-full items-center gap-2 border-b bg-background px-3 shrink-0",
      mode === "mobile" ? "h-14" : "h-[60px]",
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
      <span className="text-sm font-semibold text-foreground">Configuración</span>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="icon-sm" className="relative">
          <Bell className="size-4" />
          <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 py-0 text-[10px] leading-none bg-primary text-primary-foreground border-2 border-background">3</Badge>
        </Button>
        <Button variant="secondary" size="icon-sm"><MessageCircle className="size-4" /></Button>
        {mode !== "mobile" && (
          <Button size="sm" className="gap-1.5"><Sparkles className="size-3.5" />AI</Button>
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
  active: NavId; onSelect: (id: NavId) => void
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
            <TooltipContent side="right">{minimized ? "Expandir" : "Minimizar"}</TooltipContent>
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
              onClick={() => onSelect(id as NavId)}
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

function HorizontalNav({ active, onSelect }: { active: NavId; onSelect: (id: NavId) => void }) {
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
    <Tabs value={active} onValueChange={v => onSelect(v as NavId)} className="shrink-0">
      <div className="rounded-lg border bg-background overflow-hidden">
        <div ref={scrollRef} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ maskImage: mask, WebkitMaskImage: mask }}>
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

// ─── Empty section placeholder ────────────────────────────────────────────────

function EmptySection({ label, Icon }: { label: string; Icon: React.ElementType }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Icon className="size-8 mx-auto mb-2 opacity-20" />
        <p className="text-sm">{label}</p>
        <p className="text-xs mt-1 opacity-60">Sección en construcción</p>
      </div>
    </div>
  )
}

// ─── Content switcher ─────────────────────────────────────────────────────────

function SectionContent({ activeNav, isMobile, isCompact }: {
  activeNav: NavId
  isMobile:  boolean
  isCompact: boolean
}) {
  if (activeNav === "general") {
    return (
      <ScrollArea className="flex-1">
        <GeneralForm isMobile={isMobile} />
      </ScrollArea>
    )
  }
  if (activeNav === "users") {
    return <CuentasContent isCompact={isCompact} />
  }
  if (activeNav === "calendar") {
    return <CalendarioContent isCompact={isCompact} />
  }

  const item = NAV_ITEMS.find(n => n.id === activeNav)!
  return <EmptySection label={item.label} Icon={item.icon} />
}

// ─── Main module ──────────────────────────────────────────────────────────────

function ConfiguracionModuleInner() {
  const [screenMode,   setScreenMode]   = useState<ScreenMode>("desktop")
  const [activeNav,    setActiveNav]    = useState<NavId>("general")
  const [navMinimized, setNavMinimized] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(true)

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
    if (screenMode !== "mobile") setMobileNavOpen(false)
    else setMobileNavOpen(true)
  }, [screenMode])

  const isMobile  = screenMode === "mobile"
  const isCompact = screenMode !== "desktop"

  const activeItem = NAV_ITEMS.find(n => n.id === activeNav)!

  function selectNav(id: NavId) {
    setActiveNav(id)
    if (isMobile) setMobileNavOpen(false)
  }

  // Content panel (shared between desktop/tablet and mobile)
  const contentCard = (
    <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-w-0 min-h-0">
      {/* Section header */}
      <div className="h-12 px-3 border-b shrink-0 flex items-center gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon-sm" onClick={() => setMobileNavOpen(true)} className="-ml-1">
            <PanelLeftOpen className="size-4" />
          </Button>
        )}
        <activeItem.icon className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">{activeItem.label}</h2>
      </div>

      {/* Section body */}
      <SectionContent activeNav={activeNav} isMobile={isMobile} isCompact={isCompact} />
    </div>
  )

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      <Topbar mode={screenMode} />

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
          <div className="flex-1 flex flex-col min-h-0 gap-2 overflow-hidden relative">
            {/* Slide: nav cubre el contenido en mobile */}
            <div
              className="absolute inset-0 z-10 transition-transform duration-300 ease-in-out flex flex-col gap-2"
              style={{ transform: mobileNavOpen ? "translateX(0)" : "translateX(-110%)" }}
            >
              <HorizontalNav active={activeNav} onSelect={selectNav} />
              <div className="flex-1 rounded-lg border bg-background overflow-hidden">
                <SettingsNav
                  active={activeNav}
                  onSelect={selectNav}
                  mode="mobile"
                />
              </div>
            </div>

            {/* Contenido siempre montado */}
            {contentCard}
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
            {contentCard}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfiguracionModule() {
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
      <ConfiguracionModuleInner />
    </ScreenModeProvider>
  )
}
