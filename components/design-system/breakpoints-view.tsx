"use client"

import { Monitor, Tablet, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// ─── Definición de breakpoints (shadcn / Tailwind) ───────────────────────────

const BREAKPOINTS = [
  {
    name: "Desktop",
    prefix: "lg:",
    range: "≥ 1024px",
    icon: Monitor,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    description: "Laptops y monitores. Layout completo con todas las columnas y paneles.",
  },
  {
    name: "Tablet",
    prefix: "md:",
    range: "≥ 768px",
    icon: Tablet,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    description: "Tablets en portrait y landscape. Layouts de 2 columnas, navegación adaptada.",
  },
  {
    name: "Mobile",
    prefix: "sm:",
    range: "≥ 640px",
    icon: Smartphone,
    color: "text-info",
    bg: "bg-info/10",
    border: "border-info/20",
    description: "Teléfonos. Layout de columna única, navegación por drawer o bottom bar.",
  },
]

// ─── Barra visual de breakpoints ─────────────────────────────────────────────

function BreakpointBar() {
  const segments = [
    { label: "Mobile",  sublabel: "640px",  color: "bg-info/30",    flex: 1 },
    { label: "Tablet",  sublabel: "768px",  color: "bg-warning/30", flex: 1.5 },
    { label: "Desktop", sublabel: "1024px", color: "bg-primary/30", flex: 2.5 },
  ]

  return (
    <div className="flex h-12 rounded-lg overflow-hidden border border-border/60">
      {segments.map((seg, i) => (
        <div
          key={i}
          className={`${seg.color} flex flex-col items-center justify-center gap-0.5`}
          style={{ flex: seg.flex }}
        >
          <span className="text-xs font-medium text-foreground/70">{seg.label}</span>
          <span className="text-[10px] font-mono text-foreground/50">{seg.sublabel}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Fila de breakpoint ───────────────────────────────────────────────────────

function BreakpointRow({ bp }: { bp: (typeof BREAKPOINTS)[number] }) {
  const Icon = bp.icon
  return (
    <div className={`flex items-start gap-4 p-3 rounded-lg border ${bp.border} ${bp.bg}`}>
      <div className={`flex items-center justify-center size-8 rounded-md bg-background border ${bp.border} shrink-0`}>
        <Icon className={`size-4 ${bp.color}`} />
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{bp.name}</span>
          <Badge variant="secondary" className="font-mono text-xs px-1.5 py-0">{bp.range}</Badge>
          {bp.prefix !== "—" && (
            <Badge variant="outline" className="font-mono text-xs px-1.5 py-0 text-primary border-primary/30">
              {bp.prefix}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{bp.description}</p>
      </div>
    </div>
  )
}

// ─── Vista principal ──────────────────────────────────────────────────────────

export function BreakpointsView() {
  return (
    <div className="flex flex-col gap-6">

      <BreakpointBar />

      <Separator />

      <div className="flex flex-col gap-2">
        {BREAKPOINTS.map((bp) => (
          <BreakpointRow key={bp.prefix} bp={bp} />
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-foreground">Uso en Julia DS</h3>
        <div className="rounded-lg border bg-muted p-3 font-mono text-xs text-foreground/80 leading-relaxed">
          <p className="text-muted-foreground mb-2">{`/* Mobile-first: base → sm → md → lg → xl → 2xl */`}</p>
          <p><span className="text-primary">{"<div"}</span>{" className=\""}</p>
          <p className="pl-4 text-foreground">{"flex-col          "}<span className="text-muted-foreground">{"/* mobile: columna */"}</span></p>
          <p className="pl-4 text-warning">{"md:flex-row       "}<span className="text-muted-foreground">{"/* tablet+: fila */"}</span></p>
          <p className="pl-4 text-primary">{"lg:gap-6          "}<span className="text-muted-foreground">{"/* laptop+: más gap */"}</span></p>
          <p>{"\">"}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          El breakpoint <span className="font-mono font-semibold text-warning">md (768px)</span> es el punto de quiebre principal
          entre mobile y desktop en las pantallas de Julia DS.
        </p>
      </div>

    </div>
  )
}
