"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { PanelLeftClose, PanelLeftOpen, ChevronDown } from "lucide-react"
import { Button }     from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type NavItem = {
  id:           string
  label:        string
  icon:         LucideIcon
  children?:    NavItem[]
  defaultOpen?: boolean
}

export type NavMode = "desktop" | "tablet" | "mobile"

export interface SettingsNavProps {
  items:             NavItem[]
  active:            string
  onSelect:          (id: string) => void
  mode?:             NavMode
  minimized?:        boolean
  onToggleMinimize?: () => void
  headerLabel?:      string
}

// ─── NavGroupItem ────────────────────────────────────────────────────────────

function NavGroupItem({
  item, active, onSelect, iconOnly, onExpandNav,
}: {
  item:          NavItem
  active:        string
  onSelect:      (id: string) => void
  iconOnly:      boolean
  onExpandNav?:  () => void
}) {
  const [open, setOpen] = useState(item.defaultOpen ?? false)
  const Icon = item.icon
  const isChildActive = item.children?.some(c => c.id === active) ?? false

  // Minimized: clicking expands the nav + opens the group
  if (iconOnly) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              isChildActive
                ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                : "text-foreground/80",
            )}
            onClick={() => {
              setOpen(true)
              onExpandNav?.()
            }}
          >
            <Icon className={cn("size-4 shrink-0", isChildActive ? "text-primary" : "text-foreground/60")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div>
      {/* Group trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          "w-full flex items-center gap-2 px-2 h-8 rounded-md text-sm transition-colors cursor-pointer",
          isChildActive
            ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
            : "text-foreground font-medium hover:bg-muted",
        )}
      >
        <Icon className={cn("size-4 shrink-0", isChildActive ? "text-primary" : "text-foreground/60")} />
        <span className="flex-1 text-left truncate">{item.label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Children — grid trick: animates height linearly without max-height hacks */}
      <div className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-in-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}>
        <div className="overflow-hidden">
          <div className="mt-0.5 ml-6 flex flex-col gap-0.5 pb-0.5">
            {item.children?.map(child => (
              <FlatItem
                key={child.id}
                item={child}
                active={active}
                onSelect={onSelect}
                iconOnly={false}
                isChild
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── FlatItem ─────────────────────────────────────────────────────────────────

function FlatItem({
  item, active, onSelect, iconOnly, isChild = false,
}: {
  item:      NavItem
  active:    string
  onSelect:  (id: string) => void
  iconOnly:  boolean
  isChild?:  boolean
}) {
  const Icon = item.icon
  const isActive = active === item.id
  const btn = (
    <Button
      variant="ghost"
      size={iconOnly ? "icon-sm" : "sm"}
      className={cn(
        !iconOnly && "w-full justify-start whitespace-nowrap",
        isActive
          ? isChild
            ? "bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80"
            : "bg-primary/10 text-primary font-semibold hover:bg-primary/15 hover:text-primary"
          : isChild
            ? "text-muted-foreground hover:text-foreground"
            : "text-foreground font-medium",
      )}
      onClick={() => onSelect(item.id)}
    >
      {/* Hide icon for sub-items */}
      {!isChild && (
        <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-foreground/60")} />
      )}
      {!iconOnly && item.label}
    </Button>
  )

  if (iconOnly) return (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )

  return <div>{btn}</div>
}

// ─── SettingsNav ──────────────────────────────────────────────────────────────

export function SettingsNav({
  items, active, onSelect,
  mode = "desktop", minimized = false, onToggleMinimize,
  headerLabel = "Secciones",
}: SettingsNavProps) {
  const isMobileNav = mode === "mobile"
  const iconOnly    = minimized

  return (
    <div className={cn(
      "flex flex-col rounded-lg border bg-background overflow-hidden",
      "transition-[max-width] duration-300 ease-in-out",
      minimized     ? "w-max max-w-[56px] shrink-0"
      : isMobileNav ? "w-full h-full"
      : "w-max max-w-[400px] shrink-0",
    )}>
      {!isMobileNav && onToggleMinimize && (
        <div className={cn(
          "h-12 flex items-center border-b border-border shrink-0",
          minimized ? "justify-center px-2" : "justify-between pl-4 pr-2",
        )}>
          {!minimized && (
            <span className="text-xs font-medium text-foreground/60">
              {headerLabel}
            </span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={onToggleMinimize}
              >
                {minimized
                  ? <PanelLeftOpen className="size-4" />
                  : <PanelLeftClose className="size-4" />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {minimized ? "Expandir menú" : "Minimizar menú"}
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className={cn("flex flex-col gap-0.5 px-2 py-4", minimized && "items-center")}>
          {items.map(item =>
            item.children?.length
              ? <NavGroupItem
                  key={item.id}
                  item={item}
                  active={active}
                  onSelect={onSelect}
                  iconOnly={iconOnly}
                  onExpandNav={onToggleMinimize}
                />
              : <FlatItem
                  key={item.id}
                  item={item}
                  active={active}
                  onSelect={onSelect}
                  iconOnly={iconOnly}
                />
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
