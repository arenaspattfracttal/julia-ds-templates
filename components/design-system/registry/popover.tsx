import { defineComponent } from "../types"
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export const popoverEntry = defineComponent<{
  side: "top" | "right" | "bottom" | "left"
  align: "start" | "center" | "end"
}>({
  id: "popover",
  name: "Popover",
  description: {
    en: "Displays rich content in a portal, triggered by a button.",
    es: "Muestra contenido enriquecido en un portal, activado por un botón.",
  },
  category: "Components",
  filePath: "components/ui/popover.tsx",
  controls: {
    side:  { type: "select", options: ["top", "right", "bottom", "left"], defaultValue: "bottom" },
    align: { type: "select", options: ["start", "center", "end"],         defaultValue: "center" },
  },
  render: (props) => {
    const { side, align } = props
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent side={side} align={align}>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
          </PopoverHeader>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" />
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="25px" />
          </div>
        </PopoverContent>
      </Popover>
    )
  },
  generateCode: (props) => {
    const { side, align } = props
    const sideAttr  = side  !== "bottom" ? ` side="${side}"`   : ""
    const alignAttr = align !== "center" ? ` align="${align}"` : ""
    return `import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent${sideAttr}${alignAttr}>
        <p className="text-sm font-medium">Dimensions</p>
        <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
      </PopoverContent>
    </Popover>
  )
}`
  },
})
