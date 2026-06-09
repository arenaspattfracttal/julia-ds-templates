"use client"

import { useState, useEffect, useLayoutEffect, useRef } from "react"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Save, ArrowLeft, ChevronLeft,
  AlertTriangle, Timer, Layers, CalendarClock, Ruler,
  Warehouse, Building2, Receipt, ListChecks, ShieldCheck,
  Users2, Network, Activity, ClipboardList, ClipboardPlus,
  PackagePlus, FileCode2, Link2,
  Lock, Smartphone, KeyRound, Cable, Key, AppWindow, Puzzle,
} from "lucide-react"
import { Button }     from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsNav, type NavItem } from "@/components/ui/settings-nav"
import { TopbarBar, TopbarBarMobile } from "@/components/design-system/screens/topbar"
import { ScreenModeProvider } from "@/components/design-system/screen-mode-context"
import { cn } from "@/lib/utils"

import { GeneralForm }                    from "./ConfiguracionGeneral"
import { CuentasContent, ModulosContent } from "./CuentasUsuarios"
import { CalendarioContent }              from "./CalendarioLaboral"
import { FinancieroContent }              from "./Financiero"
import { CatalogosContent }              from "./CatalogosAuxiliares"

// ─── Types ────────────────────────────────────────────────────────────────────

type ScreenMode = "desktop" | "tablet" | "mobile"

// ─── Nav ──────────────────────────────────────────────────────────────────────

// IDs de hojas navegables
type NavId =
  | "general" | "calendar" | "docs" | "logs" | "guests" | "printing"
  | "users-list" | "users-permissions"
  | "mod-activos" | "mod-ot" | "mod-almacenes" | "mod-sol-trabajo" | "mod-iot"
  | "fin-impuestos" | "fin-moneda"
  | "cat-fallas" | "cat-horas-extra" | "cat-activos" | "cat-reprogramacion"
  | "cat-unidad" | "cat-almacenes" | "cat-coste" | "cat-presupuestos"
  | "cat-tareas" | "cat-compliance" | "cat-rrhh" | "cat-terceros"
  | "cat-sense" | "cat-ot" | "cat-sol-trabajo" | "cat-sol-material"
  | "cat-iso" | "cat-conexiones"
  | "sec-password" | "sec-2fa" | "sec-saml"
  | "api-connection" | "api-oauth" | "api-auth"
  | "account-general" | "account-addons"

// Lookup plano para header de sección
const FLAT_ITEMS = [
  { id: "general",          label: "General",                         icon: Settings     },
  { id: "calendar",         label: "Calendario laboral",              icon: Calendar     },
  { id: "docs",             label: "Gestión Documental",              icon: FileText     },
  { id: "logs",             label: "Log de Transacciones",            icon: History      },
  { id: "guests",           label: "Portal de invitados",             icon: UserCheck    },
  { id: "printing",         label: "Impresiones de OTs",              icon: Printer      },
  { id: "users-list",       label: "Usuarios",                        icon: User         },
  { id: "users-permissions",label: "Permisos",                        icon: Shield       },
  { id: "mod-activos",      label: "Activos",                         icon: Layers       },
  { id: "mod-ot",           label: "Órdenes de trabajo",              icon: ClipboardList},
  { id: "mod-almacenes",    label: "Almacenes",                       icon: Warehouse    },
  { id: "mod-sol-trabajo",  label: "Solicitudes de trabajo",          icon: ClipboardPlus},
  { id: "mod-iot",          label: "IoT",                             icon: Activity     },
  { id: "fin-impuestos",    label: "Impuestos",                       icon: Receipt      },
  { id: "fin-moneda",       label: "Cambios de moneda",               icon: CreditCard   },
  { id: "cat-fallas",       label: "Catálogo de Fallas",              icon: AlertTriangle},
  { id: "cat-horas-extra",  label: "Horas Extra",                     icon: Timer        },
  { id: "cat-activos",      label: "Activos",                         icon: Layers       },
  { id: "cat-reprogramacion",label: "Causa de reprogramación",        icon: CalendarClock},
  { id: "cat-unidad",       label: "Unidad",                          icon: Ruler        },
  { id: "cat-almacenes",    label: "Almacenes",                       icon: Warehouse    },
  { id: "cat-coste",        label: "Centro de coste",                 icon: Building2    },
  { id: "cat-presupuestos", label: "Presupuestos",                    icon: Receipt      },
  { id: "cat-tareas",       label: "Tareas",                          icon: ListChecks   },
  { id: "cat-compliance",   label: "Compliance y seguridad",          icon: ShieldCheck  },
  { id: "cat-rrhh",         label: "Recursos Humanos",                icon: Users2       },
  { id: "cat-terceros",     label: "Terceros",                        icon: Network      },
  { id: "cat-sense",        label: "Fracttal Sense",                  icon: Activity     },
  { id: "cat-ot",           label: "Órdenes de Trabajo",              icon: ClipboardList},
  { id: "cat-sol-trabajo",  label: "Solicitudes de Trabajo",          icon: ClipboardPlus},
  { id: "cat-sol-material", label: "Solicitudes de Material",         icon: PackagePlus  },
  { id: "cat-iso",          label: "Codificación ISO",                icon: FileCode2    },
  { id: "cat-conexiones",   label: "Conexiones",                      icon: Link2        },
  { id: "sec-password",     label: "Contraseña",                      icon: Lock         },
  { id: "sec-2fa",          label: "Autenticación de dos pasos",      icon: Smartphone   },
  { id: "sec-saml",         label: "SAML 2.0",                        icon: KeyRound     },
  { id: "api-connection",   label: "Conexión API",                    icon: Cable        },
  { id: "api-oauth",        label: "Consumidores OAuth",              icon: Key          },
  { id: "api-auth",         label: "Autorizaciones de Apps",          icon: AppWindow    },
  { id: "account-general",  label: "General",                         icon: Settings     },
  { id: "account-addons",   label: "AddOns",                          icon: Puzzle       },
] as const

// Estructura jerárquica — espejo exacto del registry/settings-nav del DS Julia
const NAV_ITEMS: NavItem[] = [
  { id: "general",   label: "General",              icon: Settings  },
  {
    id: "users", label: "Cuentas de Usuarios", icon: Users,
    children: [
      { id: "users-list",        label: "Usuarios", icon: User   },
      { id: "users-permissions", label: "Permisos", icon: Shield },
    ],
  },
  { id: "calendar",  label: "Calendario laboral",   icon: Calendar  },
  {
    id: "modules", label: "Módulos", icon: LayoutGrid,
    children: [
      { id: "mod-activos",         label: "Activos",                icon: Layers        },
      { id: "mod-ot",              label: "Órdenes de trabajo",     icon: ClipboardList },
      { id: "mod-almacenes",       label: "Almacenes",              icon: Warehouse     },
      { id: "mod-sol-trabajo",     label: "Solicitudes de trabajo", icon: ClipboardPlus },
      { id: "mod-iot",             label: "IoT",                    icon: Activity      },
    ],
  },
  {
    id: "financial", label: "Financiero", icon: CreditCard,
    children: [
      { id: "fin-impuestos", label: "Impuestos",         icon: Receipt    },
      { id: "fin-moneda",    label: "Cambios de moneda", icon: CreditCard },
    ],
  },
  {
    id: "catalogs", label: "Catálogos Auxiliares", icon: BookOpen, defaultOpen: false,
    children: [
      { id: "cat-fallas",          label: "Catálogo de Fallas",                  icon: AlertTriangle },
      { id: "cat-horas-extra",     label: "Horas Extra",                         icon: Timer         },
      { id: "cat-activos",         label: "Activos",                             icon: Layers        },
      { id: "cat-reprogramacion",  label: "Causa de reprogramación de la tarea", icon: CalendarClock },
      { id: "cat-unidad",          label: "Unidad",                              icon: Ruler         },
      { id: "cat-almacenes",       label: "Almacenes",                           icon: Warehouse     },
      { id: "cat-coste",           label: "Centro de coste",                     icon: Building2     },
      { id: "cat-presupuestos",    label: "Presupuestos",                        icon: Receipt       },
      { id: "cat-tareas",          label: "Tareas",                              icon: ListChecks    },
      { id: "cat-compliance",      label: "Compliance y seguridad",              icon: ShieldCheck   },
      { id: "cat-rrhh",            label: "Recursos Humanos",                    icon: Users2        },
      { id: "cat-terceros",        label: "Terceros",                            icon: Network       },
      { id: "cat-sense",           label: "Fracttal Sense",                      icon: Activity      },
      { id: "cat-ot",              label: "Órdenes de Trabajo",                  icon: ClipboardList },
      { id: "cat-sol-trabajo",     label: "Solicitudes de Trabajo",              icon: ClipboardPlus },
      { id: "cat-sol-material",    label: "Solicitudes de Material",             icon: PackagePlus   },
      { id: "cat-iso",             label: "Codificación ISO",                    icon: FileCode2     },
      { id: "cat-conexiones",      label: "Conexiones",                          icon: Link2         },
    ],
  },
  { id: "docs",      label: "Gestión Documental",   icon: FileText  },
  { id: "logs",      label: "Log de Transacciones", icon: History   },
  {
    id: "security", label: "Seguridad", icon: Shield,
    children: [
      { id: "sec-password", label: "Contraseña",                 icon: Lock       },
      { id: "sec-2fa",      label: "Autenticación de dos pasos", icon: Smartphone },
      { id: "sec-saml",     label: "SAML 2.0",                   icon: KeyRound   },
    ],
  },
  {
    id: "api", label: "Conexiones API", icon: Plug,
    children: [
      { id: "api-connection", label: "Conexión API",           icon: Cable     },
      { id: "api-oauth",      label: "Consumidores OAuth",     icon: Key       },
      { id: "api-auth",       label: "Autorizaciones de Apps", icon: AppWindow },
    ],
  },
  { id: "guests",    label: "Portal de invitados",  icon: UserCheck },
  {
    id: "account", label: "Cuenta", icon: User,
    children: [
      { id: "account-general", label: "General", icon: Settings },
      { id: "account-addons",  label: "AddOns",  icon: Puzzle   },
    ],
  },
  { id: "printing",  label: "Impresiones de OTs",   icon: Printer   },
]

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
  // Pantallas implementadas
  if (activeNav === "general")
    return <ScrollArea className="flex-1 overflow-hidden"><GeneralForm isMobile={isMobile} /></ScrollArea>
  if (activeNav === "users-list" || activeNav === "users-permissions")
    return <CuentasContent isCompact={isCompact} navId={activeNav} />
  if (activeNav === "calendar")
    return <CalendarioContent isCompact={isCompact} />
  if (activeNav === "mod-activos" || activeNav === "mod-ot" || activeNav === "mod-almacenes" || activeNav === "mod-sol-trabajo" || activeNav === "mod-iot")
    return <ModulosContent isCompact={isCompact} isMobile={isMobile} navId={activeNav} />
  if (activeNav === "fin-impuestos" || activeNav === "fin-moneda")
    return <FinancieroContent isCompact={isCompact} navId={activeNav} />
  if (activeNav.startsWith("cat-"))
    return <CatalogosContent isCompact={isCompact} isMobile={isMobile} navId={activeNav} />

  // Placeholder para secciones en construcción
  const item = FLAT_ITEMS.find(n => n.id === activeNav)!
  return <EmptySection label={item.label} Icon={item.icon} />
}

// ─── Main module ──────────────────────────────────────────────────────────────

function ConfiguracionModuleInner() {
  const [screenMode,   setScreenMode]   = useState<ScreenMode>("desktop")
  const [activeNav,    setActiveNav]    = useState<NavId>("general")
  const [navMinimized,  setNavMinimized]  = useState(false)
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
    if (screenMode === "mobile") setMobileNavOpen(true)
  }, [screenMode])

  const isMobile  = screenMode === "mobile"
  const isCompact = screenMode !== "desktop"

  const activeItem = FLAT_ITEMS.find(n => n.id === activeNav)!

  function selectNav(id: NavId) {
    setActiveNav(id)
    if (isMobile) setMobileNavOpen(false)
  }

  // Content panel (shared between desktop/tablet and mobile)
  const contentCard = (
    <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-w-0 min-h-0">
      {/* Section header — oculto en mobile (el toolbar ya muestra el nombre) */}
      {!isMobile && (
        <div className="h-12 px-3 border-b shrink-0 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">{activeItem.label}</h2>
        </div>
      )}

      {/* Section body */}
      <SectionContent activeNav={activeNav} isMobile={isMobile} isCompact={isCompact} />
    </div>
  )

  return (
    <div className="relative h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      {isMobile
        ? <TopbarBarMobile title="Configuración" />
        : <TopbarBar title="Configuración" subtitle="" showSearch={false} />
      }

      {/* 2 — Área principal */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* 2a — Toolbar */}
        <div className="flex items-center justify-between rounded-lg border bg-background p-3 gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={isMobile ? () => setMobileNavOpen(true) : undefined}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium text-foreground truncate">
              {isMobile ? activeItem.label : "Fracttal Demo"}
            </span>
          </div>
          <Button size={isCompact ? "icon-sm" : "sm"} disabled>
            <Save className="size-4" />
            {!isCompact && "Guardar"}
          </Button>
        </div>

        {/* 2b — Nav + contenido */}
        {isMobile ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {mobileNavOpen ? (
              // Nivel 1 — lista de secciones (ocupa toda la altura)
              <div className="flex-1 rounded-lg border bg-background overflow-hidden">
                <SettingsNav
                  items={[...NAV_ITEMS]}
                  active={activeNav}
                  onSelect={id => selectNav(id as NavId)}
                  mode="mobile"
                />
              </div>
            ) : (
              // Nivel 2 — contenido de la sección seleccionada
              contentCard
            )}
          </div>
        ) : (
          <div className="flex flex-1 min-h-0 gap-2 overflow-hidden">
            <SettingsNav
              items={[...NAV_ITEMS]}
              active={activeNav}
              onSelect={id => setActiveNav(id as NavId)}
              mode={screenMode}
              minimized={navMinimized}
              onToggleMinimize={screenMode === "desktop" ? () => setNavMinimized(v => !v) : undefined}
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
