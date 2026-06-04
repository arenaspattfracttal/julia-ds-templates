"use client"

import { useState, useRef, useEffect } from "react"
import { Monitor, Tablet, Smartphone, Plus, Clock, CheckCircle2, CircleDot, ChevronsLeftRight, ChevronsRightLeft } from "lucide-react"
import { SAMPLE_SCREENS, type SampleScreen } from "./screens-data"
import { ModeToggle } from "./preview-area"
import { translations } from "./i18n"
import { useViewer } from "./viewer-context"
import { DotPattern, dotPatternStyle } from "./dot-pattern"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ScreenModeProvider, type ScreenMode } from "./screen-mode-context"

// ─── Breakpoints (shadcn / Tailwind) ─────────────────────────────────────────

type BpValue = "desktop" | "tablet" | "mobile"

const BP_OPTIONS: { value: BpValue; label: string; width: number | null }[] = [
  { value: "desktop", label: "Desktop", width: null },
  { value: "tablet",  label: "Tablet",  width: 768  },
  { value: "mobile",  label: "Mobile",  width: 390  },
]

const STATUS_META = {
  pending:       { icon: Clock,        color: "text-muted-foreground", labelKey: "statusPending" },
  "in-progress": { icon: CircleDot,    color: "text-info",             labelKey: "statusInProgress" },
  done:          { icon: CheckCircle2, color: "text-success",          labelKey: "statusDone" },
} as const

interface ScreensAreaProps {
  selectedId:        string | null
  onSelect:          (id: string | null) => void
  mode:              "light" | "dark"
  onModeChange:      (m: "light" | "dark") => void
  wideMode:          boolean
  onWideModeChange:  (v: boolean) => void
}

// ─── Sub-componentes presentacionales ─────────────────────────────────────────

function FullPageBody({ children, mode, bpWidth }: { children: React.ReactNode; mode: "light" | "dark"; bpWidth: number | null }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-2 bg-overlay/[0.18]" style={dotPatternStyle(mode, 0.06)}>
      {/* Contenedor siempre centrado — anima el ancho entre desktop/tablet/mobile */}
      <div className="flex-1 flex justify-center overflow-hidden">
        <div
          className="relative overflow-hidden rounded-[8px] border border-border/60 shadow-[0_8px_32px_oklch(0_0_0/12%)] h-full"
          style={{
            width:      bpWidth ?? "100%",
            boxSizing:  bpWidth ? "content-box" : "border-box",
            transition: "width 400ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function PreviewBody({
  selected,
  Comp,
  mode,
}: {
  selected: SampleScreen
  Comp: React.ComponentType
  mode: "light" | "dark"
}) {
  return (
    <div className="flex-1 p-6 flex flex-col overflow-hidden">
      <div className="flex-1 relative rounded-xl border border-border overflow-hidden bg-muted/50 text-foreground transition-colors duration-200 flex flex-col">
        <DotPattern mode={mode} mask="radial" />
        {selected.layout === "drawer-right" ? (
          <div className="relative flex-1 flex overflow-hidden">
            <div className="flex-1" />
            <div className="relative w-[500px] shrink-0 border-l border-border bg-background flex flex-col overflow-hidden">
              <Comp />
            </div>
          </div>
        ) : (
          <div className="relative flex-1 flex flex-col overflow-auto">
            <Comp />
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  const t = translations[useViewer().lang]
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
      <div className="flex size-16 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30">
        <Monitor className="size-7 text-muted-foreground/50" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{t.screensArea.emptyTitle}</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          {t.screensArea.emptyBodyPre}{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">screens-data.ts</code>{" "}
          {t.screensArea.emptyBodyPost}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-2 rounded-lg">
        <Plus className="size-3.5" />
        <span>{t.screensArea.shareHint}</span>
      </div>
    </div>
  )
}

function EmptyGrid({ onSelect }: { onSelect: (id: string | null) => void }) {
  return (
    <ScrollArea className="flex-1 min-h-0" scrollbarSize="thin">
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {SAMPLE_SCREENS.map((screen) => (
            <ScreenCard key={screen.id} screen={screen} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

function NoContent() {
  const t = translations[useViewer().lang]
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
        <Monitor className="size-8" />
        <span className="text-sm">{t.screensArea.noContent}</span>
      </div>
    </div>
  )
}

// Provee ScreenMode fijo (cuando hay breakpoint seleccionado) o auto-detectado
// via ResizeObserver (cuando el contenedor es libre / desktop fill).
function AdaptiveScreenModeProvider({
  children, fixedMode,
}: {
  children: React.ReactNode
  fixedMode: ScreenMode | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [autoMode, setAutoMode] = useState<ScreenMode>("desktop")

  useEffect(() => {
    if (fixedMode !== null) return
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      setAutoMode(w >= 1024 ? "desktop" : w >= 768 ? "tablet" : "mobile")
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [fixedMode])

  return (
    <ScreenModeProvider mode={fixedMode ?? autoMode}>
      <div ref={ref} className="h-full">
        {children}
      </div>
    </ScreenModeProvider>
  )
}

function BodyDispatcher({
  selected, Comp, mode, onSelect, bpWidth,
}: {
  selected: SampleScreen | undefined
  Comp: React.ComponentType | undefined
  mode: "light" | "dark"
  onSelect: (id: string | null) => void
  bpWidth: number | null
}) {
  const fixedMode: ScreenMode | null = bpWidth === 390 ? "mobile" : bpWidth === 768 ? "tablet" : null

  if (selected && Comp && selected.layout === "full-page")
    return (
      <FullPageBody mode={mode} bpWidth={bpWidth}>
        <AdaptiveScreenModeProvider fixedMode={fixedMode}>
          <Comp />
        </AdaptiveScreenModeProvider>
      </FullPageBody>
    )
  if (selected && Comp) return <PreviewBody selected={selected} Comp={Comp} mode={mode} />
  if (selected && !Comp) return <NoContent />
  if (SAMPLE_SCREENS.length === 0) return <EmptyState />
  return <EmptyGrid onSelect={onSelect} />
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ScreensArea({ selectedId, onSelect, mode, onModeChange, wideMode, onWideModeChange }: ScreensAreaProps) {
  const t = translations[useViewer().lang]
  const selected = SAMPLE_SCREENS.find((s) => s.id === selectedId)
  const Comp = selected?.component
  const [bp, setBp] = useState<BpValue>("desktop")

  const bpWidth = BP_OPTIONS.find(o => o.value === bp)?.width ?? null
  const isFullPage = selected?.layout === "full-page"

  return (
    <main className="flex-1 min-w-0 flex flex-col border-x border-border bg-background overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 shrink-0 h-[74px] flex items-center justify-between border-b border-border bg-background">
        <div>
          <h1 className="text-base font-semibold tracking-tight leading-none">
            {selected ? selected.name : t.screensArea.headerTitle}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {selected?.description ?? t.screensArea.headerSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">

          {/* ── Selector de breakpoint ── */}
          {isFullPage && (
            <ToggleGroup
              type="single"
              value={bp}
              onValueChange={v => v && setBp(v as BpValue)}
              size="sm"
              variant="outline"
              spacing={0}
            >
              {BP_OPTIONS.map(({ value, label }) => (
                <ToggleGroupItem key={value} value={value} className="gap-1.5 px-2.5 text-xs">
                  {value === "desktop" && <Monitor    className="size-3.5" />}
                  {value === "tablet"  && <Tablet     className="size-3.5" />}
                  {value === "mobile"  && <Smartphone className="size-3.5" />}
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}

          {isFullPage && (
            wideMode ? (
              <Button variant="outline" onClick={() => onWideModeChange(false)}>
                <ChevronsRightLeft className="size-4" />
                {t.screensArea.collapseView}
              </Button>
            ) : (
              <Button variant="default" onClick={() => onWideModeChange(true)}>
                <ChevronsLeftRight className="size-4" />
                {t.screensArea.expandView}
              </Button>
            )
          )}
          <ModeToggle mode={mode} onModeChange={onModeChange} />
        </div>
      </div>

      {/* ── Body ── */}
      <BodyDispatcher selected={selected} Comp={Comp} mode={mode} onSelect={onSelect} bpWidth={bpWidth} />

    </main>
  )
}

// ─── Card de grid ─────────────────────────────────────────────────────────────

function ScreenCard({ screen, onSelect }: { screen: SampleScreen; onSelect: (id: string | null) => void }) {
  const t = translations[useViewer().lang]
  const cfg = STATUS_META[screen.status]
  const StatusIcon = cfg.icon
  const Comp = screen.component

  return (
    <button
      onClick={() => onSelect(screen.id)}
      className="group text-left rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all overflow-hidden"
    >
      <div className="aspect-video bg-muted border-b overflow-hidden relative flex items-center justify-center">
        {screen.imageUrl ? (
          <img src={screen.imageUrl} alt={screen.name} className="w-full h-full object-cover" />
        ) : Comp ? (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div style={{ transform: "scale(0.45)", transformOrigin: "top left", width: "222%", height: "222%" }}>
              <Comp />
            </div>
          </div>
        ) : (
          <Monitor className="size-8 text-muted-foreground/30" />
        )}
      </div>

      <div className="p-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{screen.name}</p>
          {screen.description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{screen.description}</p>
          )}
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-medium shrink-0 ${cfg.color}`}>
          <StatusIcon className="size-3" />
          {t.screensArea[cfg.labelKey]}
        </span>
      </div>
    </button>
  )
}
