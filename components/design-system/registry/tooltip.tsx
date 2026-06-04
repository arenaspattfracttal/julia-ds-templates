import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { defineComponent } from "../types"

export const tooltipEntry = defineComponent<{
  trigger: string
  content: string
  side: "top" | "right" | "bottom" | "left"
  align: "start" | "center" | "end"
  sideOffset: string
  delayDuration: string
}>({
  id: "tooltip",
  name: "Tooltip",
  description: {
    en: "A popup that displays information related to an element when hovered or focused.",
    es: "Un popup que muestra información relacionada con un elemento al pasar el cursor o al enfocarlo.",
  },
  category: "Components",
  filePath: "components/ui/tooltip.tsx",
  controls: {
    trigger:       { type: "text",   defaultValue: "Hover me" },
    content:       { type: "text",   defaultValue: "This is a tooltip" },
    side:          { type: "select", options: ["top","right","bottom","left"], defaultValue: "top" },
    align:         { type: "select", options: ["start","center","end"], defaultValue: "center" },
    sideOffset:    { type: "select", options: ["0","4","8","12"], defaultValue: "4" },
    delayDuration: { type: "select", options: ["0","200","500","700"], defaultValue: "700" },
  },
  render: (props) => {
    const { content, side, trigger, align, sideOffset, delayDuration } = props
    return (
      <TooltipProvider>
        <Tooltip delayDuration={Number(delayDuration)}>
          <TooltipTrigger asChild>
            <Button variant="outline">{trigger || "Hover me"}</Button>
          </TooltipTrigger>
          <TooltipContent side={side} align={align} sideOffset={Number(sideOffset)}>
            {content || "This is a tooltip"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
  generateCode: (props) => {
    const { content, side, trigger, align, sideOffset, delayDuration } = props
    const tooltipAttrs = delayDuration !== "700" ? ` delayDuration={${delayDuration}}` : ""
    const contentAttrs: string[] = []
    if (side !== "top")     contentAttrs.push(`side="${side}"`)
    if (align !== "center") contentAttrs.push(`align="${align}"`)
    if (sideOffset !== "4") contentAttrs.push(`sideOffset={${sideOffset}}`)
    const contentAttrStr = contentAttrs.length ? ` ${contentAttrs.join(" ")}` : ""
    return `import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Example() {
  return (
    <TooltipProvider>
      <Tooltip${tooltipAttrs}>
        <TooltipTrigger asChild>
          <Button variant="outline">${trigger || "Hover me"}</Button>
        </TooltipTrigger>
        <TooltipContent${contentAttrStr}>
          ${content || "This is a tooltip"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}`
  },
})
