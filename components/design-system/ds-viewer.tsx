"use client"

import { components } from "./registry"
import { LeftPanel } from "./left-panel"
import { ViewerProvider, useViewer } from "./viewer-context"
import { PreviewArea } from "./preview-area"
import { RightPanel } from "./right-panel"
import { IconView } from "./icon-view"
import { CompositorArea } from "./compositor-area"
import { TokenView } from "./token-view"
import { ScreensArea } from "./screens-area"
import { OverviewPage } from "./overview-page"
import { SAMPLE_SCREENS } from "./screens-data"

export function DSViewer() {
  const initial = components[0]
  return (
    <ViewerProvider initialSelectedId={initial?.id ?? ""}>
      <ViewerLayout />
    </ViewerProvider>
  )
}

function ViewerLayout() {
  const {
    view, setView, lang, mode, setMode, selectedId, iconCategory,
    compositorOpen, screensOpen, screensSelectedId, tokenSection, selectScreen,
    propValues, changeProp, wideMode, setWideMode,
    overviewOpen, selectComponent,
  } = useViewer()

  const selected = components.find((c) => c.id === selectedId)

  // True when the active screen is a layout skeleton (section: "estilos")
  const isLayoutSelected = SAMPLE_SCREENS.some(
    (s) => s.id === screensSelectedId && s.section === "estilos",
  )

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar">
      <LeftPanel />

      {overviewOpen && view === "inicio" ? (
        <OverviewPage
          onSelectComponent={selectComponent}
          onGoTokens={() => { setView("tokens") }}
          onGoIcons={() => { setView("icons") }}
        />
      ) : view === "icons" ? (
        <IconView lang={lang} selectedCategory={iconCategory} mode={mode} onModeChange={setMode} />
      ) : view === "tokens" && screensOpen && isLayoutSelected ? (
        // Layout skeleton selected inside the Estilos tab
        <ScreensArea
          selectedId={screensSelectedId}
          onSelect={selectScreen}
          mode={mode}
          onModeChange={setMode}
          wideMode={wideMode}
          onWideModeChange={setWideMode}
        />
      ) : view === "tokens" ? (
        <TokenView lang={lang} activeSection={tokenSection} mode={mode} onModeChange={setMode} />
      ) : compositorOpen ? (
        <CompositorArea />
      ) : screensOpen ? (
        <ScreensArea
          selectedId={screensSelectedId}
          onSelect={selectScreen}
          mode={mode}
          onModeChange={setMode}
          wideMode={wideMode}
          onWideModeChange={setWideMode}
        />
      ) : (
        <>
          <PreviewArea component={selected} propValues={propValues} lang={lang} mode={mode} onModeChange={setMode} />
          <RightPanel component={selected} propValues={propValues} onChange={changeProp} lang={lang} />
        </>
      )}
    </div>
  )
}
