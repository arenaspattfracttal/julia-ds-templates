import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { defineComponent } from "../types"

export const cardEntry = defineComponent<{
  showHeader: boolean
  showDescription: boolean
  showAction: boolean
  showFooter: boolean
}>({
  id: "card",
  name: "Card",
  description: {
    en: "A container for grouping related content and actions.",
    es: "Un contenedor para agrupar contenido y acciones relacionadas.",
  },
  category: "Components",
  filePath: "components/ui/card.tsx",
  previewWidth: 400,
  controls: {
    showHeader:      { type: "boolean", defaultValue: true },
    showDescription: { type: "boolean", defaultValue: true },
    showAction:      { type: "boolean", defaultValue: false },
    showFooter:      { type: "boolean", defaultValue: true },
  },
  render: (props) => {
    const { showHeader, showDescription, showAction, showFooter } = props
    return (
      <Card className="w-full">
        {showHeader && (
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            {showDescription && <CardDescription>You have 3 unread messages.</CardDescription>}
            {showAction && <CardAction><Button size="sm" variant="ghost">Mark all</Button></CardAction>}
          </CardHeader>
        )}
        <CardContent>
          <p className="text-sm text-muted-foreground">Manage your notification preferences here.</p>
        </CardContent>
        {showFooter && (
          <CardFooter>
            <Button className="w-full">Save changes</Button>
          </CardFooter>
        )}
      </Card>
    )
  },
  generateCode: (props) => {
    const { showHeader, showDescription, showAction, showFooter } = props
    const cardParts = ["Card", "CardContent"]
    if (showHeader) { cardParts.push("CardHeader", "CardTitle") }
    if (showDescription) cardParts.push("CardDescription")
    if (showAction) cardParts.push("CardAction")
    if (showFooter) cardParts.push("CardFooter")
    const headerBlock = showHeader
      ? `\n  <CardHeader>\n    <CardTitle>Notifications</CardTitle>${showDescription ? `\n    <CardDescription>You have 3 unread messages.</CardDescription>` : ""}${showAction ? `\n    <CardAction><Button size="sm" variant="ghost">Mark all</Button></CardAction>` : ""}\n  </CardHeader>`
      : ""
    const footerBlock = showFooter ? `\n  <CardFooter>\n    <Button className="w-full">Save changes</Button>\n  </CardFooter>` : ""
    const btnImport = (showAction || showFooter) ? `\nimport { Button } from "@/components/ui/button"` : ""
    return `import { ${cardParts.join(", ")} } from "@/components/ui/card"${btnImport}\n\nexport default function Example() {\n  return (\n    <Card className="w-72">${headerBlock}\n  <CardContent>\n    <p className="text-sm text-muted-foreground">Manage your notification preferences here.</p>\n  </CardContent>${footerBlock}\n    </Card>\n  )\n}`
  },
})
