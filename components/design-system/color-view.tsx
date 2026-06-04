"use client"

import { useState } from "react"
import { Check, Sun, Moon } from "lucide-react"
import { colorGroups } from "./colors"
import { theme } from "@/theme/tokens"
import { translations, type Lang } from "./i18n"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ColorViewProps {
  lang: Lang
}

// Lookup: "--primary" → valor resuelto para light/dark
const lightMap = Object.fromEntries(
  Object.entries(theme.light).map(([k, v]) => [`--${k}`, v as string])
)
const darkMap = Object.fromEntries(
  Object.entries(theme.dark).map(([k, v]) => [`--${k}`, v as string])
)

/** Acorta valores largos de oklch para que quepan en el chip */
function formatValue(value: string): string {
  if (!value) return "—"
  if (value.startsWith("#")) return value.toUpperCase()
  // oklch(0.205 0 0) → oklch(0.21 0 0)
  const match = value.match(/^oklch\(([^)]+)\)$/)
  if (match) {
    const parts = match[1].split(/\s+/)
    const shortened = parts
      .map((p) =>
        isNaN(Number(p)) ? p : String(parseFloat(Number(p).toFixed(2)))
      )
      .join(" ")
    return `oklch(${shortened})`
  }
  return value.length > 18 ? value.slice(0, 16) + "…" : value
}

export function ColorView({ lang }: ColorViewProps) {
  const [mode, setMode] = useState<"light" | "dark">("light")
  const [copied, setCopied] = useState<string | null>(null)
  const t = translations[lang]
  const isDark = mode === "dark"
  const varMap = isDark ? darkMap : lightMap

  function handleCopy(variable: string) {
    const value = varMap[variable] ?? `var(${variable})`
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(variable)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <main
      className={cn(
        "flex min-w-0 flex-1 flex-col overflow-hidden border-x border-border transition-colors duration-300",
        isDark ? "dark bg-background" : "bg-background"
      )}
    >
      {/* Header */}
      <div className="flex h-18.5 shrink-0 items-center justify-between border-b border-border px-8">
        <div>
          <h1 className="text-base leading-none font-semibold tracking-tight">
            {t.colors}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t.colorsDescription}
          </p>
        </div>

        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as "light" | "dark")}
        >
          <TabsList className="h-7 p-0.5">
            <TabsTrigger
              value="light"
              className="h-6 w-7 px-0"
              aria-label={t.lightMode}
            >
              <Sun className="size-3.5" />
            </TabsTrigger>
            <TabsTrigger
              value="dark"
              className="h-6 w-7 px-0"
              aria-label={t.darkMode}
            >
              <Moon className="size-3.5" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Body */}
      <ScrollArea className="min-h-0 flex-1" scrollbarSize="thin">
        {colorGroups.map((group, gi) => (
          <div
            key={group.id}
            className={cn(
              "flex gap-8 px-8 py-6",
              gi !== 0 && "border-t border-border"
            )}
          >
            {/* Group label */}
            <div className="w-32 shrink-0 pt-1">
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                {group.name}
              </span>
            </div>

            {/* Swatches */}
            <div className="flex flex-wrap gap-x-3 gap-y-5">
              {group.swatches.map((swatch) => {
                const isCopied = copied === swatch.variable
                const rawValue = varMap[swatch.variable] ?? ""
                const displayValue = formatValue(rawValue)

                return (
                  <div key={swatch.variable} className="flex flex-col gap-2">
                    {/* Chip */}
                    <button
                      onClick={() => handleCopy(swatch.variable)}
                      title={rawValue}
                      className={cn(
                        "group relative h-9 w-24 cursor-pointer overflow-hidden rounded-lg transition-all duration-150",
                        "hover:scale-[1.04] active:scale-[0.97]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                        "ring-offset-background focus-visible:ring-ring",
                        "border border-border"
                      )}
                      style={{ backgroundColor: `var(${swatch.variable})` }}
                    >
                      {/* Copy overlay */}
                      <span
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-all duration-150",
                          "bg-overlay/25 backdrop-blur-[1px]",
                          isCopied
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <Check
                          className={cn(
                            "transition-all duration-150",
                            isCopied
                              ? "size-3.5 text-white"
                              : "size-3 text-white/80"
                          )}
                        />
                      </span>
                    </button>

                    {/* Name + variable + value */}
                    <div className="w-24">
                      <p className="truncate text-xs leading-tight font-medium text-foreground/80">
                        {swatch.name}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                        {swatch.variable}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                        {displayValue}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </ScrollArea>
    </main>
  )
}
