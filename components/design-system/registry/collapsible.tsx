import { ChevronsUpDown as ChevronsUpDownIcon } from "lucide-react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { defineComponent } from "../types"

export const collapsibleEntry = defineComponent<{
  open: boolean
  disabled: boolean
}>({
  id: "collapsible",
  name: "Collapsible",
  description: {
    en: "An interactive component which expands/collapses a panel.",
    es: "Un componente interactivo que expande o colapsa un panel.",
  },
  category: "Components",
  filePath: "components/ui/collapsible.tsx",
  previewWidth: 400,
  controls: {
    open:     { type: "boolean", defaultValue: false },
    disabled: { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { open, disabled } = props
    return (
      <Collapsible key={String(open)} defaultOpen={open} disabled={disabled} className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Starred repositories</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <ChevronsUpDownIcon className="size-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 text-sm">@radix-ui/primitives</div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 text-sm">@radix-ui/colors</div>
          <div className="rounded-md border px-4 py-3 text-sm">@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>
    )
  },
  generateCode: (props) => {
    const { open, disabled } = props
    const attrs = [open ? " open" : "", disabled ? " disabled" : ""].filter(Boolean).join("")
    return `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"

export default function Example() {
  return (
    <Collapsible${attrs} className="w-64 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Starred repositories</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDown className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 text-sm">@radix-ui/primitives</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm">@radix-ui/colors</div>
        <div className="rounded-md border px-4 py-3 text-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  )
}`
  },
})
