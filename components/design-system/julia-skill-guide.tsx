"use client"

import { useState } from "react"
import {
  ScanSearch, Layers, LayoutTemplate, PanelBottom,
  RefreshCw, Ruler, CheckCircle2, Sparkles, Info,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// ─── Ilustraciones mini ──────────────────────────────────────────────────────

function IlluScreenshot() {
  return (
    <div className="w-full h-full flex flex-col rounded border border-border/60 overflow-hidden bg-muted/40 relative">
      <div className="h-4 bg-muted border-b border-border/60 flex items-center px-2 gap-1 shrink-0">
        <div className="size-1.5 rounded-full bg-destructive/60" />
        <div className="size-1.5 rounded-full bg-warning/60" />
        <div className="size-1.5 rounded-full bg-success/60" />
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1.5">
        <div className="h-3 w-2/3 rounded bg-border/80" />
        <div className="h-2 w-full rounded bg-border/50" />
        <div className="h-2 w-4/5 rounded bg-border/50" />
        <div className="mt-1 grid grid-cols-2 gap-1">
          <div className="h-8 rounded bg-border/40" />
          <div className="h-8 rounded bg-border/40" />
        </div>
      </div>
      <div className="absolute bottom-2 right-2 size-5 rounded-full bg-primary flex items-center justify-center shadow">
        <ScanSearch className="size-2.5 text-primary-foreground" />
      </div>
    </div>
  )
}

function IlluIdentify() {
  return (
    <div className="w-full h-full flex flex-col rounded border border-border/60 overflow-hidden bg-background">
      <div className="h-5 border-b border-border/60 bg-muted flex items-center px-1.5 gap-1 shrink-0">
        <div className="h-2 w-10 rounded bg-primary/30 border border-primary/40" />
        <span className="text-[6px] text-primary/70">topbar</span>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-8 border-r border-border/60 bg-muted/30 flex items-center justify-center shrink-0">
          <span className="text-[5px] text-muted-foreground rotate-90 whitespace-nowrap">nav</span>
        </div>
        <div className="flex-1 p-1.5 flex flex-col gap-1 min-w-0">
          <div className="h-3 border border-border/60 rounded bg-muted/20 flex items-center px-1 shrink-0">
            <span className="text-[5px] text-muted-foreground">toolbar</span>
          </div>
          <div className="flex-1 border border-border/60 rounded bg-muted/20 flex items-center justify-center">
            <span className="text-[5px] text-muted-foreground">content</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function IlluLayouts() {
  return (
    <div className="w-full h-full flex rounded border border-border/60 overflow-hidden bg-background">
      <div className="w-12 border-r border-border/60 bg-sidebar flex flex-col gap-0.5 p-1.5 shrink-0">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={cn("h-1.5 w-full rounded", i === 2 ? "bg-primary/60" : "bg-sidebar-foreground/20")} />
        ))}
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1 min-w-0">
        <div className="text-[5px] font-semibold text-muted-foreground uppercase tracking-wider">Layouts</div>
        {["Config", "Usuarios", "Detalle"].map((l) => (
          <div key={l} className="h-3 rounded border border-border/40 bg-muted/30 flex items-center px-1">
            <span className="text-[5px] text-muted-foreground">{l}</span>
          </div>
        ))}
        <div className="h-3 rounded border border-primary/50 bg-primary/10 flex items-center px-1">
          <span className="text-[5px] text-primary font-medium">→ tu pantalla</span>
        </div>
      </div>
    </div>
  )
}

function IlluSkeleton() {
  return (
    <div className="w-full h-full flex flex-col rounded border border-border/60 overflow-hidden bg-zinc-700/80">
      <div className="h-4 bg-white/90 border-b border-white/20 flex items-center justify-center shrink-0">
        <span className="text-[5px] text-black/40 font-medium tracking-wide">TOPBAR</span>
      </div>
      <div className="flex-1 p-1 flex flex-col gap-1">
        <div className="h-4 bg-white/90 rounded flex items-center justify-center shrink-0">
          <span className="text-[5px] text-black/40 font-medium">TOOLBAR</span>
        </div>
        <div className="flex-1 flex gap-1">
          <div className="w-5 bg-white/90 rounded flex items-center justify-center shrink-0">
            <span className="text-[4px] text-black/40 rotate-90 whitespace-nowrap">NAV</span>
          </div>
          <div className="flex-1 bg-white/90 rounded flex items-center justify-center">
            <span className="text-[5px] text-black/40 font-medium">BODY</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function IlluSwap() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 p-1">
      <div className="flex flex-col gap-0.5 items-center">
        <span className="text-[5px] text-muted-foreground mb-0.5">Antes</span>
        <div className="rounded border border-destructive/30 bg-destructive/5 p-1 flex flex-col gap-0.5">
          {["<div>", "<input>", "<button>"].map((el) => (
            <div key={el} className="h-3 w-14 rounded bg-destructive/20 border border-destructive/30 flex items-center px-1">
              <span className="text-[4px] text-destructive/70">{el}</span>
            </div>
          ))}
        </div>
      </div>
      <RefreshCw className="size-4 text-primary shrink-0" />
      <div className="flex flex-col gap-0.5 items-center">
        <span className="text-[5px] text-muted-foreground mb-0.5">Julia</span>
        <div className="rounded border border-primary/30 bg-primary/5 p-1 flex flex-col gap-0.5">
          {["Button", "Input", "Badge"].map((el) => (
            <div key={el} className="h-3 w-14 rounded bg-primary/20 border border-primary/30 flex items-center px-1">
              <span className="text-[4px] text-primary">{el}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IlluSpacing() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div className="w-full flex flex-col">
        <div className="relative border border-primary/40 rounded bg-primary/5 p-2 mb-1">
          <div className="h-2 w-full rounded bg-primary/20" />
          <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-[5px] text-primary whitespace-nowrap">gap-1.5</span>
        </div>
        <div className="relative border border-primary/40 rounded bg-primary/5 p-2 mb-2">
          <div className="h-2 w-full rounded bg-primary/20" />
        </div>
        <div className="relative border border-success/40 rounded bg-success/5 px-3 py-2">
          <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[4px] text-success whitespace-nowrap">p-3</span>
          <div className="h-2 w-full rounded bg-success/20" />
        </div>
      </div>
    </div>
  )
}

function IlluChecklist() {
  const items = ["Solo tokens semánticos", "Átomos de Julia", "3 breakpoints", "Tipografía Geist", "cursor-pointer"]
  return (
    <div className="w-full h-full flex flex-col justify-center gap-1 p-2">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3 text-success shrink-0" />
          <span className="text-[6px] text-foreground">{item}</span>
        </div>
      ))}
    </div>
  )
}

function IlluResult() {
  return (
    <div className="w-full h-full flex flex-col rounded border border-primary/40 overflow-hidden bg-background shadow-sm">
      <div className="h-4 bg-background border-b border-border flex items-center px-2 justify-between shrink-0">
        <div className="flex gap-1 items-center">
          <div className="size-2 rounded-sm bg-primary/60" />
          <div className="h-1.5 w-10 rounded bg-border/80" />
        </div>
        <div className="h-1.5 w-8 rounded bg-primary/60" />
      </div>
      <div className="flex-1 bg-muted/30 p-1 flex flex-col gap-1">
        <div className="h-3 bg-background rounded border border-border/60 flex items-center px-1 gap-1 shrink-0">
          <div className="size-1.5 rounded bg-muted" />
          <div className="h-1 flex-1 rounded bg-border/60" />
          <div className="h-1.5 w-6 rounded bg-primary/40" />
        </div>
        <div className="flex-1 flex gap-1">
          <div className="w-8 bg-background rounded border border-border/60 flex flex-col gap-0.5 p-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={cn("h-1.5 rounded", i === 0 ? "bg-primary/40" : "bg-border/40")} />
            ))}
          </div>
          <div className="flex-1 bg-background rounded border border-border/60" />
        </div>
      </div>
    </div>
  )
}

// ─── Pasos ───────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: 1, icon: ScanSearch, title: "Analizar el screenshot",
    desc: "Lee y comprende la pantalla: qué elementos tiene, cómo está distribuida, qué datos muestra y qué acciones permite.",
    illu: IlluScreenshot, color: "text-info bg-info/10",
  },
  {
    n: 2, icon: Layers, title: "Identificar la sección",
    desc: "Determina qué tipo de pantalla es: settings con nav lateral, tabla con toolbar, detalle con dos cards, kanban, árbol, etc.",
    illu: IlluIdentify, color: "text-warning bg-warning/10",
  },
  {
    n: 3, icon: LayoutTemplate, title: "Buscar en los Layouts",
    desc: "En Estilos → Layouts del visor Julia, localiza el skeleton que corresponde al tipo de pantalla. Úsalo como referencia de estructura.",
    illu: IlluLayouts, color: "text-primary bg-primary/10",
  },
  {
    n: 4, icon: PanelBottom, title: "Usar el layout como base",
    desc: "El skeleton define las zonas: topbar, toolbar, nav, body, footer. Respeta exactamente esa anatomía — clases, flex layout y overflow.",
    illu: IlluSkeleton, color: "text-muted-foreground bg-muted",
  },
  {
    n: 5, icon: RefreshCw, title: "Cambiar por átomos Julia",
    desc: "Reemplaza cada elemento por su átomo equivalente en Julia (Button, Input, Select, Badge, Table, Tabs…). Sin HTML crudo, sin colores hardcoded.",
    illu: IlluSwap, color: "text-success bg-success/10",
  },
  {
    n: 6, icon: Ruler, title: "Aplicar reglas de diagramación",
    desc: "gap-1.5 entre label y campo · gap-y-1.5 entre filas · p-3 en toolbar y nav · p-4 en cards · bg-muted gap-2 p-2 en área principal.",
    illu: IlluSpacing, color: "text-warning bg-warning/10",
  },
  {
    n: 7, icon: CheckCircle2, title: "Revisar que todo esté correcto",
    desc: "Verifica: solo tokens semánticos, átomos de Julia, responsive en 3 breakpoints, tipografía Geist, cursor-pointer en elementos interactivos.",
    illu: IlluChecklist, color: "text-success bg-success/10",
  },
  {
    n: 8, icon: Sparkles, title: "Resultado final",
    desc: "La pantalla queda integrada en el visor Julia DS, registrada en screens-data.ts y con icono en el panel lateral.",
    illu: IlluResult, color: "text-primary bg-primary/10",
  },
]

// ─── Componente público ───────────────────────────────────────────────────────

export function JuliaSkillGuideButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center size-7 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
        aria-label="Cómo funciona Julia skill"
      >
        <Info className="size-3.5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:!max-w-[60vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-8 pt-6 pb-4 border-b border-border shrink-0">
            <DialogTitle className="text-base font-semibold">
              Cómo Julia crea pantallas desde un screenshot
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              8 pasos para convertir cualquier diseño en una pantalla Julia DS completa y responsive —
              ya sea dentro del visor Julia DS o en cualquier página o app externa usando los átomos y tokens de Julia.
            </p>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0" scrollbarSize="thin">
            <div className="px-8 py-6 grid grid-cols-2 gap-x-6 gap-y-6">
              {STEPS.map((step) => {
                const Icon = step.icon
                const Illu = step.illu
                return (
                  <div key={step.n} className="flex gap-4 items-start rounded-xl border border-border p-4 bg-card">

                    {/* Número + icono */}
                    <div className={cn("size-9 rounded-full flex items-center justify-center shrink-0 mt-0.5", step.color)}>
                      <Icon className="size-4" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col mb-1">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                          Paso {step.n}
                        </span>
                        <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {step.desc}
                      </p>
                      {/* Ilustración */}
                      <div className="relative h-44 rounded-lg border border-border bg-muted/20 overflow-hidden p-2">
                        <Illu />
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
