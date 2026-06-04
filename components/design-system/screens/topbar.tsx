"use client"

import { useState } from "react"
import { Bell, Menu, Search, Gift, Rocket, BookOpen, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { translations } from "../i18n"
import { useViewer } from "../viewer-context"
import { useScreenMode } from "../screen-mode-context"
import { UserMenuDropdown, UserMenuDropdownMobile } from "./user-menu"
import { AppSidebar } from "./app-sidebar"

// ─── Wrapper común ────────────────────────────────────────────────────────────

function TopbarShell({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground px-2">{label}</span>
      <div className="flex w-full h-[60px] items-center gap-2 border rounded-lg bg-background px-3">
        {children}
      </div>
    </div>
  )
}

// ─── Acciones comunes (derecha) ───────────────────────────────────────────────

function TopbarActions({ showSearch = true }: { showSearch?: boolean }) {
  const t = translations[useViewer().lang]
  const isDesktop = useScreenMode() === "desktop"
  return (
    <div className="flex items-center gap-2 shrink-0">

      {showSearch && (
        <div className="relative w-[210px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input type="search" placeholder={t.topbar.searchPlaceholder} className="pl-8" />
        </div>
      )}

      <div className="flex items-center gap-1">

        {/* Notificaciones — badge primary */}
        <Button variant="secondary" size="icon-sm" className="relative">
          <Bell />
          <Badge
            className="absolute -top-1 -right-1 h-4 min-w-4 px-1 py-0 text-[10px] leading-none bg-primary text-primary-foreground border-2 border-background"
          >
            22
          </Badge>
        </Button>

        {/* Chat */}
        <Button variant="secondary" size="icon-sm">
          <MessageCircle />
        </Button>

        {/* Gift */}
        <Button variant="secondary" size="icon-sm">
          <Gift />
        </Button>

        {/* Rocket */}
        <Button variant="secondary" size="icon-sm">
          <Rocket />
        </Button>

        {/* Docs */}
        <Button variant="secondary" size="icon-sm">
          <BookOpen />
        </Button>

        {/* AI */}
        <Button
          variant="default"
          size={isDesktop ? "sm" : "icon-sm"}
        >
          <Sparkles />
          {isDesktop && "Fracttal AI"}
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8 self-center" />

      <UserMenuDropdown>
        <Avatar size="default">
          <AvatarImage src="https://i.pravatar.cc/150?img=33" />
          <AvatarFallback>FG</AvatarFallback>
        </Avatar>
      </UserMenuDropdown>
    </div>
  )
}

// ─── Variante 1: Título simple + búsqueda + acciones ─────────────────────────

function TopbarDashboard() {
  return (
    <TopbarShell label="Título de página + búsqueda + acciones">
      <div className="flex flex-1 items-center gap-1 min-w-0">
        <Button variant="ghost" size="icon-sm">
          <Menu />
        </Button>
        <span className="text-base font-medium text-foreground truncate">Dashboard</span>
      </div>
      <TopbarActions showSearch />
    </TopbarShell>
  )
}

// ─── Variante 2: Título simple + acciones (sin búsqueda) ─────────────────────

function TopbarNoSearch() {
  return (
    <TopbarShell label="Título de página + acciones (sin búsqueda)">
      <div className="flex flex-1 items-center gap-1 min-w-0">
        <Button variant="ghost" size="icon-sm">
          <Menu />
        </Button>
        <span className="text-base font-medium text-foreground truncate">Dashboard</span>
      </div>
      <TopbarActions showSearch={false} />
    </TopbarShell>
  )
}

// ─── Variante 3: Título + subtítulo + acciones ────────────────────────────────

function TopbarWithSubtitle() {
  return (
    <TopbarShell label="Módulo + sección activa + acciones">
      <div className="flex flex-1 items-center gap-1 min-w-0">
        <Button variant="ghost" size="icon-sm">
          <Menu />
        </Button>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-base font-semibold leading-none text-foreground truncate">Monitoreo</span>
          <span className="text-xs leading-none text-muted-foreground truncate">Medidores</span>
        </div>
      </div>
      <TopbarActions showSearch={false} />
    </TopbarShell>
  )
}

// ─── Acciones mobile (derecha) ───────────────────────────────────────────────

function TopbarActionsMobile() {
  return (
    <div className="flex items-center gap-1">
      <Button variant="default" size="icon-sm">
        <Sparkles />
      </Button>
      <Separator orientation="vertical" className="h-8 self-center" />
      <UserMenuDropdownMobile>
        <Avatar size="default">
          <AvatarImage src="https://i.pravatar.cc/150?img=33" />
          <AvatarFallback>FG</AvatarFallback>
        </Avatar>
      </UserMenuDropdownMobile>
    </div>
  )
}

// ─── TopbarBar: barra real para usar en pantallas ────────────────────────────

export function TopbarBar({
  title      = "Órdenes de trabajo",
  subtitle   = "Vista Kanban",
  showSearch = true,
}: {
  title?:      string
  subtitle?:   string
  showSearch?: boolean
} = {}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div className="flex w-full h-[60px] items-center gap-2 border-b bg-background px-3 shrink-0">
        <div className="flex flex-1 items-center gap-1 min-w-0">
          <Button variant="ghost" size="icon-sm" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </Button>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-base font-semibold leading-none text-foreground truncate">{title}</span>
            {subtitle && <span className="text-xs leading-none text-muted-foreground truncate">{subtitle}</span>}
          </div>
        </div>
        <TopbarActions showSearch={showSearch} />
      </div>

      {/* ── Overlay + sidebar animado ── */}
      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className="absolute inset-0 z-40 bg-overlay/30 backdrop-blur-[1px] transition-opacity duration-300"
        style={{ opacity: sidebarOpen ? 1 : 0, pointerEvents: sidebarOpen ? "auto" : "none" }}
        aria-hidden
      />
      {/* Panel */}
      <div
        className="absolute inset-y-0 left-0 z-50 w-[400px] shadow-xl transition-transform duration-300 ease-in-out overflow-hidden"
        style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        <AppSidebar />
      </div>
    </>
  )
}

// ─── TopbarBarMobile: barra mobile real para usar en pantallas ───────────────

export function TopbarBarMobile({
  title    = "Órdenes de trabajo",
  subtitle,
}: {
  title?:    string
  subtitle?: string
} = {}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div className="flex w-full h-[60px] items-center gap-2 border-b bg-background px-3 shrink-0">
        <Button variant="ghost" size="icon-sm" onClick={() => setSidebarOpen(true)}>
          <Menu />
        </Button>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-base font-semibold leading-none text-foreground truncate">{title}</span>
          {subtitle && <span className="text-xs leading-none text-muted-foreground truncate">{subtitle}</span>}
        </div>

        <TopbarActionsMobile />
      </div>

      <div
        onClick={() => setSidebarOpen(false)}
        className="absolute inset-0 z-40 bg-overlay/30 backdrop-blur-[1px] transition-opacity duration-300"
        style={{ opacity: sidebarOpen ? 1 : 0, pointerEvents: sidebarOpen ? "auto" : "none" }}
        aria-hidden
      />
      <div
        className="absolute inset-y-0 left-0 z-50 w-4/5 shadow-xl transition-transform duration-300 ease-in-out overflow-hidden"
        style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        <AppSidebar />
      </div>
    </>
  )
}

// ─── Variante mobile (showcase) ──────────────────────────────────────────────

function TopbarMobile() {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground px-2">Mobile (400px)</span>
      <div className="w-[400px] h-[60px] flex items-center gap-2 border rounded-lg bg-background px-3">
        {/* Hamburguesa + título */}
        <Button variant="ghost" size="icon-sm">
          <Menu />
        </Button>
        <span className="text-base font-semibold text-foreground">Dashboard</span>

        <div className="flex-1" />

        {/* AI */}
        <Button variant="default" size="icon-sm">
          <Sparkles />
        </Button>

        <Separator orientation="vertical" className="h-8 self-center" />

        {/* Avatar */}
        <UserMenuDropdownMobile>
          <Avatar size="default">
            <AvatarImage src="https://i.pravatar.cc/150?img=33" />
            <AvatarFallback>FG</AvatarFallback>
          </Avatar>
        </UserMenuDropdownMobile>
      </div>
    </div>
  )
}

// ─── Variante mobile con doble título y notificación en avatar ───────────────

function TopbarMobileSubtitle() {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground px-2">Mobile — módulo + sección + notificación en avatar</span>
      <div className="w-[400px] h-[60px] flex items-center gap-2 border rounded-lg bg-background px-3">
        {/* Hamburguesa + doble título */}
        <Button variant="ghost" size="icon-sm">
          <Menu />
        </Button>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-base font-semibold leading-none text-foreground truncate">Monitoreo</span>
          <span className="text-xs leading-none text-muted-foreground truncate">Medidores</span>
        </div>

        <div className="flex-1" />

        {/* AI */}
        <Button variant="default" size="icon-sm">
          <Sparkles />
        </Button>

        <Separator orientation="vertical" className="h-8 self-center" />

        {/* Avatar — badge de notificación lo añade UserMenuDropdownMobile automáticamente */}
        <UserMenuDropdownMobile>
          <Avatar size="default">
            <AvatarImage src="https://i.pravatar.cc/150?img=33" />
            <AvatarFallback>FG</AvatarFallback>
          </Avatar>
        </UserMenuDropdownMobile>
      </div>
    </div>
  )
}

// ─── Topbar: showcase con múltiples variantes ─────────────────────────────────

export function Topbar() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">Desktop</span>
      <TopbarDashboard />
      <TopbarNoSearch />
      <TopbarWithSubtitle />

      <Separator className="my-1.5" />

      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">Mobile</span>
      <TopbarMobile />
      <TopbarMobileSubtitle />
    </div>
  )
}
