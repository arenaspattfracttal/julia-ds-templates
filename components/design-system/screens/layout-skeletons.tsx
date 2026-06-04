"use client"

import { cn } from "@/lib/utils"
import { useScreenMode } from "../screen-mode-context"

// ─── Primitivos ───────────────────────────────────────────────────────────────
// Fondo negro puro · cajas blancas puras · sin bordes ni sombras.

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium text-black/30 select-none tracking-wide">
      {children}
    </span>
  )
}

function SBox({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("bg-white rounded-lg shrink-0 flex items-center justify-center", className)}>
      {label && <SLabel>{label}</SLabel>}
    </div>
  )
}

function STopbar() {
  return (
    <div className="min-h-[58px] shrink-0 bg-white flex items-center justify-center">
      <SLabel>Topbar</SLabel>
    </div>
  )
}

// Wrapper de contenido: fondo negro, flex column, gap-2, p-2
// Replica: div.flex-1.flex.flex-col.min-h-0.overflow-hidden.bg-muted.gap-2.p-2
function SContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-zinc-700 flex flex-col gap-2 p-2">
      {children}
    </div>
  )
}

// Toolbar card: p-3 + h-8 content + border × 2 = 58px
// Replica: div.rounded-lg.border.bg-background.p-3.flex.items-center.shrink-0
function SToolbar() {
  return (
    <div className="h-[58px] bg-white rounded-lg shrink-0 flex items-center justify-center">
      <SLabel>Toolbar</SLabel>
    </div>
  )
}

// Row horizontal: replica div.flex.flex-1.min-h-0.gap-2.overflow-hidden
function SRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 min-h-0 gap-2 overflow-hidden">
      {children}
    </div>
  )
}

// ─── HorizontalNav (barra de tabs con scroll) ─────────────────────────────────
// Aparece en tablet + mobile como reemplazo del side menu lateral.
// ~64px de alto — equivale a TabsList p-[6px] + triggers flex-col py-2 con icono+texto.
function SHorizontalNav() {
  return (
    <div className="h-16 bg-white rounded-lg shrink-0 flex items-center justify-center">
      <SLabel>Nav</SLabel>
    </div>
  )
}

// ─── Layout con nav adaptable ─────────────────────────────────────────────────
// Screens que usan SettingsNav (desktop) + HorizontalNav (tablet + mobile).
//
// Desktop → [Side menu 300px | Body] en fila
// Tablet  → [Side menu 52px  | Body] en fila
// Mobile  → [HorizontalNav] + [Body] en columna
function SNavLayout({ bodyLabel = "Body" }: { bodyLabel?: string }) {
  const screenMode = useScreenMode()
  const isMobile   = screenMode === "mobile"
  const isTablet   = screenMode === "tablet"

  if (!isMobile) {
    return (
      <SRow>
        <SBox className={isTablet ? "w-[52px] h-full shrink-0" : "w-[250px] h-full shrink-0"} label={isTablet ? undefined : "Side menu"} />
        <SBox className="flex-1 h-full min-w-0" label={bodyLabel} />
      </SRow>
    )
  }

  // Mobile: tabs arriba, body debajo
  return (
    <div className="flex flex-1 min-h-0 flex-col gap-2 overflow-hidden">
      <SHorizontalNav />
      <SBox className="flex-1 min-w-0 w-full" label={bodyLabel} />
    </div>
  )
}

// ─── Kanban ───────────────────────────────────────────────────────────────────
//
// Desktop  → 4 columnas visibles
// Tablet   → 2 columnas visibles (carrusel 2 páginas en real)
// Mobile   → 1 columna visible  (carrusel 4 páginas en real)

export function SkeletonKanban() {
  const screenMode = useScreenMode()
  const isTablet   = screenMode === "tablet"
  const isMobile   = screenMode === "mobile"

  const ALL_COLS   = ["Columna 1", "Columna 2", "Columna 3", "Columna 4"]
  const visibleCols = isMobile ? ALL_COLS.slice(0, 1) : isTablet ? ALL_COLS.slice(0, 2) : ALL_COLS

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden bg-zinc-700 w-full">

      <STopbar />

      {/* Toolbar wrapper px-2 → card rounded-lg p-3 */}
      <div className="px-2 shrink-0">
        <div className="h-[58px] bg-white rounded-lg flex items-center justify-center">
          <SLabel>Toolbar</SLabel>
        </div>
      </div>

      {/* Board: px-2 horizontal únicamente, sin padding inferior */}
      <div className="flex-1 min-h-0 flex gap-2 px-2 overflow-hidden">
        {visibleCols.map((label) => (
          <div
            key={label}
            className="relative flex flex-1 min-w-0 rounded-t-[8px] bg-white items-center justify-center"
          >
            <SLabel>{label}</SLabel>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Configuración General ────────────────────────────────────────────────────
//
// Desktop → Side menu w-[250px] + Form en fila
// Tablet  → HorizontalNav + Form en columna
// Mobile  → HorizontalNav + Form en columna

export function SkeletonConfiguracion() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-zinc-700 w-full">
      <STopbar />
      <SContent>
        <SToolbar />
        <SNavLayout bodyLabel="Body" />
      </SContent>
    </div>
  )
}

// ─── Tareas Pendientes ────────────────────────────────────────────────────────
//
// Sin side menu en ningún breakpoint. Solo tabla.

export function SkeletonTareasPendientes() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-zinc-700 w-full">
      <STopbar />
      <SContent>
        <SToolbar />
        <SBox className="flex-1 min-w-0 w-full" label="Tabla" />
      </SContent>
    </div>
  )
}

// ─── Cuentas de Usuarios ──────────────────────────────────────────────────────
//
// Desktop → Side menu w-[250px] + Tabla en fila
// Tablet  → HorizontalNav + Tabla en columna
// Mobile  → HorizontalNav + Lista mobile en columna

export function SkeletonCuentasUsuarios() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-zinc-700 w-full">
      <STopbar />
      <SContent>
        <SToolbar />
        <SNavLayout bodyLabel="Tabla" />
      </SContent>
    </div>
  )
}

// ─── Detalle Medidor ──────────────────────────────────────────────────────────
//
// Desktop → Side menu w-[250px] + Body en fila
// Tablet  → HorizontalNav + Body en columna
// Mobile  → HorizontalNav + Body en columna

export function SkeletonDetalleMedidor() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-zinc-700 w-full">
      <STopbar />
      <SContent>
        <SToolbar />
        <SNavLayout bodyLabel="Body" />
      </SContent>
    </div>
  )
}

// ─── Vista Árbol ──────────────────────────────────────────────────────────────
//
// Sin side menu en ningún breakpoint. Solo árbol.

export function SkeletonVistaArbol() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-zinc-700 w-full">
      <STopbar />
      <SContent>
        <SToolbar />
        <SBox className="flex-1 min-w-0 w-full" label="Árbol" />
      </SContent>
    </div>
  )
}

// ─── Detalle Empleado ─────────────────────────────────────────────────────────
//
// Desktop → Side menu w-[250px] + Body en fila
// Tablet  → HorizontalNav + Body en columna
// Mobile  → HorizontalNav + Body en columna

export function SkeletonDetalleEmpleado() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-zinc-700 w-full">
      <STopbar />
      <SContent>
        <SToolbar />
        <SNavLayout bodyLabel="Body" />
      </SContent>
    </div>
  )
}
