"use client"

import { useState } from "react"
import {
  ArrowLeft, Save, ListFilter, RefreshCw, Download,
  LayoutGrid, List, SlidersHorizontal, Calendar,
  Bell, MoreVertical, Search, X, Info,
  TableProperties, CalendarDays, AlignJustify, Copy,
  ClipboardList, Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Toggle } from "@/components/ui/toggle"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

// ─── Wrapper común ────────────────────────────────────────────────────────────

function ToolbarShell({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground px-2">{label}</span>
      <div className="p-2">
        <div className="flex items-center justify-between bg-background border rounded-lg p-3 gap-3">
          {children}
        </div>
      </div>
    </div>
  )
}

function ToolbarLeft({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2 min-w-0">{children}</div>
}

function ToolbarRight({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2 shrink-0">{children}</div>
}

// ─── Variante 1: Navegación + título + acción principal ───────────────────────

function ToolbarNav() {
  return (
    <ToolbarShell label="Navegación + título + acción principal">
      <ToolbarLeft>
        <Button variant="ghost" size="icon-sm">
          <ArrowLeft />
        </Button>
        <span className="text-sm font-medium text-foreground truncate">
          Horómetro 12 — Oficina central 429 LYCEUM AVE (121.ALEJO)
        </span>
      </ToolbarLeft>
      <ToolbarRight>
        <Button size="sm">
          <Save />
          Guardar
        </Button>
      </ToolbarRight>
    </ToolbarShell>
  )
}

// ─── Variante 2: Breadcrumb + acciones secundarias ────────────────────────────

function ToolbarBreadcrumb() {
  return (
    <ToolbarShell label="Breadcrumb + acciones secundarias">
      <ToolbarLeft>
        <Button variant="ghost" size="icon-sm">
          <ArrowLeft />
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Activos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Planta Norte</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Compresor GA37</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </ToolbarLeft>
      <ToolbarRight>
        <Button variant="ghost" size="icon-sm">
          <Download />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <MoreVertical />
        </Button>
        <Button size="sm">
          <Save />
          Guardar
        </Button>
      </ToolbarRight>
    </ToolbarShell>
  )
}

// ─── Variante 3: Selector de vista + filtros ─────────────────────────────────

function ToolbarViewFilter() {
  const [view, setView] = useState("list")
  return (
    <ToolbarShell label="Selector de vista + filtros">
      <ToolbarLeft>
        <ToggleGroup type="single" value={view} onValueChange={v => v && setView(v)} size="sm" variant="outline" spacing={0}>
          <ToggleGroupItem value="grid"><LayoutGrid className="size-4" /></ToggleGroupItem>
          <ToggleGroupItem value="list"><List className="size-4" /></ToggleGroupItem>
          <ToggleGroupItem value="table"><TableProperties className="size-4" /></ToggleGroupItem>
        </ToggleGroup>
        <Badge variant="secondary">247 resultados</Badge>
      </ToolbarLeft>
      <ToolbarRight>
        <Button variant="outline" size="sm">
          <ListFilter className="size-4" />
          Filtros
        </Button>
        <Button variant="ghost" size="icon-sm">
          <RefreshCw className="size-4" />
        </Button>
      </ToolbarRight>
    </ToolbarShell>
  )
}

// ─── Variante 4: Búsqueda + select + avatar ───────────────────────────────────

function ToolbarSearch() {
  const [q, setQ] = useState("")
  return (
    <ToolbarShell label="Búsqueda + filtro por select + usuario activo">
      <ToolbarLeft>
        <div className="relative w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Buscar activo..."
            value={q}
            onChange={e => setQ(e.target.value)}
            className="w-56 pl-8"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los activos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </ToolbarLeft>
      <ToolbarRight>
        <Avatar size="sm">
          <AvatarImage src="https://i.pravatar.cc/150?img=33" />
          <AvatarFallback>JR</AvatarFallback>
        </Avatar>
      </ToolbarRight>
    </ToolbarShell>
  )
}

// ─── Variante 5: Tabs como toggle group + fecha + acciones ────────────────────

function ToolbarTabs() {
  const [tab, setTab] = useState("pending")
  return (
    <ToolbarShell label="Tabs + selector de período + acciones">
      <ToolbarLeft>
        <ToggleGroup type="single" value={tab} onValueChange={v => v && setTab(v)} size="sm" variant="outline" spacing={0}>
          <ToggleGroupItem value="pending"><ClipboardList className="size-4" />Tareas Pendientes</ToggleGroupItem>
          <ToggleGroupItem value="ot"><Wrench className="size-4" />Órdenes de Trabajo</ToggleGroupItem>
        </ToggleGroup>
      </ToolbarLeft>
      <ToolbarRight>
        <Select defaultValue="month">
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Semana</SelectItem>
            <SelectItem value="month">Mes</SelectItem>
            <SelectItem value="quarter">Trimestre</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon-sm">
          <Calendar className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <Info className="size-4" />
        </Button>
      </ToolbarRight>
    </ToolbarShell>
  )
}

// ─── Variante 6: Filtro activo como badge + acciones rápidas ─────────────────

function ToolbarActiveFilter() {
  const [filters, setFilters] = useState(["Fecha Programada: May 31/2026"])

  return (
    <ToolbarShell label="Filtros activos como badges + acciones rápidas">
      <ToolbarLeft>
        <ToggleGroup type="single" defaultValue="list" size="sm" variant="outline" spacing={0}>
          <ToggleGroupItem value="list"><AlignJustify className="size-4" /></ToggleGroupItem>
          <ToggleGroupItem value="grid"><CalendarDays className="size-4" /></ToggleGroupItem>
          <ToggleGroupItem value="copy"><Copy className="size-4" /></ToggleGroupItem>
          <ToggleGroupItem value="table"><TableProperties className="size-4" /></ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center gap-1.5">
          {filters.map(f => (
            <Badge key={f} variant="secondary" className="gap-1">
              <Calendar className="size-3" />
              {f}
              <button onClick={() => setFilters(prev => prev.filter(x => x !== f))} className="ml-0.5 hover:text-foreground">
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      </ToolbarLeft>
      <ToolbarRight>
        <Badge variant="default" className="tabular-nums">3</Badge>
        <Button variant="ghost" size="icon-sm">
          <MoreVertical className="size-4" />
        </Button>
      </ToolbarRight>
    </ToolbarShell>
  )
}

// ─── Variante 7: Sólo acciones secundarias ────────────────────────────────────

function ToolbarActions() {
  return (
    <ToolbarShell label="Acciones agrupadas (ButtonGroup) + toggle + notificación">
      <ToolbarLeft>
        <ButtonGroup>
          <Button variant="outline" size="sm">
            <List className="size-4" />
            Lista
          </Button>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="size-4" />
            Avanzado
          </Button>
        </ButtonGroup>
      </ToolbarLeft>
      <ToolbarRight>
        <Toggle size="sm" aria-label="Notificaciones">
          <Bell className="size-4" />
        </Toggle>
        <Button variant="ghost" size="icon-sm">
          <ListFilter className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <SlidersHorizontal className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <MoreVertical className="size-4" />
        </Button>
      </ToolbarRight>
    </ToolbarShell>
  )
}

// ─── Mobile wrapper ───────────────────────────────────────────────────────────

function ToolbarMobileShell({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground px-2">{label}</span>
      <div className="p-2">
        <div className="w-[400px] flex items-center justify-between bg-background border rounded-lg p-3 gap-3">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Mobile 1: Navegación + título + acción principal ────────────────────────

function ToolbarMobileNav() {
  return (
    <ToolbarMobileShell label="Navegación + título + acción principal">
      <ToolbarLeft>
        <Button variant="ghost" size="icon-sm">
          <ArrowLeft />
        </Button>
        <span className="text-sm font-medium text-foreground truncate">
          Horómetro 12 — Oficina central
        </span>
      </ToolbarLeft>
      <ToolbarRight>
        <Button size="icon-sm">
          <Save />
        </Button>
      </ToolbarRight>
    </ToolbarMobileShell>
  )
}

// ─── Mobile 2: Búsqueda full-width + filtro ───────────────────────────────────

function ToolbarMobileSearch() {
  const [q, setQ] = useState("")
  return (
    <ToolbarMobileShell label="Búsqueda + filtro">
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Buscar..."
          value={q}
          onChange={e => setQ(e.target.value)}
          className="w-full pl-8"
        />
      </div>
      <ToolbarRight>
        <Button variant="ghost" size="icon-sm">
          <ListFilter className="size-4" />
        </Button>
      </ToolbarRight>
    </ToolbarMobileShell>
  )
}

// ─── Mobile 3: Tabs + período ────────────────────────────────────────────────

function ToolbarMobileTabs() {
  const [tab, setTab] = useState("pending")
  return (
    <ToolbarMobileShell label="Tabs + selector de período">
      <ToolbarLeft>
        <ToggleGroup type="single" value={tab} onValueChange={v => v && setTab(v)} size="sm" variant="outline" spacing={0}>
          <ToggleGroupItem value="pending"><ClipboardList className="size-4" /></ToggleGroupItem>
          <ToggleGroupItem value="ot"><Wrench className="size-4" /></ToggleGroupItem>
        </ToggleGroup>
      </ToolbarLeft>
      <ToolbarRight>
        <Select defaultValue="month">
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Semana</SelectItem>
            <SelectItem value="month">Mes</SelectItem>
            <SelectItem value="quarter">Trimestre</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon-sm">
          <Calendar className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <Info className="size-4" />
        </Button>
      </ToolbarRight>
    </ToolbarMobileShell>
  )
}

// ─── Mobile 4: Selector de vista + overflow ───────────────────────────────────

function ToolbarMobileView() {
  const [view, setView] = useState("list")
  return (
    <ToolbarMobileShell label="Selector de vista + overflow">
      <ToolbarLeft>
        <ToggleGroup type="single" value={view} onValueChange={v => v && setView(v)} size="sm" variant="outline" spacing={0}>
          <ToggleGroupItem value="list"><List className="size-4" /></ToggleGroupItem>
          <ToggleGroupItem value="grid"><LayoutGrid className="size-4" /></ToggleGroupItem>
          <ToggleGroupItem value="calendar"><CalendarDays className="size-4" /></ToggleGroupItem>
        </ToggleGroup>
        <Badge variant="secondary">247</Badge>
      </ToolbarLeft>
      <ToolbarRight>
        <Button variant="ghost" size="icon-sm">
          <RefreshCw className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <MoreVertical className="size-4" />
        </Button>
      </ToolbarRight>
    </ToolbarMobileShell>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function Toolbar() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">Desktop</span>
      <ToolbarNav />
      <ToolbarBreadcrumb />
      <ToolbarViewFilter />
      <ToolbarSearch />
      <ToolbarTabs />
      <ToolbarActiveFilter />
      <ToolbarActions />

      <Separator className="my-1.5" />

      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">Mobile</span>
      <ToolbarMobileNav />
      <ToolbarMobileSearch />
      <ToolbarMobileTabs />
      <ToolbarMobileView />
    </div>
  )
}
