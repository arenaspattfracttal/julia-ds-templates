"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { components } from "./registry"
import { SAMPLE_SCREENS } from "./screens-data"
import type { ComponentEntry } from "./types"
import type { Lang } from "./i18n"
import type { TokenSectionId } from "./token-view"

export type ViewMode = "inicio" | "tokens" | "icons"
export type Mode = "light" | "dark"

function defaultValues(component: ComponentEntry): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(component.controls).map(([key, ctrl]) => [key, ctrl.defaultValue]),
  )
}

export interface ViewerContextValue {
  view: ViewMode
  lang: Lang
  mode: Mode
  selectedId: string
  propValues: Record<string, unknown>
  iconCategory: string | null
  iconQuery: string
  compositorOpen: boolean
  screensOpen: boolean
  screensSelectedId: string | null
  tokenSection: TokenSectionId | "breakpoints" | null
  overviewOpen: boolean
  wideMode: boolean
  setView: (v: ViewMode) => void
  openOverview: () => void
  setLang: (l: Lang) => void
  setMode: (m: Mode) => void
  selectComponent: (id: string) => void
  changeProp: (key: string, value: unknown) => void
  setIconCategory: (id: string | null) => void
  setIconQuery: (q: string) => void
  toggleCompositor: (open: boolean) => void
  toggleScreens: (open: boolean) => void
  selectScreen: (id: string | null) => void
  setTokenSection: (id: TokenSectionId | "breakpoints") => void
  setWideMode: (v: boolean) => void
}

const noop = () => {}

const DEFAULT_VALUE: ViewerContextValue = {
  view: "inicio",
  lang: "en",
  mode: "light",
  selectedId: "",
  propValues: {},
  iconCategory: null,
  iconQuery: "",
  compositorOpen: false,
  screensOpen: false,
  screensSelectedId: null,
  tokenSection: null,
  overviewOpen: true,
  wideMode: false,
  setView: noop,
  openOverview: noop,
  setLang: noop,
  setMode: noop,
  selectComponent: noop,
  changeProp: noop,
  setIconCategory: noop,
  setIconQuery: noop,
  toggleCompositor: noop,
  toggleScreens: noop,
  selectScreen: noop,
  setTokenSection: noop,
  setWideMode: noop,
}

const ViewerContext = createContext<ViewerContextValue>(DEFAULT_VALUE)

export function useViewer(): ViewerContextValue {
  return useContext(ViewerContext)
}

export function ViewerProvider({
  children,
  initialSelectedId,
}: {
  children: ReactNode
  initialSelectedId: string
}) {
  const initialComp = components.find((c) => c.id === initialSelectedId)
  const [view, setView] = useState<ViewMode>("inicio")
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId)
  const [propValues, setPropValues] = useState<Record<string, unknown>>(
    initialComp ? defaultValues(initialComp) : {},
  )
  const [lang, setLang] = useState<Lang>("en")
  const [iconCategory, setIconCategory] = useState<string | null>(null)
  const [iconQuery, setIconQuery] = useState("")
  const [compositorOpen, setCompositorOpen] = useState(false)
  const [screensOpen, setScreensOpen] = useState(false)
  const [screensSelectedId, setScreensSelectedId] = useState<string | null>(null)
  const [tokenSection, setTokenSection] = useState<TokenSectionId | "breakpoints" | null>(null)
  const [mode, setMode] = useState<Mode>("light")
  const [overviewOpen, setOverviewOpen] = useState(true)
  const [wideMode, setWideMode] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (mode === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
  }, [mode])

  function handleViewChange(v: ViewMode) {
    // Leaving tokens: clean up any layout-skeleton selection
    if (view === "tokens" && v !== "tokens") {
      const selIsLayout = SAMPLE_SCREENS.some(
        (s) => s.id === screensSelectedId && s.section === "estilos",
      )
      if (selIsLayout) {
        setScreensSelectedId(null)
        setScreensOpen(false)
      }
    }
    setView(v)
    if (v !== "icons") setIconCategory(null)
  }

  function handleSetTokenSection(id: TokenSectionId | "breakpoints") {
    setTokenSection(id)
    // Switching to a token/breakpoint section closes any open layout skeleton
    setScreensOpen(false)
  }

  function openOverview() {
    setOverviewOpen(true)
    setCompositorOpen(false)
    setScreensOpen(false)
  }

  function selectComponent(id: string) {
    const comp = components.find((c) => c.id === id)
    if (!comp) return
    setSelectedId(id)
    setPropValues(defaultValues(comp))
    setCompositorOpen(false)
    setScreensOpen(false)
    setOverviewOpen(false)
  }

  function changeProp(key: string, value: unknown) {
    setPropValues((prev) => {
      const comp = components.find((c) => c.id === selectedId)
      const cascaded = comp?.cascade?.(key, value, prev) ?? {}
      return { ...prev, [key]: value, ...cascaded }
    })
  }

  function toggleCompositor(open: boolean) {
    setCompositorOpen(open)
    if (open) { setScreensOpen(false); setOverviewOpen(false) }
  }

  function toggleScreens(open: boolean) {
    setScreensOpen(open)
    if (open) { setCompositorOpen(false); setOverviewOpen(false) }
    if (!open) setWideMode(false)
  }

  function selectScreen(id: string | null) {
    setScreensSelectedId(id)
    setScreensOpen(true)
    setCompositorOpen(false)
    setOverviewOpen(false)
  }

  const value: ViewerContextValue = {
    view,
    lang,
    mode,
    selectedId,
    propValues,
    iconCategory,
    iconQuery,
    compositorOpen,
    screensOpen,
    screensSelectedId,
    tokenSection,
    overviewOpen,
    setView: handleViewChange,
    openOverview,
    setLang,
    setMode,
    selectComponent,
    changeProp,
    setIconCategory,
    setIconQuery,
    toggleCompositor,
    toggleScreens,
    selectScreen,
    setTokenSection: handleSetTokenSection,
    wideMode,
    setWideMode,
  }

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
}
