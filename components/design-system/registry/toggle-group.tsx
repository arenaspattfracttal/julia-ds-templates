import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { defineComponent } from "../types"

export const toggleGroupEntry = defineComponent<{
  type: "single" | "multiple"
  variant: "default" | "outline"
  size: "sm" | "default" | "lg"
  orientation: "horizontal" | "vertical"
  spacing: string
  spacingV: string
  content: "icons" | "text" | "both"
  disabled: boolean
}>({
  id: "toggle-group",
  name: "Toggle Group",
  description: {
    en: "A set of two-state buttons that can be toggled on or off, supporting single or multiple selection.",
    es: "Un conjunto de botones de dos estados que pueden activarse o desactivarse, con selección simple o múltiple.",
  },
  category: "Components",
  filePath: "components/ui/toggle-group.tsx",
  controls: {
    type:        { type: "select",  options: ["single", "multiple"],     defaultValue: "single" },
    variant:     { type: "select",  options: ["default", "outline"],     defaultValue: "outline" },
    size:        { type: "select",  options: ["sm", "default", "lg"],    defaultValue: "default" },
    orientation: { type: "select",  options: ["horizontal", "vertical"], defaultValue: "horizontal" },
    spacing:     { type: "select",  options: ["0", "1", "2", "4"],       defaultValue: "0" },
    spacingV:    { type: "select",  options: ["1", "2", "3"],            defaultValue: "1" },
    content:     { type: "select",  options: ["icons", "text", "both"],  defaultValue: "icons" },
    disabled:    { type: "boolean", defaultValue: false },
  },
  cascade: (key, value) => {
    if (key === "orientation" && value === "vertical")   return { spacingV: "1" }
    if (key === "orientation" && value === "horizontal") return { spacing: "0" }
    return {}
  },
  controlVisible: (key, props) => {
    if (key === "spacing")  return props.orientation !== "vertical"
    if (key === "spacingV") return props.orientation === "vertical"
    return true
  },
  render: (props) => {
    const { type, variant, size, orientation, spacing, spacingV, content, disabled } = props
    const effectiveSpacing = orientation === "vertical" ? Number(spacingV ?? "1") : Number(spacing)
    const ITEMS = [
      { value: "left",   icon: AlignLeft,   label: "Left" },
      { value: "center", icon: AlignCenter, label: "Center" },
      { value: "right",  icon: AlignRight,  label: "Right" },
    ]
    const isVertical = orientation === "vertical"
    return (
      <ToggleGroup
        type={type}
        variant={variant}
        size={size}
        orientation={orientation}
        spacing={effectiveSpacing}
        disabled={disabled}
        className={isVertical ? "flex-col w-fit items-stretch" : undefined}
      >
        {ITEMS.map(({ value, icon: Icon, label }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={label}
            className={isVertical ? "w-full justify-start" : undefined}
          >
            {content !== "text"  && <Icon />}
            {content !== "icons" && <span>{label}</span>}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    )
  },
  generateCode: (props) => {
    const { type, variant, size, orientation, spacing, spacingV, content, disabled } = props
    const effectiveSpacing = orientation === "vertical" ? (spacingV ?? "1") : spacing
    const variantProp   = variant     !== "default"    ? ` variant="${variant}"`         : ""
    const sizeProp      = size        !== "default"    ? ` size="${size}"`               : ""
    const orientProp    = orientation !== "horizontal" ? ` orientation="${orientation}"` : ""
    const spacingProp   = effectiveSpacing !== "0"     ? ` spacing={${effectiveSpacing}}` : ` spacing={0}`
    const disabledProp  = disabled ? " disabled" : ""
    const isVertical    = orientation === "vertical"
    const classNameProp = isVertical ? ` className="flex-col w-fit items-stretch"` : ""

    const ITEMS = [
      { value: "left",   icon: "AlignLeft",   label: "Left"   },
      { value: "center", icon: "AlignCenter", label: "Center" },
      { value: "right",  icon: "AlignRight",  label: "Right"  },
    ]

    const showIcon = content !== "text"
    const showText = content !== "icons"

    const itemsJSX = ITEMS.map(({ value, icon, label }) => {
      const inner = [
        showIcon ? `<${icon} />` : "",
        showText ? `<span>${label}</span>` : "",
      ].filter(Boolean).join("")
      const itemClass = isVertical ? ` className="w-full justify-start"` : ""
      return `      <ToggleGroupItem value="${value}" aria-label="${label}"${itemClass}>${inner}</ToggleGroupItem>`
    }).join("\n")

    const needsIcons = showIcon
    const iconImport = needsIcons
      ? `import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"\n` : ""

    return `${iconImport}import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function Example() {
  return (
    <ToggleGroup type="${type}"${variantProp}${sizeProp}${orientProp}${spacingProp}${disabledProp}${classNameProp}>
${itemsJSX}
    </ToggleGroup>
  )
}`
  },
})
