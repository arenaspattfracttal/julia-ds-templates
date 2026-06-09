"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Save, Layers,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { Button }     from "@/components/ui/button"
import { Switch }     from "@/components/ui/switch"
import { Label }      from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator }  from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { useScreenMode } from "../screen-mode-context"
import { cn } from "@/lib/utils"

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

// ─── Datos ────────────────────────────────────────────────────────────────────

const TIPOS = [
  { value: "activos",     label: "Activos"               },
  { value: "equipos",     label: "Equipos"               },
  { value: "herramientas",label: "Herramientas"           },
  { value: "repuestos",   label: "Repuestos y Suministros"},
] as const

const MODULE_TABS = [
  { value: "ubicaciones", label: "Ubicaciones"            },
  { value: "equipos",     label: "Equipos"                },
  { value: "herramientas",label: "Herramientas"           },
  { value: "repuestos",   label: "Repuestos y Suministros"},
] as const

type FieldRow = {
  id:         string
  label:      string
  disabled?:  boolean
  defaultOn?: boolean
}

// ── Ubicaciones ───────────────────────────────────────────────────────────────

const UBICACIONES_LEFT: FieldRow[] = [
  { id: "nombre",      label: "Nombre",                        disabled: true, defaultOn: true },
  { id: "codigo",      label: "Código"                         },
  { id: "direccion",   label: "Dirección"                      },
  { id: "ciudad",      label: "Ciudad"                         },
  { id: "codigo-area", label: "Código Área"                    },
  { id: "depto",       label: "Departamento / Estado / Región" },
  { id: "pais",        label: "País"                           },
  { id: "ubicado-en",  label: "Ubicado en ó es Parte de"      },
  { id: "tipo",        label: "Tipo"                           },
]

const UBICACIONES_RIGHT: FieldRow[] = [
  { id: "clasificacion-1", label: "Clasificación 1"        },
  { id: "clasificacion-2", label: "Clasificación 2"        },
  { id: "codigo-barras",   label: "Código de Barras / NFC" },
  { id: "notas",           label: "Notas"                  },
  { id: "prioridad",       label: "Prioridad"              },
  { id: "centro-coste",    label: "Centro de coste"        },
]

const UBICACIONES_FOOTER: FieldRow[] = [
  {
    id:    "formulario-personalizado",
    label: "Marcar Formulario Personalizado como obligatorio",
  },
  {
    id:    "actualizar-automaticamente",
    label: "Actualizar automáticamente las órdenes de trabajo y solicitudes cuando se edite la localización de la ubicación",
  },
]

// ── Equipos ───────────────────────────────────────────────────────────────────

const EQUIPOS_LEFT: FieldRow[] = [
  { id: "eq-nombre",       label: "Nombre",            disabled: true, defaultOn: true },
  { id: "eq-codigo",       label: "Código"             },
  { id: "eq-descripcion",  label: "Descripción"        },
  { id: "eq-fabricante",   label: "Fabricante"         },
  { id: "eq-modelo",       label: "Modelo"             },
  { id: "eq-serie",        label: "Número de Serie"    },
  { id: "eq-año",          label: "Año de fabricación" },
]

const EQUIPOS_RIGHT: FieldRow[] = [
  { id: "eq-clasificacion-1", label: "Clasificación 1"        },
  { id: "eq-clasificacion-2", label: "Clasificación 2"        },
  { id: "eq-codigo-barras",   label: "Código de Barras / NFC" },
  { id: "eq-notas",           label: "Notas"                  },
  { id: "eq-prioridad",       label: "Prioridad"              },
  { id: "eq-centro-coste",    label: "Centro de coste"        },
]

const EQUIPOS_FOOTER: FieldRow[] = [
  {
    id:    "eq-formulario-personalizado",
    label: "Marcar Formulario Personalizado como obligatorio",
  },
]

// ── Herramientas ──────────────────────────────────────────────────────────────

const HERRAMIENTAS_LEFT: FieldRow[] = [
  { id: "h-nombre",      label: "Nombre",         disabled: true, defaultOn: true },
  { id: "h-codigo",      label: "Código"          },
  { id: "h-descripcion", label: "Descripción"     },
  { id: "h-fabricante",  label: "Fabricante"      },
  { id: "h-modelo",      label: "Modelo"          },
  { id: "h-serie",       label: "Número de Serie" },
]

const HERRAMIENTAS_RIGHT: FieldRow[] = [
  { id: "h-clasificacion-1", label: "Clasificación 1"        },
  { id: "h-clasificacion-2", label: "Clasificación 2"        },
  { id: "h-codigo-barras",   label: "Código de Barras / NFC" },
  { id: "h-notas",           label: "Notas"                  },
  { id: "h-prioridad",       label: "Prioridad"              },
]

const HERRAMIENTAS_FOOTER: FieldRow[] = [
  {
    id:    "h-formulario-personalizado",
    label: "Marcar Formulario Personalizado como obligatorio",
  },
]

// ── Repuestos ─────────────────────────────────────────────────────────────────

const REPUESTOS_LEFT: FieldRow[] = [
  { id: "r-nombre",      label: "Nombre",         disabled: true, defaultOn: true },
  { id: "r-codigo",      label: "Código"          },
  { id: "r-descripcion", label: "Descripción"     },
  { id: "r-fabricante",  label: "Fabricante"      },
  { id: "r-referencia",  label: "Referencia"      },
  { id: "r-unidad",      label: "Unidad de medida"},
]

const REPUESTOS_RIGHT: FieldRow[] = [
  { id: "r-clasificacion-1", label: "Clasificación 1"        },
  { id: "r-clasificacion-2", label: "Clasificación 2"        },
  { id: "r-codigo-barras",   label: "Código de Barras / NFC" },
  { id: "r-notas",           label: "Notas"                  },
  { id: "r-prioridad",       label: "Prioridad"              },
  { id: "r-centro-coste",    label: "Centro de coste"        },
]

const REPUESTOS_FOOTER: FieldRow[] = [
  {
    id:    "r-formulario-personalizado",
    label: "Marcar Formulario Personalizado como obligatorio",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SwitchMap = Record<string, boolean>

function buildInitial(fields: FieldRow[]): SwitchMap {
  return Object.fromEntries(fields.map(f => [f.id, f.defaultOn ?? false]))
}

// ─── FieldGrid ────────────────────────────────────────────────────────────────

function FieldGrid({
  left, right, footer, values, onChange,
}: {
  left:     FieldRow[]
  right:    FieldRow[]
  footer:   FieldRow[]
  values:   SwitchMap
  onChange: (id: string, v: boolean) => void
}) {
  return (
    <div className="p-4 flex flex-col gap-0">
      <p className="text-sm text-muted-foreground mb-4">
        Establecer cuáles de los siguientes campos deben ser obligatorios
      </p>

      {/* Grid 2 columnas */}
      <div className="grid grid-cols-2 gap-x-8">

        {/* Columna izquierda */}
        <div>
          <div className="grid grid-cols-[1fr_auto] items-center py-2 border-b mb-0.5">
            <span className="text-sm font-semibold text-foreground">Opciones</span>
            <span className="text-sm font-semibold text-foreground pr-1">Obligatorio</span>
          </div>
          {left.map(field => (
            <div
              key={field.id}
              className={cn(
                "grid grid-cols-[1fr_auto] items-center py-2.5 border-b",
                field.disabled && "opacity-40",
              )}
            >
              <span className="text-sm text-foreground">{field.label}</span>
              <Switch
                checked={values[field.id] ?? false}
                onCheckedChange={v => onChange(field.id, v)}
                disabled={field.disabled}
              />
            </div>
          ))}
        </div>

        {/* Columna derecha */}
        <div>
          <div className="grid grid-cols-[1fr_auto] items-center py-2 border-b mb-0.5">
            <span className="text-sm font-semibold text-foreground">Opciones</span>
            <span className="text-sm font-semibold text-foreground pr-1">Obligatorio</span>
          </div>
          {right.map(field => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_auto] items-center py-2.5 border-b"
            >
              <span className="text-sm text-foreground">{field.label}</span>
              <Switch
                checked={values[field.id] ?? false}
                onCheckedChange={v => onChange(field.id, v)}
              />
            </div>
          ))}
        </div>

      </div>

      {/* Footer — opciones extra de ancho completo */}
      {footer.length > 0 && (
        <div className="mt-6 flex flex-col">
          {footer.map(field => (
            <div
              key={field.id}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <span className="text-sm text-foreground">{field.label}</span>
              <Switch
                checked={values[field.id] ?? false}
                onCheckedChange={v => onChange(field.id, v)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Módulos content ──────────────────────────────────────────────────────────

function ModulosContent({ isCompact }: { isCompact: boolean }) {
  const [tipo,    setTipo]    = useState("activos")
  const [tabUbic, setTabUbic] = useState("ubicaciones")

  // Switch state por tab
  const [ubicValues, setUbicValues] = useState<SwitchMap>(() => ({
    ...buildInitial(UBICACIONES_LEFT),
    ...buildInitial(UBICACIONES_RIGHT),
    ...buildInitial(UBICACIONES_FOOTER),
  }))
  const [eqValues, setEqValues] = useState<SwitchMap>(() => ({
    ...buildInitial(EQUIPOS_LEFT),
    ...buildInitial(EQUIPOS_RIGHT),
    ...buildInitial(EQUIPOS_FOOTER),
  }))
  const [hValues, setHValues] = useState<SwitchMap>(() => ({
    ...buildInitial(HERRAMIENTAS_LEFT),
    ...buildInitial(HERRAMIENTAS_RIGHT),
    ...buildInitial(HERRAMIENTAS_FOOTER),
  }))
  const [rValues, setRValues] = useState<SwitchMap>(() => ({
    ...buildInitial(REPUESTOS_LEFT),
    ...buildInitial(REPUESTOS_RIGHT),
    ...buildInitial(REPUESTOS_FOOTER),
  }))

  function toggle(map: SwitchMap, set: (m: SwitchMap) => void) {
    return (id: string, v: boolean) => set({ ...map, [id]: v })
  }

  return (
    <div className="flex flex-col gap-0">

      {/* Tipo select */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Tipo</Label>
          <div className="relative">
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-full pl-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tabs por módulo */}
      <Tabs value={tabUbic} onValueChange={setTabUbic} className="flex flex-col flex-1 min-h-0">
        <div className="px-4 pt-1">
          <TabsList
            variant="line"
            className={cn(isCompact && "w-full overflow-x-auto [scrollbar-width:none]")}
          >
            {MODULE_TABS.map(t => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="ubicaciones" className="mt-0">
          <FieldGrid
            left={UBICACIONES_LEFT}
            right={UBICACIONES_RIGHT}
            footer={UBICACIONES_FOOTER}
            values={ubicValues}
            onChange={toggle(ubicValues, setUbicValues)}
          />
        </TabsContent>

        <TabsContent value="equipos" className="mt-0">
          <FieldGrid
            left={EQUIPOS_LEFT}
            right={EQUIPOS_RIGHT}
            footer={EQUIPOS_FOOTER}
            values={eqValues}
            onChange={toggle(eqValues, setEqValues)}
          />
        </TabsContent>

        <TabsContent value="herramientas" className="mt-0">
          <FieldGrid
            left={HERRAMIENTAS_LEFT}
            right={HERRAMIENTAS_RIGHT}
            footer={HERRAMIENTAS_FOOTER}
            values={hValues}
            onChange={toggle(hValues, setHValues)}
          />
        </TabsContent>

        <TabsContent value="repuestos" className="mt-0">
          <FieldGrid
            left={REPUESTOS_LEFT}
            right={REPUESTOS_RIGHT}
            footer={REPUESTOS_FOOTER}
            values={rValues}
            onChange={toggle(rValues, setRValues)}
          />
        </TabsContent>
      </Tabs>

    </div>
  )
}

// ─── Settings nav ─────────────────────────────────────────────────────────────

type NavMode = "desktop" | "tablet" | "mobile"

function SettingsNav({
  active, onSelect, mode, minimized = false, onToggleMinimize,
}: {
  active:            string
  onSelect:          (id: string) => void
  mode:              NavMode
  minimized?:        boolean
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
                {minimized
                  ? <PanelLeftOpen  className="size-4" />
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

// ─── Exported screen ──────────────────────────────────────────────────────────

export function Modulos() {
  const screenMode    = useScreenMode()
  const [activeNav, setActiveNav]       = useState("modules")
  const [navMinimized, setNavMinimized] = useState(screenMode === "tablet")

  useEffect(() => { setNavMinimized(screenMode === "tablet") }, [screenMode])

  const isMobile  = screenMode === "mobile"
  const isCompact = screenMode !== "desktop"

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      {isMobile
        ? <TopbarBarMobile title="Configuración" />
        : <TopbarBar title="Configuración" subtitle="" showSearch={false} />
      }

      {/* 2 — Contenido principal */}
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
              <div className="h-12 px-3 border-b shrink-0 flex items-center gap-2">
                <LayoutGrid className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Módulos</h2>
              </div>
              <ScrollArea className="flex-1">
                <ModulosContent isCompact={isCompact} />
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
              <div className="h-12 px-3 border-b shrink-0 flex items-center gap-2">
                <LayoutGrid className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Módulos</h2>
              </div>
              <ScrollArea className="flex-1">
                <ModulosContent isCompact={isCompact} />
              </ScrollArea>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
