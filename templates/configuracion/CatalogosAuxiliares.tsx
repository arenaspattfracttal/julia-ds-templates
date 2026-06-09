"use client"

import { useState } from "react"
import {
  AlertTriangle, ClipboardList,
  EllipsisVertical, Eye, Pencil, Trash2,
  Clock, Layers, RotateCcw, Ruler, Warehouse,
  Building2, Receipt, ListChecks, ShieldCheck,
  Users, UsersRound, Activity, Wrench,
  ShoppingBag, Hash, Link2,
  Tag, Zap, ScanSearch,
} from "lucide-react"
import { Button }       from "@/components/ui/button"
import { Switch }       from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable, type ColumnDef } from "@/components/ui/data-table"
import { cn } from "@/lib/utils"

// ─── Tipos ────────────────────────────────────────────────────────────────────

type EntradaCatalogo = {
  id:          number
  activo:      boolean
  descripcion: string
  rel1:        number
  rel2:        number
}

type EntradaSimple = {
  id:          number
  activo:      boolean
  descripcion: string
  relacionado: string
}

// ─── Datos — Catálogo de Fallas ───────────────────────────────────────────────

const TIPOS_FALLA_DATA: EntradaCatalogo[] = [
  { id:  1, activo: true,  descripcion: "12232-3",                         rel1:  1, rel2:  8 },
  { id:  2, activo: false, descripcion: "1. FALHA ELÉTRICA2",              rel1:  4, rel2: 18 },
  { id:  3, activo: false, descripcion: "1 Falla Mecanicas",               rel1:  4, rel2: 18 },
  { id:  4, activo: false, descripcion: "1. Vazamento",                    rel1:  2, rel2: 11 },
  { id:  5, activo: false, descripcion: "2 Falla Eléctricab",              rel1:  2, rel2: 11 },
  { id:  6, activo: false, descripcion: "3 Falla de Operación",            rel1:  4, rel2: 18 },
  { id:  7, activo: false, descripcion: "ARTICULADA CAT",                  rel1:  1, rel2:  8 },
  { id:  8, activo: false, descripcion: "BODEGA",                          rel1:  9, rel2: 20 },
  { id:  9, activo: false, descripcion: "Cambio de nombre Pintura",        rel1:  0, rel2:  0 },
  { id: 10, activo: false, descripcion: "catalogo de pruebas condiciones", rel1:  0, rel2:  0 },
  { id: 11, activo: true,  descripcion: "CONEXION DE RED",                 rel1:  0, rel2:  0 },
  { id: 12, activo: false, descripcion: "CONEXION DE RED WI-FI",           rel1:  0, rel2:  0 },
  { id: 13, activo: false, descripcion: "défaillance électrique",          rel1:  0, rel2:  0 },
  { id: 14, activo: false, descripcion: "Défaut électrique",               rel1:  0, rel2:  0 },
  { id: 15, activo: true,  descripcion: "Eléctrica",                       rel1:  6, rel2: 12 },
  { id: 16, activo: false, descripcion: "Falla de lubricación",            rel1:  3, rel2:  9 },
  { id: 17, activo: true,  descripcion: "Falla estructural",               rel1:  5, rel2: 14 },
  { id: 18, activo: false, descripcion: "Falla hidráulica",                rel1:  2, rel2:  6 },
  { id: 19, activo: false, descripcion: "Falla mecánica general",          rel1:  7, rel2: 15 },
  { id: 20, activo: false, descripcion: "Falla por corrosión",             rel1:  1, rel2:  4 },
]

const CAUSAS_FALLA_DATA: EntradaSimple[] = [
  { id:  1, activo: true,  descripcion: "Desgaste normal",              relacionado: "Falla mecánica general" },
  { id:  2, activo: true,  descripcion: "Corto circuito",               relacionado: "Eléctrica" },
  { id:  3, activo: false, descripcion: "Falta de mantenimiento",       relacionado: "Falla de lubricación" },
  { id:  4, activo: true,  descripcion: "Sobrecarga",                   relacionado: "3 Falla de Operación" },
  { id:  5, activo: false, descripcion: "Contaminación",                relacionado: "Falla hidráulica" },
  { id:  6, activo: true,  descripcion: "Corrosión",                    relacionado: "Falla por corrosión" },
  { id:  7, activo: false, descripcion: "Vibración excesiva",           relacionado: "Falla estructural" },
  { id:  8, activo: false, descripcion: "Temperatura fuera de rango",   relacionado: "3 Falla de Operación" },
  { id:  9, activo: true,  descripcion: "Error de operación",           relacionado: "3 Falla de Operación" },
  { id: 10, activo: false, descripcion: "Falla de soldadura",           relacionado: "Falla estructural" },
]

const METODOS_DETECCION_DATA: EntradaSimple[] = [
  { id:  1, activo: true,  descripcion: "Inspección visual",            relacionado: "Múltiples" },
  { id:  2, activo: true,  descripcion: "Análisis de vibración",        relacionado: "Falla mecánica general" },
  { id:  3, activo: true,  descripcion: "Termografía infrarroja",       relacionado: "Eléctrica" },
  { id:  4, activo: false, descripcion: "Análisis de aceite",           relacionado: "Falla de lubricación" },
  { id:  5, activo: true,  descripcion: "Ultrasonido",                  relacionado: "Falla estructural" },
  { id:  6, activo: false, descripcion: "Inspección por partículas",    relacionado: "Falla estructural" },
  { id:  7, activo: true,  descripcion: "Monitoreo de parámetros",      relacionado: "IOT" },
  { id:  8, activo: false, descripcion: "Prueba de presión",            relacionado: "Falla hidráulica" },
]

// ─── Datos — Catálogo de Actividades ─────────────────────────────────────────

const TIPOS_ACTIVIDAD_DATA: EntradaCatalogo[] = [
  { id:  1, activo: true,  descripcion: "Mantenimiento Preventivo",     rel1: 12, rel2: 0 },
  { id:  2, activo: true,  descripcion: "Mantenimiento Correctivo",     rel1:  8, rel2: 0 },
  { id:  3, activo: false, descripcion: "Inspección",                   rel1:  5, rel2: 0 },
  { id:  4, activo: true,  descripcion: "Lubricación",                  rel1:  4, rel2: 0 },
  { id:  5, activo: false, descripcion: "Calibración",                  rel1:  3, rel2: 0 },
  { id:  6, activo: true,  descripcion: "Limpieza",                     rel1:  6, rel2: 0 },
  { id:  7, activo: false, descripcion: "Sustitución de componentes",   rel1:  2, rel2: 0 },
]

const ACTIVIDADES_DATA: EntradaSimple[] = [
  { id:  1, activo: true,  descripcion: "Cambio de aceite",             relacionado: "Lubricación" },
  { id:  2, activo: true,  descripcion: "Revisión eléctrica general",   relacionado: "Mantenimiento Preventivo" },
  { id:  3, activo: false, descripcion: "Calibración de sensores",      relacionado: "Calibración" },
  { id:  4, activo: true,  descripcion: "Limpieza de filtros",          relacionado: "Limpieza" },
  { id:  5, activo: true,  descripcion: "Inspección de rodamientos",    relacionado: "Inspección" },
  { id:  6, activo: false, descripcion: "Cambio de correas",            relacionado: "Sustitución de componentes" },
  { id:  7, activo: true,  descripcion: "Revisión de alineación",       relacionado: "Mantenimiento Correctivo" },
]

// ─── Datos — Catálogo de Componentes ─────────────────────────────────────────

const COMPONENTES_DATA: EntradaCatalogo[] = [
  { id:  1, activo: true,  descripcion: "Motor eléctrico",              rel1: 3, rel2: 0 },
  { id:  2, activo: true,  descripcion: "Bomba hidráulica",             rel1: 5, rel2: 0 },
  { id:  3, activo: false, descripcion: "Compresor de aire",            rel1: 2, rel2: 0 },
  { id:  4, activo: true,  descripcion: "Reductor de velocidad",        rel1: 4, rel2: 0 },
  { id:  5, activo: true,  descripcion: "Válvula de control",           rel1: 6, rel2: 0 },
  { id:  6, activo: false, descripcion: "Sensor de temperatura",        rel1: 1, rel2: 0 },
  { id:  7, activo: true,  descripcion: "Rodamiento",                   rel1: 8, rel2: 0 },
  { id:  8, activo: false, descripcion: "Correa de transmisión",        rel1: 3, rel2: 0 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowActions() {
  return (
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
  )
}

// ─── Tabla con switch + descripción + dos contadores ─────────────────────────

function TablaDoble({
  data, setData, col1, col2, addLabel, isCompact,
}: {
  data:      EntradaCatalogo[]
  setData:   React.Dispatch<React.SetStateAction<EntradaCatalogo[]>>
  col1:      string
  col2:      string
  addLabel:  string
  isCompact: boolean
}) {
  const columns: ColumnDef<EntradaCatalogo>[] = [
    {
      id:   "activo",
      size: 56,
      header: "",
      cell: ({ row }) => (
        <Switch
          checked={row.original.activo}
          onCheckedChange={v =>
            setData(prev => prev.map(r => r.id === row.original.id ? { ...r, activo: v } : r))
          }
        />
      ),
    },
    {
      accessorKey: "descripcion",
      header:      "Descripción",
    },
    {
      accessorKey: "rel1",
      header:      col1,
      size:        160,
    },
    {
      accessorKey: "rel2",
      header:      col2,
      size:        180,
    },
  ]

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      <DataTable
        columns={columns}
        data={data}
        border={false}
        resizable
        reorder
        rowSelection
        globalFilter
        columnToggle
        rowDensity
        onAdd={() => {}}
        addLabel={isCompact ? undefined : addLabel}
        onRefresh={() => {}}
        rowActions={rowActions}
        onBulkDelete={() => {}}
        mobileView={isCompact}
      />
    </div>
  )
}

// ─── Tabla con switch + descripción + relacionado ─────────────────────────────

function TablaSimple({
  data, setData, colRel, addLabel, isCompact,
}: {
  data:      EntradaSimple[]
  setData:   React.Dispatch<React.SetStateAction<EntradaSimple[]>>
  colRel:    string
  addLabel:  string
  isCompact: boolean
}) {
  const columns: ColumnDef<EntradaSimple>[] = [
    {
      id:   "activo",
      size: 56,
      header: "",
      cell: ({ row }) => (
        <Switch
          checked={row.original.activo}
          onCheckedChange={v =>
            setData(prev => prev.map(r => r.id === row.original.id ? { ...r, activo: v } : r))
          }
        />
      ),
    },
    {
      accessorKey: "descripcion",
      header:      "Descripción",
    },
    {
      accessorKey: "relacionado",
      header:      colRel,
    },
  ]

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      <DataTable
        columns={columns}
        data={data}
        border={false}
        resizable
        reorder
        rowSelection
        globalFilter
        columnToggle
        rowDensity
        onAdd={() => {}}
        addLabel={isCompact ? undefined : addLabel}
        onRefresh={() => {}}
        rowActions={rowActions}
        onBulkDelete={() => {}}
        mobileView={isCompact}
      />
    </div>
  )
}

// ─── Sub-tabs Fallas ──────────────────────────────────────────────────────────

function FallasContent({ isCompact, isMobile }: { isCompact: boolean; isMobile: boolean }) {
  const [tiposFalla,  setTiposFalla]  = useState(TIPOS_FALLA_DATA)
  const [causasFalla, setCausasFalla] = useState(CAUSAS_FALLA_DATA)
  const [metodos,     setMetodos]     = useState(METODOS_DETECCION_DATA)

  return (
    <Tabs defaultValue="tipos" className="flex flex-col flex-1 min-h-0">
      <div className="shrink-0 px-3 py-2 border-b">
        <TabsList variant="default" className="w-full">
          <TabsTrigger value="tipos"   className="flex-1 gap-1.5"><Tag       className="size-3.5" />Tipos de Falla</TabsTrigger>
          <TabsTrigger value="causas"  className="flex-1 gap-1.5"><Zap       className="size-3.5" />Causas de Falla</TabsTrigger>
          <TabsTrigger value="metodos" className="flex-1 gap-1.5"><ScanSearch className="size-3.5" />Métodos de Detección</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="tipos"   className="flex-1 min-h-0 mt-0 flex flex-col">
        <TablaDoble
          data={tiposFalla} setData={setTiposFalla}
          col1="Causas de Falla" col2="Métodos de Detección"
          addLabel="Nuevo tipo" isCompact={isCompact}
        />
      </TabsContent>
      <TabsContent value="causas"  className="flex-1 min-h-0 mt-0 flex flex-col">
        <TablaSimple
          data={causasFalla} setData={setCausasFalla}
          colRel="Tipo de Falla"
          addLabel="Nueva causa" isCompact={isCompact}
        />
      </TabsContent>
      <TabsContent value="metodos" className="flex-1 min-h-0 mt-0 flex flex-col">
        <TablaSimple
          data={metodos} setData={setMetodos}
          colRel="Asociado a"
          addLabel="Nuevo método" isCompact={isCompact}
        />
      </TabsContent>
    </Tabs>
  )
}

// ─── Sub-tabs Actividades ─────────────────────────────────────────────────────

function ActividadesContent({ isCompact, isMobile }: { isCompact: boolean; isMobile: boolean }) {
  const [tipos,       setTipos]       = useState(TIPOS_ACTIVIDAD_DATA)
  const [actividades, setActividades] = useState(ACTIVIDADES_DATA)

  return (
    <Tabs defaultValue="tipos" className="flex flex-col flex-1 min-h-0">
      <div className="shrink-0 border-b px-3">
        <TabsList variant="line">
          <TabsTrigger value="tipos">Tipos de Actividad</TabsTrigger>
          <TabsTrigger value="actividades">Actividades</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="tipos" className="flex-1 min-h-0 mt-0 flex flex-col">
        <TablaDoble
          data={tipos} setData={setTipos}
          col1="Actividades" col2=""
          addLabel="Nuevo tipo" isCompact={isCompact}
        />
      </TabsContent>
      <TabsContent value="actividades" className="flex-1 min-h-0 mt-0 flex flex-col">
        <TablaSimple
          data={actividades} setData={setActividades}
          colRel="Tipo de Actividad"
          addLabel="Nueva actividad" isCompact={isCompact}
        />
      </TabsContent>
    </Tabs>
  )
}

// ─── Sub-tabs Componentes ─────────────────────────────────────────────────────

function ComponentesContent({ isCompact, isMobile }: { isCompact: boolean; isMobile: boolean }) {
  const [componentes, setComponentes] = useState(COMPONENTES_DATA)

  return (
    <Tabs defaultValue="componentes" className="flex flex-col flex-1 min-h-0">
      <div className="shrink-0 border-b px-3">
        <TabsList variant="line">
          <TabsTrigger value="componentes">Componentes</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="componentes" className="flex-1 min-h-0 mt-0 flex flex-col">
        <TablaDoble
          data={componentes} setData={setComponentes}
          col1="Activos relacionados" col2=""
          addLabel="Nuevo componente" isCompact={isCompact}
        />
      </TabsContent>
    </Tabs>
  )
}

// ─── Datos genéricos ──────────────────────────────────────────────────────────

function makeGeneric(labels: string[]): EntradaCatalogo[] {
  return labels.map((descripcion, i) => ({
    id: i + 1, activo: i % 3 !== 2, descripcion, rel1: 0, rel2: 0,
  }))
}

const GENERIC_DATA: Record<string, EntradaCatalogo[]> = {
  horasExtra:    makeGeneric(["Hora extra diurna", "Hora extra nocturna", "Hora extra festiva", "Hora extra dominical"]),
  activos:       makeGeneric(["Equipo rotativo", "Equipo estático", "Instrumento", "Estructura civil", "Vehículo"]),
  reprogramacion:makeGeneric(["Falta de repuestos", "Personal no disponible", "Condiciones climáticas", "Prioridad de producción", "Falla en planificación"]),
  unidad:        makeGeneric(["kg", "litro", "metro", "unidad", "galón", "tonelada", "hora"]),
  almacenes:     makeGeneric(["Almacén central", "Almacén de campo", "Almacén temporal", "Almacén externo"]),
  centroCoste:   makeGeneric(["Mantenimiento", "Producción", "Administración", "Ingeniería", "Operaciones"]),
  presupuestos:  makeGeneric(["Presupuesto anual", "Presupuesto correctivo", "Presupuesto preventivo", "Presupuesto predictivo"]),
  tareas:        makeGeneric(["Inspección visual", "Lubricación", "Ajuste mecánico", "Medición eléctrica", "Prueba funcional"]),
  compliance:    makeGeneric(["Seguridad industrial", "Medio ambiente", "Calidad", "Riesgo eléctrico", "Trabajo en alturas"]),
  rrhh:          makeGeneric(["Mecánico", "Electricista", "Instrumentista", "Supervisor", "Operador", "Contratista"]),
  terceros:      makeGeneric(["Proveedor externo", "Contratista especializado", "Fabricante OEM", "Consultor técnico"]),
  fracttalSense: makeGeneric(["Sensor temperatura", "Sensor vibración", "Sensor presión", "Sensor caudal", "Sensor nivel"]),
  otTipos:       makeGeneric(["Preventivo", "Correctivo", "Predictivo", "Modificativo", "Inspección"]),
  solicitudes:   makeGeneric(["Solicitud urgente", "Solicitud programada", "Solicitud de inspección", "Solicitud de mejora"]),
  solMaterial:   makeGeneric(["Repuesto mecánico", "Repuesto eléctrico", "Consumible", "Herramienta", "Lubricante"]),
  iso:           makeGeneric(["ISO 55001", "ISO 9001", "ISO 14001", "ISO 45001", "ISO 50001"]),
  conexiones:    makeGeneric(["SAP", "Oracle EAM", "Maximo", "API REST", "CMMS externo"]),
}

// ─── Catálogo genérico ────────────────────────────────────────────────────────

function GenericContent({
  dataKey, addLabel, isCompact,
}: {
  dataKey:   string
  addLabel:  string
  isCompact: boolean
}) {
  const [data, setData] = useState<EntradaCatalogo[]>(GENERIC_DATA[dataKey] ?? [])

  const columns: ColumnDef<EntradaCatalogo>[] = [
    {
      id: "activo", size: 56, header: "",
      cell: ({ row }) => (
        <Switch
          checked={row.original.activo}
          onCheckedChange={v => setData(prev => prev.map(r => r.id === row.original.id ? { ...r, activo: v } : r))}
        />
      ),
    },
    { accessorKey: "descripcion", header: "Descripción" },
  ]

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      <DataTable
        columns={columns} data={data}
        border={false} resizable reorder
        rowSelection globalFilter columnToggle rowDensity
        onAdd={() => {}} addLabel={isCompact ? undefined : addLabel}
        onRefresh={() => {}}
        rowActions={rowActions}
        onBulkDelete={() => {}}
        mobileView={isCompact}
      />
    </div>
  )
}

// ─── Catálogos config ─────────────────────────────────────────────────────────

const CATALOGOS = [
  { id: "fallas",        label: "Catálogo de Fallas",                    icon: AlertTriangle },
  { id: "horasExtra",    label: "Horas Extra",                           icon: Clock         },
  { id: "activos",       label: "Activos",                               icon: Layers        },
  { id: "reprogramacion",label: "Causa de reprogramación de la tarea",   icon: RotateCcw     },
  { id: "unidad",        label: "Unidad",                                icon: Ruler         },
  { id: "almacenes",     label: "Almacenes",                             icon: Warehouse     },
  { id: "centroCoste",   label: "Centro de coste",                       icon: Building2     },
  { id: "presupuestos",  label: "Presupuestos",                          icon: Receipt       },
  { id: "tareas",        label: "Tareas",                                icon: ListChecks    },
  { id: "compliance",    label: "Compliance y seguridad",                icon: ShieldCheck   },
  { id: "rrhh",          label: "Recursos Humanos",                      icon: Users         },
  { id: "terceros",      label: "Terceros",                              icon: UsersRound    },
  { id: "fracttalSense", label: "Fracttal Sense",                        icon: Activity      },
  { id: "otTipos",       label: "Órdenes de Trabajo",                    icon: Wrench        },
  { id: "solicitudes",   label: "Solicitudes de Trabajo",                icon: ClipboardList },
  { id: "solMaterial",   label: "Solicitudes de Material",               icon: ShoppingBag   },
  { id: "iso",           label: "Codificación ISO",                      icon: Hash          },
  { id: "conexiones",    label: "Conexiones",                            icon: Link2         },
] as const

type CatalogoId = typeof CATALOGOS[number]["id"]

// ─── Mapa navId → CatalogoId ──────────────────────────────────────────────────

const NAV_TO_CATALOGO: Record<string, CatalogoId> = {
  "cat-fallas":         "fallas",
  "cat-horas-extra":    "horasExtra",
  "cat-activos":        "activos",
  "cat-reprogramacion": "reprogramacion",
  "cat-unidad":         "unidad",
  "cat-almacenes":      "almacenes",
  "cat-coste":          "centroCoste",
  "cat-presupuestos":   "presupuestos",
  "cat-tareas":         "tareas",
  "cat-compliance":     "compliance",
  "cat-rrhh":           "rrhh",
  "cat-terceros":       "terceros",
  "cat-sense":          "fracttalSense",
  "cat-ot":             "otTipos",
  "cat-sol-trabajo":    "solicitudes",
  "cat-sol-material":   "solMaterial",
  "cat-iso":            "iso",
  "cat-conexiones":     "conexiones",
}

// ─── Export principal ─────────────────────────────────────────────────────────

export function CatalogosContent({ isCompact, isMobile = false, navId }: { isCompact: boolean; isMobile?: boolean; navId?: string }) {
  const activoCatalogo: CatalogoId = (navId ? NAV_TO_CATALOGO[navId] : undefined) ?? "fallas"

  if (activoCatalogo === "fallas") {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <FallasContent isCompact={isCompact} isMobile={isMobile} />
      </div>
    )
  }

  const label = CATALOGOS.find(c => c.id === activoCatalogo)?.label ?? activoCatalogo
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <GenericContent
        dataKey={activoCatalogo}
        addLabel={`Nuevo — ${label}`}
        isCompact={isCompact}
      />
    </div>
  )
}
