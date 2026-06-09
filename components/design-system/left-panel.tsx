"use client"

import { useState, useEffect, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Palette, Layers, Shapes, ChevronDown, PuzzleIcon, Home, Search, X, Braces,
  // Component item icons
  ChevronsUpDown, AlertCircle, AlertTriangle, BellRing,
  AppWindow, Menu, CircleUser, Tag,
  MousePointerClick, Calendar, CheckSquare, TextCursorInput,
  Gauge, CircleDot, ListFilter, SlidersHorizontal, ToggleLeft,
  LayoutDashboard, AlignLeft, Info, Columns3, Navigation,
  // Icon category icons
  LayoutGrid, ArrowRight, FolderOpen, Circle, Type, BarChart2, MessageSquare,
  Clock, Play, MapPin, User, Shield, Code2, Monitor, Leaf, Utensils,
  DollarSign, Wrench, Heart, Building2, BookOpen, Calculator,
  ShoppingBag, Share2, Gamepad2, Sparkles, Box,
  Pipette, Radius, CaseSensitive,
  GalleryHorizontal,
  RectangleEllipsis,
  CreditCard, MousePointer, MoreHorizontal,
  ScrollText, Minus, Table2, Power,
  PanelLeft as PanelLeftIcon,
  PanelTop,
  LayoutTemplate,
  PanelRight,
  Settings, ClipboardList, Users, Wifi, Download, Receipt, UserRound,
} from "lucide-react"
import { categorizedComponents } from "./registry"
import { SAMPLE_SCREENS } from "./screens-data"
import { JuliaSkillGuideButton } from "./julia-skill-guide"
import type { SampleScreen } from "./screens-data"
import { CATEGORY_COUNTS } from "./icon-categories"
import { translations } from "./i18n"
import { TOKEN_SECTIONS, type TokenSectionId } from "./token-view"
import { useViewer } from "./viewer-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// ─── Component groups ────────────────────────────────────────────────────────

interface CompGroup {
  id: string
  label: string
  ids: string[]
}

const COMP_GROUPS: CompGroup[] = [
  {
    id: "feedback",
    label: "Feedback",
    ids: ["alert", "alert-dialog", "sonner", "tooltip"],
  },
  {
    id: "overlay",
    label: "Overlay",
    ids: ["dialog", "dropdown-menu", "hover-card", "popover"],
  },
  {
    id: "form",
    label: "Form & Inputs",
    ids: ["button", "button-group", "calendar", "date-picker", "checkbox", "input", "label", "radio-group", "select", "slider", "switch", "textarea", "toggle", "toggle-group"],
  },
  {
    id: "display",
    label: "Display",
    ids: ["accordion", "avatar", "badge", "breadcrumb", "card", "carousel", "dots", "pagination", "progress", "skeleton", "table", "data-table", "tabs", "tree"],
  },
  {
    id: "layout",
    label: "Layout",
    ids: ["collapsible", "scroll-area", "separator"], // sidebar: WIP, oculto temporalmente
  },
]

// Icon per component id
const COMP_ITEM_ICONS: Record<string, LucideIcon> = {
  carousel:       GalleryHorizontal,
  breadcrumb:     Navigation,
  accordion:      ChevronsUpDown,
  alert:          AlertCircle,
  "alert-dialog": AlertTriangle,
  sonner:         BellRing,
  dialog:         AppWindow,
  "dropdown-menu": Menu,
  avatar:         CircleUser,
  badge:          Tag,
  button:         MousePointerClick,
  "button-group": LayoutGrid,
  calendar:       Calendar,
  "date-picker":  Calendar,
  checkbox:       CheckSquare,
  input:          TextCursorInput,
  progress:       Gauge,
  "radio-group":  CircleDot,
  select:         ListFilter,
  slider:         SlidersHorizontal,
  switch:         ToggleLeft,
  tabs:           LayoutDashboard,
  textarea:        AlignLeft,
  tooltip:         Info,
  "toggle-group":  Columns3,
  skeleton:        RectangleEllipsis,
  card:            CreditCard,
  collapsible:     ChevronsUpDown,
  "hover-card":    MousePointer,
  label:           Type,
  pagination:      MoreHorizontal,
  popover:         MessageSquare,
  "scroll-area":   ScrollText,
  separator:       Minus,
  table:           Table2,
  "data-table":    Table2,
  toggle:          Power,
  sidebar:         PanelLeftIcon,
  tree:            FolderOpen,
  dots:            MoreHorizontal,
}

// ─── Screen item → icon mapping ──────────────────────────────────────────────

const SCREEN_ITEM_ICONS: Record<string, LucideIcon> = {
  "dialog-variants": AppWindow,
  "topbar":          PanelTop,
  "app-sidebar":     PanelLeftIcon,
  "toolbar":         LayoutTemplate,
  "drawer-tarea":    PanelRight,
  "kanban-card-ot":  Columns3,
  "kanban-screen":           Columns3,
  "user-menu":               User,
  "configuracion-modulo-completo": Settings,
  "tareas-pendientes":             ClipboardList,
  "vista-arbol":             FolderOpen,
  "detalle-medidor":         Wifi,
  "presupuesto-detalle":     Receipt,
  "detalle-empleado":        UserRound,
  // Estructuras
  "layout-kanban":             Columns3,
  "layout-configuracion":      Settings,
  "layout-tareas-pendientes":  ClipboardList,
  "layout-cuentas-usuarios":   Users,
  "layout-detalle-medidor":    Wifi,
  "layout-vista-arbol":        FolderOpen,
}

// ─── Token section → icon mapping ────────────────────────────────────────────

const _TOKEN_SECTION_ICONS: Record<string, LucideIcon> = {
  colors:     Pipette,
  radius:     Radius,
  typography: CaseSensitive,
}

// ─── Icon category → icon mapping ────────────────────────────────────────────

const ICON_CATEGORY_ICONS: Record<string, LucideIcon> = {
  arrows:    ArrowRight,
  files:     FolderOpen,
  shapes:    Circle,
  text:      Type,
  layout:    LayoutGrid,
  charts:    BarChart2,
  comms:     MessageSquare,
  datetime:  Clock,
  media:     Play,
  maps:      MapPin,
  users:     User,
  security:  Shield,
  dev:       Code2,
  devices:   Monitor,
  nature:    Leaf,
  food:      Utensils,
  finance:   DollarSign,
  tools:     Wrench,
  health:    Heart,
  buildings: Building2,
  education: BookOpen,
  math:      Calculator,
  shopping:  ShoppingBag,
  social:    Share2,
  games:     Gamepad2,
  zodiac:    Sparkles,
  other:     Box,
}

// ─── Reusable nav primitives ───────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  label,
  expanded,
  onToggle,
}: {
  icon: LucideIcon
  label: string
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="group w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors cursor-pointer hover:bg-sidebar-accent"
    >
      <Icon className="size-3.5 shrink-0 text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70" />
      <span className="flex-1 text-left text-sm font-medium text-sidebar-foreground/80 group-hover:text-sidebar-foreground">
        {label}
      </span>
      <ChevronDown className={cn(
        "size-3.5 text-sidebar-foreground/30 shrink-0 transition-transform duration-200",
        expanded ? "rotate-180" : "rotate-0",
      )} />
    </button>
  )
}

function NavItem({
  icon: Icon,
  label,
  selected,
  onClick,
  trailing,
}: {
  icon?: LucideIcon
  label: string
  selected: boolean
  onClick: () => void
  trailing?: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
        selected
          ? "bg-primary text-primary-foreground font-medium"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
      )}
    >
      {Icon && (
        <Icon className={cn(
          "size-3.5 shrink-0",
          selected ? "text-primary-foreground" : "text-sidebar-foreground/30",
        )} />
      )}
      <span className="flex-1">{label}</span>
      {trailing}
    </button>
  )
}

function CountBadge({ count, selected }: { count: number; selected: boolean }) {
  return (
    <span className={cn(
      "text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0",
      selected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-sidebar-accent text-sidebar-foreground/40",
    )}>
      {count}
    </span>
  )
}

// ─── PantallasNav ─────────────────────────────────────────────────────────────

interface PantallasNavProps {
  pantallasGroups: Record<string, SampleScreen[]>
  screensOpen: boolean
  screensSelectedId: string | null
  onSelect: (id: string) => void
}

function PantallasNav({ pantallasGroups, screensOpen, screensSelectedId, onSelect }: PantallasNavProps) {
  const allScreens = Object.values(pantallasGroups).flat()
  return (
    <ul className="mt-1 flex flex-col gap-0.5 pl-3">
      {allScreens.map((screen) => (
        <li key={screen.id}>
          <NavItem
            icon={SCREEN_ITEM_ICONS[screen.id] ?? AppWindow}
            label={screen.name}
            selected={screensOpen && screensSelectedId === screen.id}
            onClick={() => onSelect(screen.id)}
          />
        </li>
      ))}
    </ul>
  )
}

// ─── IconsNav ─────────────────────────────────────────────────────────────────

function IconsNav({
  selectedIconCategory,
  onIconCategorySelect,
  totalIcons,
  allLabel,
}: {
  selectedIconCategory: string | null
  onIconCategorySelect: (id: string | null) => void
  totalIcons: number
  allLabel: string
}) {
  return (
    <ul className="space-y-0.5">
      <li>
        <NavItem
          icon={Shapes}
          label={allLabel}
          selected={selectedIconCategory === null}
          onClick={() => onIconCategorySelect(null)}
          trailing={<CountBadge count={totalIcons} selected={selectedIconCategory === null} />}
        />
      </li>

      {CATEGORY_COUNTS.map(({ id, label, count }) => (
        <li key={id}>
          <NavItem
            icon={ICON_CATEGORY_ICONS[id] ?? Box}
            label={label}
            selected={selectedIconCategory === id}
            onClick={() => onIconCategorySelect(id)}
            trailing={<CountBadge count={count} selected={selectedIconCategory === id} />}
          />
        </li>
      ))}
    </ul>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function LeftPanel() {
  const {
    view, setView, selectedId, selectComponent, lang, setLang,
    iconCategory, setIconCategory, iconQuery, setIconQuery,
    compositorOpen, toggleCompositor,
    screensOpen, screensSelectedId, selectScreen,
    tokenSection, setTokenSection, wideMode, overviewOpen, openOverview,
  } = useViewer()
  const collapsed = screensOpen && wideMode

  // ── Modo compacto (página en tablet: 768-1023px) ─────────────────────────
  const isIconOnly = false

  // ── Datos base (antes de hooks que los usan) ─────────────────────────────
  const allComps = Object.values(categorizedComponents).flat()
  const compById = Object.fromEntries(allComps.map((c) => [c.id, c]))

  // ── Home search ──────────────────────────────────────────────────────────
  const [homeQuery, setHomeQuery] = useState("")

  // Reset home search when leaving inicio view
  useEffect(() => { if (view !== "inicio") setHomeQuery("") }, [view])

  const _hq = homeQuery.trim().toLowerCase()
  const homeResults = !_hq ? null : [
    ...allComps
      .filter((c) => c.name.toLowerCase().includes(_hq) || c.id.toLowerCase().includes(_hq))
      .map((c) => ({ kind: "atom" as const, id: c.id, name: c.name })),
    ...SAMPLE_SCREENS
      .filter((s) => s.section !== "estilos" && (
        s.name.toLowerCase().includes(_hq) ||
        (s.description ?? "").toLowerCase().includes(_hq)
      ))
      .map((s) => ({ kind: "screen" as const, id: s.id, name: s.name })),
  ]
  const t = translations[lang]
  const totalIcons = CATEGORY_COUNTS.reduce((acc, c) => acc + c.count, 0)
  const [componentsExpanded, setComponentsExpanded] = useState(false)
  const [screensExpanded, setScreensExpanded] = useState(false)
  const [pantallasExpanded, setPantallasExpanded] = useState(false)
  const [layoutsExpanded, setLayoutsExpanded] = useState(true)

  const componenteScreens = SAMPLE_SCREENS.filter((s) => s.section !== "pantallas" && s.section !== "estilos")
  const pantallasScreens  = SAMPLE_SCREENS.filter((s) => s.section === "pantallas")
  const estilosScreens    = SAMPLE_SCREENS.filter((s) => s.section === "estilos")

  const pantallasGroups = pantallasScreens.reduce<Record<string, SampleScreen[]>>((acc, s) => {
    const key = s.group ?? t.leftPanel.general
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  const _tokenSectionLabels: Record<TokenSectionId, string> = {
    colors: t.tokenView.sectionColors,
    radius: t.tokenView.sectionRadius,
    typography: t.tokenView.sectionTypography,
    spacing: t.tokenView.sectionSpacing,
  }

  return (
    <aside className={cn(
      "dark shrink-0 flex flex-col bg-sidebar text-sidebar-foreground overflow-hidden",
      "transition-[width,min-width,max-width,opacity] duration-300 ease-in-out",
      collapsed
        ? "w-0 min-w-0 max-w-0 opacity-0"
        : isIconOnly
          ? "w-[60px] min-w-[60px] max-w-[60px] opacity-100"
          : "w-1/5 min-w-[290px] max-w-[380px] opacity-100"
    )}>

      {/* Brand header */}
      <div className={cn(
        "border-b border-sidebar-border h-[74px] flex items-center shrink-0",
        isIconOnly ? "justify-center px-2" : "justify-between px-4"
      )}>
        <div className="flex items-center gap-2">
          <img src="/isotipo.svg" alt="Fracttal" className="size-[42px] shrink-0" />
          {!isIconOnly && (
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold leading-none text-sidebar-foreground">Julia</p>
              <p className="text-sm leading-none text-sidebar-foreground/40">Design System</p>
            </div>
          )}
        </div>
        {!isIconOnly && (
          <div className="flex items-center gap-1">
            <JuliaSkillGuideButton />
            <Popover>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md border border-sidebar-foreground/20 text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:border-sidebar-foreground/40 transition-colors shrink-0 cursor-pointer">
                  <Download className="size-3.5" />
                  Skill
                </button>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="w-[340px] p-4 flex flex-col gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Instalar Julia skill</p>
                  <p className="text-xs text-muted-foreground">Ejecuta en tu terminal para instalar el skill en Claude Code.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Windows (PowerShell)</p>
                  <button
                    onClick={() => navigator.clipboard.writeText('iex (irm "https://fracttal-tech-s-l.github.io/Julia-Design-System/install-julia-skill.ps1")')}
                    className="text-left font-mono text-xs bg-muted rounded-md px-3 py-2 text-foreground hover:bg-muted/80 transition-colors cursor-pointer break-all"
                  >
                    iex (irm "https://…/install-julia-skill.ps1")
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">macOS / Linux</p>
                  <button
                    onClick={() => navigator.clipboard.writeText('bash <(curl -s "https://fracttal-tech-s-l.github.io/Julia-Design-System/install-julia-skill.sh")')}
                    className="text-left font-mono text-xs bg-muted rounded-md px-3 py-2 text-foreground hover:bg-muted/80 transition-colors cursor-pointer break-all"
                  >
                    bash &lt;(curl -s "https://…/install-julia-skill.sh")
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground">Haz clic en el comando para copiarlo.</p>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Bloque fijo: tabs + buscador contextual */}
      <div className={cn("flex flex-col gap-3 shrink-0", isIconOnly ? "p-2" : "p-3")}>
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList className="w-full !h-fit">
            <TabsTrigger value="inicio" className={cn("flex-1 flex-col gap-1 text-xs py-2", isIconOnly && "px-2.5")}>
              <Home className="size-3.5" />
              {!isIconOnly && t.inicio}
            </TabsTrigger>
            <TabsTrigger value="tokens" className={cn("flex-1 flex-col gap-1 text-xs py-2", isIconOnly && "px-2.5")}>
              <Palette className="size-3.5" />
              {!isIconOnly && t.tokens}
            </TabsTrigger>
            <TabsTrigger value="icons" className={cn("flex-1 flex-col gap-1 text-xs py-2", isIconOnly && "px-2.5")}>
              <Shapes className="size-3.5" />
              {!isIconOnly && t.icons}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Buscador home */}
        {!isIconOnly && view === "inicio" && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-sidebar-foreground/40 pointer-events-none" />
            <Input
              value={homeQuery}
              onChange={(e) => setHomeQuery(e.target.value)}
              placeholder="Buscar átomos, pantallas…"
              className="pl-8 h-8 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus-visible:ring-sidebar-ring"
            />
            {homeQuery && (
              <button
                onClick={() => setHomeQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sidebar-foreground/40 hover:text-sidebar-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Buscador iconos */}
        {!isIconOnly && view === "icons" && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-sidebar-foreground/40 pointer-events-none" />
            <Input
              value={iconQuery}
              onChange={(e) => setIconQuery(e.target.value)}
              placeholder={t.searchIcons}
              className="pl-8 h-8 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus-visible:ring-sidebar-ring"
            />
            {iconQuery && (
              <button
                onClick={() => setIconQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sidebar-foreground/40 hover:text-sidebar-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Separator full-width bajo el bloque superior */}
      {!isIconOnly && <div className="h-px bg-sidebar-border shrink-0" />}

      {/* Navigation content */}
      <ScrollArea className="flex-1 min-h-0" scrollbarSize="thin">
      <nav className={cn("flex flex-col gap-2", isIconOnly ? "p-2 items-center" : "p-3")}>

        {/* ── Inicio view ── */}
        {view === "inicio" && isIconOnly && (
          <div className="flex flex-col gap-1 items-center">
            <button onClick={openOverview} className={cn("size-8 rounded-md flex items-center justify-center cursor-pointer transition-colors", overviewOpen ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground")}>
              <Home className="size-4" />
            </button>
            <button onClick={() => setComponentsExpanded((v) => !v)} className="size-8 rounded-md flex items-center justify-center text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer transition-colors">
              <Layers className="size-4" />
            </button>
            <button onClick={() => setScreensExpanded((v) => !v)} className="size-8 rounded-md flex items-center justify-center text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer transition-colors">
              <Monitor className="size-4" />
            </button>
            <button onClick={() => setPantallasExpanded((v) => !v)} className="size-8 rounded-md flex items-center justify-center text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer transition-colors">
              <LayoutTemplate className="size-4" />
            </button>
          </div>
        )}

        {view === "inicio" && !isIconOnly && (
          <div className="flex flex-col gap-2">

            {/* Search results */}
            {homeResults !== null ? (
              <div className="flex flex-col gap-1">
                {homeResults.length === 0 ? (
                  <p className="px-2 py-4 text-xs text-sidebar-foreground/40 text-center">Sin resultados</p>
                ) : (
                  homeResults.map((r) => (
                    <NavItem
                      key={r.id}
                      icon={r.kind === "atom" ? (COMP_ITEM_ICONS[r.id] ?? Layers) : (SCREEN_ITEM_ICONS[r.id] ?? AppWindow)}
                      label={r.name}
                      selected={r.kind === "atom" ? (selectedId === r.id && !compositorOpen) : (screensOpen && screensSelectedId === r.id)}
                      onClick={() => {
                        if (r.kind === "atom") selectComponent(r.id)
                        else selectScreen(r.id)
                        setHomeQuery("")
                      }}
                    />
                  ))
                )}
              </div>
            ) : (
              <>

            {/* Overview home link */}
            <button
              onClick={openOverview}
              className={cn(
                "group w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
                overviewOpen
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Home className={cn("size-3.5 shrink-0", overviewOpen ? "text-primary-foreground" : "text-sidebar-foreground/30")} />
              <span className="flex-1">Overview</span>
            </button>

            {/* Átomos (expandable) */}
            <div>
              <SectionHeader
                icon={Layers}
                label={t.leftPanel.atoms}
                expanded={componentsExpanded}
                onToggle={() => setComponentsExpanded((v) => !v)}
              />

              {componentsExpanded && (
                <div className="mt-1 flex flex-col gap-1">
                  {COMP_GROUPS.map((group, i) => {
                    const items = group.ids.map((id) => compById[id]).filter(Boolean)
                    return (
                      <div key={group.id}>
                        {i > 0 && <div className="h-px bg-sidebar-border mx-2 my-1" />}
                        <p className="px-2 py-1.5 text-[10px] font-medium text-sidebar-foreground/40">
                          {group.label}
                        </p>
                        <ul className="flex flex-col gap-0.5 pl-3">
                          {items.map((comp) => (
                            <li key={comp.id}>
                              <NavItem
                                icon={COMP_ITEM_ICONS[comp.id]}
                                label={comp.name}
                                selected={selectedId === comp.id && !compositorOpen}
                                onClick={() => selectComponent(comp.id)}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Componentes (expandible) */}
            <div>
              <SectionHeader
                icon={Monitor}
                label={t.leftPanel.components}
                expanded={screensExpanded}
                onToggle={() => setScreensExpanded((v) => !v)}
              />

              {screensExpanded && (
                <ul className="mt-1 flex flex-col gap-0.5 pl-3">
                  {componenteScreens.map((screen) => (
                    <li key={screen.id}>
                      <NavItem
                        icon={SCREEN_ITEM_ICONS[screen.id] ?? AppWindow}
                        label={screen.name}
                        selected={screensOpen && screensSelectedId === screen.id}
                        onClick={() => selectScreen(screen.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pantallas (expandible) */}
            {pantallasScreens.length > 0 && (
              <div>
                <SectionHeader
                  icon={LayoutTemplate}
                  label={t.leftPanel.screens}
                  expanded={pantallasExpanded}
                  onToggle={() => setPantallasExpanded((v) => !v)}
                />

                {pantallasExpanded && (
                  <PantallasNav
                    pantallasGroups={pantallasGroups}
                    screensOpen={screensOpen}
                    screensSelectedId={screensSelectedId}
                    onSelect={selectScreen}
                  />
                )}
              </div>
            )}

            {/* Compositor — oculto temporalmente (cambiar a true para mostrar) */}
            {(false as boolean) && (
              <NavItem
                icon={PuzzleIcon}
                label={t.leftPanel.compositor}
                selected={compositorOpen}
                onClick={() => toggleCompositor(true)}
                trailing={
                  <span className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0",
                    compositorOpen ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/20 text-primary",
                  )}>{t.leftPanel.beta}</span>
                }
              />
            )}

              </>
            )}

          </div>
        )}

        {/* ── Estilos view (Tokens + Breakpoints + Layouts) ── */}
        {view === "tokens" && (
          <div className="flex flex-col gap-2">

            {/* Tokens — item único */}
            <NavItem
              icon={Braces}
              label={t.leftPanel.tokensSection}
              selected={TOKEN_SECTIONS.some(({ id }) => tokenSection === id)}
              onClick={() => setTokenSection("colors")}
            />

            {/* Breakpoints — item único */}
            <NavItem
              icon={Monitor}
              label={t.leftPanel.breakpointsSection}
              selected={tokenSection === "breakpoints"}
              onClick={() => setTokenSection("breakpoints")}
            />

            {/* Layouts */}
            {estilosScreens.length > 0 && (
              <div>
                <SectionHeader
                  icon={LayoutTemplate}
                  label={t.leftPanel.layoutsSection}
                  expanded={layoutsExpanded}
                  onToggle={() => setLayoutsExpanded((v) => !v)}
                />
                {layoutsExpanded && (
                  <ul className="mt-1 flex flex-col gap-0.5 pl-3">
                    {estilosScreens.map((screen) => (
                      <li key={screen.id}>
                        <NavItem
                          icon={SCREEN_ITEM_ICONS[screen.id] ?? AppWindow}
                          label={screen.name}
                          selected={screensOpen && screensSelectedId === screen.id}
                          onClick={() => selectScreen(screen.id)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

          </div>
        )}

        {/* ── Icons ── */}
        {view === "icons" && (
          <IconsNav
            selectedIconCategory={iconCategory}
            onIconCategorySelect={setIconCategory}
            totalIcons={totalIcons}
            allLabel={t.leftPanel.all}
          />
        )}


      </nav>
      </ScrollArea>

      {/* Footer */}
      {!isIconOnly && (
        <div className="p-4 border-t border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-1">
            {(["en", "es"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={[
                  "text-xs font-medium px-1.5 py-0.5 rounded transition-colors cursor-pointer",
                  lang === l
                    ? "text-sidebar-foreground bg-sidebar-accent"
                    : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70",
                ].join(" ")}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <p className="text-xs text-sidebar-foreground/25">v1.0.0</p>
        </div>
      )}
    </aside>
  )
}
