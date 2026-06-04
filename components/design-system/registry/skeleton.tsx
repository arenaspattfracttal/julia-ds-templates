import { defineComponent } from "../types"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export const skeletonEntry = defineComponent<{
  preset: string
  lines: string
}>({
  id: "skeleton",
  name: "Skeleton",
  description: {
    en: "Placeholder preview for content that is loading.",
    es: "Vista previa de marcador para contenido que está cargando.",
  },
  category: "Components",
  filePath: "components/ui/skeleton.tsx",
  previewWidth: 400,
  controls: {
    preset: { type: "select", options: ["text", "card", "avatar", "list"], defaultValue: "card" },
    lines:  { type: "select", options: ["2", "3", "4"], defaultValue: "3" },
  },
  controlVisible: (key, props) => {
    if (key === "lines") return props.preset === "text"
    return true
  },
  render: (props) => {
    const { preset, lines } = props
    const lineCount = Number(lines)

    if (preset === "text") {
      const widths = ["w-full", "w-4/5", "w-11/12", "w-3/4"]
      return (
        <div className="flex flex-col gap-2 w-full">
          {Array.from({ length: lineCount }).map((_, i) => (
            <Skeleton key={i} className={cn("h-4", widths[i % widths.length])} />
          ))}
        </div>
      )
    }

    if (preset === "avatar") {
      return (
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      )
    }

    if (preset === "list") {
      return (
        <div className="flex flex-col gap-3 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    // card (default)
    return (
      <div className="flex flex-col gap-3 w-full">
        <Skeleton className="h-36 w-full rounded-lg" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </div>
    )
  },
  generateCode: (props) => {
    const { preset, lines } = props
    const lineCount = Number(lines)
    const imp = `import { Skeleton } from "@/components/ui/skeleton"\n\nexport default function Example() {\n  return (\n`
    const close = `  )\n}`

    if (preset === "text") {
      const widths = ["w-full", "w-4/5", "w-11/12", "w-3/4"]
      const skels = Array.from({ length: lineCount })
        .map((_, i) => `      <Skeleton className="h-4 ${widths[i % widths.length]}" />`)
        .join("\n")
      return `${imp}    <div className="flex flex-col gap-2 w-64">\n${skels}\n    </div>\n${close}`
    }

    if (preset === "avatar") {
      return `${imp}    <div className="flex items-center gap-3 w-64">
      <Skeleton className="size-10 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>\n${close}`
    }

    if (preset === "list") {
      const rows = Array.from({ length: 3 }).map(() =>
        `      <div className="flex items-center gap-3">
        <Skeleton className="size-8 rounded-full shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>`
      ).join("\n")
      return `${imp}    <div className="flex flex-col gap-3 w-64">\n${rows}\n    </div>\n${close}`
    }

    // card
    return `${imp}    <div className="flex flex-col gap-3 w-64">
      <Skeleton className="h-36 w-full rounded-lg" />
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>\n${close}`
  },
})
