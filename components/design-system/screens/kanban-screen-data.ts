import type { Priority, OTMultiActivos, OTMultiTareas } from "./kanban-card-ot"

// ─── Tipos de datos ───────────────────────────────────────────────────────────

export type TareaSinTomarData = {
  requestNumber: string; assetText: string; taskText: string
  priority: Priority; hora: string; fecha: string; recurringLabel: string
}

export type OTSingleData = {
  woNumber: string; createdBy: string; assetText: string; taskText: string
  priority: Priority; assigneeName: string; assigneeAvatar: string
  horaEstimada: string; fechaVencimiento: string
  showRelatedOT?: boolean; labels?: { name: string; color: string }[]
}

export type OTMultiData = {
  woNumber: string; createdBy: string
  activos: OTMultiActivos; tareas: OTMultiTareas
  urgencyTags: { name: string; color: string }[]
  assigneeName: string; assigneeAvatar: string
  horaEstimada: string; fechaVencimiento: string
  showRelatedOT?: boolean
}

export type DraggableEntry = { id: string; progress: number } & (
  | { type: "single"; data: OTSingleData }
  | { type: "multi";  data: OTMultiData  }
)

// ─── Datos estáticos de muestra (fixtures) ────────────────────────────────────

export const TAREAS_PENDIENTES: TareaSinTomarData[] = [
  {
    requestNumber: "Solicitud #4821",
    assetText: "Compresor de aire Atlas Copco GA37, Planta Norte, área de producción junto al cuarto de herramientas.",
    taskText: "Reemplazo de filtro separador de aceite y revisión de válvulas de alivio de presión.",
    priority: "high", hora: "08:00", fecha: "15-01-2025", recurringLabel: "Cada 3 meses",
  },
  {
    requestNumber: "Solicitud #4822",
    assetText: "Montacargas Toyota 8FGU25 #05, Bodega Central, pasillo 3, bahía de carga.",
    taskText: "Inspección de sistema de frenos hidráulicos y cambio de pastillas desgastadas.",
    priority: "critical", hora: "09:00", fecha: "16-01-2025", recurringLabel: "Cada 6 meses",
  },
  {
    requestNumber: "Solicitud #4823",
    assetText: "Sistema UPS APC Symmetra 20kVA, Data Center piso 2, rack 12, pasillo frío.",
    taskText: "Reemplazo preventivo de banco de baterías de plomo-ácido por vida útil cumplida.",
    priority: "high", hora: "14:00", fecha: "20-01-2025", recurringLabel: "Cada 2 años",
  },
  {
    requestNumber: "Solicitud #4824",
    assetText: "Caldera industrial Cleaver Brooks 200HP, Sala de máquinas, subsuelo nivel 1.",
    taskText: "Limpieza química de tubos de fuego, prueba de seguridades y ajuste de quemador.",
    priority: "medium", hora: "07:00", fecha: "22-01-2025", recurringLabel: "Cada 1 año",
  },
  {
    requestNumber: "Solicitud #4825",
    assetText: "Transformador ABB 500kVA, Subestación eléctrica exterior, sector norte.",
    taskText: "Análisis de aceite dieléctrico, medición de resistencia de aislamiento y termografía.",
    priority: "medium", hora: "10:00", fecha: "25-01-2025", recurringLabel: "Cada 6 meses",
  },
  {
    requestNumber: "Solicitud #4826",
    assetText: "Banda transportadora Rexnord 24\", Línea de producción 3, tramo intermedio.",
    taskText: "Lubricación de rodillos, tensado de banda y revisión de raspadores.",
    priority: "low", hora: "06:00", fecha: "27-01-2025", recurringLabel: "Cada 1 mes",
  },
  {
    requestNumber: "Solicitud #4827",
    assetText: "Compresor de tornillo Ingersoll Rand 75HP, Sala de compresores, unidad 2.",
    taskText: "Mantenimiento de 2000 horas: cambio de aceite, filtros de aire y separador.",
    priority: "high", hora: "08:00", fecha: "28-01-2025", recurringLabel: "Cada 2000h",
  },
  {
    requestNumber: "Solicitud #4828",
    assetText: "Generador de emergencia Caterpillar 500kW, Sala técnica, edificio B.",
    taskText: "Prueba de carga al 80%, revisión de arranque automático y nivel de combustible.",
    priority: "critical", hora: "07:00", fecha: "30-01-2025", recurringLabel: "Cada 3 meses",
  },
  {
    requestNumber: "Solicitud #4829",
    assetText: "Torre de enfriamiento BAC modelo VT-200, Azotea planta procesadora.",
    taskText: "Limpieza y desinfección de láminas de relleno, revisión de ventilador y flotador.",
    priority: "medium", hora: "09:00", fecha: "31-01-2025", recurringLabel: "Cada 2 meses",
  },
]

export const INIT_PROCESO: DraggableEntry[] = [
  {
    id: "WO-2025031-FTTL", type: "single", progress: 10,
    data: {
      woNumber: "WO-2025031-FTTL", createdBy: "Carlos Mendoza",
      assetText: "Generador Cummins C275D5 250kVA, Sala de generadores, edificio principal.",
      taskText: "Mantenimiento preventivo mensual: cambio de aceite 15W-40, filtros y revisión de correas.",
      priority: "high", assigneeName: "Roberto Silva", assigneeAvatar: "https://i.pravatar.cc/150?img=52",
      horaEstimada: "06:00", fechaVencimiento: "18-01-2025",
      labels: [{ name: "Preventivo", color: "var(--info)" }, { name: "Generación", color: "var(--warning)" }],
    },
  },
  {
    id: "WO-2025032-FTTL", type: "multi", progress: 5,
    data: {
      woNumber: "WO-2025032-FTTL", createdBy: "Ana García",
      activos: { total: 8, ok: 6, fail: 2 }, tareas: { total: 22, critical: 1, high: 2, medium: 14, low: 4, veryLow: 1 },
      urgencyTags: [{ name: "Preventivo", color: "var(--info)" }, { name: "Flota", color: "var(--primary)" }],
      assigneeName: "Jorge Ramírez", assigneeAvatar: "https://i.pravatar.cc/150?img=33",
      horaEstimada: "48:00", fechaVencimiento: "24-01-2025",
    },
  },
  {
    id: "WO-2025033-FTTL", type: "multi", progress: 20,
    data: {
      woNumber: "WO-2025033-FTTL", createdBy: "Patricia Torres",
      activos: { total: 3, ok: 2, fail: 1 }, tareas: { total: 12, critical: 0, high: 1, medium: 8, low: 3, veryLow: 0 },
      urgencyTags: [{ name: "Climatización", color: "var(--info)" }],
      assigneeName: "María López", assigneeAvatar: "https://i.pravatar.cc/150?img=47",
      horaEstimada: "16:00", fechaVencimiento: "21-01-2025", showRelatedOT: false,
    },
  },
  {
    id: "WO-2025034-FTTL", type: "single", progress: 15,
    data: {
      woNumber: "WO-2025034-FTTL", createdBy: "Luis Hernández",
      assetText: "Bomba centrífuga KSB Etanorm 40-200, Estación de bombeo, nivel -1.",
      taskText: "Cambio de sellos mecánicos tipo John Crane, revisión de rodamientos y alineación de eje.",
      priority: "medium", assigneeName: "Carmen Ruiz", assigneeAvatar: "https://i.pravatar.cc/150?img=44",
      horaEstimada: "08:00", fechaVencimiento: "23-01-2025", showRelatedOT: false,
      labels: [{ name: "Correctivo", color: "var(--destructive)" }, { name: "Bombas", color: "var(--info)" }],
    },
  },
  {
    id: "WO-2025035-FTTL", type: "single", progress: 30,
    data: {
      woNumber: "WO-2025035-FTTL", createdBy: "Roberto Silva",
      assetText: "Ventilador centrífugo Siemens 45kW, Sala de secado, unidad VE-04.",
      taskText: "Cambio de rodamientos SKF, balanceo dinámico del rotor y revisión de correas de transmisión.",
      priority: "high", assigneeName: "Patricia Torres", assigneeAvatar: "https://i.pravatar.cc/150?img=60",
      horaEstimada: "10:00", fechaVencimiento: "26-01-2025",
      labels: [{ name: "Correctivo", color: "var(--destructive)" }, { name: "Mecánico", color: "var(--primary)" }],
    },
  },
  {
    id: "WO-2025036-FTTL", type: "multi", progress: 45,
    data: {
      woNumber: "WO-2025036-FTTL", createdBy: "Ana García",
      activos: { total: 6, ok: 4, fail: 2 }, tareas: { total: 15, critical: 1, high: 2, medium: 9, low: 3, veryLow: 0 },
      urgencyTags: [{ name: "Preventivo", color: "var(--info)" }, { name: "Eléctrico", color: "var(--warning)" }],
      assigneeName: "Luis Hernández", assigneeAvatar: "https://i.pravatar.cc/150?img=8",
      horaEstimada: "36:00", fechaVencimiento: "27-01-2025",
    },
  },
  {
    id: "WO-2025037-FTTL", type: "single", progress: 8,
    data: {
      woNumber: "WO-2025037-FTTL", createdBy: "Carmen Ruiz",
      assetText: "Elevador hidráulico Haulotte H15SX, Almacén general, zona de estanterías altas.",
      taskText: "Inspección de cilindros hidráulicos, nivel de aceite, control de plataforma y test de seguridades.",
      priority: "critical", assigneeName: "Jorge Ramírez", assigneeAvatar: "https://i.pravatar.cc/150?img=33",
      horaEstimada: "04:00", fechaVencimiento: "28-01-2025", showRelatedOT: false,
      labels: [{ name: "Seguridad", color: "var(--destructive)" }, { name: "Elevación", color: "var(--warning)" }],
    },
  },
  {
    id: "WO-2025038-FTTL", type: "multi", progress: 60,
    data: {
      woNumber: "WO-2025038-FTTL", createdBy: "María López",
      activos: { total: 4, ok: 3, fail: 1 }, tareas: { total: 19, critical: 0, high: 3, medium: 11, low: 4, veryLow: 1 },
      urgencyTags: [{ name: "Anual", color: "var(--primary)" }, { name: "HVAC", color: "var(--info)" }],
      assigneeName: "Ana García", assigneeAvatar: "https://i.pravatar.cc/150?img=25",
      horaEstimada: "44:00", fechaVencimiento: "29-01-2025", showRelatedOT: false,
    },
  },
  {
    id: "WO-2025039-FTTL", type: "single", progress: 25,
    data: {
      woNumber: "WO-2025039-FTTL", createdBy: "Jorge Ramírez",
      assetText: "Chiller York YVAA400, Sala de máquinas climatización, cubierta edificio central.",
      taskText: "Limpieza de condensador de aire, revisión de compresor scroll y análisis de refrigerante R-410A.",
      priority: "medium", assigneeName: "Carlos Mendoza", assigneeAvatar: "https://i.pravatar.cc/150?img=12",
      horaEstimada: "12:00", fechaVencimiento: "30-01-2025",
      labels: [{ name: "Preventivo", color: "var(--info)" }, { name: "Refrigeración", color: "var(--info)" }],
    },
  },
]

export const INIT_REVISION: DraggableEntry[] = [
  {
    id: "WO-2025021-FTTL", type: "multi", progress: 65,
    data: {
      woNumber: "WO-2025021-FTTL", createdBy: "Jorge Ramírez",
      activos: { total: 5, ok: 3, fail: 2 }, tareas: { total: 18, critical: 2, high: 3, medium: 10, low: 2, veryLow: 1 },
      urgencyTags: [{ name: "Eléctrico", color: "var(--warning)" }, { name: "Alta tensión", color: "var(--destructive)" }],
      assigneeName: "Ana García", assigneeAvatar: "https://i.pravatar.cc/150?img=25",
      horaEstimada: "32:00", fechaVencimiento: "10-01-2025",
    },
  },
  {
    id: "WO-2025022-FTTL", type: "single", progress: 75,
    data: {
      woNumber: "WO-2025022-FTTL", createdBy: "Carmen Ruiz",
      assetText: "Torno CNC Mazak Integrex i-400, Área de mecanizado, nave 2, puesto 7.",
      taskText: "Calibración geométrica y ajuste de parámetros de control numérico según especificaciones OEM.",
      priority: "high", assigneeName: "Carlos Mendoza", assigneeAvatar: "https://i.pravatar.cc/150?img=12",
      horaEstimada: "12:00", fechaVencimiento: "12-01-2025",
      labels: [{ name: "Calibración", color: "var(--primary)" }, { name: "CNC", color: "var(--info)" }],
    },
  },
  {
    id: "WO-2025023-FTTL", type: "multi", progress: 55,
    data: {
      woNumber: "WO-2025023-FTTL", createdBy: "Roberto Silva",
      activos: { total: 4, ok: 3, fail: 1 }, tareas: { total: 9, critical: 0, high: 1, medium: 6, low: 2, veryLow: 0 },
      urgencyTags: [{ name: "Refrigeración", color: "var(--info)" }, { name: "Preventivo", color: "var(--info)" }],
      assigneeName: "Patricia Torres", assigneeAvatar: "https://i.pravatar.cc/150?img=60",
      horaEstimada: "20:00", fechaVencimiento: "14-01-2025", showRelatedOT: false,
    },
  },
  {
    id: "WO-2025024-FTTL", type: "single", progress: 80,
    data: {
      woNumber: "WO-2025024-FTTL", createdBy: "María López",
      assetText: "Puente grúa 5 toneladas DEMAG, Área de carga, nave principal, travesaño norte.",
      taskText: "Revisión y lubricación de cables de acero, inspección de polipasto y frenos electromagnéticos.",
      priority: "critical", assigneeName: "Luis Hernández", assigneeAvatar: "https://i.pravatar.cc/150?img=8",
      horaEstimada: "10:00", fechaVencimiento: "15-01-2025",
      labels: [{ name: "Seguridad", color: "var(--destructive)" }, { name: "Izaje", color: "var(--warning)" }],
    },
  },
  {
    id: "WO-2025025-FTTL", type: "single", progress: 85,
    data: {
      woNumber: "WO-2025025-FTTL", createdBy: "Luis Hernández",
      assetText: "Robot Fanuc M20iB/25, Celda de soldadura, nave 1, puesto RS-03.",
      taskText: "Calibración de ejes J1-J6, revisión del teach pendant y actualización de parámetros de backup.",
      priority: "high", assigneeName: "Carmen Ruiz", assigneeAvatar: "https://i.pravatar.cc/150?img=44",
      horaEstimada: "08:00", fechaVencimiento: "16-01-2025",
      labels: [{ name: "Calibración", color: "var(--primary)" }, { name: "Robótica", color: "var(--info)" }],
    },
  },
  {
    id: "WO-2025026-FTTL", type: "multi", progress: 70,
    data: {
      woNumber: "WO-2025026-FTTL", createdBy: "Carlos Mendoza",
      activos: { total: 7, ok: 5, fail: 2 }, tareas: { total: 25, critical: 1, high: 4, medium: 15, low: 5, veryLow: 0 },
      urgencyTags: [{ name: "Correctivo", color: "var(--destructive)" }, { name: "Mecánico", color: "var(--primary)" }],
      assigneeName: "María López", assigneeAvatar: "https://i.pravatar.cc/150?img=47",
      horaEstimada: "56:00", fechaVencimiento: "17-01-2025",
    },
  },
  {
    id: "WO-2025027-FTTL", type: "single", progress: 90,
    data: {
      woNumber: "WO-2025027-FTTL", createdBy: "Patricia Torres",
      assetText: "Camión grúa Hiab 144 DS, Parque de vehículos, sector de equipos pesados.",
      taskText: "Inspección estructural de pluma, revisión del sistema hidráulico y certificación de estabilizadores.",
      priority: "critical", assigneeName: "Roberto Silva", assigneeAvatar: "https://i.pravatar.cc/150?img=52",
      horaEstimada: "06:00", fechaVencimiento: "18-01-2025", showRelatedOT: false,
      labels: [{ name: "Seguridad", color: "var(--destructive)" }, { name: "Vehículos", color: "var(--warning)" }],
    },
  },
  {
    id: "WO-2025028-FTTL", type: "multi", progress: 60,
    data: {
      woNumber: "WO-2025028-FTTL", createdBy: "Ana García",
      activos: { total: 3, ok: 2, fail: 1 }, tareas: { total: 8, critical: 0, high: 1, medium: 5, low: 2, veryLow: 0 },
      urgencyTags: [{ name: "Preventivo", color: "var(--info)" }, { name: "Neumático", color: "var(--primary)" }],
      assigneeName: "Jorge Ramírez", assigneeAvatar: "https://i.pravatar.cc/150?img=33",
      horaEstimada: "18:00", fechaVencimiento: "19-01-2025", showRelatedOT: false,
    },
  },
  {
    id: "WO-2025029-FTTL", type: "single", progress: 78,
    data: {
      woNumber: "WO-2025029-FTTL", createdBy: "Jorge Ramírez",
      assetText: "Bomba de vacío Busch RB0160, Laboratorio de control de calidad, sala blanca.",
      taskText: "Cambio de aceite sintético, filtros de admisión y escape, medición de nivel de vacío final.",
      priority: "medium", assigneeName: "Patricia Torres", assigneeAvatar: "https://i.pravatar.cc/150?img=60",
      horaEstimada: "03:00", fechaVencimiento: "20-01-2025",
      labels: [{ name: "Preventivo", color: "var(--info)" }, { name: "Laboratorio", color: "var(--success)" }],
    },
  },
]

export const INIT_FINALIZADA: DraggableEntry[] = [
  {
    id: "WO-2025011-FTTL", type: "multi", progress: 100,
    data: {
      woNumber: "WO-2025011-FTTL", createdBy: "Ana García",
      activos: { total: 6, ok: 6, fail: 0 }, tareas: { total: 28, critical: 0, high: 2, medium: 18, low: 7, veryLow: 1 },
      urgencyTags: [{ name: "Anual", color: "var(--primary)" }, { name: "Producción", color: "var(--success)" }],
      assigneeName: "Jorge Ramírez", assigneeAvatar: "https://i.pravatar.cc/150?img=33",
      horaEstimada: "80:00", fechaVencimiento: "05-01-2025",
    },
  },
  {
    id: "WO-2025012-FTTL", type: "multi", progress: 100,
    data: {
      woNumber: "WO-2025012-FTTL", createdBy: "Jorge Ramírez",
      activos: { total: 2, ok: 2, fail: 0 }, tareas: { total: 7, critical: 0, high: 0, medium: 4, low: 3, veryLow: 0 },
      urgencyTags: [{ name: "Eléctrico", color: "var(--warning)" }, { name: "LED", color: "var(--success)" }],
      assigneeName: "Roberto Silva", assigneeAvatar: "https://i.pravatar.cc/150?img=52",
      horaEstimada: "14:00", fechaVencimiento: "07-01-2025", showRelatedOT: false,
    },
  },
  {
    id: "WO-2025013-FTTL", type: "single", progress: 100,
    data: {
      woNumber: "WO-2025013-FTTL", createdBy: "Carlos Mendoza",
      assetText: "Unidad de aire acondicionado Carrier 38GXC060 5T, Oficinas administrativas, piso 3.",
      taskText: "Limpieza de evaporador y condensador, bandeja de condensados y carga de refrigerante R-410A.",
      priority: "low", assigneeName: "Carmen Ruiz", assigneeAvatar: "https://i.pravatar.cc/150?img=44",
      horaEstimada: "04:00", fechaVencimiento: "08-01-2025", showRelatedOT: false,
      labels: [{ name: "Preventivo", color: "var(--info)" }, { name: "HVAC", color: "var(--info)" }],
    },
  },
  {
    id: "WO-2025014-FTTL", type: "multi", progress: 100,
    data: {
      woNumber: "WO-2025014-FTTL", createdBy: "Patricia Torres",
      activos: { total: 3, ok: 3, fail: 0 }, tareas: { total: 11, critical: 0, high: 1, medium: 7, low: 3, veryLow: 0 },
      urgencyTags: [{ name: "Seguridad", color: "var(--destructive)" }, { name: "Contra incendios", color: "var(--warning)" }],
      assigneeName: "María López", assigneeAvatar: "https://i.pravatar.cc/150?img=47",
      horaEstimada: "18:00", fechaVencimiento: "09-01-2025",
    },
  },
  {
    id: "WO-2025015-FTTL", type: "single", progress: 100,
    data: {
      woNumber: "WO-2025015-FTTL", createdBy: "Roberto Silva",
      assetText: "Rectificadora sin centros Studer S33, Taller de mecanizado de precisión, banco 4.",
      taskText: "Rectificación de guías lineales, ajuste de husillos de bolas y verificación geométrica con patrón.",
      priority: "medium", assigneeName: "Carmen Ruiz", assigneeAvatar: "https://i.pravatar.cc/150?img=44",
      horaEstimada: "16:00", fechaVencimiento: "03-01-2025", showRelatedOT: false,
      labels: [{ name: "Correctivo", color: "var(--destructive)" }, { name: "Precisión", color: "var(--primary)" }],
    },
  },
  {
    id: "WO-2025016-FTTL", type: "multi", progress: 100,
    data: {
      woNumber: "WO-2025016-FTTL", createdBy: "Luis Hernández",
      activos: { total: 5, ok: 5, fail: 0 }, tareas: { total: 14, critical: 0, high: 0, medium: 8, low: 5, veryLow: 1 },
      urgencyTags: [{ name: "Preventivo", color: "var(--info)" }, { name: "Semestral", color: "var(--success)" }],
      assigneeName: "Ana García", assigneeAvatar: "https://i.pravatar.cc/150?img=25",
      horaEstimada: "28:00", fechaVencimiento: "04-01-2025", showRelatedOT: false,
    },
  },
  {
    id: "WO-2025017-FTTL", type: "single", progress: 100,
    data: {
      woNumber: "WO-2025017-FTTL", createdBy: "Carmen Ruiz",
      assetText: "Sistema PCI red húmeda, Edificio de oficinas, plantas 1 a 4.",
      taskText: "Prueba hidrostática de red, inspección de rociadores, válvulas de control y prueba de alarmas.",
      priority: "high", assigneeName: "Luis Hernández", assigneeAvatar: "https://i.pravatar.cc/150?img=8",
      horaEstimada: "10:00", fechaVencimiento: "05-01-2025",
      labels: [{ name: "Seguridad", color: "var(--destructive)" }, { name: "Contra incendios", color: "var(--warning)" }],
    },
  },
  {
    id: "WO-2025018-FTTL", type: "multi", progress: 100,
    data: {
      woNumber: "WO-2025018-FTTL", createdBy: "Ana García",
      activos: { total: 9, ok: 9, fail: 0 }, tareas: { total: 32, critical: 0, high: 2, medium: 20, low: 9, veryLow: 1 },
      urgencyTags: [{ name: "Anual", color: "var(--primary)" }, { name: "Eléctrico", color: "var(--warning)" }],
      assigneeName: "Jorge Ramírez", assigneeAvatar: "https://i.pravatar.cc/150?img=33",
      horaEstimada: "96:00", fechaVencimiento: "06-01-2025",
    },
  },
  {
    id: "WO-2025019-FTTL", type: "single", progress: 100,
    data: {
      woNumber: "WO-2025019-FTTL", createdBy: "María López",
      assetText: "Calefactor industrial Reznor UDAP-400, Nave de almacenamiento, zona norte.",
      taskText: "Revisión y limpieza del quemador, electroválvula de gas, intercambiador de calor y termostatos.",
      priority: "low", assigneeName: "Patricia Torres", assigneeAvatar: "https://i.pravatar.cc/150?img=60",
      horaEstimada: "05:00", fechaVencimiento: "06-01-2025", showRelatedOT: false,
      labels: [{ name: "Preventivo", color: "var(--info)" }, { name: "Gas", color: "var(--warning)" }],
    },
  },
]
