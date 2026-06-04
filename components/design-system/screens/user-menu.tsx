"use client"

import { useState } from "react"
import { Settings, Globe, Sun, Moon, HelpCircle, Building2, LogOut, ChevronRight, Bell, MessageCircle, Gift, Rocket, BookOpen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// ─── Datos del usuario ────────────────────────────────────────────────────────

const USER = {
  name:     "Carlos Mendoza",
  email:    "carlos.mendoza@fracttal.co",
  company:  "Fracttal Demo",
  initials: "CM",
  avatar:   "https://i.pravatar.cc/150?img=33",
}

// ─── Mode selector — autónomo, lee y escribe el DOM directamente ──────────────
// No necesita props: cualquier instancia puede cambiar el tema
// y siempre refleja el estado real de document.documentElement.

function ModeSelector({ stopPropagation = false }: { stopPropagation?: boolean }) {
  const [dark, setDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  )

  function handleChange(isDark: boolean) {
    setDark(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }

  return (
    <Tabs
      value={dark ? "dark" : "light"}
      onValueChange={(v) => handleChange(v === "dark")}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      <TabsList className="!p-[3px]">
        <TabsTrigger value="light" aria-label="Modo claro" className="!py-1 px-2.5">
          <Sun className="size-3.5" />
        </TabsTrigger>
        <TabsTrigger value="dark" aria-label="Modo oscuro" className="!py-1 px-2.5">
          <Moon className="size-3.5" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

// ─── MenuDivider — hairline consistente ──────────────────────────────────────
// Footprint par (8px) + línea fuera de flujo. Garantiza que todos los
// separadores del menú caigan en la misma posición de subpíxel, evitando que en
// pantallas con escalado fraccionario (DPR 1.5) unos se rendericen a 1px y otros
// a 2px. Reemplaza el patrón `my-1 h-px` (footprint impar de 9px) que alternaba
// la alineación con la rejilla en cada separador.

function MenuDivider() {
  return (
    <div className="relative -mx-1 h-2">
      {/* border-t (no bg-fill): el navegador ajusta los bordes a la rejilla de
          píxeles y los renderiza nítidos, evitando el antialiasing borroso que
          sufre un relleno de 1px cuando cae desfasado en pantallas DPR 1.5. */}
      <div className="absolute inset-x-0 top-1/2 border-t border-border" />
    </div>
  )
}

// ─── UserMenuDropdown — wrapper reutilizable para cualquier trigger ────────────

export function UserMenuDropdown({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
        >
          {children}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end">

        {/* Header usuario */}
        <div className="flex items-center gap-3 p-2">
          <Avatar size="lg">
            <AvatarImage src={USER.avatar} />
            <AvatarFallback>{USER.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-semibold leading-none truncate">{USER.name}</span>
            <span className="text-sm text-muted-foreground truncate leading-5">{USER.email}</span>
            <span className="text-sm text-muted-foreground truncate leading-5">{USER.company}</span>
          </div>
        </div>

        <MenuDivider />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings />
            Configuración
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger><Globe />Lenguaje</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Español</DropdownMenuItem>
              <DropdownMenuItem>English</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger><HelpCircle />Ayuda y Soporte Técnico</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Documentación</DropdownMenuItem>
              <DropdownMenuItem>Contactar soporte</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem>
            <Building2 />
            Cambiar de compañía
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <MenuDivider />

        {/* Fila final: Cerrar Sesión + selector de modo */}
        <div className="flex items-center justify-between gap-1 px-1 pb-1">
          <DropdownMenuItem className="text-primary focus:text-primary focus:bg-primary/10 cursor-pointer">
            <LogOut className="text-primary!" />
            Cerrar Sesión
          </DropdownMenuItem>
          {/* stopPropagation evita que el click cierre el dropdown */}
          <ModeSelector stopPropagation />
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── UserMenuDropdownMobile — variante mobile con acciones de topbar ─────────

const MOBILE_ACTIONS = [
  { icon: Bell,          label: "Notificaciones", badge: 22 },
  { icon: MessageCircle, label: "Chat"                      },
  { icon: Gift,          label: "Novedades"                 },
  { icon: Rocket,        label: "Lanzamientos"              },
  { icon: BookOpen,      label: "Docs"                      },
] as const

function MobileActionsRow() {
  return (
    <div className="flex items-center justify-around px-1 py-1">
      {MOBILE_ACTIONS.map(({ icon: Icon, label, ...rest }) => {
        const badge = "badge" in rest ? (rest as { badge: number }).badge : undefined
        return (
          <Button key={label} variant="secondary" size="icon-sm" aria-label={label} className="relative">
            <Icon className="size-4" />
            {badge !== undefined && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 py-0 text-[10px] leading-none bg-primary text-primary-foreground border-2 border-background pointer-events-none">
                {badge}
              </Badge>
            )}
          </Button>
        )
      })}
    </div>
  )
}

export function UserMenuDropdownMobile({ children }: { children: React.ReactNode }) {
  const notifCount = (MOBILE_ACTIONS.find(a => a.label === "Notificaciones") as { badge?: number } | undefined)?.badge ?? 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
        >
          {children}
          {notifCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 py-0 text-[10px] leading-none bg-primary text-primary-foreground border-2 border-background pointer-events-none">
              {notifCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end">

        {/* Fila de acciones rápidas */}
        <MobileActionsRow />

        <MenuDivider />

        {/* Header usuario */}
        <div className="flex items-center gap-3 p-2">
          <Avatar size="lg">
            <AvatarImage src={USER.avatar} />
            <AvatarFallback>{USER.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-semibold leading-none truncate">{USER.name}</span>
            <span className="text-sm text-muted-foreground truncate leading-5">{USER.email}</span>
            <span className="text-sm text-muted-foreground truncate leading-5">{USER.company}</span>
          </div>
        </div>

        <MenuDivider />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings />
            Configuración
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger><Globe />Lenguaje</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Español</DropdownMenuItem>
              <DropdownMenuItem>English</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger><HelpCircle />Ayuda y Soporte Técnico</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Documentación</DropdownMenuItem>
              <DropdownMenuItem>Contactar soporte</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem>
            <Building2 />
            Cambiar de compañía
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <MenuDivider />

        {/* Fila final: Cerrar Sesión + selector de modo */}
        <div className="flex items-center justify-between gap-1 px-1 pb-1">
          <DropdownMenuItem className="text-primary focus:text-primary focus:bg-primary/10 cursor-pointer">
            <LogOut className="text-primary!" />
            Cerrar Sesión
          </DropdownMenuItem>
          <ModeSelector stopPropagation />
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Vista estática siempre visible (showcase) ────────────────────────────────

function StaticUserMenu() {
  const item = "w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground outline-none"

  return (
    <div className="w-64 rounded-md border bg-popover text-popover-foreground shadow-md p-1">

      <div className="flex items-center gap-3 p-2">
        <Avatar size="lg">
          <AvatarImage src={USER.avatar} />
          <AvatarFallback>{USER.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold leading-none truncate">{USER.name}</span>
          <span className="text-sm text-muted-foreground truncate leading-5">{USER.email}</span>
          <span className="text-sm text-muted-foreground truncate leading-5">{USER.company}</span>
        </div>
      </div>

      <MenuDivider />

      <button type="button" className={item}>
        <Settings className="size-4 shrink-0 text-muted-foreground" />
        Configuración
      </button>
      <button type="button" className={cn(item, "justify-between")}>
        <div className="flex items-center gap-2">
          <Globe className="size-4 shrink-0 text-muted-foreground" />
          Lenguaje
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </button>
      <button type="button" className={cn(item, "justify-between")}>
        <div className="flex items-center gap-2">
          <HelpCircle className="size-4 shrink-0 text-muted-foreground" />
          Ayuda y Soporte Técnico
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </button>
      <button type="button" className={item}>
        <Building2 className="size-4 shrink-0 text-muted-foreground" />
        Cambiar de compañía
      </button>

      <MenuDivider />

      {/* Fila final: Cerrar Sesión + selector de modo */}
      <div className="flex items-center justify-between px-1 gap-1">
        <button type="button" className={cn(item, "text-primary hover:bg-primary/10 hover:text-primary flex-none w-auto")}>
          <LogOut className="size-4 shrink-0" />
          Cerrar Sesión
        </button>
        <ModeSelector />
      </div>

    </div>
  )
}

// ─── Vista estática mobile (showcase) ────────────────────────────────────────

function StaticUserMenuMobile() {
  const item = "w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground outline-none"

  return (
    <div className="w-64 rounded-md border bg-popover text-popover-foreground shadow-md p-1">

      {/* Fila de acciones rápidas */}
      <div className="flex items-center justify-around px-1 py-1">
        {MOBILE_ACTIONS.map(({ icon: Icon, label }) => (
          <Button key={label} variant="secondary" size="icon-sm" aria-label={label}>
            <Icon className="size-4" />
          </Button>
        ))}
      </div>

      <MenuDivider />

      <div className="flex items-center gap-3 p-2">
        <Avatar size="lg">
          <AvatarImage src={USER.avatar} />
          <AvatarFallback>{USER.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold leading-none truncate">{USER.name}</span>
          <span className="text-sm text-muted-foreground truncate leading-5">{USER.email}</span>
          <span className="text-sm text-muted-foreground truncate leading-5">{USER.company}</span>
        </div>
      </div>

      <MenuDivider />

      <button type="button" className={item}>
        <Settings className="size-4 shrink-0 text-muted-foreground" />
        Configuración
      </button>
      <button type="button" className={cn(item, "justify-between")}>
        <div className="flex items-center gap-2">
          <Globe className="size-4 shrink-0 text-muted-foreground" />
          Lenguaje
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </button>
      <button type="button" className={cn(item, "justify-between")}>
        <div className="flex items-center gap-2">
          <HelpCircle className="size-4 shrink-0 text-muted-foreground" />
          Ayuda y Soporte Técnico
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </button>
      <button type="button" className={item}>
        <Building2 className="size-4 shrink-0 text-muted-foreground" />
        Cambiar de compañía
      </button>

      <MenuDivider />

      <div className="flex items-center justify-between px-1 gap-1">
        <button type="button" className={cn(item, "text-primary hover:bg-primary/10 hover:text-primary flex-none w-auto")}>
          <LogOut className="size-4 shrink-0" />
          Cerrar Sesión
        </button>
        <ModeSelector />
      </div>

    </div>
  )
}

// ─── Showcase ─────────────────────────────────────────────────────────────────

export function UserMenu() {
  return (
    <div className="flex-1 flex flex-col gap-10 items-center justify-center p-8">

      {/* ── Variante default ── */}
      <div className="flex flex-col gap-3 w-full max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
          Default
        </span>
        <div className="flex items-start gap-12 flex-wrap">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-muted-foreground">Trigger</span>
            <UserMenuDropdown>
              <Avatar size="default">
                <AvatarImage src={USER.avatar} />
                <AvatarFallback>{USER.initials}</AvatarFallback>
              </Avatar>
            </UserMenuDropdown>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <span className="text-xs text-muted-foreground">Vista previa</span>
            <StaticUserMenu />
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Variante mobile ── */}
      <div className="flex flex-col gap-3 w-full max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
          Mobile
        </span>
        <div className="flex items-start gap-12 flex-wrap">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-muted-foreground">Trigger</span>
            <UserMenuDropdownMobile>
              <Avatar size="default">
                <AvatarImage src={USER.avatar} />
                <AvatarFallback>{USER.initials}</AvatarFallback>
              </Avatar>
            </UserMenuDropdownMobile>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <span className="text-xs text-muted-foreground">Vista previa</span>
            <StaticUserMenuMobile />
          </div>
        </div>
      </div>

    </div>
  )
}
