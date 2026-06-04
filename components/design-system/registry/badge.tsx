import React from "react"
import { defineComponent } from "../types"
import { Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const badgeEntry = defineComponent<{
  children: string
  variant: string
  size: "default" | "sm"
  icon: string
}>({
  id: "badge",
  name: "Badge",
  description: {
    en: "Displays a small status descriptor for UI elements.",
    es: "Muestra un pequeño descriptor de estado para elementos de la interfaz.",
  },
  category: "Components",
  filePath: "components/ui/badge.tsx",
  controls: {
    children: { type: "text",   defaultValue: "Badge" },
    variant:  { type: "select", options: ["default","secondary","destructive","outline","ghost"], defaultValue: "default" },
    size:     { type: "select", options: ["default","sm"], defaultValue: "default" },
    icon:     { type: "select", options: ["none","start","end"], defaultValue: "none" },
  },
  render: (props) => {
    const { children, variant, size, icon } = props
    return (
      <Badge variant={variant as React.ComponentProps<typeof Badge>["variant"]} size={size}>
        {icon === "start" && <Tag data-icon="inline-start" />}
        {children || "Badge"}
        {icon === "end" && <Tag data-icon="inline-end" />}
      </Badge>
    )
  },
  generateCode: (props) => {
    const { children, variant, size, icon } = props
    const attrs: string[] = []
    if (variant !== "default") attrs.push(`variant="${variant}"`)
    if (size !== "default") attrs.push(`size="${size}"`)
    const attrStr = attrs.length ? ` ${attrs.join(" ")}` : ""
    const iconStart = icon === "start" ? `<Tag data-icon="inline-start" />` : ""
    const iconEnd   = icon === "end"   ? `<Tag data-icon="inline-end" />`   : ""
    const label = children || "Badge"
    const inner = [iconStart, label, iconEnd].filter(Boolean).join("")
    const indented = `    <Badge${attrStr}>${inner}</Badge>`
    const iconLine = icon !== "none" ? `import { Tag } from "lucide-react"\n` : ""
    return `${iconLine}import { Badge } from "@/components/ui/badge"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
