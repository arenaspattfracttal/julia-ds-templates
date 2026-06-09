"use client"

import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import {
  Settings, Users, Calendar, LayoutGrid, CreditCard,
  BookOpen, FileText, History, Shield, Plug, UserCheck,
  User, Printer, Save, Plus,
  PanelLeftClose, PanelLeftOpen,
  Eye, Pencil, Trash2, Lock,
  Info, EllipsisVertical, ChevronDown,
  Layers, Wrench, Package, ClipboardList, Cpu,
  ArrowLeft, RotateCcw, ListFilter, SlidersHorizontal,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button }      from "@/components/ui/button"
import { Badge }       from "@/components/ui/badge"
import { Checkbox }    from "@/components/ui/checkbox"
import { ScrollArea }  from "@/components/ui/scroll-area"
import { Separator }   from "@/components/ui/separator"
import { TopbarBar, TopbarBarMobile } from "@/components/design-system/screens/topbar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable, type ColumnDef } from "@/components/ui/data-table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScreenModeProvider } from "@/components/design-system/screen-mode-context"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ScreenMode = "desktop" | "tablet" | "mobile"

type Perfil = "Administrador" | "Técnico" | "Sólo Lectura" | "Solicitudes" | "Personalizado"

type Usuario = {
  id:             number
  habilitado:     boolean
  nombre:         string
  email:          string
  tipoUsuario:    string
  perfil:         Perfil
  grupoPermisos:  string
  verificado:     boolean
  bloqueado:      boolean
}

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

// ─── Data ─────────────────────────────────────────────────────────────────────

const USUARIOS: Usuario[] = [
  { id:  1, habilitado: true,  nombre: "AAAA USUARIO USUARIO USUARIO USUARIO o DEMO FRACTTAL", email: "derpickel@gmail.com",                    tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  2, habilitado: true,  nombre: "Adri Z",                                                email: "adriana.zambrano@fracttal.com",           tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  3, habilitado: true,  nombre: "ALEJANDRO AGUILAR",                                     email: "alejandro.aguilar@fracttal.com",          tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  4, habilitado: true,  nombre: "Alejandro Caro",                                        email: "alejandro.caro@fracttal.com",             tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  5, habilitado: true,  nombre: "Alejandro caro tecnico 1",                              email: "alejocaro-qa@yopmail.com",                tipoUsuario: "Recursos Humanos", perfil: "Técnico",       grupoPermisos: "ADMIN TAMAYO",        verificado: true, bloqueado: false },
  { id:  6, habilitado: true,  nombre: "Alejandro Tamayo",                                      email: "altamayoag@gmail.com",                    tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  7, habilitado: true,  nombre: "Alejandro Tamayo",                                      email: "alejandrotamayoagudelo@gmail.com",        tipoUsuario: "Recursos Humanos", perfil: "Sólo Lectura",  grupoPermisos: "Solo Lectura Tamayo", verificado: true, bloqueado: false },
  { id:  8, habilitado: true,  nombre: "Alexander Fuentes",                                     email: "alexander.fuentes@fracttal.com",          tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id:  9, habilitado: true,  nombre: "Alfred",                                                email: "up170660@alumnos.upa.edu.mx",             tipoUsuario: "Recursos Humanos", perfil: "Solicitudes",   grupoPermisos: "",                    verificado: true, bloqueado: false },
  { id: 10, habilitado: true,  nombre: "Alfredo Sandoval",                                      email: "alfredo.sandoval@fracttal.com",           tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 11, habilitado: true,  nombre: "Alfred SV",                                             email: "alfredosandoval76@gmail.com",             tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 12, habilitado: true,  nombre: "Andrea Angarita",                                       email: "andrea.angarita@fracttal.com",            tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 13, habilitado: true,  nombre: "arturo.castro@fracttal.com",                            email: "arturo.castro@fracttal.com",              tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 14, habilitado: true,  nombre: "AZR",                                                   email: "adrianay.zambrano@gmail.com",             tipoUsuario: "Recursos Humanos", perfil: "Personalizado", grupoPermisos: "ADMIN TAMAYO",        verificado: true, bloqueado: false },
  { id: 15, habilitado: true,  nombre: "Beatriz Quintero",                                      email: "beatriz.quintero@fracttal.com",           tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 16, habilitado: true,  nombre: "Carlos Mendoza",                                        email: "carlos.mendoza@fracttal.com",             tipoUsuario: "Recursos Humanos", perfil: "Técnico",       grupoPermisos: "ADMIN TAMAYO",        verificado: true, bloqueado: false },
  { id: 17, habilitado: false, nombre: "Carmen Ruiz",                                           email: "carmen.ruiz@fracttal.com",                tipoUsuario: "Recursos Humanos", perfil: "Sólo Lectura",  grupoPermisos: "Solo Lectura Tamayo", verificado: true, bloqueado: false },
  { id: 18, habilitado: true,  nombre: "Daniel Moreno",                                         email: "daniel.moreno@fracttal.com",              tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
  { id: 19, habilitado: true,  nombre: "Diana Castillo",                                        email: "diana.castillo@fracttal.com",             tipoUsuario: "Recursos Humanos", perfil: "Técnico",       grupoPermisos: "ADMIN TAMAYO",        verificado: true, bloqueado: false },
  { id: 20, habilitado: true,  nombre: "Eduardo Silva",                                         email: "eduardo.silva@fracttal.com",              tipoUsuario: "Recursos Humanos", perfil: "Administrador", grupoPermisos: "Administrador",       verificado: true, bloqueado: false },
]

const STATS = [
  { label: "Cuentas de Usuarios",        used: 0, max: "120"       },
  { label: "Cuentas Técnico limitado",   used: 0, max: "30"        },
  { label: "Cuentas de solicitudes",     used: 0, max: "Ilimitado" },
  { label: "Cuentas de solo lectura",    used: 0, max: "Ilimitado" },
]

// ─── Datos de permisos ────────────────────────────────────────────────────────

type GrupoPermiso = {
  id:          number
  descripcion: string
  nota:        string
  soloLectura: boolean
}

const GRUPOS: GrupoPermiso[] = [
  { id:  1, descripcion: "AAA Grupo MRX",                          nota: "",                                          soloLectura: false },
  { id:  2, descripcion: "Administrador",                          nota: "Grupo de permisos predeterminado",          soloLectura: false },
  { id:  3, descripcion: "Admin Oauth Alfred",                     nota: "",                                          soloLectura: false },
  { id:  4, descripcion: "Adminstrador de Negocios",               nota: "Todas las opciones son seleccionadas",      soloLectura: false },
  { id:  5, descripcion: "ADMIN TAMAYO",                           nota: "",                                          soloLectura: false },
  { id:  6, descripcion: "Admouath",                               nota: "",                                          soloLectura: false },
  { id:  7, descripcion: "Alfred TEC",                             nota: "",                                          soloLectura: false },
  { id:  8, descripcion: "Alfred TI- MTTO",                        nota: "",                                          soloLectura: false },
  { id:  9, descripcion: "ALL_PERMISSIONS",                        nota: "",                                          soloLectura: false },
  { id: 10, descripcion: "AUDITOR PARKS",                          nota: "ahora si se pudo reducir la lista de perm", soloLectura: true  },
  { id: 11, descripcion: "CARLOS ALFREDO - GRUPO 1 TESTE",         nota: "GRUPO 1 TESTE",                             soloLectura: false },
  { id: 12, descripcion: "Carlos Alfredo - Perfil pedidos",        nota: "",                                          soloLectura: false },
  { id: 13, descripcion: "Carlos alfredo Perfil Técnico",          nota: "",                                          soloLectura: false },
  { id: 14, descripcion: "CARLOS SOLICITAÇÃO DE SERVIÇOS TESTE",   nota: "",                                          soloLectura: false },
  { id: 15, descripcion: "CARLOS TESTES PLANEJADORES",             nota: "",                                          soloLectura: false },
  { id: 16, descripcion: "chefe de manutenção",                    nota: "",                                          soloLectura: false },
  { id: 17, descripcion: "Demo Grupo Lectura",                     nota: "",                                          soloLectura: true  },
  { id: 18, descripcion: "Grupo Básico",                           nota: "Acceso a módulos básicos",                  soloLectura: false },
  { id: 19, descripcion: "Grupo Operativo",                        nota: "",                                          soloLectura: false },
  { id: 20, descripcion: "Solo Lectura Tamayo",                    nota: "Permisos de consulta únicamente",           soloLectura: true  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function perfilVariant(p: Perfil) {
  if (p === "Administrador") return "default"   as const
  if (p === "Técnico")       return "secondary" as const
  if (p === "Sólo Lectura")  return "outline"   as const
  if (p === "Solicitudes")   return "info"      as const
  return "outline" as const
}

// ─── Nuevo usuario — datos ────────────────────────────────────────────────────

const TIPOS_USUARIO = ["Recursos Humanos", "Técnico", "Contratista", "Administrador"]
const PERFILES_FORM = ["Administrador", "Técnico", "Sólo Lectura", "Solicitudes", "Personalizado"]
const GRUPOS_FORM   = ["Administrador", "ADMIN TAMAYO", "Solo Lectura Tamayo", "Grupo Básico", "Grupo Operativo"]
const MODULOS_FORM  = ["Dashboard", "Activos", "Mantenimiento", "Inventario", "Reportes"]

type NuevoUsuarioFormData = {
  tipoUsuario:         string
  habilitado:          boolean
  nombre:              string
  email:               string
  perfil:              string
  grupoPermisos:       string
  permitirEditar:      boolean
  visualizarDashboard: boolean
  modulo:              string
  ssoOnly:             boolean
  recibirCorreo:       boolean
}

// ─── Nuevo usuario — pantalla ─────────────────────────────────────────────────

function NuevoUsuarioScreen({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [form, setForm] = useState<NuevoUsuarioFormData>({
    tipoUsuario:         "Recursos Humanos",
    habilitado:          true,
    nombre:              "",
    email:               "",
    perfil:              "",
    grupoPermisos:       "",
    permitirEditar:      false,
    visualizarDashboard: true,
    modulo:              "Dashboard",
    ssoOnly:             false,
    recibirCorreo:       true,
  })
  const [submitted, setSubmitted] = useState(false)
  const [isDirty,   setIsDirty]   = useState(false)

  const emailError  = submitted && !form.email.trim()
  const perfilError = submitted && !form.perfil

  function set<K extends keyof NuevoUsuarioFormData>(key: K, value: NuevoUsuarioFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">

        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Nueva cuenta de usuario</DialogTitle>
          <DialogDescription>
            Completa los campos para crear una nueva cuenta de usuario.
          </DialogDescription>
        </DialogHeader>

        {/* Formulario scrollable — patrón Julia DS Modals */}
        <div className="[overflow-y:overlay] max-h-[45vh] pl-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&:hover::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
          <div className="flex flex-col divide-y">

            {/* Configuración general */}
            <section className="py-4 flex flex-col gap-4">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Configuración general</span>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Tipo de usuario</Label>
                  <Select value={form.tipoUsuario} onValueChange={v => set("tipoUsuario", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_USUARIO.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 self-end pb-0.5">
                  <Switch checked={form.habilitado} onCheckedChange={v => set("habilitado", v)} />
                  <span className="text-sm text-foreground">Habilitado</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Nombre</Label>
                  <Input value={form.nombre} onChange={e => set("nombre", e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <Input
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {emailError && (
                    <span className="text-xs text-destructive">Email no puede estar en blanco</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Perfil</Label>
                  <Select value={form.perfil} onValueChange={v => set("perfil", v)}>
                    <SelectTrigger className={cn("w-full", perfilError && "border-destructive")}>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {PERFILES_FORM.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {perfilError && (
                    <span className="text-xs text-destructive">Perfil no puede estar en blanco</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Grupo de Permisos</Label>
                  <Select value={form.grupoPermisos} onValueChange={v => set("grupoPermisos", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRUPOS_FORM.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Configuración de inicio */}
            <section className="py-4 flex flex-col gap-4">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Configuración de inicio</span>
              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="permitir-editar"
                    checked={form.permitirEditar}
                    onCheckedChange={v => set("permitirEditar", !!v)}
                  />
                  <label htmlFor="permitir-editar" className="text-sm cursor-pointer select-none">
                    Permitir editar por el usuario
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="visualizar-dashboard"
                    checked={form.visualizarDashboard}
                    onCheckedChange={v => set("visualizarDashboard", !!v)}
                  />
                  <label htmlFor="visualizar-dashboard" className="text-sm cursor-pointer select-none">
                    Visualizar dashboard principal
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Módulo</Label>
                  <Select value={form.modulo} onValueChange={v => set("modulo", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODULOS_FORM.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Agregar múltiples localizaciones */}
            <section className="py-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Agregar múltiples localizaciones
                </span>
                <span className="text-xs text-muted-foreground">
                  Agrega una o varias localizaciones y limita el contenido que podrá ver el usuario
                  (Al no agregar filtros el usuario tiene acceso a todas las localizaciones)
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Info className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Sin filtro de localizaciones</span>
                </div>
                <Button variant="ghost" size="icon-sm" aria-label="Agregar localización">
                  <Plus className="size-4" />
                </Button>
              </div>
            </section>

            {/* Otras Opciones */}
            <section className="py-4 flex flex-col gap-3">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Otras Opciones</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sso-only"
                    checked={form.ssoOnly}
                    onCheckedChange={v => set("ssoOnly", !!v)}
                  />
                  <label htmlFor="sso-only" className="text-sm cursor-pointer select-none">
                    Autenticación únicamente mediante Single Sign-On
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="recibir-correo"
                    checked={form.recibirCorreo}
                    onCheckedChange={v => set("recibirCorreo", !!v)}
                  />
                  <label htmlFor="recibir-correo" className="text-sm cursor-pointer select-none">
                    Recibir por correo electrónico información de Fracttal sobre funciones,
                    actualizaciones, sugerencias, encuestas y ofertas promocionales
                  </label>
                </div>
                <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                  <Checkbox id="dos-pasos" disabled />
                  <label htmlFor="dos-pasos" className="text-sm cursor-not-allowed select-none text-muted-foreground">
                    Autenticación de dos pasos sin configurar
                  </label>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button disabled={!isDirty} onClick={() => setSubmitted(true)}>
            <Save className="size-4" />
            Guardar
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
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
                variant="ghost" size="icon-sm"
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

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ isCompact }: { isCompact: boolean }) {
  return (
    <div className={cn(
      "flex shrink-0 border-b",
      isCompact ? "flex-col divide-y" : "divide-x",
    )}>
      {STATS.map(({ label, used, max }) => (
        <div key={label} className="flex flex-col gap-0.5 px-4 py-2.5 flex-1 min-w-0">
          <span className="text-xs text-muted-foreground truncate">{label}</span>
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {used} / {max}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Sort icon (used by PermisosTable) ───────────────────────────────────────

// ─── Permisos columns ────────────────────────────────────────────────────────

const GRUPOS_COLUMNS: ColumnDef<GrupoPermiso>[] = [
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.descripcion}</span>,
  },
  {
    accessorKey: "nota",
    header: "Nota",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground truncate max-w-56 block">
        {row.original.nota || "—"}
      </span>
    ),
  },
  {
    accessorKey: "soloLectura",
    header: "Solo lectura",
    cell: ({ row }) => (
      <Badge variant={row.original.soloLectura ? "success" : "destructive"} size="sm">
        {row.original.soloLectura ? "Sí" : "No"}
      </Badge>
    ),
  },
]

// ─── Columnas de la tabla de usuarios ────────────────────────────────────────

const COLUMNS: ColumnDef<Usuario>[] = [
  {
    accessorKey: "habilitado",
    header: "Habilitado",
    cell: ({ row }) => (
      <Badge variant={row.original.habilitado ? "success" : "destructive"} size="sm">
        {row.original.habilitado ? "Sí" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => <span className="text-sm font-medium max-w-44 truncate block">{row.original.nombre}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-xs text-muted-foreground max-w-52 truncate block font-mono">{row.original.email}</span>,
  },
  {
    accessorKey: "tipoUsuario",
    header: "Tipo de usuario",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.tipoUsuario}</span>,
  },
  {
    accessorKey: "perfil",
    header: "Perfil",
    cell: ({ row }) => <Badge variant={perfilVariant(row.original.perfil)} size="sm">{row.original.perfil}</Badge>,
  },
  {
    accessorKey: "grupoPermisos",
    header: "Grupo de Permisos",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.grupoPermisos || "—"}</span>,
  },
  {
    accessorKey: "verificado",
    header: "Verificado",
    cell: ({ row }) => (
      <Badge variant={row.original.verificado ? "success" : "secondary"} size="sm">
        {row.original.verificado ? "Sí" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "bloqueado",
    header: "Bloqueado",
    cell: ({ row }) => (
      <Badge variant={row.original.bloqueado ? "destructive" : "secondary"} size="sm">
        {row.original.bloqueado ? "Sí" : "No"}
      </Badge>
    ),
  },
]

// ─── Tabla de usuarios ────────────────────────────────────────────────────────

function UsersTable({ isCompact }: { isCompact: boolean }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <NuevoUsuarioScreen open={modalOpen} onOpenChange={setModalOpen} />

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <DataTable
          columns={COLUMNS}
          data={USUARIOS}
          border={false}
          resizable
          reorder
          rowSelection
          globalFilter
          columnToggle
          rowDensity
          onAdd={() => setModalOpen(true)}
          addLabel="Nuevo usuario"
          onRefresh={() => {}}
          rowActions={(_row) => (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs" aria-label="Acciones">
                      <EllipsisVertical className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" avoidCollisions={false}>Acciones</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Eye className="size-3.5" />Ver</DropdownMenuItem>
                <DropdownMenuItem><Pencil className="size-3.5" />Editar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive"><Trash2 className="size-3.5" />Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          onBulkDelete={() => {}}
          mobileView={isCompact}
        />
      </div>
    </>
  )
}

// ─── Tabla de permisos ────────────────────────────────────────────────────────


// ─── Modal nuevo grupo de permisos ───────────────────────────────────────────

function GrupoPermisosModal({
  open, onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [descripcion,     setDescripcion]     = useState("")
  const [nota,            setNota]            = useState("")
  const [soloLectura,     setSoloLectura]     = useState(false)
  const [seleccionarTodo, setSeleccionarTodo] = useState(false)
  const [touched,         setTouched]         = useState(false)

  const invalid = touched && !descripcion.trim()

  function handleClose() {
    setDescripcion(""); setNota(""); setSoloLectura(false)
    setSeleccionarTodo(false); setTouched(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose() }}>
      <DialogContent showCloseButton={false} className="max-w-4xl h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" onClick={handleClose} aria-label="Volver">
              <ArrowLeft className="size-4" />
            </Button>
            <span className="text-base font-semibold text-foreground">Nuevo grupo de permisos</span>
          </div>
          <Button size="sm" disabled>
            <Save className="size-4" />
            Guardar
          </Button>
        </div>

        {/* Formulario */}
        <div className="px-4 py-4 flex flex-col gap-4 border-b shrink-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 min-w-0">
              <Input
                placeholder="Descripción"
                value={descripcion}
                onChange={e => { setDescripcion(e.target.value); setTouched(true) }}
                aria-invalid={invalid}
                className={cn(invalid && "border-destructive focus-visible:ring-destructive/20")}
              />
              {invalid && (
                <span className="text-xs text-destructive">Este campo es obligatorio</span>
              )}
            </div>
            <Input
              placeholder="Nota"
              value={nota}
              onChange={e => setNota(e.target.value)}
              className="min-w-0"
            />
          </div>
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox
                checked={soloLectura}
                onCheckedChange={v => setSoloLectura(!!v)}
              />
              <span className="text-sm text-foreground">Solo lectura.</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox
                checked={seleccionarTodo}
                onCheckedChange={v => setSeleccionarTodo(!!v)}
              />
              <span className="text-sm text-foreground">Seleccionar / Deseleccionar todo.</span>
            </label>
          </div>
        </div>

        {/* Toolbar de permisos */}
        <div className="flex items-center justify-end gap-1 px-3 py-2 border-b shrink-0">
          <Button variant="ghost" size="icon-sm" aria-label="Actualizar">
            <RotateCcw className="size-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Filtrar">
            <ListFilter className="size-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Opciones">
            <SlidersHorizontal className="size-4 text-primary" />
          </Button>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
            <rect x="12" y="36" width="56" height="36" rx="4" className="fill-primary/20" />
            <path d="M12 46 Q40 40 68 46" strokeWidth="2" fill="none" className="stroke-primary/30" />
            <rect x="20" y="28" width="40" height="12" rx="3" className="fill-primary/30" />
            <circle cx="50" cy="22" r="4" className="fill-primary/20" />
            <path d="M50 22 Q54 14 58 10" strokeWidth="1.5" strokeLinecap="round" fill="none" className="stroke-primary/20" />
            <circle cx="60" cy="9" r="2" className="fill-primary/30" />
          </svg>
          <span className="text-sm text-muted-foreground">Sin datos para mostrar</span>
        </div>

      </DialogContent>
    </Dialog>
  )
}

// ─── Tabla de grupos de permisos ──────────────────────────────────────────────

function PermisosTable({ isCompact }: { isCompact: boolean }) {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <GrupoPermisosModal open={modalOpen} onOpenChange={setModalOpen} />
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      <DataTable
        columns={GRUPOS_COLUMNS}
        data={GRUPOS}
        border={false}
        resizable
        reorder
        rowSelection
        globalFilter
        columnToggle
        rowDensity
        onAdd={() => setModalOpen(true)}
        addLabel={isCompact ? undefined : "Nuevo grupo"}
        onRefresh={() => {}}
        rowActions={(_row) => (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs" aria-label="Acciones">
                    <EllipsisVertical className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="left" avoidCollisions={false}>Acciones</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Eye className="size-3.5" />Ver</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive"><Trash2 className="size-3.5" />Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        onBulkDelete={() => {}}
        mobileView={isCompact}
      />
    </div>
    </>
  )
}

// ─── Content panel ────────────────────────────────────────────────────────────

export function CuentasContent({ isCompact, navId }: { isCompact: boolean; navId?: string }) {
  if (navId === "users-permissions") {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <PermisosTable isCompact={isCompact} />
      </div>
    )
  }
  // "users-list" o sin navId → tabla de usuarios
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatsBar isCompact={isCompact} />
      <UsersTable isCompact={isCompact} />
    </div>
  )
}

// ─── Módulos — tipos y campos ─────────────────────────────────────────────────

type CampoModulo = { id: string; label: string; obligatorio: boolean }
type OpcionGlobal = { id: string; label: string; activo: boolean }

type TipoModulo = {
  id:       string
  label:    string
  icon:     React.ElementType
  campos:   CampoModulo[]
  globales: OpcionGlobal[]
}

type SubtipoActivos = {
  id:      string
  label:   string
  campos:  CampoModulo[]
  globales: OpcionGlobal[]
}

const SUBTIPO_ACTIVOS: SubtipoActivos[] = [
  {
    id: "ubicaciones", label: "Ubicaciones",
    campos: [
      { id: "nombre",    label: "Nombre",                          obligatorio: true  },
      { id: "codigo",    label: "Código",                          obligatorio: false },
      { id: "tipo",      label: "Tipo",                            obligatorio: false },
      { id: "clasif1",   label: "Clasificación 1",                 obligatorio: false },
      { id: "clasif2",   label: "Clasificación 2",                 obligatorio: false },
      { id: "barras",    label: "Código de Barras / NFC",          obligatorio: false },
      { id: "direccion", label: "Dirección",                       obligatorio: false },
      { id: "notas",     label: "Notas",                           obligatorio: false },
      { id: "ciudad",    label: "Ciudad",                          obligatorio: false },
      { id: "coste",     label: "Centro de coste",                 obligatorio: false },
      { id: "codigoArea",label: "Código Área",                     obligatorio: false },
      { id: "ubicado",   label: "Ubicado en ó es Parte de",        obligatorio: false },
      { id: "dpto",      label: "Departamento / Estado / Región",  obligatorio: false },
      { id: "pais",      label: "País",                            obligatorio: false },
    ],
    globales: [
      { id: "formPersonalizado", label: "Marcar Formulario Personalizado como obligatorio",                                                   activo: false },
      { id: "actualizarOTs",     label: "Actualizar automáticamente las órdenes de trabajo y solicitudes cuando se edite la localización",    activo: false },
    ],
  },
  {
    id: "equipos", label: "Equipos",
    campos: [
      { id: "unidad",    label: "Unidad",                obligatorio: true  },
      { id: "nombre",    label: "Nombre",                obligatorio: true  },
      { id: "codigo",    label: "Código",                obligatorio: false },
      { id: "serial",    label: "Número de Serial",      obligatorio: false },
      { id: "fabricante",label: "Fabricante",            obligatorio: false },
      { id: "modelo",    label: "Modelo",                obligatorio: false },
      { id: "tipo",      label: "Tipo",                  obligatorio: false },
      { id: "clasif1",   label: "Clasificación 1",       obligatorio: false },
      { id: "clasif2",   label: "Clasificación 2",       obligatorio: false },
      { id: "barras",    label: "Código de Barras / NFC",obligatorio: false },
      { id: "notas",     label: "Notas",                 obligatorio: false },
      { id: "coste",     label: "Centro de coste",       obligatorio: false },
      { id: "ubicado",   label: "Ubicado en ó es Parte de",obligatorio: false },
      { id: "otro1",     label: "Otro 1",                obligatorio: false },
      { id: "otro2",     label: "Otro 2",                obligatorio: false },
    ],
    globales: [
      { id: "formPersonalizado", label: "Marcar Formulario Personalizado como obligatorio", activo: false },
    ],
  },
  {
    id: "herramientas", label: "Herramientas",
    campos: [
      { id: "unidad",    label: "Unidad",                          obligatorio: true  },
      { id: "nombre",    label: "Nombre",                          obligatorio: true  },
      { id: "codigo",    label: "Código",                          obligatorio: false },
      { id: "serial",    label: "Número de Serial",                obligatorio: false },
      { id: "fabricante",label: "Fabricante",                      obligatorio: false },
      { id: "modelo",    label: "Modelo",                          obligatorio: false },
      { id: "tipo",      label: "Tipo",                            obligatorio: false },
      { id: "clasif1",   label: "Clasificación 1",                 obligatorio: false },
      { id: "clasif2",   label: "Clasificación 2",                 obligatorio: false },
      { id: "barras",    label: "Código de Barras / NFC",          obligatorio: false },
      { id: "notas",     label: "Notas",                           obligatorio: false },
      { id: "coste",     label: "Centro de coste",                 obligatorio: false },
      { id: "visible",   label: "Visible para todos",              obligatorio: false },
      { id: "ctrlSerial",label: "Controlado por serial",           obligatorio: false },
      { id: "otro1",     label: "OTRO 1",                          obligatorio: false },
      { id: "otro2",     label: "OTRO 2",                          obligatorio: false },
      { id: "limitar",   label: "Limitar Acceso a Esta Localización", obligatorio: false },
    ],
    globales: [
      { id: "formPersonalizado", label: "Marcar Formulario Personalizado como obligatorio", activo: false },
    ],
  },
  {
    id: "repuestos", label: "Repuestos y Suministros",
    campos: [
      { id: "unidad",    label: "Unidad",                          obligatorio: true  },
      { id: "nombre",    label: "Nombre",                          obligatorio: true  },
      { id: "codigo",    label: "Código",                          obligatorio: false },
      { id: "nParte",    label: "Número de parte",                 obligatorio: false },
      { id: "fabricante",label: "Fabricante",                      obligatorio: false },
      { id: "modelo",    label: "Modelo",                          obligatorio: false },
      { id: "tipo",      label: "Tipo",                            obligatorio: false },
      { id: "clasif1",   label: "Clasificación 1",                 obligatorio: false },
      { id: "clasif2",   label: "Clasificación 2",                 obligatorio: false },
      { id: "barras",    label: "Código de Barras / NFC",          obligatorio: false },
      { id: "notas",     label: "Notas",                           obligatorio: false },
      { id: "visible",   label: "Visible para todos",              obligatorio: false },
      { id: "ctrlSerial",label: "Controlado por serial",           obligatorio: false },
      { id: "otro1",     label: "Otro 1",                          obligatorio: false },
      { id: "otro2",     label: "Otro 2",                          obligatorio: false },
      { id: "limitar",   label: "Limitar Acceso a Esta Localización", obligatorio: false },
    ],
    globales: [
      { id: "formPersonalizado", label: "Marcar Formulario Personalizado como obligatorio", activo: false },
    ],
  },
]

const TIPOS_MODULOS: TipoModulo[] = [
  {
    id: "activos", label: "Activos", icon: Layers,
    campos: [
      { id: "nombre",      label: "Nombre",                        obligatorio: true  },
      { id: "clasificacion1", label: "Clasificación 1",            obligatorio: false },
      { id: "codigo",      label: "Código",                        obligatorio: false },
      { id: "clasificacion2", label: "Clasificación 2",            obligatorio: false },
      { id: "direccion",   label: "Dirección",                     obligatorio: false },
      { id: "barras",      label: "Código de Barras / NFC",        obligatorio: false },
      { id: "ciudad",      label: "Ciudad",                        obligatorio: false },
      { id: "notas",       label: "Notas",                         obligatorio: false },
      { id: "codigoArea",  label: "Código Área",                   obligatorio: false },
      { id: "prioridad",   label: "Prioridad",                     obligatorio: false },
      { id: "dpto",        label: "Departamento / Estado / Región", obligatorio: false },
      { id: "coste",       label: "Centro de coste",               obligatorio: false },
      { id: "pais",        label: "País",                          obligatorio: false },
      { id: "ubicado",     label: "Ubicado en ó es Parte de",      obligatorio: false },
      { id: "tipo",        label: "Tipo",                          obligatorio: false },
    ],
    globales: [
      { id: "formPersonalizado", label: "Marcar Formulario Personalizado como obligatorio",                                                   activo: false },
      { id: "actualizarOTs",     label: "Actualizar automáticamente las órdenes de trabajo y solicitudes cuando se edite la localización",    activo: false },
    ],
  },
  {
    id: "ots", label: "Órdenes de Trabajo", icon: Wrench,
    campos: [
      { id: "descripcion",  label: "Descripción",       obligatorio: true  },
      { id: "prioridad",    label: "Prioridad",          obligatorio: false },
      { id: "fechaInicio",  label: "Fecha de inicio",   obligatorio: false },
      { id: "fechaFin",     label: "Fecha de cierre",   obligatorio: false },
      { id: "responsable",  label: "Responsable",       obligatorio: false },
      { id: "tipoTrabajo",  label: "Tipo de trabajo",   obligatorio: false },
      { id: "causa",        label: "Causa de la falla",  obligatorio: false },
      { id: "coste",        label: "Centro de coste",   obligatorio: false },
      { id: "notas",        label: "Notas",              obligatorio: false },
      { id: "adjuntos",     label: "Adjuntos",           obligatorio: false },
    ],
    globales: [
      { id: "firmaDigital",  label: "Requerir firma digital al cerrar la OT",               activo: false },
      { id: "checklistOblig", label: "Marcar checklist como obligatorio antes de cerrar",   activo: true  },
    ],
  },
  {
    id: "almacenes", label: "Almacenes", icon: Package,
    campos: [
      { id: "nombre",      label: "Nombre",              obligatorio: true  },
      { id: "codigo",      label: "Código",              obligatorio: false },
      { id: "tipo",        label: "Tipo",                obligatorio: false },
      { id: "ubicacion",   label: "Ubicación",           obligatorio: false },
      { id: "responsable", label: "Responsable",         obligatorio: false },
      { id: "capacidad",   label: "Capacidad máxima",    obligatorio: false },
      { id: "notas",       label: "Notas",               obligatorio: false },
    ],
    globales: [
      { id: "stockMinimo", label: "Alertar cuando el stock llegue al mínimo",              activo: true  },
      { id: "aprobacion",  label: "Requerir aprobación para salidas de almacén",           activo: false },
    ],
  },
  {
    id: "solicitudes", label: "Solicitudes de Trabajo", icon: ClipboardList,
    campos: [
      { id: "adjunto",          label: "Adjunto",             obligatorio: false },
      { id: "activo",           label: "Activo",              obligatorio: false },
      { id: "observaciones",    label: "Observaciones",       obligatorio: false },
      { id: "solicitadoPor",    label: "Solicitado Por",      obligatorio: false },
      { id: "emailSolicitante", label: "Email del solicitante", obligatorio: false },
      { id: "referencia",       label: "Referencia",          obligatorio: false },
      { id: "localizacion",     label: "Localización",        obligatorio: false },
      { id: "grupo",            label: "Grupo",               obligatorio: false },
      { id: "clasificacion1",   label: "Clasificación 1",     obligatorio: false },
      { id: "clasificacion2",   label: "Clasificación 2",     obligatorio: false },
      { id: "palabrasClave",    label: "Palabras clave",      obligatorio: false },
    ],
    globales: [],
  },
  {
    id: "iot", label: "IOT", icon: Cpu,
    campos: [
      { id: "nombre",       label: "Nombre del sensor",    obligatorio: true  },
      { id: "codigo",       label: "Código / ID",          obligatorio: true  },
      { id: "tipo",         label: "Tipo de sensor",       obligatorio: false },
      { id: "unidad",       label: "Unidad de medida",     obligatorio: false },
      { id: "frecuencia",   label: "Frecuencia de lectura", obligatorio: false },
      { id: "umbralMin",    label: "Umbral mínimo",        obligatorio: false },
      { id: "umbralMax",    label: "Umbral máximo",        obligatorio: false },
      { id: "activo",       label: "Activo vinculado",     obligatorio: false },
    ],
    globales: [
      { id: "alertaUmbral",  label: "Generar alerta cuando se supere el umbral",              activo: true  },
      { id: "crearOTAuto",   label: "Crear OT automáticamente al detectar anomalía",          activo: false },
    ],
  },
]

// ─── OTs — permisos ──────────────────────────────────────────────────────────

// ─── Solicitudes — permisos ───────────────────────────────────────────────────

const SOLICITUDES_PERMISOS: OpcionGlobal[] = [
  { id: "actualizarActivos",   label: "Actualizar los activos editados en las solicitudes de trabajo abiertas",                                                                                              activo: false },
  { id: "editarAdminAbierta",  label: "Permitir a los administradores de solicitudes de trabajo editar la información avanzada de las solicitudes en estado \"Abierta\"",                                    activo: false },
  { id: "editarCreadorAbierta",label: "Permitir que el creador de la solicitud de trabajo edite la información avanzada para las solicitudes en estado \"Abierta\"",                                         activo: false },
  { id: "portalAbierto",       label: "Permitir que las solicitudes del portal de invitados pasen a estado Abierto",                                                                                         activo: false },
]

// ─── IOT — funciones de muestreo ─────────────────────────────────────────────

const IOT_FUNCIONES = [
  {
    value:       "ASAP_SMOOTH",
    label:       "ASAP_SMOOTH",
    description: "Se enfoca en hacer que la línea de datos se vea suave y sin saltos bruscos, eliminando puntos sin cambiar demasiado la forma general.",
  },
  {
    value:       "GP_LTTB",
    label:       "GP_LTTB",
    description: "Es una versión mejorada de LTTB que elige puntos clave de manera más eficiente para que los gráficos se vean bien sin perder detalles importantes.",
  },
  {
    value:       "LTTB",
    label:       "LTTB",
    description: "Selecciona los puntos más representativos para que, aunque haya menos datos, la forma del gráfico siga mostrando la misma tendencia.",
  },
]

// ─── IOT — permisos ───────────────────────────────────────────────────────────

const IOT_PERMISOS: OpcionGlobal[] = [
  { id: "alertaUmbral",      label: "Generar alerta cuando se supere el umbral configurado",                                        activo: true  },
  { id: "crearOTAuto",       label: "Crear OT automáticamente al detectar una anomalía",                                            activo: false },
  { id: "historialLecturas", label: "Registrar historial completo de lecturas del sensor",                                          activo: true  },
  { id: "notifUmbral",       label: "Notificar por correo al responsable cuando se supere el umbral",                               activo: false },
  { id: "desactivarSensor",  label: "Permitir desactivar sensores desde la plataforma",                                             activo: false },
]

// ─── Almacenes — permisos ─────────────────────────────────────────────────────

const ALMACENES_PERMISOS: OpcionGlobal[] = [
  { id: "cantidadCero",    label: "Establecer cantidad real usada en 0(cero) para recursos provenientes de un almacén integrado",    activo: true  },
  { id: "eliminarRecursos",label: "Permitir eliminar recursos con cantidad entregada > 0 provenientes de un almacén integrado",       activo: true  },
  { id: "lotesVencidos",   label: "Permitir la salida de lotes con fecha de vencimiento vencida",                                    activo: false },
]

// ─── OTs — permisos ──────────────────────────────────────────────────────────

const OT_PERMISOS: OpcionGlobal[] = [
  { id: "adjuntosFinalizadas",   label: "Permitir agregar adjuntos en Ots finalizadas",                                                                                                             activo: true  },
  { id: "finalizarPendientes",   label: "Permitir finalizar/cancelar Ots con requisiciones de material pendientes",                                                                                 activo: true  },
  { id: "fechaFueraServicio",    label: "Establecer la fecha de finalización de fuera de servicio de los activos con la fecha de finalización de la tarea (por defecto es la fecha de finalización de la OT).", activo: false },
  { id: "multiresponsables",     label: "Permitir a los recursos humanos asignados ser responsables de la OT (Multiresponsables)",                                                                  activo: false },
  { id: "editarCantidadReal",    label: "Permitir editar la cantidad real usada con requisiciones de material pendientes",                                                                          activo: false },
  { id: "calificarRevision",     label: "Permitir calificar la OT aun estando en revisión",                                                                                                        activo: false },
  { id: "filtrarRRHH",           label: "Filtrar los recursos humanos según el perfil seleccionado (Dentro de una tarea)",                                                                          activo: true  },
  { id: "actualizarActivadores", label: "Permitir actualizar activadores con OTs activas",                                                                                                         activo: false },
  { id: "catalogoFallas",        label: "Establecer diligenciamiento obligatorio de catálogo de fallas",                                                                                           activo: true  },
  { id: "generacionPorFecha",    label: "Permitir que la generación automática de OTs se active por la fecha de programación",                                                                     activo: false },
  { id: "firmaCompliance",       label: "Permitir firma obligatoria en formularios de Compliance y Seguridad",                                                                                     activo: false },
  { id: "cancelacionAvanzada",   label: "Permitir opciones avanzadas de cancelación de OTs",                                                                                                       activo: true  },
  { id: "cumplimientoSinRest",   label: "Analizar cumplimiento sin restricción mensual",                                                                                                           activo: false },
  { id: "categorizarTiempos",    label: "Habilitar categorización de tiempos de ejecución",                                                                                                        activo: true  },
  { id: "enlaceCompartir",       label: "Generar automáticamente el enlace para compartir todas las OTs",                                                                                          activo: false },
  { id: "actualizarActivoEnProceso", label: "Actualizar el activo editado en las OTs en proceso y revisión",                                                                                      activo: false },
  { id: "costosRRHH",            label: "Utilizar costos de los recursos humanos desde el plan de tareas",                                                                                         activo: false },
  { id: "costosServicios",       label: "Utilizar costos de los servicios desde el plan de tareas",                                                                                                activo: false },
]

// ─── Módulos — content ────────────────────────────────────────────────────────

// Mapeo navId → id interno del módulo
const NAV_TO_MODULO: Record<string, string> = {
  "mod-activos":      "activos",
  "mod-ot":           "ots",
  "mod-almacenes":    "almacenes",
  "mod-sol-trabajo":  "solicitudes",
  "mod-iot":          "iot",
}

export function ModulosContent({ isCompact, isMobile = false, navId }: { isCompact: boolean; isMobile?: boolean; navId?: string }) {
  const moduloActivo = (navId && NAV_TO_MODULO[navId]) ?? "activos"

  const [tipos,         setTipos]         = useState<TipoModulo[]>(TIPOS_MODULOS)
  const [subtipos,      setSubtipos]      = useState<SubtipoActivos[]>(SUBTIPO_ACTIVOS)
  const [activoSubtipo, setActivoSubtipo] = useState<string>("ubicaciones")
  const [almacenesPermisos,  setAlmacenesPermisos]  = useState<OpcionGlobal[]>(ALMACENES_PERMISOS)
  const [solicitudesPermisos,setSolicitudesPermisos] = useState<OpcionGlobal[]>(SOLICITUDES_PERMISOS)
  const [iotPermisos,        setIotPermisos]         = useState<OpcionGlobal[]>(IOT_PERMISOS)
  const [otPermisos,         setOtPermisos]          = useState<OpcionGlobal[]>(OT_PERMISOS)
  const [otId,               setOtId]               = useState({ prefijo: "WO-", secuencia: "412", sufijo: "-2026" })
  const [iotFuncion,         setIotFuncion]         = useState("GP_LTTB")

  function toggleCampo(tipoId: string, campoId: string, v: boolean) {
    setTipos(prev => prev.map(t =>
      t.id !== tipoId ? t : {
        ...t,
        campos: t.campos.map(c => c.id === campoId ? { ...c, obligatorio: v } : c),
      }
    ))
  }

  function toggleGlobal(tipoId: string, opId: string, v: boolean) {
    setTipos(prev => prev.map(t =>
      t.id !== tipoId ? t : {
        ...t,
        globales: t.globales.map(g => g.id === opId ? { ...g, activo: v } : g),
      }
    ))
  }

  function toggleSubCampo(subId: string, campoId: string, v: boolean) {
    setSubtipos(prev => prev.map(s =>
      s.id !== subId ? s : {
        ...s,
        campos: s.campos.map(c => c.id === campoId ? { ...c, obligatorio: v } : c),
      }
    ))
  }

  function toggleSubGlobal(subId: string, opId: string, v: boolean) {
    setSubtipos(prev => prev.map(s =>
      s.id !== subId ? s : {
        ...s,
        globales: s.globales.map(g => g.id === opId ? { ...g, activo: v } : g),
      }
    ))
  }

  function toggleAlmacenPermiso(opId: string, v: boolean) {
    setAlmacenesPermisos(prev => prev.map(p => p.id === opId ? { ...p, activo: v } : p))
  }

  function toggleSolicitudPermiso(opId: string, v: boolean) {
    setSolicitudesPermisos(prev => prev.map(p => p.id === opId ? { ...p, activo: v } : p))
  }

  function toggleIotPermiso(opId: string, v: boolean) {
    setIotPermisos(prev => prev.map(p => p.id === opId ? { ...p, activo: v } : p))
  }

  function toggleOtPermiso(opId: string, v: boolean) {
    setOtPermisos(prev => prev.map(p => p.id === opId ? { ...p, activo: v } : p))
  }

  const tipo = tipos.find(t => t.id === moduloActivo) ?? tipos[0]

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {moduloActivo === "activos" ? (
            <Tabs value={activoSubtipo} onValueChange={setActivoSubtipo} className="flex flex-col flex-1 min-h-0">
              <div className="shrink-0 border-b px-3">
                <TabsList variant="line">
                  {subtipos.map(s => (
                    <TabsTrigger key={s.id} value={s.id}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {subtipos.map(st => (
                <TabsContent key={st.id} value={st.id} className="flex-1 min-h-0 mt-0">
                  <ScrollArea className="h-full overflow-hidden">
                    <div className="p-4 flex flex-col gap-5">
                      <div className={cn("grid gap-x-6 gap-y-0", isCompact ? "grid-cols-1" : "grid-cols-2")}>
                        <div className="contents">
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-xs font-medium text-muted-foreground">Opciones</span>
                            <span className="text-xs font-medium text-muted-foreground">Obligatorio</span>
                          </div>
                          {!isCompact && (
                            <div className="flex items-center justify-between py-2 border-b">
                              <span className="text-xs font-medium text-muted-foreground">Opciones</span>
                              <span className="text-xs font-medium text-muted-foreground">Obligatorio</span>
                            </div>
                          )}
                        </div>
                        {st.campos.map(campo => (
                          <div key={campo.id} className="flex items-center justify-between py-2.5 border-b min-w-0">
                            <span className="text-sm text-foreground">{campo.label}</span>
                            <Switch checked={campo.obligatorio} onCheckedChange={v => toggleSubCampo(st.id, campo.id, v)} />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col gap-0 rounded-lg border overflow-hidden">
                        {st.globales.map((op, i) => (
                          <div key={op.id} className={cn("flex items-center justify-between gap-4 px-3 py-3", i < st.globales.length - 1 && "border-b")}>
                            <span className="text-sm text-foreground leading-snug">{op.label}</span>
                            <Switch checked={op.activo} onCheckedChange={v => toggleSubGlobal(st.id, op.id, v)} className="shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>

      ) : moduloActivo === "ots" ? (
            <Tabs defaultValue="permisos" className="flex flex-col flex-1 min-h-0">
              <div className="shrink-0 border-b px-3">
                <TabsList variant="line">
                  <TabsTrigger value="permisos">Opciones y permisos</TabsTrigger>
                  <TabsTrigger value="id-ot">ID de orden de trabajo</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="permisos" className="flex-1 min-h-0 mt-0">
                <ScrollArea className="h-full overflow-hidden">
                  <div className="flex flex-col">
                    <div className="flex items-center px-4 py-2 border-b">
                      <span className="text-xs font-medium text-muted-foreground">Descripción</span>
                    </div>
                    {otPermisos.map((p, i) => (
                      <div key={p.id} className={cn("flex items-center gap-3 px-4 py-3", i < otPermisos.length - 1 && "border-b")}>
                        <Switch checked={p.activo} onCheckedChange={v => toggleOtPermiso(p.id, v)} className="shrink-0" />
                        <span className="text-sm text-foreground leading-snug">{p.label}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="id-ot" className="flex-1 min-h-0 mt-0">
                <ScrollArea className="h-full overflow-hidden">
                  <div className="p-4">
                    <div className={cn("grid gap-3", isCompact ? "grid-cols-1" : "grid-cols-3")}>
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <Label htmlFor="ot-prefijo">Prefijo</Label>
                        <Input id="ot-prefijo" value={otId.prefijo} onChange={e => setOtId(prev => ({ ...prev, prefijo: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <Label htmlFor="ot-secuencia">Secuencia</Label>
                        <Input id="ot-secuencia" value={otId.secuencia} onChange={e => setOtId(prev => ({ ...prev, secuencia: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <Label htmlFor="ot-sufijo">Sufijo</Label>
                        <Input id="ot-sufijo" value={otId.sufijo} onChange={e => setOtId(prev => ({ ...prev, sufijo: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

      ) : moduloActivo === "almacenes" ? (
            <ScrollArea className="h-full overflow-hidden">
              <div className="flex flex-col">
                <div className="flex items-center px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">Descripción</span>
                </div>
                {almacenesPermisos.map((p, i) => (
                  <div key={p.id} className={cn("flex items-center gap-3 px-4 py-3", i < almacenesPermisos.length - 1 && "border-b")}>
                    <Switch checked={p.activo} onCheckedChange={v => toggleAlmacenPermiso(p.id, v)} className="shrink-0" />
                    <span className="text-sm text-foreground leading-snug">{p.label}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>

      ) : moduloActivo === "solicitudes" ? (
            <ScrollArea className="h-full overflow-hidden">
              <div className="p-4 flex flex-col gap-5">
                {/* Grid de campos obligatorios */}
                <div>
                  <p className="text-sm text-foreground mb-3">Establecer cuáles de los siguientes campos deben ser obligatorios</p>
                  <div className={cn("grid gap-x-6 gap-y-0", isCompact ? "grid-cols-1" : "grid-cols-2")}>
                    <div className="contents">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-xs font-medium text-muted-foreground">Opciones</span>
                        <span className="text-xs font-medium text-muted-foreground">Obligatorio</span>
                      </div>
                      {!isCompact && (
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-xs font-medium text-muted-foreground">Opciones</span>
                          <span className="text-xs font-medium text-muted-foreground">Obligatorio</span>
                        </div>
                      )}
                    </div>
                    {tipo.campos.map(campo => (
                      <div key={campo.id} className="flex items-center justify-between py-2.5 border-b min-w-0">
                        <span className="text-sm text-foreground">{campo.label}</span>
                        <Switch checked={campo.obligatorio} onCheckedChange={v => toggleCampo(tipo.id, campo.id, v)} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Permisos globales */}
                <div className="flex flex-col gap-0 rounded-lg border overflow-hidden">
                  {solicitudesPermisos.map((p, i) => (
                    <div key={p.id} className={cn("flex items-center justify-between gap-4 px-3 py-3", i < solicitudesPermisos.length - 1 && "border-b")}>
                      <span className="text-sm text-foreground leading-snug">{p.label}</span>
                      <Switch checked={p.activo} onCheckedChange={v => toggleSolicitudPermiso(p.id, v)} className="shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

      ) : moduloActivo === "iot" ? (
            <ScrollArea className="h-full overflow-hidden">
              <div className="p-4 flex flex-col gap-3">
                <Label className="text-sm font-medium text-foreground">
                  Función de reducción de muestreo
                </Label>
                <RadioGroup value={iotFuncion} onValueChange={setIotFuncion} className="flex flex-col gap-2">
                  {IOT_FUNCIONES.map(({ value, label, description }) => (
                    <label
                      key={value}
                      htmlFor={`iot-fn-${value}`}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors",
                        iotFuncion === value
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:bg-muted/40",
                      )}
                    >
                      <RadioGroupItem
                        id={`iot-fn-${value}`}
                        value={value}
                        className="mt-0.5 shrink-0"
                      />
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="text-sm font-semibold text-foreground leading-none">
                          {label}
                        </span>
                        <span className="text-sm text-muted-foreground leading-snug">
                          {description}
                        </span>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </ScrollArea>

      ) : (
        <ScrollArea className="h-full overflow-hidden">
          <div className="flex flex-col">
            <div className="flex items-center px-4 py-2 border-b">
              <span className="text-xs font-medium text-muted-foreground">Descripción</span>
            </div>
            {tipo.globales.map((p, i) => (
              <div key={p.id} className={cn("flex items-center gap-3 px-4 py-3", i < tipo.globales.length - 1 && "border-b")}>
                <Switch checked={p.activo} onCheckedChange={v => toggleGlobal(tipo.id, p.id, v)} className="shrink-0" />
                <span className="text-sm text-foreground leading-snug">{p.label}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

// ─── Panel de contenido por sección ──────────────────────────────────────────

function SectionPlaceholder({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground p-8">
      <Icon className="size-8 opacity-30" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

function ActiveContent({ navId, isCompact, isMobile }: { navId: string; isCompact: boolean; isMobile: boolean }) {
  if (navId === "users")    return <CuentasContent isCompact={isCompact} />
  if (navId === "modules")  return <ModulosContent isCompact={isCompact} isMobile={isMobile} />

  const item = NAV_ITEMS.find(n => n.id === navId)
  return <SectionPlaceholder label={item?.label ?? navId} icon={item?.icon ?? Settings} />
}

// ─── Main screen ──────────────────────────────────────────────────────────────

function CuentasUsuariosInner() {
  const [screenMode,   setScreenMode]   = useState<ScreenMode>("desktop")
  const [activeNav,    setActiveNav]    = useState("users")
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
  }, [screenMode])

  const isMobile  = screenMode === "mobile"
  const isCompact = screenMode !== "desktop"

  return (
    <div className="relative h-full flex flex-col overflow-hidden bg-background">

      {/* 1 — Topbar */}
      {isMobile
        ? <TopbarBarMobile title="Configuración" />
        : <TopbarBar title="Configuración" subtitle="" showSearch={false} />
      }

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
              <ActiveContent navId={activeNav} isCompact={isCompact} isMobile={isMobile} />
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
            <div className="flex-1 rounded-lg border bg-background overflow-hidden flex flex-col min-w-0 min-h-0">
              <ActiveContent navId={activeNav} isCompact={isCompact} isMobile={isMobile} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function CuentasUsuarios() {
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
      <CuentasUsuariosInner />
    </ScreenModeProvider>
  )
}
