import React from "react"
import { defineComponent } from "../types"
import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic, Underline } from "lucide-react"

export const toggleEntry = defineComponent<{
  variant: "default" | "outline"
  size: "default" | "sm" | "lg"
  pressed: boolean
  disabled: boolean
  showIcon: boolean
  children: string
}>({
  id: "toggle",
  name: "Toggle",
  description: {
    en: "A two-state button that can be either on or off.",
    es: "Un botón de dos estados que puede estar activado o desactivado.",
  },
  category: "Components",
  filePath: "components/ui/toggle.tsx",
  controls: {
    variant:  { type: "select",  options: ["default", "outline"], defaultValue: "outline" },
    size:     { type: "select",  options: ["default", "sm", "lg"], defaultValue: "default" },
    pressed:  { type: "boolean", defaultValue: false },
    disabled: { type: "boolean", defaultValue: false },
    showIcon: { type: "boolean", defaultValue: true },
    children: { type: "text",    defaultValue: "Bold" },
  },
  render: (props) => {
    const { variant, size, pressed, disabled, showIcon, children } = props
    const label = children || "Bold"
    const IconMap: Record<string, React.ElementType> = { Bold, Italic, Underline }
    const Icon = IconMap[label] ?? Bold
    // key forces remount when defaultPressed changes so the control stays in sync
    return (
      <Toggle
        key={String(pressed)}
        variant={variant}
        size={size}
        defaultPressed={pressed}
        disabled={disabled}
        aria-label={label}
      >
        {showIcon && <Icon />}
        {label}
      </Toggle>
    )
  },
  generateCode: (props) => {
    const { variant, size, pressed, disabled, showIcon, children } = props
    const label = children || "Bold"
    const attrs: string[] = []
    if (variant !== "outline")  attrs.push(`variant="${variant}"`)
    if (size    !== "default")  attrs.push(`size="${size}"`)
    if (pressed)                attrs.push("defaultPressed")
    if (disabled)               attrs.push("disabled")
    const attrStr   = attrs.length ? ` ${attrs.join(" ")}` : ""
    const iconNames: Record<string, string> = { Bold: "Bold", Italic: "Italic", Underline: "Underline" }
    const iconName  = iconNames[label] ?? "Bold"
    const iconImport = showIcon ? `import { ${iconName} } from "lucide-react"\n` : ""
    const iconEl    = showIcon ? `<${iconName} /> ` : ""
    return `${iconImport}import { Toggle } from "@/components/ui/toggle"

export default function Example() {
  return (
    <Toggle${attrStr} aria-label="${label}">
      ${iconEl}${label}
    </Toggle>
  )
}`
  },
})
