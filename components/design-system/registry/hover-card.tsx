import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { defineComponent } from "../types"

export const hoverCardEntry = defineComponent<{
  side: "top" | "right" | "bottom" | "left"
  align: "start" | "center" | "end"
}>({
  id: "hover-card",
  name: "Hover Card",
  description: {
    en: "For sighted users to preview content available behind a link.",
    es: "Para usuarios con visión que desean previsualizar el contenido detrás de un enlace.",
  },
  category: "Components",
  filePath: "components/ui/hover-card.tsx",
  controls: {
    side:  { type: "select", options: ["top", "right", "bottom", "left"], defaultValue: "bottom" },
    align: { type: "select", options: ["start", "center", "end"],         defaultValue: "center" },
  },
  render: (props) => {
    const { side, align } = props
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@fracttal</Button>
        </HoverCardTrigger>
        <HoverCardContent side={side} align={align} className="w-64">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/fracttal.png" />
              <AvatarFallback>FR</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-semibold">@fracttal</p>
              <p className="text-sm text-muted-foreground">Asset & maintenance management platform.</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  },
  generateCode: (props) => {
    const { side, align } = props
    const sideAttr  = side  !== "bottom" ? ` side="${side}"`   : ""
    const alignAttr = align !== "center" ? ` align="${align}"` : ""
    return `import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@fracttal</Button>
      </HoverCardTrigger>
      <HoverCardContent${sideAttr}${alignAttr} className="w-64">
        <p className="text-sm font-semibold">@fracttal</p>
        <p className="text-sm text-muted-foreground">Asset & maintenance management platform.</p>
      </HoverCardContent>
    </HoverCard>
  )
}`
  },
})
