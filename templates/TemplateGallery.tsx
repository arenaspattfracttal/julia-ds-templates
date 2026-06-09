import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { LayoutTemplate, Settings, Wrench, Package, BarChart3 } from "lucide-react"
import { ConfiguracionGeneral } from "./configuracion/ConfiguracionGeneral"
import { CuentasUsuarios } from "./configuracion/CuentasUsuarios"
import { CalendarioLaboral } from "./configuracion/CalendarioLaboral"
import { Modulos }           from "./configuracion/Modulos"
import { ConfiguracionModule } from "./configuracion/ConfiguracionModule"

// ─── Types ────────────────────────────────────────────────────────────────────

interface TemplateEntry {
  id:          string
  title:       string
  description: string
  screen:      string
  module:      string
  status:      "ready" | "wip"
  component?:  React.ComponentType
}

// ─── Registro de módulos ──────────────────────────────────────────────────────

const MODULES: { id: string; label: string; icon: React.ElementType }[] = [
  { id: "configuracion", label: "Configuración",  icon: Settings  },
  { id: "mantenimiento", label: "Mantenimiento",  icon: Wrench    },
  { id: "activos",       label: "Activos",         icon: Package   },
  { id: "reportes",      label: "Reportes",        icon: BarChart3 },
]

// ─── Registro de templates ────────────────────────────────────────────────────

const TEMPLATES: TemplateEntry[] = [
  // ── Configuración — módulo completo ───────────────────────────────────────
  {
    id:          "configuracion-module",
    module:      "configuracion",
    screen:      "Módulo completo",
    title:       "Configuración — Módulo completo",
    description: "General · Cuentas de Usuarios · Calendario Laboral navegables desde un único SettingsNav.",
    status:      "ready",
    component:   ConfiguracionModule,
  },
  // ── Configuración — pantallas individuales ─────────────────────────────────
  {
    id:          "configuracion-general",
    module:      "configuracion",
    screen:      "General",
    title:       "Configuración General",
    description: "Ajustes de empresa: logo, campos regionales, mapa de ubicación y datos de contacto.",
    status:      "ready",
    component:   ConfiguracionGeneral,
  },
  {
    id:          "cuentas-usuarios",
    module:      "configuracion",
    screen:      "Cuentas de Usuarios",
    title:       "Cuentas de Usuarios",
    description: "Gestión de usuarios con tabla, tabs Cuentas/Permisos, barra de contadores y acciones por fila.",
    status:      "ready",
    component:   CuentasUsuarios,
  },
  {
    id:          "calendario-laboral",
    module:      "configuracion",
    screen:      "Calendario laboral",
    title:       "Calendario Laboral",
    description: "Días laborales (multiselect) + tabla de días festivos con fecha, día laboral y recurrente.",
    status:      "ready",
    component:   CalendarioLaboral,
  },
  {
    id:          "modulos",
    module:      "configuracion",
    screen:      "Módulos",
    title:       "Módulos",
    description: "Configuración de campos obligatorios por tipo y módulo: Ubicaciones, Equipos, Herramientas y Repuestos.",
    status:      "ready",
    component:   Modulos,
  },
  {
    id:          "seguridad",
    module:      "configuracion",
    screen:      "Seguridad",
    title:       "Seguridad",
    description: "Políticas de contraseñas, autenticación de dos factores y sesiones activas.",
    status:      "wip",
  },

  // ── Mantenimiento ──────────────────────────────────────────────────────────
  {
    id:          "listado-ots",
    module:      "mantenimiento",
    screen:      "Órdenes de Trabajo",
    title:       "Listado de OTs",
    description: "Tabla de órdenes de trabajo con filtros por estado, técnico y activo.",
    status:      "wip",
  },
  {
    id:          "kanban-ots",
    module:      "mantenimiento",
    screen:      "Kanban OTs",
    title:       "Kanban de OTs",
    description: "Tablero Kanban drag & drop para gestión visual del flujo de trabajo.",
    status:      "wip",
  },

  // ── Activos ────────────────────────────────────────────────────────────────
  {
    id:          "listado-activos",
    module:      "activos",
    screen:      "Activos",
    title:       "Listado de Activos",
    description: "Catálogo de activos con árbol jerárquico, filtros y acciones en lote.",
    status:      "wip",
  },
]

// ─── Gallery ──────────────────────────────────────────────────────────────────

export function TemplateGallery() {
  const [search,        setSearch]        = useState("")
  const [activeModule,  setActiveModule]  = useState<string | null>(null)
  const [activeId,      setActiveId]      = useState<string | null>(null)

  const activeTemplate = TEMPLATES.find(t => t.id === activeId)

  // Vista de template individual
  if (activeTemplate?.component) {
    const Screen = activeTemplate.component
    const mod = MODULES.find(m => m.id === activeTemplate.module)
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-4 h-10 bg-muted border-b shrink-0">
          <button
            onClick={() => setActiveId(null)}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            ← Julia DS Templates
          </button>
          <span className="text-xs text-muted-foreground">/</span>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
            {mod?.label}
          </span>
          <span className="text-xs text-muted-foreground">/</span>
          <span className="text-xs font-medium text-foreground">{activeTemplate.title}</span>
        </div>
        <div className="flex-1 min-h-0">
          <Screen />
        </div>
      </div>
    )
  }

  // Filtrado
  const q = search.toLowerCase()
  const filtered = TEMPLATES.filter(t =>
    (!activeModule || t.module === activeModule) &&
    (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.screen.toLowerCase().includes(q))
  )

  // Agrupar por módulo
  const moduleIds = activeModule
    ? [activeModule]
    : [...new Set(filtered.map(t => t.module))]

  const readyCount = TEMPLATES.filter(t => t.status === "ready").length

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">

      {/* Header */}
      <header className="border-b bg-background shrink-0">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LayoutTemplate className="size-5 text-primary" />
            <div>
              <h1 className="text-base font-semibold leading-none">Julia DS Templates</h1>
              <p className="text-xs text-muted-foreground mt-1">Fracttal · React 19 + Tailwind v4 + shadcn/ui</p>
            </div>
          </div>
          <Input
            type="search"
            placeholder="Buscar template..."
            className="w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtros de módulo */}
        <div className="max-w-5xl mx-auto px-6 pb-3 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveModule(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
              activeModule === null
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            Todos ({TEMPLATES.length})
          </button>
          {MODULES.filter(m => TEMPLATES.some(t => t.module === m.id)).map(({ id, label, icon: Icon }) => {
            const count = TEMPLATES.filter(t => t.module === id).length
            return (
              <button
                key={id}
                onClick={() => setActiveModule(prev => prev === id ? null : id)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  activeModule === id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                <Icon className="size-3" />
                {label} ({count})
              </button>
            )
          })}
        </div>
      </header>

      {/* Contenido scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-5">

          <p className="text-xs text-muted-foreground mb-5">
            <span className="font-medium text-foreground">{readyCount}</span> listos ·{" "}
            <span className="font-medium text-foreground">{TEMPLATES.length - readyCount}</span> en progreso ·{" "}
            Añade los tuyos en <code className="text-xs bg-muted px-1 py-0.5 rounded">templates/&lt;módulo&gt;/</code>
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <LayoutTemplate className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay templates que coincidan con &quot;{search}&quot;</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {moduleIds.map(modId => {
                const mod        = MODULES.find(m => m.id === modId)
                const ModIcon    = mod?.icon ?? LayoutTemplate
                const modItems   = filtered.filter(t => t.module === modId)
                if (!modItems.length) return null
                return (
                  <section key={modId}>
                    {/* Cabecera de módulo */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-lg bg-muted text-foreground">
                        <ModIcon className="size-3.5" />
                        {mod?.label ?? modId}
                      </div>
                      <Separator className="flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {modItems.filter(t => t.status === "ready").length} / {modItems.length} listos
                      </span>
                    </div>

                    {/* Grid de cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {modItems.map((template) => (
                        <Card key={template.id} className="group hover:shadow-md transition-shadow flex flex-col">
                          <CardHeader className="pb-2 pt-4 px-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs text-muted-foreground mb-0.5 truncate">{template.screen}</p>
                                <CardTitle className="text-sm leading-snug">{template.title}</CardTitle>
                              </div>
                              <Badge
                                variant="outline"
                                className={`shrink-0 text-[10px] px-1.5 py-0 h-5 ${
                                  template.status === "ready"
                                    ? "border-success text-success"
                                    : "border-warning text-warning"
                                }`}
                              >
                                {template.status === "ready" ? "Listo" : "En progreso"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-3 pb-4 px-4 flex-1">
                            <CardDescription className="text-xs leading-relaxed line-clamp-3">
                              {template.description}
                            </CardDescription>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-auto"
                              disabled={template.status === "wip"}
                              onClick={() => template.status === "ready" && setActiveId(template.id)}
                            >
                              {template.status === "ready" ? "Ver template" : "Próximamente"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
