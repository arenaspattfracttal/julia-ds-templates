import { defineComponent } from "../types"
import { Switch } from "@/components/ui/switch"

export const switchEntry = defineComponent<{
  checked: boolean
  label: string
  description: string
  size: "default" | "sm" | "lg"
  disabled: boolean
}>({
  id: "switch",
  name: "Switch",
  description: {
    en: "A control that allows the user to toggle between checked and unchecked states.",
    es: "Un control que permite al usuario alternar entre estados activado y desactivado.",
  },
  category: "Components",
  filePath: "components/ui/switch.tsx",
  previewWidth: 400,
  controls: {
    checked:     { type: "boolean", defaultValue: false },
    label:       { type: "text",    defaultValue: "Airplane mode" },
    description: { type: "text",    defaultValue: "" },
    size:        { type: "select",  options: ["default","sm","lg"], defaultValue: "default" },
    disabled:    { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { checked, label, description, size, disabled } = props
    if (!label && !description) {
      return <Switch key={String(checked)} defaultChecked={checked} size={size} disabled={disabled} />
    }
    return (
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex flex-col gap-0.5">
          {label && <p className="text-sm font-medium leading-none">{label}</p>}
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <Switch key={String(checked)} defaultChecked={checked} size={size} disabled={disabled} />
      </div>
    )
  },
  generateCode: (props) => {
    const { checked, label, description, size, disabled } = props
    const attrs: string[] = []
    if (checked) attrs.push("defaultChecked")
    if (size !== "default") attrs.push(`size="${size}"`)
    if (disabled) attrs.push("disabled")
    const switchTag = attrs.length === 0 ? `<Switch />`
      : attrs.length === 1 ? `<Switch ${attrs[0]} />`
      : `<Switch\n  ${attrs.join("\n  ")}\n/>`
    if (!label && !description) {
      const indented = switchTag.split("\n").map(l=>`    ${l}`).join("\n")
      return `import { Switch } from "@/components/ui/switch"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
    }
    const labelLine = label ? `      <p className="text-sm font-medium leading-none">${label}</p>` : ""
    const descLine = description ? `\n      <p className="text-xs text-muted-foreground mt-0.5">${description}</p>` : ""
    const body = `<div className="flex items-center justify-between w-72 gap-4">\n  <div className="flex flex-col gap-0.5">\n${labelLine}${descLine}\n  </div>\n  ${switchTag}\n</div>`
    const indented = body.split("\n").map(l=>`    ${l}`).join("\n")
    return `import { Switch } from "@/components/ui/switch"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
