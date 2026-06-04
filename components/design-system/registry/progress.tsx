import { defineComponent } from "../types"
import { Progress } from "@/components/ui/progress"

export const progressEntry = defineComponent<{
  value: number
  showLabel: boolean
  showPercentage: boolean
}>({
  id: "progress",
  name: "Progress",
  description: {
    en: "Displays an indicator showing the completion progress of a task.",
    es: "Muestra un indicador del progreso de completación de una tarea.",
  },
  category: "Components",
  filePath: "components/ui/progress.tsx",
  previewWidth: 400,
  controls: {
    value:          { type: "number",  defaultValue: 60, min: 0, max: 100, step: 1 },
    showLabel:      { type: "boolean", defaultValue: true },
    showPercentage: { type: "boolean", defaultValue: true },
  },
  render: (props) => {
    const { value, showLabel, showPercentage } = props
    return (
      <div className="flex flex-col gap-2 w-full">
        {(showLabel || showPercentage) && (
          <div className="flex items-center justify-between">
            {showLabel && <span className="text-sm font-medium">Loading files...</span>}
            {showPercentage && <span className="text-sm text-muted-foreground">{value}%</span>}
          </div>
        )}
        <Progress value={value} />
      </div>
    )
  },
  generateCode: (props) => {
    const { value, showLabel, showPercentage } = props
    const progressTag = `<Progress value={${value}} />`
    if (!showLabel && !showPercentage) {
      const indented = `    ${progressTag}`
      return `import { Progress } from "@/components/ui/progress"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
    }
    const labelLine  = showLabel      ? `      <span className="text-sm font-medium">Loading files...</span>` : ""
    const pctLine    = showPercentage ? `      <span className="text-sm text-muted-foreground">${value}%</span>` : ""
    const header     = `  <div className="flex items-center justify-between">\n${[labelLine, pctLine].filter(Boolean).join("\n")}\n  </div>`
    const body       = `<div className="flex flex-col gap-2 w-64">\n${header}\n  ${progressTag}\n</div>`
    const indented   = body.split("\n").map(l=>`    ${l}`).join("\n")
    return `import { Progress } from "@/components/ui/progress"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
