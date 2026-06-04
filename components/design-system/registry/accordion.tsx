import { Info, Settings, Activity, LayoutGrid } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { defineComponent } from "../types"

export const accordionEntry = defineComponent<{
  type: "single" | "multiple"
  itemCount: string
  collapsible: boolean
  defaultOpen: boolean
  bordered: boolean
  disabled: boolean
  showIcons: boolean
}>({
  id: "accordion",
  name: "Accordion",
  description: {
    en: "A vertically stacked set of interactive headings that reveal or hide associated content.",
    es: "Un conjunto de encabezados interactivos apilados verticalmente que muestran u ocultan contenido.",
  },
  category: "Components",
  filePath: "components/ui/accordion.tsx",
  previewWidth: 400,
  controls: {
    type:         { type: "select",  options: ["single", "multiple"], defaultValue: "single" },
    itemCount:    { type: "select",  options: ["2", "3", "4"], defaultValue: "3" },
    collapsible:  { type: "boolean", defaultValue: true },
    defaultOpen:  { type: "boolean", defaultValue: true },
    bordered:     { type: "boolean", defaultValue: true },
    disabled:     { type: "boolean", defaultValue: false },
    showIcons:    { type: "boolean", defaultValue: false },
  },
  cascade: (key, value) => {
    if (key === "bordered" && value === true) return { defaultOpen: true }
    return {}
  },
  render: (props) => {
    const { type, itemCount, collapsible, defaultOpen, bordered, disabled, showIcons } = props
    const count = Number(itemCount) || 3
    const SAMPLE_ICONS = [Info, Settings, Activity, LayoutGrid]
    const items = [
      { value: "item-1", trigger: "Is it accessible?",    content: "Yes. It adheres to the WAI-ARIA design pattern." },
      { value: "item-2", trigger: "Is it styled?",         content: "Yes. It comes with default styles that match the other components' aesthetic." },
      { value: "item-3", trigger: "Is it animated?",       content: "Yes. It's animated by default, but you can disable it if you prefer." },
      { value: "item-4", trigger: "Can I customize it?",   content: "Yes. You can customize the styles using Tailwind CSS classes." },
    ].slice(0, count)

    const accordionProps =
      type === "single"
        ? { type: "single" as const, defaultValue: defaultOpen ? "item-1" : undefined, collapsible }
        : { type: "multiple" as const, defaultValue: defaultOpen ? ["item-1"] : [] }

    const remountKey = `${bordered}-${defaultOpen}-${type}`

    return (
      <Accordion key={remountKey} {...accordionProps} className={bordered ? "w-full border rounded-lg px-4" : "w-full"}>
        {items.map((item, i) => {
          const Icon = SAMPLE_ICONS[i]
          return (
            <AccordionItem key={item.value} value={item.value} disabled={disabled}>
              <AccordionTrigger>
                {showIcons ? (
                  <span className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    {item.trigger}
                  </span>
                ) : item.trigger}
              </AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    )
  },
  generateCode: (props) => {
    const { type, itemCount, collapsible, defaultOpen, bordered, disabled } = props
    const count = Number(itemCount) || 3
    const items = [
      { value: "item-1", trigger: "Is it accessible?",   content: "Yes. It adheres to the WAI-ARIA design pattern." },
      { value: "item-2", trigger: "Is it styled?",        content: "Yes. It comes with default styles that match the other components' aesthetic." },
      { value: "item-3", trigger: "Is it animated?",      content: "Yes. It's animated by default, but you can disable it if you prefer." },
      { value: "item-4", trigger: "Can I customize it?",  content: "Yes. You can customize the styles using Tailwind CSS classes." },
    ].slice(0, count)

    const { showIcons } = props
    const ICON_NAMES = ["Info", "Settings", "Activity", "LayoutGrid"]
    const rootAttrs: string[] = [`type="${type}"`]
    if (type === "single") {
      if (defaultOpen) rootAttrs.push(`defaultValue="item-1"`)
      if (collapsible) rootAttrs.push(`collapsible`)
    } else {
      if (defaultOpen) rootAttrs.push(`defaultValue={["item-1"]}`)
    }
    rootAttrs.push(bordered ? `className="w-80 border rounded-lg px-4"` : `className="w-80"`)

    const triggerContent = (text: string, iconName: string) => showIcons
      ? `<span className="flex items-center gap-2">\n        <${iconName} className="size-4 shrink-0 text-muted-foreground" />\n        ${text}\n      </span>`
      : text

    const itemRows = items.map((item, i) => {
      const disabledAttr = disabled ? " disabled" : ""
      return [
        `  <AccordionItem value="${item.value}"${disabledAttr}>`,
        `    <AccordionTrigger>${triggerContent(item.trigger, ICON_NAMES[i])}</AccordionTrigger>`,
        `    <AccordionContent>${item.content}</AccordionContent>`,
        `  </AccordionItem>`,
      ].join("\n")
    }).join("\n")

    const attrStr = rootAttrs.join(" ")
    const body = `<Accordion ${attrStr}>\n${itemRows}\n</Accordion>`
    const indented = body.split("\n").map(l => `    ${l}`).join("\n")
    const lucideImport = showIcons
      ? `import { ${ICON_NAMES.slice(0, count).join(", ")} } from "lucide-react"\n`
      : ""
    return `${lucideImport}import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
