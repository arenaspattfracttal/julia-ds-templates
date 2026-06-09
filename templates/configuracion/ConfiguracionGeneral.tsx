"use client"

import { useState, useEffect, useLayoutEffect, useRef } from "react"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Camera, Save, Bell, MessageCircle,
  Sparkles, PanelLeftClose, PanelLeftOpen, ChevronLeft, ImageIcon,
} from "lucide-react"
import { Button }      from "@/components/ui/button"
import { Input }       from "@/components/ui/input"
import { Label }       from "@/components/ui/label"
import { ScrollArea }  from "@/components/ui/scroll-area"
import { Separator }  from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge }       from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Eye, Upload, Trash2 } from "lucide-react"
import { ScreenModeProvider } from "@/components/design-system/screen-mode-context"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ScreenMode = "desktop" | "tablet" | "mobile"

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "general",   label: "General",                icon: Settings   },
  { id: "users",     label: "Cuentas de Usuarios",    icon: Users      },
  { id: "calendar",  label: "Calendario laboral",     icon: Calendar   },
  { id: "modules",   label: "Módulos",                icon: LayoutGrid },
  { id: "financial", label: "Financiero",             icon: CreditCard },
  { id: "catalogs",  label: "Catálogos Auxiliares",   icon: BookOpen   },
  { id: "docs",      label: "Gestión Documental",     icon: FileText   },
  { id: "logs",      label: "Log de Transacciones",   icon: History    },
  { id: "security",  label: "Seguridad",              icon: Shield     },
  { id: "api",       label: "Conexiones API",         icon: Plug       },
  { id: "guests",    label: "Portal de invitados",    icon: UserCheck  },
  { id: "account",   label: "Cuenta",                 icon: User       },
  { id: "printing",  label: "Impresiones de OTs",     icon: Printer    },
] as const

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ title, mode }: { title: string; mode: ScreenMode }) {
  const isMobile = mode === "mobile"
  return (
    <div className={cn(
      "flex w-full items-center gap-2 border-b bg-background px-3 shrink-0",
      isMobile ? "h-14" : "h-[60px]",
    )}>
      {/* Logo Fracttal */}
      <svg viewBox="0 0 500 500" className="size-6 text-primary shrink-0" aria-label="Fracttal">
        <path fill="currentColor" d="M243.57,301c-14.32,0-25.92,11.61-25.92,25.92s11.61,25.92,25.92,25.92,25.92-11.61,25.92-25.92-11.61-25.92-25.92-25.92Z"/>
        <path fill="currentColor" d="M310.05,260.54c-15.41,0-27.89,12.48-27.89,27.89s12.48,27.89,27.89,27.89,27.89-12.48,27.89-27.89-12.48-27.89-27.89-27.89Z"/>
        <path fill="currentColor" d="M310.05,183.59c-15.41,0-27.89,12.48-27.89,27.89s12.48,27.89,27.89,27.89,27.89-12.48,27.89-27.89-12.48-27.89-27.89-27.89Z"/>
        <path fill="currentColor" d="M243.57,147.11c-14.3,0-25.92,11.62-25.92,25.92s11.62,25.92,25.92,25.92,25.92-11.62,25.92-25.92-11.62-25.92-25.92-25.92Z"/>
        <path fill="currentColor" d="M177.08,233.8c12.34,0,22.32-9.98,22.32-22.32s-9.99-22.32-22.32-22.32-22.32,9.98-22.32,22.32,9.99,22.32,22.32,22.32Z"/>
        <path fill="currentColor" d="M177.08,310.75c12.34,0,22.32-9.98,22.32-22.32s-9.99-22.32-22.32-22.32-22.32,9.98-22.32,22.32,9.99,22.32,22.32,22.32Z"/>
        <path fill="currentColor" d="M376.25,220.07c-16.52,0-29.91,13.39-29.91,29.9s13.39,29.91,29.91,29.91,29.91-13.39,29.91-29.91-13.39-29.9-29.91-29.9Z"/>
      </svg>

      <span className="text-sm font-semibold text-foreground">{title}</span>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <Button variant="secondary" size="icon-sm" className="relative">
          <Bell className="size-4" />
          <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 py-0 text-[10px] leading-none bg-primary text-primary-foreground border-2 border-background">
            3
          </Badge>
        </Button>
        <Button variant="secondary" size="icon-sm">
          <MessageCircle className="size-4" />
        </Button>
        {!isMobile && (
          <Button size="sm" className="gap-1.5">
            <Sparkles className="size-3.5" />
            AI
          </Button>
        )}
      </div>

      <Avatar className="size-8 cursor-pointer">
        <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
          UR
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

// ─── Logo upload ──────────────────────────────────────────────────────────────

function LogoUpload({ isMobile }: { isMobile: boolean }) {
  const [imageUrl, setImageUrl]       = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen]   = useState(false)
  const fileInputRef                  = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    // reset input para permitir subir el mismo archivo de nuevo
    e.target.value = ""
  }

  function handleDelete() {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(null)
  }

  return (
    <>
      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Logo de la empresa</DialogTitle>
          </DialogHeader>
          {imageUrl ? (
            <img src={imageUrl} alt="Logo empresa" className="w-full rounded-lg object-contain max-h-72" />
          ) : (
            <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">No hay imagen cargada</span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmar eliminar */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará el logo de la empresa. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contenedor imagen */}
      <div className={cn(
        "relative rounded-lg border border-border bg-card flex items-center justify-center overflow-hidden",
        isMobile ? "w-full h-[140px]" : "w-full h-full",
      )}>
        {imageUrl ? (
          <img src={imageUrl} alt="Logo empresa" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className={cn("text-muted-foreground/40", isMobile ? "size-16" : "size-12")} />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" size="icon" className="absolute bottom-1.5 right-1.5 size-7" aria-label="Cambiar logo">
              <Camera className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setPreviewOpen(true)}>
              <Eye className="size-3.5" />
              Ver imagen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-3.5" />
              Subir imagen
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="size-3.5" />
              Eliminar imagen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

// ─── Map (OpenStreetMap iframe) ───────────────────────────────────────────────

const LAT = 6.2017336
const LNG = -75.576614
const DELTA = 0.008

const MAP_URL =
  `https://www.openstreetmap.org/export/embed.html` +
  `?bbox=${LNG - DELTA}%2C${LAT - DELTA}%2C${LNG + DELTA}%2C${LAT + DELTA}` +
  `&layer=mapnik&marker=${LAT}%2C${LNG}`

function MapEmbed() {
  return (
    <div className="relative rounded-lg border overflow-hidden min-h-[220px] bg-muted">
      <iframe
        src={MAP_URL}
        title="Ubicación en el mapa"
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}

// ─── Field atoms ──────────────────────────────────────────────────────────────

function Field({ label, value, className }: { label: string; value?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input className="w-full" defaultValue={value} />
    </div>
  )
}

function SelectField({
  label, value, options = [], className,
}: { label: string; value?: string; options?: string[]; className?: string }) {
  const items = options.length ? options : value ? [value] : []
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select defaultValue={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          {items.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

// ─── Horizontal nav (mobile) ──────────────────────────────────────────────────

function HorizontalNav({ active, onSelect }: {
  active:   string
  onSelect: (id: string) => void
}) {
  const scrollRef             = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd,   setAtEnd]   = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    function update() {
      if (!el) return
      setAtStart(el.scrollLeft <= 0)
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
    }
    update()
    el.addEventListener("scroll", update)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => { el.removeEventListener("scroll", update); ro.disconnect() }
  }, [])

  const mask =
    atStart && atEnd ? undefined
    : atStart ? "linear-gradient(to right, black 91%, transparent 100%)"
    : atEnd   ? "linear-gradient(to right, transparent 0%, black 9%, black 100%)"
    : "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)"

  return (
    <Tabs value={active} onValueChange={onSelect} className="shrink-0">
      <div className="rounded-lg border border-border bg-background overflow-hidden">
        <div
          ref={scrollRef}
          className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ maskImage: mask, WebkitMaskImage: mask }}
        >
          <TabsList variant="white" className="!h-fit !border-0 !rounded-none !bg-transparent">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="flex-col gap-1 px-2.5 py-2">
                <Icon className="size-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
    </Tabs>
  )
}

// ─── Settings nav ─────────────────────────────────────────────────────────────

function SettingsNav({
  active, onSelect, mode, minimized = false, onToggleMinimize,
}: {
  active: string
  onSelect: (id: string) => void
  mode: ScreenMode
  minimized?: boolean
  onToggleMinimize?: () => void
}) {
  const isMobileNav = mode === "mobile"
  const iconOnly    = minimized

  return (
    <div className={cn(
      "flex flex-col rounded-lg border bg-background overflow-hidden transition-all duration-300",
      minimized     ? "w-[56px] shrink-0"
      : isMobileNav ? "w-full h-full"
      : "w-[250px] shrink-0",
    )}>
      {!isMobileNav && onToggleMinimize && (
        <div className={cn(
          "h-12 px-2 flex items-center border-b border-border shrink-0",
          minimized ? "justify-center" : "justify-between",
        )}>
          {!minimized && (
            <span className="text-xs font-medium text-foreground/60 px-1">Secciones</span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={onToggleMinimize}
              >
                {minimized ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {minimized ? "Expandir menú" : "Minimizar menú"}
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className={cn("flex flex-col gap-0.5 p-2", minimized && "items-center")}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              size={iconOnly ? "icon-sm" : "sm"}
              className={cn(
                !iconOnly && "w-full justify-start",
                active === id
                  ? "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary"
                  : "text-foreground/80",
              )}
              onClick={() => onSelect(id)}
            >
              <Icon className={cn("size-4 shrink-0", active === id ? "text-primary" : "text-muted-foreground")} />
              {!iconOnly && label}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  title, children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 py-4">
      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
        {title}
      </span>
      {children}
    </div>
  )
}

// ─── General form ─────────────────────────────────────────────────────────────

export function GeneralForm({ isMobile }: { isMobile: boolean }) {
  const cols = isMobile ? "grid-cols-1" : "grid-cols-2"

  return (
    <div className="p-4">
      <div className="w-full max-w-2xl mx-auto">

        {/* ── Identidad corporativa ──────────────────────────────────────── */}
        <SectionCard title="Identidad corporativa">
          <div className="flex flex-col gap-3">
            <div className={cn(
              "rounded-lg border border-border bg-muted overflow-hidden",
              isMobile ? "h-[140px]" : "h-[100px]",
            )}>
              <LogoUpload isMobile={isMobile} />
            </div>
            <div className={cn("grid gap-x-4 gap-y-3", cols)}>
              <Field label="Código" value="451"                       className="min-w-0" />
              <Field label="Nombre" value="Fracttal Demo"             className="min-w-0" />
              <Field label="Email"  value="pablo.moreno@fracttal.com" className="min-w-0" />
              <SelectField
                label="Moneda"
                value="Colombian Peso"
                options={["Colombian Peso", "US Dollar", "Euro"]}
                className="min-w-0"
              />
              <div className={cn("min-w-0", !isMobile && "col-span-2")}>
                <SelectField
                  label="Separador de miles"
                  value="(.) El carácter utilizado es una coma"
                  options={[
                    "(.) El carácter utilizado es una coma",
                    "(,) El carácter utilizado es un punto",
                  ]}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <Separator />

        {/* ── Configuración regional ─────────────────────────────────────── */}
        <SectionCard title="Configuración regional">
          <div className={cn("grid gap-x-4 gap-y-3", cols)}>
            <SelectField
              label="Zona horaria UTC"
              value="America/Sao_Paulo"
              options={["America/Sao_Paulo", "America/Bogota", "America/New_York", "Europe/Madrid"]}
              className="min-w-0"
            />
            <SelectField
              label="Idioma para correos"
              value="Español"
              options={["Español", "English", "Português"]}
              className="min-w-0"
            />
            <div className={cn("min-w-0", !isMobile && "col-span-2")}>
              <SelectField
                label="Valoración de existencias"
                value="PMP (Promedio)"
                options={["PMP (Promedio)", "FIFO", "LIFO"]}
              />
            </div>
          </div>
        </SectionCard>

        <Separator />

        {/* ── Dirección y ubicación ──────────────────────────────────────── */}
        <SectionCard title="Dirección y ubicación">
          <div className={cn("grid gap-x-4 gap-y-3", cols)}>
            <div className={cn("min-w-0", !isMobile && "col-span-2")}>
              <Field label="Dirección" value="Arrengo #451 COL" />
            </div>
            <Field label="Ciudad"                         value="Medellín" className="min-w-0" />
            <Field label="Departamento / Estado / Región" value="NA"       className="min-w-0" />
            <Field label="País"                           value="COL"      className="min-w-0" />
            <Field label="Código Área"                    value="7656544"  className="min-w-0" />
            <Field label="Latitud"                        value="6.2017336"  className="min-w-0" />
            <Field label="Longitud"                       value="-75.576614" className="min-w-0" />
            <div className={cn("min-h-[220px] min-w-0", !isMobile && "col-span-2")}>
              <MapEmbed />
            </div>
          </div>
        </SectionCard>

        <Separator />

        {/* ── Contacto ──────────────────────────────────────────────────── */}
        <SectionCard title="Contacto">
          <div className={cn("grid gap-x-4 gap-y-3", cols)}>
            <Field label="Telf. Principal"  value="+57 3193615662"   className="min-w-0" />
            <Field label="Telf. Secundario"                          className="min-w-0" />
            <Field label="Teléfono SMS"                              className="min-w-0" />
            <Field label="Página Web"       value="www.fracttal.com" className="min-w-0" />
          </div>
        </SectionCard>

      </div>
    </div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

function ConfiguracionGeneralInner() {
  const [screenMode, setScreenMode] = useState<ScreenMode>("desktop")
  const [activeNav,  setActiveNav]  = useState("general")
  const [navMinimized, setNavMinimized] = useState(false)

  useEffect(() => {
    function check() {
      const w = window.innerWidth
      setScreenMode(w >= 1024 ? "desktop" : w >= 768 ? "tablet" : "mobile")
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useLayoutEffect(() => {
    setNavMinimized(screenMode === "tablet")
    if (screenMode !== "mobile") setActiveNav(prev => prev || "general")
  }, [screenMode])

  const isMobile  = screenMode === "mobile"
  const isCompact = screenMode !== "desktop"

  const activeItem = NAV_ITEMS.find(n => n.id === activeNav)

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      <Topbar title="Configuración" mode={screenMode} />

      {/* 2 — Área principal */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* 2a — Toolbar */}
        <div className="flex items-center justify-between h-[60px] rounded-lg border bg-background px-3 gap-3 shrink-0">
          <span className="text-sm font-medium text-foreground">Fracttal Demo</span>
          <Button size={isCompact ? "icon-sm" : "sm"} disabled>
            <Save className="size-4" />
            {!isCompact && " Guardar"}
          </Button>
        </div>

        {/* 2b — Nav + contenido */}
        {isMobile ? (
          <div className="flex-1 flex flex-col min-h-0 gap-2 overflow-hidden">
            <HorizontalNav active={activeNav} onSelect={setActiveNav} />
            <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-h-0">
              {activeItem && (
                <div className="h-12 px-3 border-b border-border shrink-0 flex items-center gap-2">
                  <activeItem.icon className="size-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">{activeItem.label}</h2>
                </div>
              )}
              <ScrollArea className="flex-1">
                <GeneralForm isMobile={isMobile} />
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 min-h-0 gap-2 overflow-hidden">
            <SettingsNav
              active={activeNav}
              onSelect={setActiveNav}
              mode={screenMode}
              minimized={navMinimized}
              onToggleMinimize={() => setNavMinimized(v => !v)}
            />
            <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-w-0">
              {activeItem && (
                <div className="h-12 px-3 border-b border-border shrink-0 flex items-center gap-2">
                  <activeItem.icon className="size-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">{activeItem.label}</h2>
                </div>
              )}
              <ScrollArea className="flex-1">
                <GeneralForm isMobile={isMobile} />
              </ScrollArea>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export function ConfiguracionGeneral() {
  const [mode, setMode] = useState<ScreenMode>("desktop")
  useEffect(() => {
    function check() {
      const w = window.innerWidth
      setMode(w >= 1024 ? "desktop" : w >= 768 ? "tablet" : "mobile")
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <ScreenModeProvider mode={mode}>
      <ConfiguracionGeneralInner />
    </ScreenModeProvider>
  )
}
