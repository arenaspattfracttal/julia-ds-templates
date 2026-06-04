"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type TreeNode = {
  id:           string
  label:        string
  description?: string
  icon?:        LucideIcon
  children?:    TreeNode[]
}

interface TreeProps {
  data:                TreeNode[]
  onOpen?:             (id: string) => void
  defaultExpandedIds?: string[]
  className?:          string
  bordered?:           boolean
}

// ─── Item ─────────────────────────────────────────────────────────────────────

interface TreeItemProps {
  node:        TreeNode
  depth:       number
  onOpen?:     (id: string) => void
  expandedIds: Set<string>
  onToggle:    (id: string) => void
}

function TreeItem({ node, depth, onOpen, expandedIds, onToggle }: TreeItemProps) {
  const hasChildren = !!node.children?.length
  const isExpanded  = expandedIds.has(node.id)
  const Icon        = node.icon

  function handleToggleClick(e: React.MouseEvent) {
    e.stopPropagation()
    onToggle(node.id)
  }

  function handleOpenClick() {
    onOpen?.(node.id)
  }

  return (
    <div data-slot="tree-item">
      <div
        className="flex items-center w-full gap-0.5"
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {/* Chevron: solo expande/colapsa */}
        <span
          className={cn(
            "shrink-0 flex items-center justify-center rounded-sm transition-colors",
            node.description ? "size-8" : "size-5",
            hasChildren
              ? "cursor-pointer text-foreground/50 hover:bg-muted hover:text-foreground"
              : "cursor-default"
          )}
          onClick={hasChildren ? handleToggleClick : undefined}
        >
          {hasChildren && (
            isExpanded
              ? <ChevronDown  className="size-4" />
              : <ChevronRight className="size-4" />
          )}
        </span>

        {/* Ícono + texto: abre el destino del activo */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpenClick}
          onKeyDown={(e) => e.key === "Enter" && handleOpenClick()}
          className={cn(
            "flex items-center flex-1 min-w-0 rounded-md select-none transition-colors",
            node.description ? "gap-2 p-1.5 min-h-8" : "gap-1.5 px-1.5 h-8",
            onOpen
              ? "cursor-pointer text-foreground/70 hover:bg-muted hover:text-foreground"
              : "cursor-default text-foreground/70"
          )}
        >
          {Icon && (
            <Icon className={cn("shrink-0 text-muted-foreground", node.description ? "size-4" : "size-3.5")} />
          )}
          <span className="flex flex-col min-w-0">
            <span className="truncate text-sm font-normal leading-tight">
              {node.label}
            </span>
            {node.description && (
              <span className="truncate text-xs leading-tight mt-0.5 text-muted-foreground">
                {node.description}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div role="group">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onOpen={onOpen}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function Tree({
  data,
  onOpen,
  defaultExpandedIds = [],
  className,
  bordered = false,
}: TreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedIds)
  )

  function handleToggle(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  return (
    <ScrollArea
      data-slot="tree"
      className={cn(
        "w-full",
        bordered && "rounded-lg border bg-background",
        className
      )}
    >
      <div role="tree" className="flex flex-col gap-0.5 p-2">
        {data.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            depth={0}
            onOpen={onOpen}
            expandedIds={expandedIds}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

export { Tree }
