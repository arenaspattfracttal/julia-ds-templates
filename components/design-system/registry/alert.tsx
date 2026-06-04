import { Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
import { defineComponent } from "../types"

export const alertEntry = defineComponent<{
  variant: "default" | "destructive"
  title: string
  description: string
  showIcon: boolean
  showAction: boolean
}>({
  id: "alert",
  name: "Alert",
  description: {
    en: "Displays a callout for user attention — informational or destructive.",
    es: "Muestra un aviso para llamar la atención del usuario — informativo o destructivo.",
  },
  category: "Components",
  filePath: "components/ui/alert.tsx",
  previewWidth: 400,
  controls: {
    variant:     { type: "select",  options: ["default","destructive"], defaultValue: "default" },
    title:       { type: "text",    defaultValue: "Heads up!" },
    description: { type: "text",    defaultValue: "You can add components to your app using the CLI." },
    showIcon:    { type: "boolean", defaultValue: true },
    showAction:  { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { variant, title, description, showIcon, showAction } = props
    return (
      <Alert variant={variant} className="w-full">
        {showIcon && (variant === "destructive" ? <AlertCircle /> : <Info />)}
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
        {showAction && (
          <AlertAction>
            <Button size="xs" variant={variant}>Dismiss</Button>
          </AlertAction>
        )}
      </Alert>
    )
  },
  generateCode: (props) => {
    const { variant, title, description, showIcon, showAction } = props
    const variantAttr = variant !== "default" ? ` variant="${variant}"` : ""
    const iconTag = showIcon ? (variant === "destructive" ? `\n  <AlertCircle />` : `\n  <Info />`) : ""
    const titleTag = title ? `\n  <AlertTitle>${title}</AlertTitle>` : ""
    const descTag  = description ? `\n  <AlertDescription>${description}</AlertDescription>` : ""
    const btnVariantAttr = variant !== "default" ? ` variant="${variant}"` : ""
    const actionTag = showAction ? `\n  <AlertAction>\n    <Button size="xs"${btnVariantAttr}>Dismiss</Button>\n  </AlertAction>` : ""
    const body = `<Alert${variantAttr}>${iconTag}${titleTag}${descTag}${actionTag}\n</Alert>`
    const indented = body.split("\n").map(l=>`    ${l}`).join("\n")
    const iconName = showIcon ? (variant === "destructive" ? "AlertCircle" : "Info") : null
    const iconLine = iconName ? `import { ${iconName} } from "lucide-react"\n` : ""
    const alertImports = ["Alert", title && "AlertTitle", description && "AlertDescription", showAction && "AlertAction"].filter(Boolean).join(", ")
    const buttonLine = showAction ? `import { Button } from "@/components/ui/button"\n` : ""
    return `${iconLine}${buttonLine}import { ${alertImports} } from "@/components/ui/alert"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
