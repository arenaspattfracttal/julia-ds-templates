"use client"

import * as React from "react"
import { X, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const BASE_CLASS =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

// ─── Base clearable (usado por SearchInput y por Input clearable) ──────────────

function ClearableBase({
  type,
  className,
  onChange,
  value,
  defaultValue,
  ...props
}: React.ComponentProps<"input">) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    String(defaultValue ?? "")
  )
  const ref = React.useRef<HTMLInputElement>(null)

  const currentValue = isControlled ? String(value ?? "") : uncontrolledValue
  const showClear = currentValue.length > 0

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setUncontrolledValue(e.target.value)
    onChange?.(e)
  }

  function handleClear() {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set
    if (ref.current && setter) {
      setter.call(ref.current, "")
      ref.current.dispatchEvent(new Event("input",  { bubbles: true }))
      ref.current.dispatchEvent(new Event("change", { bubbles: true }))
      ref.current.focus()
    }
    if (!isControlled) setUncontrolledValue("")
  }

  const isSearch = type === "search"

  return (
    <div className="relative flex w-full items-center">
      {isSearch && (
        <Search className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none shrink-0" />
      )}
      <input
        ref={ref}
        type={type}
        data-slot="input"
        value={isControlled ? String(value ?? "") : uncontrolledValue}
        onChange={handleChange}
        className={cn(
          BASE_CLASS,
          isSearch && "[&::-webkit-search-cancel-button]:hidden pl-8",
          showClear && "pr-8",
          className,
        )}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          aria-label="Limpiar"
          onMouseDown={(e) => { e.preventDefault(); handleClear() }}
          className="absolute right-1.5 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

// ─── Input search (retro-compat) ──────────────────────────────────────────────

function SearchInput(props: Omit<React.ComponentProps<"input">, "type">) {
  return <ClearableBase type="search" {...props} />
}

// ─── Input base ───────────────────────────────────────────────────────────────

function Input({
  className,
  type,
  clearable,
  ...props
}: React.ComponentProps<"input"> & {
  /** Muestra un botón X para limpiar el contenido cuando hay valor escrito. */
  clearable?: boolean
}) {
  if (type === "search" || clearable) {
    return <ClearableBase type={type} className={className} {...props} />
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(BASE_CLASS, className)}
      {...props}
    />
  )
}

export { Input, SearchInput }
