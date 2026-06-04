"use client"

import React, { useEffect, useRef, useState } from "react"
import { Copy, Check } from "lucide-react"
import { theme, spacing } from "@/theme/tokens"
import { translations, type Lang, type Translation } from "./i18n"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "./preview-area"
import { BreakpointsView } from "./breakpoints-view"

// ── Token source maps ─────────────────────────────────────────────────────────

const lightMap = Object.fromEntries(
  Object.entries(theme.light).map(([k, v]) => [`--${k}`, v as string])
)
const darkMap = Object.fromEntries(
  Object.entries(theme.dark).map(([k, v]) => [`--${k}`, v as string])
)

// ── Token data ────────────────────────────────────────────────────────────────

interface TokenDef {
  name: string
  cssVar: string
  classes: string[]
}

interface ColorGroup {
  id: string
  label: string
  tokens: TokenDef[]
}

const COLOR_GROUPS: ColorGroup[] = [
  {
    id: "base", label: "Base",
    tokens: [
      { name: "background", cssVar: "--background", classes: ["bg-background"] },
      { name: "foreground", cssVar: "--foreground", classes: ["text-foreground"] },
    ],
  },
  {
    id: "primary", label: "Primary",
    tokens: [
      { name: "primary",            cssVar: "--primary",            classes: ["bg-primary", "text-primary", "border-primary", "ring-primary"] },
      { name: "primary-foreground", cssVar: "--primary-foreground", classes: ["text-primary-foreground"] },
    ],
  },
  {
    id: "secondary", label: "Secondary",
    tokens: [
      { name: "secondary",            cssVar: "--secondary",            classes: ["bg-secondary", "text-secondary"] },
      { name: "secondary-foreground", cssVar: "--secondary-foreground", classes: ["text-secondary-foreground"] },
    ],
  },
  {
    id: "muted", label: "Muted",
    tokens: [
      { name: "muted",            cssVar: "--muted",            classes: ["bg-muted", "text-muted"] },
      { name: "muted-foreground", cssVar: "--muted-foreground", classes: ["text-muted-foreground"] },
    ],
  },
  {
    id: "accent", label: "Accent",
    tokens: [
      { name: "accent",            cssVar: "--accent",            classes: ["bg-accent", "text-accent"] },
      { name: "accent-foreground", cssVar: "--accent-foreground", classes: ["text-accent-foreground"] },
    ],
  },
  {
    id: "destructive", label: "Destructive",
    tokens: [
      { name: "destructive",            cssVar: "--destructive",            classes: ["bg-destructive", "text-destructive", "border-destructive"] },
      { name: "destructive-foreground", cssVar: "--destructive-foreground", classes: ["text-destructive-foreground"] },
    ],
  },
  {
    id: "card", label: "Card",
    tokens: [
      { name: "card",            cssVar: "--card",            classes: ["bg-card"] },
      { name: "card-foreground", cssVar: "--card-foreground", classes: ["text-card-foreground"] },
    ],
  },
  {
    id: "popover", label: "Popover",
    tokens: [
      { name: "popover",            cssVar: "--popover",            classes: ["bg-popover"] },
      { name: "popover-foreground", cssVar: "--popover-foreground", classes: ["text-popover-foreground"] },
    ],
  },
  {
    id: "border", label: "Border & Ring",
    tokens: [
      { name: "border", cssVar: "--border", classes: ["border-border"] },
      { name: "input",  cssVar: "--input",  classes: ["border-input"] },
      { name: "ring",   cssVar: "--ring",   classes: ["ring-ring", "outline-ring"] },
    ],
  },
  {
    id: "status", label: "Status",
    tokens: [
      { name: "warning",            cssVar: "--warning",            classes: ["bg-warning", "text-warning", "border-warning"] },
      { name: "warning-foreground", cssVar: "--warning-foreground", classes: ["text-warning-foreground"] },
      { name: "success",            cssVar: "--success",            classes: ["bg-success", "text-success", "border-success"] },
      { name: "success-foreground", cssVar: "--success-foreground", classes: ["text-success-foreground"] },
      { name: "info",               cssVar: "--info",               classes: ["bg-info", "text-info", "border-info"] },
      { name: "info-foreground",    cssVar: "--info-foreground",    classes: ["text-info-foreground"] },
    ],
  },
  {
    id: "charts", label: "Charts",
    tokens: [
      { name: "chart-1", cssVar: "--chart-1", classes: ["bg-chart-1", "text-chart-1", "fill-chart-1", "stroke-chart-1"] },
      { name: "chart-2", cssVar: "--chart-2", classes: ["bg-chart-2", "text-chart-2", "fill-chart-2", "stroke-chart-2"] },
      { name: "chart-3", cssVar: "--chart-3", classes: ["bg-chart-3", "text-chart-3", "fill-chart-3", "stroke-chart-3"] },
      { name: "chart-4", cssVar: "--chart-4", classes: ["bg-chart-4", "text-chart-4", "fill-chart-4", "stroke-chart-4"] },
      { name: "chart-5", cssVar: "--chart-5", classes: ["bg-chart-5", "text-chart-5", "fill-chart-5", "stroke-chart-5"] },
    ],
  },
]

// rem → px (assumes 16 px root font size)
function remToPx(rem: string): string {
  const n = parseFloat(rem)
  return isNaN(n) ? rem : `${Math.round(n * 16)}px`
}

const RADIUS_SCALE = [
  { id: "sm",  token: "--radius-sm",  tailwind: "rounded-sm",  px: 4  },
  { id: "md",  token: "--radius-md",  tailwind: "rounded-md",  px: 6  },
  { id: "lg",  token: "--radius-lg",  tailwind: "rounded-lg",  px: 8  },
  { id: "xl",  token: "--radius-xl",  tailwind: "rounded-xl",  px: 12 },
  { id: "2xl", token: "--radius-2xl", tailwind: "rounded-2xl", px: 16 },
  { id: "3xl", token: "--radius-3xl", tailwind: "rounded-3xl", px: 20 },
  { id: "4xl", token: "--radius-4xl", tailwind: "rounded-4xl", px: 24 },
]

const FONT_FAMILIES = [
  {
    cssVar:   "--font-sans",
    tailwind: "font-sans",
    label:    "Sans-serif",
    value:    "Inter",
    sample:   "The quick brown fox jumps over the lazy dog",
    style:    { fontFamily: "var(--font-sans)" },
  },
  {
    cssVar:   "--font-mono",
    tailwind: "font-mono",
    label:    "Monospace",
    value:    "Geist Mono",
    sample:   "const hello = () => 'world'",
    style:    { fontFamily: "var(--font-mono)" },
  },
  {
    cssVar:   "--font-heading",
    tailwind: "font-heading",
    label:    "Heading",
    value:    "var(--font-sans)",
    sample:   "Heading typeface alias",
    style:    { fontFamily: "var(--font-heading)" },
  },
]

const TYPOGRAPHY_STYLES = [
  { name: "H1",         label: "Heading 1",     el: "h1",         fontSize: "2.25rem",  classes: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",                          sample: "Taxing Laughter: The Joke Tax Chronicles" },
  { name: "H2",         label: "Heading 2",     el: "h2",         fontSize: "1.875rem", classes: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",               sample: "The People of the Kingdom" },
  { name: "H3",         label: "Heading 3",     el: "h3",         fontSize: "1.5rem",   classes: "scroll-m-20 text-2xl font-semibold tracking-tight",                                        sample: "The Joke Tax" },
  { name: "H4",         label: "Heading 4",     el: "h4",         fontSize: "1.25rem",  classes: "scroll-m-20 text-xl font-semibold tracking-tight",                                         sample: "People stopped telling jokes" },
  { name: "p",          label: "Paragraph",     el: "p",          fontSize: "1rem",     classes: "leading-7",                                                                                 sample: "The king, seeing how much he was feared, sent tax collectors to every corner of his realm to collect the joke tax." },
  { name: "Lead",       label: "Lead",          el: "p",          fontSize: "1.25rem",  classes: "text-xl text-muted-foreground",                                                             sample: "A modal dialog that interrupts the user with important content." },
  { name: "Large",      label: "Large",         el: "div",        fontSize: "1.125rem", classes: "text-lg font-semibold",                                                                     sample: "Are you absolutely sure?" },
  { name: "Small",      label: "Small",         el: "small",      fontSize: "0.875rem", classes: "text-sm font-medium leading-none",                                                          sample: "Email address" },
  { name: "Muted",      label: "Muted",         el: "p",          fontSize: "0.875rem", classes: "text-sm text-muted-foreground",                                                             sample: "Enter your email address." },
  { name: "Code",       label: "Inline code",   el: "code",       fontSize: "0.875rem", classes: "relative rounded bg-muted px-[5px] py-[3px] font-mono text-sm font-semibold",         sample: "@radix-ui/react-alert-dialog" },
  { name: "Blockquote", label: "Blockquote",    el: "blockquote", fontSize: "1rem",     classes: "mt-6 border-l-2 pl-6 italic",                                                               sample: "After all, everyone enjoys a good joke, so it's only fair that they should pay for the privilege." },
  { name: "List",       label: "List",          el: "ul",         fontSize: "1rem",     classes: "my-6 ml-6 list-disc [&>li]:mt-2",                                                           sample: "1st level of puns: 5 gold coins\n2nd level of jokes: 10 gold coins\n3rd level of humor: 20 gold coins" },
]

// ── Copy chip ─────────────────────────────────────────────────────────────────

function CopyChip({ label, t }: { label: string; t: Translation }) {
  const [copied, setCopied] = useState(false)

  function copy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(label).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      onClick={copy}
      title={`${t.tokenView.copyTitle} "${label}"`}
      className={cn(
        "font-mono text-[10px] px-1.5 py-0.5 rounded border transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0",
        copied
          ? "bg-success/10 border-success/40 text-success"
          : "bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {copied ? t.tokenView.copiedShort : label}
    </button>
  )
}

// ── Hex conversion via canvas ─────────────────────────────────────────────────

function cssColorToHex(color: string): string {
  try {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext("2d")
    if (!ctx) return color
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  } catch {
    return color
  }
}

// ── Clickable swatch ──────────────────────────────────────────────────────────

function Swatch({ color, label, t }: { color: string; label: string; t: Translation }) {
  const [hex, setHex] = useState<string | null>(null)

  function handleClick() {
    const h = cssColorToHex(color)
    navigator.clipboard.writeText(h).catch(() => {})
    setHex(h)
    setTimeout(() => setHex(null), 1500)
  }

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <button
        onClick={handleClick}
        title={`${t.tokenView.copyHexTitle} ${label}`}
        className={cn(
          "group/swatch relative w-12 h-10 rounded-md border border-black/20 dark:border-white/20",
          "transition-all duration-150 cursor-pointer hover:scale-105 hover:shadow-md active:scale-95",
        )}
        style={{ backgroundColor: color }}
      >
        {/* Hover: copy icon */}
        {!hex && (
          <span className="absolute inset-0 flex items-center justify-center rounded-md bg-overlay/25 opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-150">
            <Copy className="size-3.5 text-white drop-shadow" />
          </span>
        )}
        {/* Copied: check icon */}
        {hex && (
          <span className="absolute inset-0 flex items-center justify-center rounded-md bg-overlay/30">
            <Check className="size-4 text-white drop-shadow" strokeWidth={2.5} />
          </span>
        )}
      </button>
      <span className={cn(
        "text-[10px] leading-none font-mono transition-colors duration-150",
        hex ? "text-foreground font-semibold" : "text-muted-foreground"
      )}>
        {hex ?? label}
      </span>
    </div>
  )
}

// ── Swatch pair: light + dark separated ──────────────────────────────────────

function SwatchPair({ lightColor, darkColor, t }: { lightColor: string; darkColor: string; t: Translation }) {
  return (
    <div className="flex gap-2 shrink-0">
      <Swatch color={lightColor} label={t.lightMode} t={t} />
      <Swatch color={darkColor} label={t.darkMode} t={t} />
    </div>
  )
}

// ── Section anchor ────────────────────────────────────────────────────────────

export const TOKEN_SECTIONS = [
  { id: "colors" },
  { id: "radius" },
  { id: "typography" },
  { id: "spacing" },
] as const

// ── Spacing data ──────────────────────────────────────────────────────────────

const SEMANTIC_SPACING = [
  { token: "space-form",    px: "6px",  tailwind: "gap-1.5 · gap-y-1.5", use: "Label→campo y campo→campo. REGLA FIJA." },
  { token: "space-base",    px: "8px",  tailwind: "p-2 · gap-2",         use: "Área principal, nav, gaps de layout." },
  { token: "space-section", px: "12px", tailwind: "p-3 · gap-3",         use: "Padding de toolbars, nav y entre secciones." },
  { token: "space-card",    px: "16px", tailwind: "p-4",                 use: "Padding cards de formulario." },
]

const NUMERIC_SPACING = Object.entries(spacing)
  .filter(([k]) => k.startsWith("space-") && !isNaN(Number(k.replace("space-", "").replace("-", "."))))
  .map(([k, v]) => ({
    token: k,
    px: v as string,
    tailwind: k.replace("space-", "").replace("-", "."),
  }))

export type TokenSectionId = (typeof TOKEN_SECTIONS)[number]["id"]

// ── Main component ────────────────────────────────────────────────────────────

export function TokenView({
  lang,
  activeSection,
  mode,
  onModeChange,
}: {
  lang: Lang
  activeSection: TokenSectionId | "breakpoints" | null
  mode: "light" | "dark"
  onModeChange: (m: "light" | "dark") => void
}) {
  const t = translations[lang]
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Partial<Record<TokenSectionId, HTMLElement | null>>>({})

  useEffect(() => {
    if (!activeSection || activeSection === "breakpoints" || !scrollRef.current) return
    const el = sectionRefs.current[activeSection as TokenSectionId]
    if (el) scrollRef.current.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" })
  }, [activeSection])

  return (
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden border-l border-border bg-background">
      {/* Header */}
      <div className="px-10 h-[74px] shrink-0 flex items-center justify-between border-b border-border">
        <div>
          <h1 className="text-base font-semibold tracking-tight leading-none">
            {activeSection === "breakpoints" ? "Breakpoints" : t.tokenView.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeSection === "breakpoints"
              ? "Sistema de puntos de quiebre de Tailwind CSS v4 — los mismos que usa shadcn/ui."
              : t.tokenView.subtitle}
          </p>
        </div>
        <ModeToggle mode={mode} onModeChange={onModeChange} />
      </div>

      {/* Scrollable body */}
      <ScrollArea className="flex-1 min-h-0" scrollbarSize="thin" viewportRef={activeSection === "breakpoints" ? undefined : scrollRef}>
        <div className="px-10 py-6 max-w-6xl mx-auto flex flex-col gap-10">
          {activeSection === "breakpoints" && <BreakpointsView />}
          {activeSection !== "breakpoints" && <>

          {/* ── Colors ── */}
          <section ref={(el) => { sectionRefs.current.colors = el }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-muted-foreground">
              {t.tokenView.colorsTitle}
            </h2>

            <div className="flex items-center gap-4 px-2 mb-1">
              <div className="shrink-0 w-[112px]" />
              <span className="text-[10px] font-semibold w-44 shrink-0 text-muted-foreground">{t.tokenView.colToken}</span>
              <span className="text-[10px] font-semibold w-56 shrink-0 text-muted-foreground">{t.tokenView.colCssVar}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{t.tokenView.colTailwind}</span>
            </div>

            <div className="flex flex-col gap-5">
              {COLOR_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-1 text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {group.tokens.map((token) => (
                      <div
                        key={token.name}
                        className="flex items-center gap-4 px-2 py-1.5 rounded-md transition-colors hover:bg-muted/50"
                      >
                        <SwatchPair
                          lightColor={lightMap[token.cssVar] ?? "transparent"}
                          darkColor={darkMap[token.cssVar]  ?? "transparent"}
                          t={t}
                        />
                        <span className="text-sm font-mono w-44 truncate shrink-0 text-foreground">
                          {token.name}
                        </span>
                        <div className="w-56 shrink-0">
                          <CopyChip label={token.cssVar} t={t} />
                        </div>
                        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                          {token.classes.map((cls) => (
                            <CopyChip key={cls} label={cls} t={t} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator className="bg-border" />

          {/* ── Radius ── */}
          <section ref={(el) => { sectionRefs.current.radius = el }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-muted-foreground">
              {t.tokenView.radiusTitle}
            </h2>

            <div className="flex flex-wrap gap-6">
              {RADIUS_SCALE.map((r) => (
                <div key={r.id} className="flex flex-col items-center gap-3">
                  <div
                    className="size-14 border bg-muted border-border"
                    style={{ borderRadius: `${r.px}px` }}
                  />
                  <div className="flex flex-col items-center gap-1">
                    <CopyChip label={r.token} t={t} />
                    <CopyChip label={r.tailwind} t={t} />
                    <span className="text-[10px] font-mono text-muted-foreground">{r.px}px</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator className="bg-border" />

          {/* ── Typography ── */}
          <section ref={(el) => { sectionRefs.current.typography = el }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-muted-foreground">
              {t.tokenView.typographyTitle}
            </h2>

            {/* Font families */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
                {t.tokenView.fontFamilies}
              </p>
              <div className="flex flex-col gap-2">
                {FONT_FAMILIES.map((f) => (
                  <div
                    key={f.cssVar}
                    className="flex items-center gap-4 px-4 py-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-32 shrink-0 flex flex-col gap-1">
                      <CopyChip label={f.cssVar} t={t} />
                      <CopyChip label={f.tailwind} t={t} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={f.style} className="text-base text-foreground truncate">
                        {f.sample}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold text-foreground">{f.label}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Type scale */}
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
              {t.tokenView.typeScale}
            </p>
            <div className="flex flex-col gap-3">
              {TYPOGRAPHY_STYLES.map((style) => {
                const El = style.el as keyof React.JSX.IntrinsicElements
                return (
                  <div key={style.name} className="px-4 py-4 rounded-md border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{style.label}</span>
                      <code className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-mono">&lt;{style.el}&gt;</code>
                      <span className="text-[10px] font-mono text-muted-foreground">{style.fontSize}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">·</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{remToPx(style.fontSize)}</span>
                    </div>
                    {style.el === "ul" ? (
                      <El className={cn(style.classes, "text-foreground")}>
                        {style.sample.split("\n").map((item, i) => <li key={i}>{item}</li>)}
                      </El>
                    ) : (
                      <El className={cn(style.classes, "text-foreground")}>{style.sample}</El>
                    )}
                    <div className="mt-3 pt-3 border-t border-border">
                      <CopyChip label={style.classes} t={t} />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <Separator className="bg-border" />

          {/* ── Spacing ── */}
          <section ref={(el) => { sectionRefs.current.spacing = el }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-muted-foreground">
              Spacing
            </h2>

            {/* Semánticos */}
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
              Tokens semánticos
            </p>
            <div className="flex flex-col gap-0.5 mb-8">
              {SEMANTIC_SPACING.map((s) => (
                <div key={s.token} className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                  {/* Barra visual */}
                  <div className="shrink-0 w-24 flex items-center">
                    <div className="h-5 rounded-sm bg-primary/20 border border-primary/30" style={{ width: s.px }} />
                  </div>
                  {/* Token */}
                  <div className="w-40 shrink-0">
                    <CopyChip label={`--${s.token}`} t={t} />
                  </div>
                  {/* px */}
                  <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">{s.px}</span>
                  {/* Tailwind */}
                  <div className="w-44 shrink-0">
                    <CopyChip label={s.tailwind} t={t} />
                  </div>
                  {/* Uso */}
                  <span className="text-xs text-muted-foreground flex-1 min-w-0">{s.use}</span>
                </div>
              ))}
            </div>

            {/* Escala numérica */}
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
              Escala numérica (1 unidad = 4px)
            </p>
            <div className="flex flex-col gap-0.5">
              {NUMERIC_SPACING.map((s) => (
                <div key={s.token} className="flex items-center gap-4 px-3 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="shrink-0 w-24 flex items-center">
                    <div className="h-4 rounded-sm bg-muted-foreground/20 border border-border" style={{ width: `min(${s.px}, 96px)` }} />
                  </div>
                  <div className="w-40 shrink-0">
                    <CopyChip label={`--${s.token}`} t={t} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">{s.px}</span>
                  <div className="w-24 shrink-0">
                    <CopyChip label={s.tailwind} t={t} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="h-8" />
          </>}
        </div>
      </ScrollArea>
    </main>
  )
}
