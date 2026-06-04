import { defineComponent } from "../types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export const radioGroupEntry = defineComponent<{
  label: string
  description: string
  itemCount: string
  option1: string
  option2: string
  option3: string
  option4: string
  option5: string
  orientation: string
  withDescription: boolean
  disabled: boolean
  invalid: boolean
}>({
  id: "radio-group",
  name: "Radio Group",
  description: {
    en: "A set of checkable buttons where only one can be checked at a time.",
    es: "Un conjunto de botones donde solo uno puede estar seleccionado a la vez.",
  },
  category: "Components",
  filePath: "components/ui/radio-group.tsx",
  controls: {
    label:            { type: "text",    defaultValue: "Subscription plan" },
    description:      { type: "text",    defaultValue: "" },
    itemCount:        { type: "select",  options: ["2","3","4","5"], defaultValue: "3" },
    option1:          { type: "text",    defaultValue: "Option 1" },
    option2:          { type: "text",    defaultValue: "Option 2" },
    option3:          { type: "text",    defaultValue: "Option 3" },
    option4:          { type: "text",    defaultValue: "Option 4" },
    option5:          { type: "text",    defaultValue: "Option 5" },
    orientation:      { type: "select",  options: ["vertical","horizontal"], defaultValue: "vertical" },
    withDescription:  { type: "boolean", defaultValue: false },
    disabled:         { type: "boolean", defaultValue: false },
    invalid:          { type: "boolean", defaultValue: false },
  },
  controlVisible: (key, props) => {
    const match = key.match(/^option(\d)$/)
    if (!match) return true
    return Number(match[1]) <= Number(props.itemCount ?? 3)
  },
  render: (props) => {
    const { label, description, itemCount, option1, option2, option3, option4, option5, orientation, withDescription, disabled, invalid } = props
    const count = Number(itemCount) || 3
    const allOptions = [option1, option2, option3, option4, option5].map((o, i) => o || `Option ${i + 1}`)
    const options = allOptions.slice(0, count).map((lbl, i) => ({ value: `option${i + 1}`, label: lbl }))

    if (withDescription) {
      return (
        <div className="flex flex-col gap-1.5">
          {label && <label className="text-sm font-medium text-foreground">{label}</label>}
          <RadioGroup defaultValue="option1" className="gap-3 w-72">
            {options.map((opt, i) => (
              <label key={opt.value} className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer">
                <RadioGroupItem value={opt.value} id={opt.value} className="mt-0.5" disabled={disabled && i === 1} />
                <div>
                  <p className="text-sm font-medium leading-none">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">Description for {opt.label.toLowerCase()}.</p>
                </div>
              </label>
            ))}
          </RadioGroup>
          {description && !invalid && <p className="text-xs text-muted-foreground">{description}</p>}
          {invalid && <p className="text-xs text-destructive">Please select an option.</p>}
        </div>
      )
    }
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <RadioGroup defaultValue="option1"
          className={orientation === "horizontal" ? "flex flex-row gap-6 w-fit" : "gap-3 w-fit"}>
          {options.map((opt, i) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={opt.value}
                disabled={disabled && i === 1}
                aria-invalid={invalid ? "true" : undefined} />
              <label htmlFor={opt.value} className="text-sm cursor-pointer">{opt.label}</label>
            </div>
          ))}
        </RadioGroup>
        {description && !invalid && <p className="text-xs text-muted-foreground">{description}</p>}
        {invalid && <p className="text-xs text-destructive">Please select an option.</p>}
      </div>
    )
  },
  generateCode: (props) => {
    const { label, description, itemCount, option1, option2, option3, option4, option5, orientation, withDescription, disabled, invalid } = props
    const count = Number(itemCount) || 3
    const allOptions = [option1, option2, option3, option4, option5].map((o, i) => o || `Option ${i + 1}`)
    const options = allOptions.slice(0, count).map((lbl, i) => ({ value: `option${i + 1}`, label: lbl }))
    const labelLine = label ? `  <label className="text-sm font-medium">${label}</label>\n` : ""
    const descLine = description && !invalid ? `\n  <p className="text-xs text-muted-foreground">${description}</p>` : ""
    const errorLine = invalid ? `\n  <p className="text-xs text-destructive">Please select an option.</p>` : ""
    if (withDescription) {
      const rows = options.map((opt, i) => {
        const dAttr = disabled && i === 1 ? " disabled" : ""
        return `  <label className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer">\n    <RadioGroupItem value="${opt.value}" id="${opt.value}" className="mt-0.5"${dAttr} />\n    <div>\n      <p className="text-sm font-medium leading-none">${opt.label}</p>\n      <p className="text-xs text-muted-foreground mt-1">Description for ${opt.label.toLowerCase()}.</p>\n    </div>\n  </label>`
      }).join("\n")
      const radioGroup = `<RadioGroup defaultValue="option1" className="gap-3 w-72">\n${rows}\n</RadioGroup>`
      const body = label || description || invalid
        ? `<div className="flex flex-col gap-1.5">\n${labelLine}  ${radioGroup.split("\n").join("\n  ")}${descLine}${errorLine}\n</div>`
        : radioGroup
      const indented = body.split("\n").map(l => `    ${l}`).join("\n")
      return `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
    }
    const cls = orientation === "horizontal" ? `className="flex flex-row gap-6"` : `className="gap-3"`
    const rows = options.map((opt, i) => {
      const attrs = [`value="${opt.value}"`, `id="${opt.value}"`, ...(disabled && i === 1 ? ["disabled"] : []), ...(invalid ? ['aria-invalid="true"'] : [])]
      return `  <div className="flex items-center gap-2">\n    <RadioGroupItem ${attrs.join(" ")} />\n    <label htmlFor="${opt.value}" className="text-sm cursor-pointer">${opt.label}</label>\n  </div>`
    }).join("\n")
    const radioGroup = `<RadioGroup defaultValue="option1" ${cls}>\n${rows}\n</RadioGroup>`
    const body = label || description || invalid
      ? `<div className="flex flex-col gap-1.5">\n${labelLine}  ${radioGroup.split("\n").join("\n  ")}${descLine}${errorLine}\n</div>`
      : radioGroup
    const indented = body.split("\n").map(l => `    ${l}`).join("\n")
    return `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
