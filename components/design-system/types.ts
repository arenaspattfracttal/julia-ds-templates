import { ReactNode } from "react"

export type ComponentExample = {
  title: string
  render: () => ReactNode
  code?: string
}

export type SelectControl = {
  type: "select"
  options: string[]
  defaultValue: string
}

export type BooleanControl = {
  type: "boolean"
  defaultValue: boolean
}

export type TextControl = {
  type: "text"
  defaultValue: string
}

export type NumberControl = {
  type: "number"
  defaultValue: number
  min?: number
  max?: number
  step?: number
}

export type IconControl = {
  type: "icon"
  defaultValue: string   // icon name or "none"
}

export type ControlDefinition =
  | SelectControl
  | BooleanControl
  | TextControl
  | NumberControl
  | IconControl

export type ComponentEntry<TProps = Record<string, unknown>> = {
  id: string
  name: string
  description: { en: string; es: string }
  category: string
  filePath: string
  controls: Record<string, ControlDefinition>
  cascade?: (key: string, value: unknown, current: TProps) => Partial<TProps>
  controlVisible?: (key: string, props: TProps) => boolean
  /** Width in px to constrain the preview canvas. When set, the component renders inside a fixed-width box. */
  previewWidth?: number
  render: (props: TProps) => ReactNode
  /** Optional render used inside the Compositor (replaces `render` there). */
  compositorRender?: (props: TProps) => ReactNode
  generateCode: (props: TProps) => string
  examples?: ComponentExample[]
}

/**
 * Factory que tipa fuertemente los props de un componente del catálogo.
 *
 * Cada entry declara su forma de props una sola vez vía el parámetro genérico;
 * dentro de `render`, `generateCode`, `cascade` y `controlVisible` los props
 * quedan tipados (sin `props as { ... }`). El genérico se borra a la forma base
 * `ComponentEntry` para poder almacenar entries heterogéneos en un mismo array.
 * Esta es la única conversión de tipos controlada — reemplaza los casts inline.
 */
export function defineComponent<TProps>(entry: ComponentEntry<TProps>): ComponentEntry {
  return entry as unknown as ComponentEntry
}
