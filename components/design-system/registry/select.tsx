import React from "react"
import { defineComponent } from "../types"
import { Apple, Citrus, Banana, Grape, Cherry, Carrot, Leaf, Sprout } from "lucide-react"
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectSeparator, SelectTrigger, SelectValue,
} from "@/components/ui/select"

// ─── SELECT generateCode helpers ──────────────────────────────────────────────

interface SelectItemData { value: string; label: string; icon: string }
interface SelectGroupData { group: string; items: SelectItemData[] }

function buildSelectItemLine(v: string, lbl: string, icon: string, showIcons: boolean): string {
  const inner = showIcons
    ? `<span className="flex items-center gap-1.5"><${icon} className="size-4 shrink-0 text-muted-foreground" />${lbl}</span>`
    : lbl
  return `<SelectItem value="${v}">${inner}</SelectItem>`
}

function buildSelectItems(groups: boolean, showIcons: boolean, FLAT_ITEMS: SelectItemData[], GROUP_ITEMS: SelectGroupData[]): string {
  if (groups) {
    return GROUP_ITEMS.map((g, gi) => {
      const sep = gi > 0 ? `<SelectSeparator />\n` : ""
      const rows = g.items.map(({ value: v, label: lbl, icon }) => `  ${buildSelectItemLine(v, lbl, icon, showIcons)}`).join("\n")
      return `${sep}<SelectGroup>\n  <SelectLabel>${g.group}</SelectLabel>\n${rows}\n</SelectGroup>`
    }).join("\n")
  }
  return FLAT_ITEMS.map(({ value: v, label: lbl, icon }) => buildSelectItemLine(v, lbl, icon, showIcons)).join("\n")
}

function buildSelectTrigger(showIcons: boolean, placeholder: string, triggerAttrs: string[], _iconNames: string[], _allItems: SelectItemData[]): string {
  const triggerInner = showIcons
    ? `\n    <span className="flex items-center gap-1.5 flex-1 min-w-0">\n      {selectedItem && <SelectedIcon className="size-4 shrink-0 text-muted-foreground" />}\n      <SelectValue placeholder="${placeholder}" />\n    </span>`
    : `\n    <SelectValue placeholder="${placeholder}" />`
  return `<SelectTrigger ${triggerAttrs.join(" ")}>${triggerInner}\n  </SelectTrigger>`
}

function buildSelectStateBlock(showIcons: boolean, iconNames: string[], allItems: SelectItemData[]): string {
  if (showIcons) {
    const iconMap = iconNames.map((n) => `${allItems.find(it => it.icon === n)?.value ?? n}: ${n}`).join(", ")
    return `  const [value, setValue] = useState("")\n  const ICONS: Record<string, React.ElementType> = { ${iconMap} }\n  const SelectedIcon = ICONS[value]\n\n`
  }
  return `  const [value, setValue] = useState("")\n\n`
}

function buildSelectWrapper(labelLine: string, descLine: string, errorLine: string, selectBlock: string): string {
  if (!(labelLine || descLine || errorLine)) return selectBlock
  return `<div className="flex flex-col gap-1.5 w-56">\n  ${labelLine}${selectBlock.split("\n").join("\n  ")}${descLine}${errorLine}\n</div>`
}

export const selectEntry = defineComponent<{
  showLabel: boolean
  label: string
  placeholder: string
  showMessage: boolean
  description: string
  size: "default" | "sm"
  showIcons: boolean
  disabled: boolean
  invalid: boolean
  groups: boolean
  clearable: boolean
}>({
  id: "select",
  name: "Select",
  description: {
    en: "Displays a list of options for the user to pick from — triggered by a button.",
    es: "Muestra una lista de opciones para que el usuario elija — activada por un botón.",
  },
  category: "Components",
  filePath: "components/ui/select.tsx",
  previewWidth: 400,
  controls: {
    showLabel:   { type: "boolean", defaultValue: true },
    label:       { type: "text",    defaultValue: "Fruit" },
    placeholder: { type: "text",    defaultValue: "Select an option" },
    showMessage: { type: "boolean", defaultValue: false },
    description: { type: "text",    defaultValue: "Pick your favourite fruit." },
    size:        { type: "select",  options: ["default","sm"], defaultValue: "default" },
    showIcons:   { type: "boolean", defaultValue: false },
    disabled:    { type: "boolean", defaultValue: false },
    invalid:     { type: "boolean", defaultValue: false },
    groups:      { type: "boolean", defaultValue: false },
    clearable:   { type: "boolean", defaultValue: false },
  },
  controlVisible: (key, props) => {
    if (key === "label") return !!props.showLabel
    if (key === "description") return !!props.showMessage
    return true
  },
  render: (props) => {
    const { showLabel, label, placeholder, showMessage, description, size, showIcons, disabled, invalid, groups, clearable } = props

    const FLAT_ITEMS = [
      { value: "apple",  label: "Apple",  Icon: Apple  },
      { value: "orange", label: "Orange", Icon: Citrus },
      { value: "banana", label: "Banana", Icon: Banana },
      { value: "grape",  label: "Grape",  Icon: Grape  },
      { value: "cherry", label: "Cherry", Icon: Cherry },
    ]
    const GROUP_ITEMS = [
      { group: "Fruits",     items: [
        { value: "apple",    label: "Apple",    Icon: Apple  },
        { value: "orange",   label: "Orange",   Icon: Citrus },
        { value: "banana",   label: "Banana",   Icon: Banana },
      ]},
      { group: "Vegetables", items: [
        { value: "carrot",   label: "Carrot",   Icon: Carrot  },
        { value: "broccoli", label: "Broccoli", Icon: Leaf    },
        { value: "spinach",  label: "Spinach",  Icon: Sprout  },
      ]},
    ]
    function SelectPreview() {
      const [value, setValue] = React.useState("")
      return (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger
            size={size}
            className="w-full"
            disabled={disabled}
            aria-invalid={invalid ? "true" : undefined}
            clearable={clearable || undefined}
            onClear={clearable && value ? () => setValue("") : undefined}
          >
            <SelectValue placeholder={placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {groups ? (
              GROUP_ITEMS.map((g, gi) => (
                <React.Fragment key={g.group}>
                  {gi > 0 && <SelectSeparator />}
                  <SelectGroup>
                    <SelectLabel>{g.group}</SelectLabel>
                    {g.items.map(({ value: v, label: lbl, Icon }) => (
                      <SelectItem key={v} value={v}>
                        <span className="flex items-center gap-1.5">
                          {showIcons && <Icon className="size-4 shrink-0 text-muted-foreground" />}
                          {lbl}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </React.Fragment>
              ))
            ) : (
              FLAT_ITEMS.map(({ value: v, label: lbl, Icon }) => (
                <SelectItem key={v} value={v}>
                  <span className="flex items-center gap-1.5">
                    {showIcons && <Icon className="size-4 shrink-0 text-muted-foreground" />}
                    {lbl}
                  </span>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )
    }

    return (
      <div className="flex flex-col gap-0.5 w-full">
        {showLabel && label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <SelectPreview />
        {showMessage && description && !invalid && <p className="text-xs text-muted-foreground">{description}</p>}
        {invalid && <p className="text-xs text-destructive">Please select an option.</p>}
      </div>
    )
  },
  generateCode: (props) => {
    const { showLabel, label, placeholder, showMessage, description, size, showIcons, disabled, invalid, groups, clearable } = props
    const FLAT_ITEMS: SelectItemData[] = [
      { value: "apple",  label: "Apple",  icon: "Apple"  },
      { value: "orange", label: "Orange", icon: "Citrus" },
      { value: "banana", label: "Banana", icon: "Banana" },
      { value: "grape",  label: "Grape",  icon: "Grape"  },
      { value: "cherry", label: "Cherry", icon: "Cherry" },
    ]
    const GROUP_ITEMS: SelectGroupData[] = [
      { group: "Fruits", items: [
        { value: "apple",    label: "Apple",    icon: "Apple"  },
        { value: "orange",   label: "Orange",   icon: "Citrus" },
        { value: "banana",   label: "Banana",   icon: "Banana" },
      ]},
      { group: "Vegetables", items: [
        { value: "carrot",   label: "Carrot",   icon: "Carrot"  },
        { value: "broccoli", label: "Broccoli", icon: "Leaf"    },
        { value: "spinach",  label: "Spinach",  icon: "Sprout"  },
      ]},
    ]
    const allItems = groups ? GROUP_ITEMS.flatMap(g => g.items) : FLAT_ITEMS
    const iconNames = [...new Set(allItems.map(i => i.icon))]
    const lucideImport = showIcons ? `import { ${iconNames.join(", ")} } from "lucide-react"\n` : ""

    const triggerAttrs: string[] = ['className="w-full"']
    if (size !== "default") triggerAttrs.push(`size="${size}"`)
    if (disabled) triggerAttrs.push("disabled")
    if (invalid) triggerAttrs.push('aria-invalid="true"')
    if (clearable) triggerAttrs.push("clearable")
    const ph = placeholder || "Select an option"

    const itemsCode = buildSelectItems(groups, showIcons, FLAT_ITEMS, GROUP_ITEMS)
    const triggerCode = buildSelectTrigger(showIcons, ph, triggerAttrs, iconNames, allItems)
    const stateBlock = buildSelectStateBlock(showIcons, iconNames, allItems)
    const onClearProp = clearable ? `\n    onClear={value ? () => setValue("") : undefined}` : ""
    const triggerCodeWithClear = triggerCode.replace(
      /(<SelectTrigger [^>]*)(>)/,
      (_, open, close) => `${open}${onClearProp}${close}`
    )

    const selectBlock = `<Select value={value} onValueChange={setValue}>\n  ${clearable ? triggerCodeWithClear : triggerCode}\n  <SelectContent>\n${itemsCode.split("\n").map(l => `    ${l}`).join("\n")}\n  </SelectContent>\n</Select>`

    const labelLine = showLabel && label ? `<label className="text-sm font-medium">${label}</label>\n  ` : ""
    const descLine = showMessage && description && !invalid ? `\n  <p className="text-xs text-muted-foreground">${description}</p>` : ""
    const errorLine = invalid ? `\n  <p className="text-xs text-destructive">Please select an option.</p>` : ""
    const inner = buildSelectWrapper(labelLine, descLine, errorLine, selectBlock)

    const indented = inner.split("\n").map(l => `    ${l}`).join("\n")
    const named = groups
      ? "Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue"
      : "Select, SelectContent, SelectItem, SelectTrigger, SelectValue"
    return `${lucideImport}import { useState } from "react"\nimport { ${named} } from "@/components/ui/select"\n\nexport default function Example() {\n${stateBlock}  return (\n${indented}\n  )\n}`
  },
})
