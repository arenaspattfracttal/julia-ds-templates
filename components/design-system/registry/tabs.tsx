import { defineComponent } from "../types"
import { useRef, useState, useEffect } from "react"
import { User, Lock, Bell, Search } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

function ScrollableTabs({ children }: { children: React.ReactNode }) {
  const ref                       = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart]     = useState(true)
  const [atEnd,   setAtEnd]       = useState(false)
  const [dragging, setDragging]   = useState(false)
  const dragStart                 = useRef({ x: 0, scrollLeft: 0 })
  const movedRef                  = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function update() {
      if (!el) return
      setAtStart(el.scrollLeft <= 0)
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
    }

    function onMouseDown(e: MouseEvent) {
      if (!el) return
      dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft }
      movedRef.current  = false
      setDragging(true)
    }

    function onMouseMove(e: MouseEvent) {
      if (!el || !dragStart.current || !(e.buttons & 1)) return
      const dx = e.clientX - dragStart.current.x
      if (Math.abs(dx) > 3) movedRef.current = true
      el.scrollLeft = dragStart.current.scrollLeft - dx
    }

    function onMouseUp() { setDragging(false) }

    // Evita que un drag active el TabsTrigger subyacente
    function onClickCapture(e: MouseEvent) {
      if (movedRef.current) e.stopPropagation()
    }

    update()
    el.addEventListener("scroll", update)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    el.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup",   onMouseUp)
    el.addEventListener("clickCapture" as "click", onClickCapture, true)

    return () => {
      el.removeEventListener("scroll", update)
      ro.disconnect()
      el.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup",   onMouseUp)
      el.removeEventListener("clickCapture" as "click", onClickCapture, true)
    }
  }, [])

  const mask = atStart && atEnd
    ? undefined
    : atStart
      ? "linear-gradient(to right, black 91%, transparent 100%)"
      : atEnd
        ? "linear-gradient(to right, transparent 0%, black 9%, black 100%)"
        : "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)"

  return (
    <div
      ref={ref}
      className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        cursor: dragging ? "grabbing" : "grab",
      }}
    >
      {children}
    </div>
  )
}

const EXTRA_TABS = ["Trending","Events","News","Community","Rewards"]
const ICON_NODES = [<User className="size-4" key="u"/>, <Lock className="size-4" key="l"/>, <Bell className="size-4" key="b"/>, <Search className="size-4" key="s"/>]
const ICON_NAMES = ["User","Lock","Bell","Search"]

// Helpers para clases según size ──────────────────────────────────────────────

function listCls(compact: boolean, stacked: boolean) {
  return cn(
    compact  ? "!p-[3px]"  : undefined,
    stacked  ? "!h-fit"    : undefined,
  ) || undefined
}

function triggerCls(compact: boolean, stacked: boolean, iconsOnly: boolean) {
  if (stacked) return cn("flex-col gap-1 px-2.5", compact ? "!py-0.5" : "py-2")
  return cn(
    compact ? (iconsOnly ? "!py-1" : "!py-0.5") : undefined,
    iconsOnly ? "px-2.5" : undefined,
  ) || undefined
}

// ─── Tabs entry ───────────────────────────────────────────────────────────────

export const tabsEntry = defineComponent<{
  variant:     "default" | "line" | "white"
  size:        "default" | "sm"
  orientation: "horizontal" | "vertical"
  tabCount:    string
  tab1:        string
  tab2:        string
  tab3:        string
  tab4:        string
  icons:       string
  badge:       boolean
  disabled:    boolean
  scrollable:  boolean
}>({
  id: "tabs",
  name: "Tabs",
  description: {
    en: "A set of layered sections of content displayed one at a time.",
    es: "Un conjunto de secciones de contenido apiladas que se muestran de una en una.",
  },
  category: "Components",
  filePath: "components/ui/tabs.tsx",
  controls: {
    variant:     { type: "select",  options: ["default","line","white"],          defaultValue: "default" },
    size:        { type: "select",  options: ["default","sm"],                    defaultValue: "default" },
    orientation: { type: "select",  options: ["horizontal","vertical"],           defaultValue: "horizontal" },
    scrollable:  { type: "boolean",                                               defaultValue: false },
    tabCount:    { type: "select",  options: ["2","3","4","6","9"],               defaultValue: "3" },
    tab1:        { type: "text",                                                  defaultValue: "Account" },
    tab2:        { type: "text",                                                  defaultValue: "Password" },
    tab3:        { type: "text",                                                  defaultValue: "Notifications" },
    tab4:        { type: "text",                                                  defaultValue: "Settings" },
    icons:       { type: "select",  options: ["none","with text","icons only","stacked"], defaultValue: "none" },
    badge:       { type: "boolean",                                               defaultValue: false },
    disabled:    { type: "boolean",                                               defaultValue: false },
  },
  controlVisible: (key, props) => {
    if (key === "orientation" && props.scrollable) return false
    return true
  },
  render: (props) => {
    const { variant, size, orientation, tabCount, tab1, tab2, tab3, tab4, disabled, icons, badge, scrollable } = props
    const count      = Number(tabCount) || 3
    const baseLabels = [tab1||"Account", tab2||"Password", tab3||"Notifications", tab4||"Settings"]
    const allLabels  = [...baseLabels, ...EXTRA_TABS].slice(0, count)
    const keys       = Array.from({ length: count }, (_, i) => `tab${i + 1}`)
    const compact    = size === "sm"
    const stacked    = icons === "stacked"
    const showIcon   = icons !== "none"
    const showLabel  = icons !== "icons only"
    const iconsOnly  = icons === "icons only"
    const list = (
      <TabsList variant={variant} className={listCls(compact, stacked)}>
        {keys.map((k, i) => (
          <TabsTrigger key={k} value={k}
            disabled={disabled && i === 1}
            badge={badge && i === count - 1 ? 3 : undefined}
            className={triggerCls(compact, stacked, iconsOnly)}
          >
            {showIcon && ICON_NODES[i % ICON_NODES.length]}
            {showLabel && allLabels[i]}
          </TabsTrigger>
        ))}
      </TabsList>
    )
    return (
      <div className="flex justify-center w-full">
        <Tabs defaultValue="tab1" orientation={scrollable ? "horizontal" : orientation} className={scrollable ? "w-full max-w-sm" : "w-fit"}>
          {scrollable ? <ScrollableTabs>{list}</ScrollableTabs> : list}
        </Tabs>
      </div>
    )
  },
  compositorRender: (props) => {
    const { variant, size, orientation, tabCount, tab1, tab2, tab3, tab4, disabled, icons, badge, scrollable } = props
    const count      = Number(tabCount) || 3
    const baseLabels = [tab1||"Account", tab2||"Password", tab3||"Notifications", tab4||"Settings"]
    const allLabels  = [...baseLabels, ...EXTRA_TABS].slice(0, count)
    const keys       = Array.from({ length: count }, (_, i) => `tab${i + 1}`)
    const compact    = size === "sm"
    const stacked    = icons === "stacked"
    const showIcon   = icons !== "none"
    const showLabel  = icons !== "icons only"
    const iconsOnly  = icons === "icons only"
    const list = (
      <TabsList variant={variant} className={listCls(compact, stacked)}>
        {keys.map((k, i) => (
          <TabsTrigger key={k} value={k}
            disabled={disabled && i === 1}
            badge={badge && i === count - 1 ? 3 : undefined}
            className={triggerCls(compact, stacked, iconsOnly)}
          >
            {showIcon && ICON_NODES[i % ICON_NODES.length]}
            {showLabel && allLabels[i]}
          </TabsTrigger>
        ))}
      </TabsList>
    )
    return (
      <Tabs defaultValue="tab1" orientation={scrollable ? "horizontal" : orientation} className="w-full">
        {scrollable
          ? <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{list}</div>
          : list}
      </Tabs>
    )
  },
  generateCode: (props) => {
    const { variant, size, orientation, tabCount, tab1, tab2, tab3, tab4, disabled, icons, badge, scrollable } = props
    const count      = Number(tabCount) || 3
    const compact    = size === "sm"
    const stacked    = icons === "stacked"
    const showIcon   = icons !== "none"
    const showLabel  = icons !== "icons only"
    const iconsOnly  = icons === "icons only"
    const baseLabels = [tab1||"Account", tab2||"Password", tab3||"Notifications", tab4||"Settings"]
    const allLabels  = [...baseLabels, ...EXTRA_TABS].slice(0, count)
    const keys       = Array.from({ length: count }, (_, i) => `tab${i + 1}`)
    const effectiveOrientation = scrollable ? "horizontal" : orientation
    const computedListCls    = listCls(compact, stacked)
    const computedTriggerCls = triggerCls(compact, stacked, iconsOnly)

    const tabsAttrs = ['defaultValue="tab1"', ...(effectiveOrientation !== "horizontal" ? [`orientation="${effectiveOrientation}"`] : [])]
    const listAttrs = [
      ...(variant !== "default" ? [`variant="${variant}"`] : []),
      ...(computedListCls ? [`className="${computedListCls}"`] : []),
    ]
    const tabsOpen  = tabsAttrs.length === 1 ? `<Tabs ${tabsAttrs[0]}>` : `<Tabs\n  ${tabsAttrs.join("\n  ")}\n>`
    const listOpen  = listAttrs.length ? `<TabsList ${listAttrs.join(" ")}>` : `<TabsList>`
    const triggers  = keys.map((k, i) => {
      const attrs = [
        `value="${k}"`,
        ...(disabled && i === 1 ? ["disabled"] : []),
        ...(badge && i === count - 1 ? ["badge={3}"] : []),
        ...(computedTriggerCls ? [`className="${computedTriggerCls}"`] : []),
      ]
      const iconPart  = showIcon ? `<${ICON_NAMES[i % ICON_NAMES.length]} className="size-4" />` : ""
      const labelPart = showLabel ? allLabels[i] : ""
      return `    <TabsTrigger ${attrs.join(" ")}>${iconPart}${labelPart}</TabsTrigger>`
    }).join("\n")
    const panels = keys.map((k, i) =>
      `  <TabsContent value="${k}">\n    <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">\n      Content of ${allLabels[i]}\n    </div>\n  </TabsContent>`
    ).join("\n")
    const tabsList = scrollable
      ? `  <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_80%,transparent_100%)]">\n    ${listOpen}\n${triggers}\n    </TabsList>\n  </div>`
      : `  ${listOpen}\n${triggers}\n  </TabsList>`
    const body     = [tabsOpen, tabsList, panels, `</Tabs>`].join("\n")
    const indented = body.split("\n").map(l => `    ${l}`).join("\n")
    const iconImport = showIcon ? `import { ${[...new Set(keys.map((_,i) => ICON_NAMES[i % ICON_NAMES.length]))].join(", ")} } from "lucide-react"\n` : ""
    return `${iconImport}import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
