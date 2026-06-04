import React from "react"
import { defineComponent } from "../types"
import { Slider } from "@/components/ui/slider"

export const sliderEntry = defineComponent<{
  type: string
  min: number
  max: number
  step: string
  orientation: string
  disabled: boolean
  showValue: boolean
  valueLabel: string
}>({
  id: "slider",
  name: "Slider",
  description: {
    en: "An input where the user selects a value from within a given range.",
    es: "Un control deslizante donde el usuario selecciona un valor dentro de un rango.",
  },
  category: "Components",
  filePath: "components/ui/slider.tsx",
  previewWidth: 400,
  controls: {
    type:        { type: "select",  options: ["single","range"], defaultValue: "single" },
    min:         { type: "number",  defaultValue: 0,   min: 0,   max: 100, step: 1 },
    max:         { type: "number",  defaultValue: 100, min: 1,   max: 200, step: 1 },
    step:        { type: "select",  options: ["1","5","10","25"], defaultValue: "1" },
    orientation: { type: "select",  options: ["horizontal","vertical"], defaultValue: "horizontal" },
    disabled:    { type: "boolean", defaultValue: false },
    showValue:   { type: "boolean", defaultValue: true },
    valueLabel:  { type: "text",    defaultValue: "Value" },
  },
  controlVisible: (key, props) => {
    if (key === "valueLabel") return !!props.showValue
    return true
  },
  render: (props) => {
    const { type, min, max, step, orientation, disabled, showValue, valueLabel } = props
    const isRange = type === "range"
    const isVertical = orientation === "vertical"
    const label = valueLabel || (isRange ? "Range" : "Value")
    function SliderPreview() {
      const [val, setVal] = React.useState<number[]>(isRange ? [25, 75] : [50])
      return (
        <div className={isVertical ? "flex flex-col items-center gap-4" : "flex flex-col gap-3 w-full"}>
          {showValue && (
            isVertical ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{isRange ? `${val[0]} – ${val[1]}` : val[0]}</span>
              </div>
            ) : (
              <div className="flex justify-between w-full text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{isRange ? `${val[0]} – ${val[1]}` : val[0]}</span>
              </div>
            )
          )}
          <Slider defaultValue={isRange ? [25, 75] : [50]}
            min={min} max={max} step={Number(step)}
            orientation={orientation as "horizontal" | "vertical"}
            disabled={disabled} onValueChange={setVal}
            className={isVertical ? "h-40" : undefined} />
        </div>
      )
    }
    return <SliderPreview />
  },
  generateCode: (props) => {
    const { type, min, max, step, orientation, disabled, showValue, valueLabel } = props
    const isRange = type === "range"
    const label = valueLabel || (isRange ? "Range" : "Value")
    const attrs: string[] = [`defaultValue={${isRange ? "[25, 75]" : "[50]"}}`]
    if (min !== 0)   attrs.push(`min={${min}}`)
    if (max !== 100) attrs.push(`max={${max}}`)
    if (step !== "1") attrs.push(`step={${step}}`)
    if (orientation !== "horizontal") attrs.push(`orientation="${orientation}"`)
    if (disabled) attrs.push("disabled")
    attrs.push("onValueChange={setVal}")
    const tag = attrs.length <= 2
      ? `<Slider ${attrs.join(" ")} />`
      : ["<Slider", ...attrs.map(a => `  ${a}`), "/>"].join("\n")
    const wrapClass = orientation === "vertical" ? "h-40" : "w-64"
    const valueRow = showValue
      ? `  <div className="flex justify-between text-sm">\n    <span className="text-muted-foreground">${label}</span>\n    <span className="font-medium">{${isRange ? "val[0] + \" – \" + val[1]" : "val[0]"}}</span>\n  </div>\n  ` : ""
    const sliderIndented = tag.split("\n").map(l => `  ${l}`).join("\n")
    const inner = `${valueRow}${sliderIndented}`
    const indented = inner.split("\n").map(l => `    ${l}`).join("\n")
    const stateBlock = `  const [val, setVal] = React.useState(${isRange ? "[25, 75]" : "[50]"})\n\n`
    return `import { useState } from "react"\nimport { Slider } from "@/components/ui/slider"\n\nexport default function Example() {\n${stateBlock}  return (\n    <div className="${wrapClass}">\n${indented}\n    </div>\n  )\n}`
  },
})
