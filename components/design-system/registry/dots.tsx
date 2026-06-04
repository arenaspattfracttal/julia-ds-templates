import { useState } from "react"
import { defineComponent } from "../types"
import { Dots } from "@/components/ui/dots"

// Componente interno con estado propio — render() no puede usar hooks directamente
function DotsPreview({ count, size, clickable, withContainer }: {
  count:         number
  size:          "sm" | "default" | "lg"
  clickable:     boolean
  withContainer: boolean
}) {
  const [active, setActive] = useState(0)
  return (
    <div
      className="flex flex-col items-center gap-4 p-6 rounded-lg"
      style={{ background: withContainer ? "var(--muted)" : undefined }}
    >
      <Dots
        count={count}
        active={active}
        size={size}
        withContainer={withContainer}
        onDotClick={clickable ? setActive : undefined}
      />
      {clickable && (
        <p className="text-xs text-muted-foreground">
          Página {active + 1} de {count}
        </p>
      )}
    </div>
  )
}

export const dotsEntry = defineComponent<{
  count:         number
  size:          "sm" | "default" | "lg"
  clickable:     boolean
  withContainer: boolean
}>({
  id: "dots",
  name: "Dots",
  description: {
    en: "Pagination dots indicator for carousels and step flows.",
    es: "Indicador de puntos para carruseles y flujos por pasos.",
  },
  category: "Display",
  filePath: "components/ui/dots.tsx",
  previewWidth: 200,
  controls: {
    count:         { type: "number",  defaultValue: 4 },
    size:          { type: "select",  defaultValue: "default", options: ["sm", "default", "lg"] },
    clickable:     { type: "boolean", defaultValue: true },
    withContainer: { type: "boolean", defaultValue: false },
  },
  render: (props) => (
    <DotsPreview
      count={props.count}
      size={props.size}
      clickable={props.clickable}
      withContainer={props.withContainer}
    />
  ),
  generateCode: (props) => `import { Dots } from "@/components/ui/dots"

export default function Example() {
  const [active, setActive] = useState(0)
  return (
    <Dots
      count={4}
      active={active}${props.withContainer ? "\n      withContainer" : ""}
      onDotClick={setActive}
    />
  )
}`,
})
