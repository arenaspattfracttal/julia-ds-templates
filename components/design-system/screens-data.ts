/**
 * Pantallas / componentes — añade aquí las entradas que quieres recrear.
 * Cada entrada puede tener una imagen de referencia y/o un componente recreado.
 */

import type { ComponentType } from "react"
import { Topbar } from "./screens/topbar"
import { AppSidebar } from "./screens/app-sidebar"
import { Toolbar } from "./screens/toolbar"
import { DrawerTarea } from "./screens/drawer-tarea"
import { KanbanCardOT } from "./screens/kanban-card-ot"
import { KanbanScreen } from "./screens/kanban-screen"
import { UserMenu } from "./screens/user-menu"
import { ConfiguracionGeneral }  from "./screens/configuracion-general"
import { CalendarioLaboral }     from "./screens/calendario-laboral"
import { TareasPendientes }      from "./screens/tareas-pendientes"
import { CuentasUsuarios }      from "./screens/cuentas-usuarios"
import { DetalleMedidor }       from "./screens/detalle-medidor"
import { VistaArbol }           from "./screens/vista-arbol"
import { PresupuestoDetalle }   from "./screens/presupuesto-detalle"
import { DetalleEmpleado }      from "./screens/detalle-empleado"
import {
  SkeletonKanban,
  SkeletonConfiguracion,
  SkeletonTareasPendientes,
  SkeletonCuentasUsuarios,
  SkeletonDetalleMedidor,
  SkeletonVistaArbol,
  SkeletonDetalleEmpleado,
} from "./screens/layout-skeletons"

export type SampleScreen = {
  id: string
  name: string
  description?: string
  /** URL o ruta a la imagen de referencia (screenshot original) */
  imageUrl?: string
  /** Componente React recreado con Julia DS */
  component?: ComponentType
  /** Estado de la recreación */
  status: "pending" | "in-progress" | "done"
  /** Cómo se muestra el componente en el canvas del viewer */
  layout?: "full" | "drawer-right" | "full-page"
  /** Sección en el panel izquierdo */
  section?: "componentes" | "pantallas" | "estilos"
  /** Sub-sección dentro de la sección (ej. "kanban") */
  group?: string
}

export const SAMPLE_SCREENS: SampleScreen[] = [
  {
    id: "topbar",
    name: "Topbar",
    description: "Barra de navegación superior principal",
    status: "done",
    component: Topbar,
  },
  {
    id: "app-sidebar",
    name: "App Sidebar",
    description: "Sidebar de navegación principal con módulos y ayuda",
    status: "done",
    component: AppSidebar,
  },
  {
    id: "toolbar",
    name: "Toolbar",
    description: "Barra de acciones con navegación y acción principal",
    status: "done",
    component: Toolbar,
  },
  {
    id: "drawer-tarea",
    name: "Drawer Tarea",
    description: "Panel lateral derecho de detalle y edición de tarea",
    status: "done",
    component: DrawerTarea,
    layout: "drawer-right",
  },
  {
    id: "kanban-card-ot",
    name: "Kanban Cards",
    description: "Tarjetas Kanban: OT tarea única, OT múltiples tareas, tarea sin tomar",
    status: "done",
    component: KanbanCardOT,
  },
  {
    id: "user-menu",
    name: "User Menu",
    description: "Menú desplegable de perfil con ajustes, modo oscuro y cerrar sesión",
    status: "done",
    component: UserMenu,
  },
  // ── Pantallas ──────────────────────────────────────────────────────────────
  {
    id: "kanban-screen",
    name: "Kanban",
    description: "Pantalla completa de Kanban con columnas de OTs",
    status: "done",
    component: KanbanScreen,
    layout: "full-page",
    section: "pantallas",
    group: "kanban",
  },
  {
    id: "configuracion-general",
    name: "Configuración General",
    description: "Pantalla de ajustes generales de compañía: identidad, dirección, mapa y preferencias",
    status: "done",
    component: ConfiguracionGeneral,
    layout: "full-page",
    section: "pantallas",
    group: "configuracion",
  },
  {
    id: "calendario-laboral",
    name: "Calendario Laboral",
    description: "Gestión de días laborales y días festivos con tabla de feriados",
    status: "done",
    component: CalendarioLaboral,
    layout: "full-page",
    section: "pantallas",
    group: "configuracion",
  },
  {
    id: "tareas-pendientes",
    name: "Tareas Pendientes",
    description: "Listado de tareas pendientes con tabla, filtros y acciones por fila",
    status: "done",
    component: TareasPendientes,
    layout: "full-page",
    section: "pantallas",
    group: "tareas",
  },
  {
    id: "cuentas-usuarios",
    name: "Cuentas de Usuarios",
    description: "Gestión de cuentas de usuario con tabla de usuarios, roles y estados",
    status: "done",
    component: CuentasUsuarios,
    layout: "full-page",
    section: "pantallas",
    group: "configuracion",
  },
  {
    id: "detalle-medidor",
    name: "Detalle Medidor",
    description: "Pantalla de detalle y edición de un sensor/medidor con nav lateral",
    status: "done",
    component: DetalleMedidor,
    layout: "full-page",
    section: "pantallas",
    group: "monitoreo",
  },
  {
    id: "vista-arbol",
    name: "Vista Árbol",
    description: "Vista jerárquica de activos en forma de árbol expandible",
    status: "done",
    component: VistaArbol,
    layout: "full-page",
    section: "pantallas",
    group: "activos",
  },
  {
    id: "presupuesto-detalle",
    name: "Presupuesto Detalle",
    description: "Detalle de presupuesto con formulario de cabecera, ítems y totales",
    status: "done",
    component: PresupuestoDetalle,
    layout: "full-page",
    section: "pantallas",
    group: "financiero",
  },
  {
    id: "detalle-empleado",
    name: "Detalle Empleado",
    description: "Ficha de empleado con nav lateral, mapa y formulario completo",
    status: "done",
    component: DetalleEmpleado,
    layout: "full-page",
    section: "pantallas",
    group: "rrhh",
  },
  // ── Estructuras ───────────────────────────────────────────────────────────
  {
    id: "layout-kanban",
    name: "Kanban",
    description: "Estructura de la pantalla Kanban: topbar + toolbar strip + tablero de columnas",
    status: "done",
    component: SkeletonKanban,
    layout: "full-page",
    section: "estilos",
    group: "kanban",
  },
  {
    id: "layout-configuracion",
    name: "Configuración General",
    description: "Estructura: topbar + toolbar + nav lateral + panel de formulario",
    status: "done",
    component: SkeletonConfiguracion,
    layout: "full-page",
    section: "estilos",
    group: "configuracion",
  },
  {
    id: "layout-tareas-pendientes",
    name: "Tareas Pendientes",
    description: "Estructura: topbar + toolbar + tabla con header, filas y footer de paginación",
    status: "done",
    component: SkeletonTareasPendientes,
    layout: "full-page",
    section: "estilos",
    group: "tareas",
  },
  {
    id: "layout-cuentas-usuarios",
    name: "Cuentas de Usuarios",
    description: "Estructura: topbar + toolbar + tabla con header, filas y footer de paginación",
    status: "done",
    component: SkeletonCuentasUsuarios,
    layout: "full-page",
    section: "estilos",
    group: "configuracion",
  },
  {
    id: "layout-detalle-medidor",
    name: "Detalle Medidor",
    description: "Estructura: topbar + toolbar + nav lateral + panel de detalle",
    status: "done",
    component: SkeletonDetalleMedidor,
    layout: "full-page",
    section: "estilos",
    group: "monitoreo",
  },
  {
    id: "layout-vista-arbol",
    name: "Vista Árbol",
    description: "Estructura: topbar + toolbar + panel de árbol con header de búsqueda y filas",
    status: "done",
    component: SkeletonVistaArbol,
    layout: "full-page",
    section: "estilos",
    group: "activos",
  },
  {
    id: "layout-detalle-empleado",
    name: "Detalle Empleado",
    description: "Estructura: topbar + toolbar + HorizontalNav (tablet/mobile) o nav lateral (desktop) + panel de detalle",
    status: "done",
    component: SkeletonDetalleEmpleado,
    layout: "full-page",
    section: "estilos",
    group: "empleados",
  },
]
