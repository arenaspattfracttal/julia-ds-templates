import React from "react"
import { defineComponent } from "../types"
import { Circle, Square, Triangle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export const buttonGroupEntry = defineComponent<{
  orientation: "horizontal" | "vertical"
  variant: string
  size: string
  buttonCount: string
  button1: string
  button2: string
  button3: string
  button4: string
  showIcons: boolean
  separator: boolean
  disabled: boolean
}>({
  id: "button-group",
  name: "Button Group",
  description: {
    en: "A container that groups related buttons together with consistent styling.",
    es: "Un contenedor que agrupa botones relacionados con estilos consistentes.",
  },
  category: "Components",
  filePath: "components/ui/button-group.tsx",
  controls: {
    orientation: { type: "select",  options: ["horizontal","vertical"], defaultValue: "horizontal" },
    variant:     { type: "select",  options: ["default","outline","secondary","ghost"], defaultValue: "outline" },
    size:        { type: "select",  options: ["default","xs","sm","lg"], defaultValue: "default" },
    buttonCount: { type: "select",  options: ["2","3","4"], defaultValue: "3" },
    button1:     { type: "text",    defaultValue: "Circle" },
    button2:     { type: "text",    defaultValue: "Square" },
    button3:     { type: "text",    defaultValue: "Triangle" },
    button4:     { type: "text",    defaultValue: "Star" },
    showIcons:   { type: "boolean", defaultValue: false },
    separator:   { type: "boolean", defaultValue: false },
    disabled:    { type: "boolean", defaultValue: false },
  },
  controlVisible: (key, props) => {
    if (key === "separator") return props.variant === "ghost"
    const match = key.match(/^button(\d)$/)
    if (match) return Number(match[1]) <= Number(props.buttonCount ?? 3)
    return true
  },
  render: (props) => {
    const { orientation, variant, size, buttonCount, button1, button2, button3, button4, showIcons, separator, disabled } = props
    const count = Number(buttonCount) || 3
    const ICONS = [Circle, Square, Triangle, Star]
    const labels = [button1 || "Circle", button2 || "Square", button3 || "Triangle", button4 || "Star"].slice(0, count)
    return (
      <ButtonGroup orientation={orientation}>
        {labels.map((lbl, i) => {
          const Icon = ICONS[i]
          return (
            <React.Fragment key={i}>
              {separator && i > 0 && <ButtonGroupSeparator orientation={orientation === "vertical" ? "horizontal" : "vertical"} />}
              <Button
                variant={variant as React.ComponentProps<typeof Button>["variant"]}
                size={size as React.ComponentProps<typeof Button>["size"]}
                disabled={disabled}
                className={orientation === "vertical" ? "justify-start" : undefined}
              >
                {showIcons && <Icon className="size-4" />}
                {lbl}
              </Button>
            </React.Fragment>
          )
        })}
      </ButtonGroup>
    )
  },
  generateCode: (props) => {
    const { orientation, variant, size, buttonCount, button1, button2, button3, button4, showIcons, separator, disabled } = props
    const count = Number(buttonCount) || 3
    const ICON_NAMES = ["Circle", "Square", "Triangle", "Star"]
    const labels = [button1 || "Circle", button2 || "Square", button3 || "Triangle", button4 || "Star"].slice(0, count)
    const btnAttrs: string[] = []
    if (variant !== "default") btnAttrs.push(`variant="${variant}"`)
    if (size    !== "default") btnAttrs.push(`size="${size}"`)
    if (disabled) btnAttrs.push("disabled")
    if (orientation === "vertical") btnAttrs.push(`className="justify-start"`)
    const btnAttrStr = btnAttrs.length ? " " + btnAttrs.join(" ") : ""
    const orientationAttr = orientation !== "horizontal" ? ` orientation="${orientation}"` : ""
    const rows = labels.map((lbl, i) => {
      const iconPart = showIcons ? `<${ICON_NAMES[i]} className="size-4" />` : ""
      const inner = iconPart ? `${iconPart}${lbl}` : lbl
      const btn = `  <Button${btnAttrStr}>${inner}</Button>`
      const sepTag = orientation === "vertical" ? `  <ButtonGroupSeparator orientation="horizontal" />` : `  <ButtonGroupSeparator />`
      return separator && i > 0 ? `${sepTag}\n${btn}` : btn
    }).join("\n")
    const body = `<ButtonGroup${orientationAttr}>\n${rows}\n</ButtonGroup>`
    const indented = body.split("\n").map(l => `    ${l}`).join("\n")
    const lucideImport = showIcons
      ? `import { ${ICON_NAMES.slice(0, count).join(", ")} } from "lucide-react"\n`
      : ""
    const bgImport = separator
      ? `import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"`
      : `import { ButtonGroup } from "@/components/ui/button-group"`
    return `${lucideImport}import { Button } from "@/components/ui/button"\n${bgImport}\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
