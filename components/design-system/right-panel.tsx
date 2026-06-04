"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { ComponentEntry, ControlDefinition } from "./types"
import { translations, type Lang, type Translation } from "./i18n"
import { ALL_ICONS, ICONS_MAP } from "./icon-categories"
import { cn } from "@/lib/utils"

interface RightPanelProps {
  component: ComponentEntry | undefined
  propValues: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  lang: Lang
}

export function RightPanel({ component, propValues, onChange, lang }: RightPanelProps) {
  const t = translations[lang]
  return (
    <aside className="w-1/5 min-w-[240px] max-w-[380px] shrink-0 flex flex-col bg-background border-l border-border">
      <div className="p-4 border-b border-border h-[74px] flex flex-col justify-center gap-1">
        <h2 className="text-base font-semibold leading-none tracking-tight">{t.controls}</h2>
        <p className="text-sm leading-none text-muted-foreground">{t.configureHere}</p>
      </div>

      <ScrollArea className="flex-1 min-h-0" scrollbarSize="thin">
        <div className="p-4 space-y-4">
          {component ? (
            Object.entries(component.controls)
              .filter(([key]) => !component.controlVisible || component.controlVisible(key, propValues))
              .map(([key, control]) => (
              <ControlField
                key={key}
                propName={key}
                control={control}
                value={propValues[key]}
                onChange={(val) => onChange(key, val)}
                t={t}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              {t.selectToSeeControls}
            </p>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}

interface ControlFieldProps {
  propName: string
  control: ControlDefinition
  value: unknown
  onChange: (value: unknown) => void
  t: Translation
}

function ControlField({ propName, control, value, onChange, t }: ControlFieldProps) {
  const label =
    propName === "children"
      ? t.rightPanel.labelFallback
      : propName
          .replace(/([A-Z])/g, " $1")
          .replace(/^(.)/, (s) => s.toUpperCase())
          .trim()

  if (control.type === "select") {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground block">{label}</label>
        <Select value={value as string} onValueChange={(val) => onChange(val)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {control.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  if (control.type === "boolean") {
    return (
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <Switch
          checked={value as boolean}
          onCheckedChange={(checked) => onChange(checked)}
        />
      </div>
    )
  }

  if (control.type === "text") {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground block">{label}</label>
        <Input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  if (control.type === "number") {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground block">{label}</label>
        <Input
          type="number"
          value={value as number}
          min={control.min}
          max={control.max}
          step={control.step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    )
  }

  if (control.type === "icon") {
    return (
      <IconPickerField
        label={label}
        value={value as string}
        onChange={onChange}
        t={t}
      />
    )
  }

  return null
}

// ─── Icon picker ──────────────────────────────────────────────────────────────

function IconPickerField({
  label, value, onChange, t,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  t: Translation
}) {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_ICONS
    return ALL_ICONS.filter(([name]) => name.toLowerCase().includes(q))
  }, [query])

  const SelectedIcon = value !== "none" ? ICONS_MAP.get(value) : null

  function select(name: string) {
    onChange(name)
    setOpen(false)
    setQuery("")
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground block">{label}</label>

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-sm transition-colors cursor-pointer",
          open ? "border-primary bg-primary/5" : "border-input bg-background hover:bg-muted",
        )}
      >
        {SelectedIcon
          ? <SelectedIcon className="size-4 shrink-0 text-muted-foreground" />
          : <span className="size-4 shrink-0 rounded border border-dashed border-border" />
        }
        <span className="flex-1 text-left text-foreground truncate">
          {value === "none" ? "none" : value}
        </span>
        {value !== "none" && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onChange("none") }}
            className="shrink-0 text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </span>
        )}
      </button>

      {/* Inline picker panel */}
      {open && (
        <div className="rounded-lg border border-border bg-background shadow-sm overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.rightPanel.searchIcon}
                className="w-full text-xs bg-muted border border-input rounded-md pl-6 pr-2 py-1.5 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Grid */}
          <ScrollArea className="max-h-52" scrollbarSize="thin">
          <div className="p-1.5">
            {/* None option */}
            <button
              onClick={() => select("none")}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer",
                value === "none" && "bg-primary/10 text-primary font-medium",
              )}
            >
              <span className="size-4 shrink-0 rounded border border-dashed border-border" />
              none
            </button>

            <div
              className="grid gap-0.5 mt-1"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(32px, 1fr))" }}
            >
              {filtered.map(([name, Icon]) => (
                <button
                  key={name}
                  onClick={() => select(name)}
                  title={name}
                  className={cn(
                    "flex items-center justify-center rounded-md p-1.5 transition-colors cursor-pointer",
                    value === name
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">{t.noResults}</p>
            )}
          </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
