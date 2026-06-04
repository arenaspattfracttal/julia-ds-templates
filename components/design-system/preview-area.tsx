"use client"

import { useState } from "react"
import { Sun, Moon, ChevronDown, ChevronUp } from "lucide-react"
import type { ComponentEntry } from "./types"
import { CodeBlock } from "./code-block"
import { ApiTable } from "./api-table"
import { API_REFERENCE } from "./api-reference-data"
import { translations, type Lang } from "./i18n"
import { DotPattern } from "./dot-pattern"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PreviewAreaProps {
  component: ComponentEntry | undefined
  propValues: Record<string, unknown>
  lang: Lang
  mode: "light" | "dark"
  onModeChange: (mode: "light" | "dark") => void
}

// ─── Shared mode toggle ──────────────────────────────────────────────────────

export function ModeToggle({
  mode,
  onModeChange,
}: {
  mode: "light" | "dark"
  onModeChange: (m: "light" | "dark") => void
}) {
  return (
    <Tabs value={mode} onValueChange={(v) => onModeChange(v as "light" | "dark")}>
      <TabsList className="h-7 p-0.5">
        <TabsTrigger value="light" className="h-6 w-7 px-0">
          <Sun className="size-3.5" />
        </TabsTrigger>
        <TabsTrigger value="dark" className="h-6 w-7 px-0">
          <Moon className="size-3.5" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

// Controles que no aportan al resumen (son contenido, no configuración)
const SKIP_KEYS = new Set([
  "children", "label", "placeholder", "description", "trigger", "content",
  "title", "triggerLabel", "actionLabel", "cancelLabel",
  "tab1", "tab2", "tab3", "tab4", "fallback",
])

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^(.)/, (s) => s.toUpperCase())
    .trim()
}

function buildSummary(
  component: ComponentEntry,
  propValues: Record<string, unknown>
): { label: string; value: string }[] {
  const tags: { label: string; value: string }[] = []

  for (const [key, control] of Object.entries(component.controls)) {
    if (SKIP_KEYS.has(key)) continue
    const value = propValues[key] ?? control.defaultValue
    const label = formatLabel(key)

    if (control.type === "select") {
      tags.push({ label, value: String(value) })
    } else if (control.type === "boolean") {
      if (value === true) tags.push({ label, value: "on" })
    } else if (control.type === "number") {
      if (value !== control.defaultValue) tags.push({ label, value: String(value) })
    }
  }

  return tags
}

export function PreviewArea({ component, propValues, lang, mode, onModeChange }: PreviewAreaProps) {
  const [codeOpen, setCodeOpen] = useState(false)
  const t = translations[lang]

  return (
    <main className="flex-1 min-w-0 flex flex-col border-x border-border bg-background overflow-hidden">
      {/* Component header */}
      <div className="px-4 shrink-0 h-[74px] flex items-center justify-between border-b border-border bg-background">
        <div>
          <h1 className="text-base font-semibold tracking-tight leading-none">
            {component?.name ?? "—"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {component?.description[lang]}
          </p>
        </div>
        <ModeToggle mode={mode} onModeChange={onModeChange} />
      </div>

      {/* Scrollable body */}
      <ScrollArea className="flex-1 min-h-0" scrollbarSize="thin">

        {/* Preview + collapsible code */}
        <div className="px-4 pt-4">
          {/* Title row */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-sm font-semibold tracking-tight">{t.preview}</h2>
            {component && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {component.filePath}
              </span>
            )}
          </div>

          {/* Canvas + code as one rounded card */}
          <div className="rounded-xl border border-border overflow-hidden transition-colors duration-200">

            {/* Canvas */}
            <div className="relative min-h-[260px] flex items-center justify-center px-8 pt-10 pb-8 bg-background text-foreground transition-colors duration-200">
              {/* Dot pattern */}
              <DotPattern mode={mode} mask="horizontal" />

              {/* Summary chips */}
              {component && (
                <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[55%]">
                  {buildSummary(component, propValues).map(({ label, value }) => (
                    <span
                      key={label}
                      className="text-[10px] px-1.5 py-0.5 rounded-md leading-none flex items-center gap-1 bg-muted text-muted-foreground"
                    >
                      <span className="font-medium">{label}</span>
                      <span className="text-border">·</span>
                      <span>{value}</span>
                    </span>
                  ))}
                </div>
              )}

              {component ? (
                component.previewWidth ? (
                  <div style={{ width: component.previewWidth }} className="flex flex-col">
                    {component.render(propValues)}
                  </div>
                ) : component.render(propValues)
              ) : (
                <p className="text-sm text-muted-foreground">{t.selectFromLeft}</p>
              )}
            </div>

            {/* Collapsible code toggle */}
            {component && (
              <>
                <button
                  onClick={() => setCodeOpen(v => !v)}
                  className="dark w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-t border-sidebar-border bg-sidebar text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                >
                  {codeOpen
                    ? <ChevronUp className="size-3.5 shrink-0" />
                    : <ChevronDown className="size-3.5 shrink-0" />
                  }
                  <span>{t.implementation}</span>
                  <span className="ml-auto text-sidebar-foreground/40">
                    {codeOpen ? t.hideCode : t.viewCode}
                  </span>
                </button>

                {codeOpen && (
                  <div className="[&>div]:rounded-none [&>div]:border-0 [&>div]:border-t [&>div]:border-sidebar-border">
                    <CodeBlock code={component.generateCode(propValues)} lang={lang} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* API Reference section */}
        {component && API_REFERENCE[component.id] && (
          <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-semibold tracking-tight">API Reference</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {API_REFERENCE[component.id].length} props
              </span>
            </div>
            <ApiTable props={API_REFERENCE[component.id]} />
          </div>
        )}
      </ScrollArea>
    </main>
  )
}

