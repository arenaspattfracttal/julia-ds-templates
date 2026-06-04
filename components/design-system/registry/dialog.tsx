import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { defineComponent } from "../types"

export const dialogEntry = defineComponent<{
  triggerLabel: string
  title: string
  description: string
  actionLabel: string
  size: string
  actionVariant: "default" | "destructive" | "secondary" | "outline"
  showCloseButton: boolean
  showFooterClose: boolean
}>({
  id: "dialog",
  name: "Dialog",
  description: {
    en: "A modal window that overlays the page content and requires user interaction.",
    es: "Una ventana modal que se superpone al contenido y requiere interacción del usuario.",
  },
  category: "Components",
  filePath: "components/ui/dialog.tsx",
  controls: {
    triggerLabel:    { type: "text",    defaultValue: "Open dialog" },
    title:           { type: "text",    defaultValue: "Edit profile" },
    description:     { type: "text",    defaultValue: "Make changes to your profile here. Click save when you're done." },
    actionLabel:     { type: "text",    defaultValue: "Save changes" },
    size:            { type: "select",  options: ["sm", "default", "lg", "xl"], defaultValue: "default" },
    actionVariant:   { type: "select",  options: ["default", "destructive", "secondary", "outline"], defaultValue: "default" },
    showCloseButton: { type: "boolean", defaultValue: true },
    showFooterClose: { type: "boolean", defaultValue: true },
  },
  render: (props) => {
    const { triggerLabel, title, description, actionLabel, size, actionVariant, showCloseButton, showFooterClose } = props
    const sizeClass: Record<string, string> = {
      sm: "sm:max-w-sm", default: "sm:max-w-md", lg: "sm:max-w-lg", xl: "sm:max-w-xl",
    }
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{triggerLabel || "Open dialog"}</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={showCloseButton} className={sizeClass[size] ?? "sm:max-w-md"}>
          <DialogHeader>
            <DialogTitle>{title || "Edit profile"}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <DialogFooter showCloseButton={showFooterClose}>
            <Button variant={actionVariant}>{actionLabel || "Save changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  generateCode: (props) => {
    const { triggerLabel, title, description, actionLabel, size, actionVariant, showCloseButton, showFooterClose } = props
    const sizeClass: Record<string, string> = {
      sm: "sm:max-w-sm", default: "sm:max-w-md", lg: "sm:max-w-lg", xl: "sm:max-w-xl",
    }
    const contentAttrs: string[] = []
    if (sizeClass[size] !== "sm:max-w-md") contentAttrs.push(`className="${sizeClass[size]}"`)
    if (!showCloseButton) contentAttrs.push(`showCloseButton={false}`)
    const contentAttrStr = contentAttrs.length ? ` ${contentAttrs.join(" ")}` : ""
    const actionAttr = actionVariant !== "default" ? ` variant="${actionVariant}"` : ""
    const descLine = description ? `\n          <DialogDescription>\n            ${description}\n          </DialogDescription>` : ""
    const footerClose = showFooterClose ? ` showCloseButton` : ""
    const named = [
      "Dialog", "DialogContent", "DialogDescription", "DialogFooter",
      "DialogHeader", "DialogTitle", "DialogTrigger",
    ].join(", ")
    return `import { Button } from "@/components/ui/button"
import {
  ${named}
} from "@/components/ui/dialog"

export default function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">${triggerLabel || "Open dialog"}</Button>
      </DialogTrigger>
      <DialogContent${contentAttrStr}>
        <DialogHeader>
          <DialogTitle>${title || "Edit profile"}</DialogTitle>${descLine}
        </DialogHeader>
        <DialogFooter${footerClose}>
          <Button${actionAttr}>${actionLabel || "Save changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`
  },
})
