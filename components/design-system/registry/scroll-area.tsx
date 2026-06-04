import { defineComponent } from "../types"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const scrollAreaEntry = defineComponent<{
  orientation: string
  height: string
}>({
  id: "scroll-area",
  name: "Scroll Area",
  description: {
    en: "Augments native scroll functionality for custom, cross-browser styling.",
    es: "Mejora el scroll nativo para un estilo personalizado y compatible con distintos navegadores.",
  },
  category: "Components",
  filePath: "components/ui/scroll-area.tsx",
  previewWidth: 400,
  controls: {
    orientation: { type: "select", options: ["vertical", "horizontal"], defaultValue: "vertical" },
    height:      { type: "select", options: ["150", "200", "250"],      defaultValue: "200" },
  },
  render: (props) => {
    const { orientation, height } = props
    const tags = ["v1.2.0", "v1.1.0", "v1.0.4", "v1.0.3", "v1.0.2", "v1.0.1", "v1.0.0",
                  "v0.9.0", "v0.8.1", "v0.8.0", "v0.7.2", "v0.7.1", "v0.7.0"]
    if (orientation === "horizontal") {
      return (
        <ScrollArea className="w-full rounded-md border">
          <div className="flex gap-3 p-4 whitespace-nowrap">
            {tags.slice(0, 8).map((t) => (
              <div key={t} className="shrink-0 rounded-md border bg-muted px-3 py-1 text-sm">{t}</div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )
    }
    return (
      <ScrollArea className="w-full rounded-md border" style={{ height: `${height}px` }}>
        <div className="p-4 space-y-1">
          {tags.map((t) => (
            <div key={t} className="text-sm py-1 border-b border-border last:border-0">{t}</div>
          ))}
        </div>
      </ScrollArea>
    )
  },
  generateCode: (props) => {
    const { orientation, height } = props
    if (orientation === "horizontal") {
      return `import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function Example() {
  return (
    <ScrollArea className="w-72 rounded-md border">
      <div className="flex gap-3 p-4 whitespace-nowrap">
        {tags.map((tag) => (
          <div key={tag} className="shrink-0 rounded-md border bg-muted px-3 py-1 text-sm">{tag}</div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}`
    }
    return `import { ScrollArea } from "@/components/ui/scroll-area"

export default function Example() {
  return (
    <ScrollArea className="h-[${height}px] w-48 rounded-md border">
      <div className="p-4 space-y-1">
        {items.map((item) => (
          <div key={item} className="text-sm py-1 border-b last:border-0">{item}</div>
        ))}
      </div>
    </ScrollArea>
  )
}`
  },
})
