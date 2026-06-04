"use client"

import { useState } from "react"
import {
  ChevronDown, RotateCcw, ListFilter, Settings2,
  MapPin, Cpu, Building2, Layers, Box, Wrench, Scissors, ClipboardList, Map,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button }   from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tree, type TreeNode } from "@/components/ui/tree"
import { TopbarBar, TopbarBarMobile } from "./topbar"
import { useScreenMode } from "../screen-mode-context"
import { cn } from "@/lib/utils"

// ─── Opciones de filtro ───────────────────────────────────────────────────────

const FILTER_OPTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "todos",      label: "Todos los Activos",      icon: Layers        },
  { id: "ubicaciones",label: "Ubicaciones",            icon: MapPin        },
  { id: "equipos",    label: "Equipos",                icon: Box           },
  { id: "herramientas",label: "Herramientas",          icon: Wrench        },
  { id: "repuestos",  label: "Repuestos y Suministros",icon: Scissors      },
  { id: "digitales",  label: "Digitales",              icon: ClipboardList },
  { id: "mapas",      label: "Mapas",                  icon: Map           },
]

// ─── Datos de muestra ─────────────────────────────────────────────────────────

const TREE_DATA: TreeNode[] = [
  {
    id: "1",
    label: "Sede Central",
    description: "Bogotá, Colombia",
    icon: Building2,
    children: [
      {
        id: "1-1",
        label: "Planta de Producción Norte",
        description: "Sede Central › Bogotá",
        icon: MapPin,
        children: [
          { id: "1-1-1", label: "Refrigerador Industrial A",  description: "Planta Norte › Zona Frío",    icon: Cpu },
          { id: "1-1-2", label: "Compresor Central",          description: "Planta Norte › Sala Máquinas", icon: Cpu },
          { id: "1-1-3", label: "Generador de Respaldo",      description: "Planta Norte › Subestación",  icon: Cpu },
        ],
      },
      {
        id: "1-2",
        label: "Almacén Logístico",
        description: "Sede Central › Bodega Sur",
        icon: MapPin,
        children: [
          { id: "1-2-1", label: "Montacargas 01", description: "Almacén › Zona de Carga",  icon: Cpu },
          { id: "1-2-2", label: "Banda Transportadora", description: "Almacén › Línea 3", icon: Cpu },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Filial São Paulo",
    description: "São Paulo, Brasil",
    icon: Building2,
    children: [
      {
        id: "2-1",
        label: "Planta Manufactura SP",
        description: "Filial SP › Zona Industrial",
        icon: MapPin,
        children: [
          { id: "2-1-1", label: "Horno de Fundición",   description: "Manufactura SP › Área 4",    icon: Cpu },
          { id: "2-1-2", label: "Prensa Hidráulica 02", description: "Manufactura SP › Línea B",   icon: Cpu },
        ],
      },
      { id: "2-2", label: "Centro de Distribución SP", description: "Filial SP › Puerto Seco", icon: MapPin },
    ],
  },
  {
    id: "3",
    label: "Oficina Lima",
    description: "Lima, Perú",
    icon: Building2,
    children: [
      { id: "3-1", label: "Sala de Servidores",   description: "Lima › Piso 3",           icon: Cpu },
      { id: "3-2", label: "Unidad de Climatización", description: "Lima › Azotea",        icon: Cpu },
    ],
  },
  {
    id: "4",
    label: "Planta Monterrey",
    description: "Monterrey, México",
    icon: Building2,
    children: [
      {
        id: "4-1",
        label: "Línea de Ensamble",
        description: "Monterrey › Nave Industrial 2",
        icon: MapPin,
        children: [
          { id: "4-1-1", label: "Robot Soldador R-12",   description: "Ensamble › Estación 5",  icon: Cpu },
          { id: "4-1-2", label: "Banda Ensamble Final",  description: "Ensamble › Salida",      icon: Cpu },
          { id: "4-1-3", label: "Compresor de Aire",     description: "Ensamble › Zona Neumática", icon: Cpu },
        ],
      },
      { id: "4-2", label: "Almacén de Materias Primas", description: "Monterrey › Bodega A", icon: MapPin },
    ],
  },
  { id: "5",  label: "Sucursal Buenos Aires",  description: "Buenos Aires, Argentina", icon: Building2 },
  { id: "6",  label: "Centro Operativo Quito", description: "Quito, Ecuador",          icon: Building2 },
  { id: "7",  label: "Depósito Santiago",      description: "Santiago, Chile",         icon: MapPin    },
  { id: "8",  label: "Oficina Caracas",        description: "Caracas, Venezuela",      icon: Building2 },
  { id: "9",  label: "Hub Logístico Panamá",   description: "Ciudad de Panamá",        icon: MapPin    },
  { id: "10", label: "Planta San José",        description: "San José, Costa Rica",    icon: Building2 },
  { id: "11", label: "Bodega Guayaquil",       description: "Guayaquil, Ecuador",      icon: MapPin    },
  { id: "12", label: "Sucursal Medellín",      description: "Medellín, Colombia",      icon: Building2 },
  { id: "13", label: "Centro de Distribución Cali", description: "Cali, Colombia",    icon: MapPin    },
]

// ─── Pantalla ─────────────────────────────────────────────────────────────────

export function VistaArbol() {
  const [activeFilter, setActiveFilter] = useState("todos")
  const selected     = FILTER_OPTIONS.find((o) => o.id === activeFilter)!
  const SelectedIcon = selected.icon
  const screenMode   = useScreenMode()
  const isMobile     = screenMode === "mobile"
  const isCompact    = screenMode !== "desktop"

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {isMobile
        ? <TopbarBarMobile title="Activos" subtitle="Vista Árbol" />
        : <TopbarBar title="Activos" subtitle="Vista Árbol" showSearch />
      }

      {/* Contenido con fondo muted */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted gap-2 p-2">

        {/* Toolbar card */}
        <div className="flex items-center h-[60px] flex items-center rounded-lg border bg-background px-3 gap-3 shrink-0">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">
                <SelectedIcon className="size-4" />
                {!isCompact && selected.label}
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {FILTER_OPTIONS.map(({ id, label, icon: Icon }) => (
                <DropdownMenuItem
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  className={cn(activeFilter === id && "bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary")}
                >
                  <Icon className={cn("size-4 shrink-0", activeFilter === id ? "text-primary" : "text-muted-foreground")} />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1" />

          <Button variant="ghost" size="icon-sm">
            <RotateCcw className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <ListFilter className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Settings2 className="size-4" />
          </Button>
        </div>

        {/* Card del árbol */}
        <div className="flex-1 min-h-0 rounded-lg border bg-background overflow-hidden">
          <Tree
            data={TREE_DATA}
            defaultExpandedIds={["1", "1-1"]}
            onOpen={(id) => console.log("Abrir activo:", id)}
            className="h-full"
          />
        </div>

      </div>
    </div>
  )
}
