import { defineComponent } from "../types"
import { Checkbox } from "@/components/ui/checkbox"

export const checkboxEntry = defineComponent<{
  label: string
  description: string
  checked: boolean
  indeterminate: boolean
  disabled: boolean
  invalid: boolean
  group: boolean
}>({
  id: "checkbox",
  name: "Checkbox",
  description: {
    en: "A control that allows the user to toggle a boolean value.",
    es: "Un control que permite al usuario alternar un valor booleano.",
  },
  category: "Components",
  filePath: "components/ui/checkbox.tsx",
  controls: {
    label:       { type: "text",    defaultValue: "Accept terms and conditions" },
    description: { type: "text",    defaultValue: "" },
    checked:       { type: "boolean", defaultValue: false },
    indeterminate: { type: "boolean", defaultValue: false },
    disabled:      { type: "boolean", defaultValue: false },
    invalid:       { type: "boolean", defaultValue: false },
    group:         { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { label, description, checked, indeterminate, disabled, invalid, group } = props
    if (group) {
      const items = [
        { id: "analytics", label: "Enable analytics", checked: true },
        { id: "emails",    label: "Marketing emails",  checked: false },
        { id: "updates",   label: "Product updates",   checked: true },
      ]
      return (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox id={item.id} defaultChecked={item.checked} disabled={disabled} />
              <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">{item.label}</label>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Checkbox id="cb-demo" key={String(checked) + String(indeterminate)}
            defaultChecked={indeterminate ? "indeterminate" : checked}
            disabled={disabled} aria-invalid={invalid ? "true" : undefined} />
          <label htmlFor="cb-demo" className="text-sm font-medium cursor-pointer leading-none">
            {label || "Accept terms and conditions"}
          </label>
        </div>
        {description && !invalid && <p className="text-xs text-muted-foreground ml-6">{description}</p>}
        {invalid && <p className="text-xs text-destructive ml-6">This field is required.</p>}
      </div>
    )
  },
  generateCode: (props) => {
    const { label, description, checked, indeterminate, disabled, invalid, group } = props
    if (group) {
      const items = [
        { id: "analytics", label: "Enable analytics", checked: true },
        { id: "emails",    label: "Marketing emails",  checked: false },
        { id: "updates",   label: "Product updates",   checked: true },
      ]
      const rows = items.map(it => {
        const attrs = [`id="${it.id}"`, ...(it.checked ? ["defaultChecked"] : []), ...(disabled ? ["disabled"] : [])]
        return `  <div className="flex items-center gap-2">\n    <Checkbox ${attrs.join(" ")} />\n    <label htmlFor="${it.id}" className="text-sm font-medium cursor-pointer">${it.label}</label>\n  </div>`
      }).join("\n")
      const indented = `  <div className="flex flex-col gap-3">\n${rows.split("\n").map(l=>`  ${l}`).join("\n")}\n  </div>`
      return `import { Checkbox } from "@/components/ui/checkbox"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
    }
    const attrs: string[] = [`id="cb-demo"`]
    if (indeterminate) attrs.push(`checked="indeterminate"`)
    else if (checked) attrs.push("defaultChecked")
    if (disabled) attrs.push("disabled")
    if (invalid) attrs.push('aria-invalid="true"')
    const cbTag = `<Checkbox ${attrs.join(" ")} />`
    const labelLine = `<label htmlFor="cb-demo" className="text-sm font-medium cursor-pointer">${label || "Accept terms and conditions"}</label>`
    const descLine = description && !invalid ? `\n  <p className="text-xs text-muted-foreground ml-6">${description}</p>` : ""
    const errorLine = invalid ? `\n  <p className="text-xs text-destructive ml-6">This field is required.</p>` : ""
    const body = `<div className="flex flex-col gap-1.5">\n  <div className="flex items-center gap-2">\n    ${cbTag}\n    ${labelLine}\n  </div>${descLine}${errorLine}\n</div>`
    const indented = body.split("\n").map(l=>`    ${l}`).join("\n")
    return `import { Checkbox } from "@/components/ui/checkbox"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
