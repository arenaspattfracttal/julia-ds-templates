"use client"

import {
  Layers, Palette, Shapes, ArrowRight,
  Zap, Eye, Shield, Users,
  ChevronsUpDown, ToggleLeft,
  Tag, CheckSquare, Table2, AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { components as registryComponents } from "./registry"
import { SAMPLE_SCREENS } from "./screens-data"
import { CATEGORY_COUNTS } from "./icon-categories"
import { theme } from "@/theme/tokens"

// Stats calculados dinámicamente — se actualizan solos al agregar items
function buildStats() {
  const nComponents = registryComponents.length
  const nScreens    = SAMPLE_SCREENS.filter((s) => s.section !== "estilos").length
  const nIcons      = CATEGORY_COUNTS.reduce((acc, c) => acc + c.count, 0)
  const nTokens     = Object.keys(theme.light).filter(
    (k) => !k.startsWith("chart") && k !== "radius"
  ).length

  return [
    { value: String(nComponents), label: "Componentes" },
    { value: String(nTokens),     label: "Tokens"       },
    { value: String(nScreens),    label: "Pantallas"    },
    { value: `${nIcons}+`,        label: "Íconos"       },
  ]
}

const PRINCIPLES = [
  {
    icon: Eye,
    title: "Claridad",
    description:
      "Cada elemento comunica su propósito sin ambigüedad. Las interfaces de Fracttal operan en contextos industriales exigentes — la claridad no es estética, es seguridad operativa.",
  },
  {
    icon: Zap,
    title: "Eficiencia",
    description:
      "Los técnicos de campo y gestores de mantenimiento toman decisiones bajo presión. Julia reduce la fricción para que cada interacción sea rápida y predecible.",
  },
  {
    icon: Shield,
    title: "Consistencia",
    description:
      "Un mismo patrón en todas las superficies — web, mobile, reportes. La consistencia genera confianza y reduce la carga cognitiva del usuario.",
  },
  {
    icon: Users,
    title: "Accesibilidad",
    description:
      "Diseñado para cumplir WCAG 2.1 AA. Los productos de Fracttal son usados por personas en condiciones diversas de iluminación, dispositivo y contexto.",
  },
]

const COMPONENT_HIGHLIGHTS = [
  { id: "button", label: "Button", icon: ToggleLeft },
  { id: "badge", label: "Badge", icon: Tag },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "table", label: "Table", icon: Table2 },
  { id: "alert", label: "Alert", icon: AlertCircle },
  { id: "accordion", label: "Accordion", icon: ChevronsUpDown },
]

interface OverviewPageProps {
  onSelectComponent: (id: string) => void
  onGoTokens: () => void
  onGoIcons: () => void
}

export function OverviewPage({ onSelectComponent, onGoTokens, onGoIcons }: OverviewPageProps) {
  const STATS = buildStats()
  return (
    <main className="flex-1 overflow-y-auto bg-background">

      {/* Hero */}
      <section className="relative border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative px-10 py-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Julia Design System
            </h1>
            <Badge variant="outline" className="text-xs text-muted-foreground font-normal translate-y-0.5">
              v1.0.0
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            El lenguaje visual de Fracttal. Un sistema de componentes, tokens y patrones
            diseñado para construir productos de gestión de mantenimiento consistentes,
            accesibles y escalables.
          </p>
          <div className="mt-10 flex items-center gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="px-10 py-12 max-w-6xl mx-auto space-y-16">

        {/* Sobre Julia */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Sobre Julia
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 rounded-xl border border-border p-6 bg-card">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fracttal opera en sectores industriales donde la experiencia de usuario no es
                un diferenciador — es un requisito operativo.{" "}
                <strong className="text-foreground font-medium">Julia</strong> es el sistema
                de diseño que unifica todos los productos de Fracttal bajo un mismo lenguaje
                visual, eliminando inconsistencias entre módulos y acelerando el desarrollo
                de nuevas funcionalidades.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Construido sobre{" "}
                <strong className="text-foreground font-medium">Shadcn UI</strong> y{" "}
                <strong className="text-foreground font-medium">Radix Primitives</strong>,
                con tokens semánticos propios de Fracttal y soporte completo para modo oscuro.
              </p>
            </div>
            <div className="rounded-xl border border-border p-6 bg-card flex flex-col gap-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Stack</p>
              {["React + TypeScript", "Shadcn UI", "Radix Primitives", "Tailwind CSS v4", "Lucide Icons"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Principios */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Principios de diseño
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-border p-6 bg-card hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <p.icon className="size-3.5 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">{p.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Explorar */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Explorar
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => onSelectComponent("button")}
              className="group text-left rounded-xl border border-border p-6 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Layers className="size-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Átomos</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                36 componentes base: botones, inputs, badges, tablas y más.
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                Ver componentes <ArrowRight className="size-3" />
              </span>
            </button>

            <button
              onClick={onGoTokens}
              className="group text-left rounded-xl border border-border p-6 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Palette className="size-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Tokens</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Colores, tipografía y radios semánticos del sistema.
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                Ver tokens <ArrowRight className="size-3" />
              </span>
            </button>

            <button
              onClick={onGoIcons}
              className="group text-left rounded-xl border border-border p-6 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shapes className="size-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Íconos</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                +2000 íconos Lucide organizados por categoría.
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                Ver íconos <ArrowRight className="size-3" />
              </span>
            </button>
          </div>
        </section>

        {/* Componentes frecuentes */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Componentes frecuentes
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {COMPONENT_HIGHLIGHTS.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectComponent(c.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
              >
                <c.icon className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{c.label}</span>
                <ArrowRight className="size-3 text-muted-foreground/40 ml-auto" />
              </button>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Julia Design System · Fracttal</span>
          </div>
          <span className="text-xs text-muted-foreground/50">© 2025 Fracttal Tech S.L.</span>
        </footer>

      </div>
    </main>
  )
}
