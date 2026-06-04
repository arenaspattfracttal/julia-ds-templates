"use client"

import React, { useState, useMemo } from "react"
import { createRoot } from "react-dom/client"
import { flushSync } from "react-dom"
import { Copy, Download, Check } from "lucide-react"
import { ALL_ICONS, ICONS_BY_CATEGORY, type IconComponent } from "./icon-categories"
import { translations, type Lang } from "./i18n"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./preview-area"
import { useViewer } from "./viewer-context"

interface IconViewProps {
  lang: Lang
  selectedCategory: string | null
  mode: "light" | "dark"
  onModeChange: (m: "light" | "dark") => void
}

function downloadIconSVG(name: string, Icon: IconComponent) {
  // Render icon to a detached DOM node synchronously, then extract the SVG markup.
  const container = document.createElement("div")
  container.style.cssText = "position:absolute;visibility:hidden;pointer-events:none"
  document.body.appendChild(container)

  const root = createRoot(container)
  flushSync(() => {
    root.render(React.createElement(Icon as React.ComponentType<{ size?: number }>, { size: 24 }))
  })

  const svg = container.querySelector("svg")
  if (svg) {
    const svgStr = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgStr], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${name}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  root.unmount()
  document.body.removeChild(container)
}

export function IconView({ lang, selectedCategory, mode, onModeChange }: IconViewProps) {
  const { iconQuery } = useViewer()
  const [copied, setCopied] = useState<string | null>(null)
  const t = translations[lang]

  const baseIcons = useMemo(
    () => (selectedCategory ? (ICONS_BY_CATEGORY[selectedCategory] ?? []) : ALL_ICONS),
    [selectedCategory]
  )

  const filtered = useMemo(() => {
    const q = iconQuery.trim().toLowerCase().replace(/\s+/g, "")
    if (!q) return baseIcons
    return baseIcons.filter(([name]) => name.toLowerCase().includes(q))
  }, [baseIcons, iconQuery])

  function handleCopy(name: string) {
    navigator.clipboard
      .writeText(`import { ${name} } from "lucide-react"`)
      .catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <main className="flex-1 min-w-0 flex flex-col border-x border-border bg-background overflow-hidden">
      {/* Header */}
      <div className="px-8 shrink-0 h-[74px] flex items-center justify-between border-b border-border">
        <div>
          <h1 className="text-base font-semibold tracking-tight leading-none">
            {t.icons}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length === ALL_ICONS.length
              ? `${ALL_ICONS.length} icons`
              : `${filtered.length} of ${baseIcons.length}`}
          </p>
        </div>
        <ModeToggle mode={mode} onModeChange={onModeChange} />
      </div>

      {/* Grid */}
      <ScrollArea className="flex-1 min-h-0" scrollbarSize="thin">
        <div className="p-6">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              {t.noIconsFound} &ldquo;{iconQuery}&rdquo;
            </p>
          ) : (
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))" }}
            >
              {filtered.map(([name, Icon]) => {
                const isCopied = copied === name
                return (
                  <div
                    key={name}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-lg px-1 py-3 text-center",
                      "transition-colors duration-100 hover:bg-muted",
                      isCopied && "bg-muted"
                    )}
                  >
                    <Icon
                      size={24}
                      className="text-muted-foreground group-hover:text-foreground transition-colors duration-100"
                    />

                    {/* Bottom slot — fixed height so the tile never grows */}
                    <div className="relative h-4 w-full">
                      <span className="absolute inset-0 flex items-center justify-center truncate text-[10px] leading-tight text-muted-foreground transition-opacity duration-100 group-hover:opacity-0">
                        {name}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                        <button
                          onClick={() => handleCopy(name)}
                          title="Copy import"
                          className="flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
                        >
                          {isCopied
                            ? <Check className="size-3.5 text-foreground" />
                            : <Copy className="size-3.5" />
                          }
                        </button>
                        <button
                          onClick={() => downloadIconSVG(name, Icon)}
                          title="Download SVG"
                          className="flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
                        >
                          <Download className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  )
}
