import { defineComponent } from "../types"
import { Separator } from "@/components/ui/separator"

export const separatorEntry = defineComponent<{
  orientation: "horizontal" | "vertical"
  withLabel: boolean
}>({
  id: "separator",
  name: "Separator",
  description: {
    en: "Visually or semantically separates content.",
    es: "Separa el contenido de forma visual o semántica.",
  },
  category: "Components",
  filePath: "components/ui/separator.tsx",
  previewWidth: 400,
  controls: {
    orientation: { type: "select", options: ["horizontal", "vertical"], defaultValue: "horizontal" },
    withLabel:   { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { orientation, withLabel } = props
    if (orientation === "vertical") {
      return (
        <div className="flex h-10 items-center gap-4 text-sm">
          <span>Blog</span>
          <Separator orientation="vertical" />
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Source</span>
        </div>
      )
    }
    if (withLabel) {
      return (
        <div className="flex w-full items-center gap-3 text-sm text-muted-foreground">
          <Separator className="flex-1" />
          <span>OR</span>
          <Separator className="flex-1" />
        </div>
      )
    }
    return (
      <div className="w-full space-y-3">
        <p className="text-sm font-medium">Section A</p>
        <Separator />
        <p className="text-sm font-medium">Section B</p>
      </div>
    )
  },
  generateCode: (props) => {
    const { orientation, withLabel } = props
    if (orientation === "vertical") {
      return `import { Separator } from "@/components/ui/separator"

export default function Example() {
  return (
    <div className="flex h-10 items-center gap-4 text-sm">
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Source</span>
    </div>
  )
}`
    }
    if (withLabel) {
      return `import { Separator } from "@/components/ui/separator"

export default function Example() {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <Separator className="flex-1" />
      <span>OR</span>
      <Separator className="flex-1" />
    </div>
  )
}`
    }
    return `import { Separator } from "@/components/ui/separator"

export default function Example() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Section A</p>
      <Separator />
      <p className="text-sm font-medium">Section B</p>
    </div>
  )
}`
  },
})
