import { Textarea } from "@/components/ui/textarea"
import { defineComponent } from "../types"

export const textareaEntry = defineComponent<{
  showLabel: boolean
  label: string
  placeholder: string
  showMessage: boolean
  description: string
  rows: string
  disabled: boolean
  invalid: boolean
}>({
  id: "textarea",
  name: "Textarea",
  description: {
    en: "Displays a multi-line text input for longer form content.",
    es: "Muestra un campo de texto de múltiples líneas para contenido más largo.",
  },
  category: "Components",
  filePath: "components/ui/textarea.tsx",
  previewWidth: 400,
  controls: {
    showLabel:   { type: "boolean", defaultValue: true },
    label:       { type: "text",    defaultValue: "Message" },
    placeholder: { type: "text",    defaultValue: "Write your message here..." },
    showMessage: { type: "boolean", defaultValue: false },
    description: { type: "text",    defaultValue: "Max 500 characters." },
    rows:        { type: "select",  options: ["2","4","6","8"], defaultValue: "4" },
    disabled:    { type: "boolean", defaultValue: false },
    invalid:     { type: "boolean", defaultValue: false },
  },
  controlVisible: (key, props) => {
    if (key === "label") return !!props.showLabel
    if (key === "description") return !!props.showMessage
    return true
  },
  render: (props) => {
    const { showLabel, label, placeholder, showMessage, description, rows, disabled, invalid } = props
    return (
      <div className="w-full flex flex-col gap-0.5">
        {showLabel && label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <Textarea placeholder={placeholder} rows={Number(rows)} disabled={disabled}
          aria-invalid={invalid ? "true" : undefined} />
        {showMessage && description && !invalid && <p className="text-xs text-muted-foreground">{description}</p>}
        {invalid && <p className="text-xs text-destructive">This field is not valid.</p>}
      </div>
    )
  },
  generateCode: (props) => {
    const { showLabel, label, placeholder, showMessage, description, rows, disabled, invalid } = props
    const attrs: string[] = []
    if (placeholder) attrs.push(`placeholder="${placeholder}"`)
    if (rows !== "4") attrs.push(`rows={${rows}}`)
    if (disabled) attrs.push("disabled")
    if (invalid) attrs.push('aria-invalid="true"')
    const tag = attrs.length <= 1
      ? `<Textarea${attrs.length ? " " + attrs[0] : ""} />`
      : ["<Textarea", ...attrs.map(a => `  ${a}`), "/>"].join("\n")
    const labelLine = showLabel && label ? `<label className="text-sm font-medium">${label}</label>\n    ` : ""
    const descLine = showMessage && description && !invalid ? `\n    <p className="text-xs text-muted-foreground">${description}</p>` : ""
    const errorLine = invalid ? `\n    <p className="text-xs text-destructive">This field is not valid.</p>` : ""
    const inner = `${labelLine}${tag}${descLine}${errorLine}`
    const indented = inner.split("\n").map(l => `    ${l}`).join("\n")
    return `import { Textarea } from "@/components/ui/textarea"\n\nexport default function Example() {\n  return (\n    <div className="flex flex-col gap-1.5 w-72">\n${indented}\n    </div>\n  )\n}`
  },
})
