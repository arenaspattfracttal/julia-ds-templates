import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
  AlertDialogAction, AlertDialogCancel, AlertDialogMedia,
} from "@/components/ui/alert-dialog"
import { defineComponent } from "../types"

export const alertDialogEntry = defineComponent<{
  triggerLabel: string
  title: string
  description: string
  actionLabel: string
  cancelLabel: string
  size: "default" | "sm"
  actionVariant: "default" | "destructive" | "outline" | "secondary"
  showMedia: boolean
}>({
  id: "alert-dialog",
  name: "Alert Dialog",
  description: {
    en: "A modal dialog that interrupts the user with important content and expects a response.",
    es: "Un diálogo modal que interrumpe al usuario con contenido importante y espera una respuesta.",
  },
  category: "Components",
  filePath: "components/ui/alert-dialog.tsx",
  controls: {
    triggerLabel:  { type: "text",    defaultValue: "Delete account" },
    title:         { type: "text",    defaultValue: "Are you absolutely sure?" },
    description:   { type: "text",    defaultValue: "This action cannot be undone. This will permanently delete your account and remove your data from our servers." },
    actionLabel:   { type: "text",    defaultValue: "Continue" },
    cancelLabel:   { type: "text",    defaultValue: "Cancel" },
    size:          { type: "select",  options: ["default", "sm"], defaultValue: "default" },
    actionVariant: { type: "select",  options: ["default", "destructive", "outline", "secondary"], defaultValue: "destructive" },
    showMedia:     { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { triggerLabel, title, description, actionLabel, cancelLabel, size, actionVariant, showMedia } = props
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">{triggerLabel || "Open dialog"}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size={size}>
          <AlertDialogHeader>
            {showMedia && (
              <AlertDialogMedia>
                <AlertCircle />
              </AlertDialogMedia>
            )}
            <AlertDialogTitle>{title || "Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {description || "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{cancelLabel || "Cancel"}</AlertDialogCancel>
            <AlertDialogAction variant={actionVariant}>
              {actionLabel || "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
  generateCode: (props) => {
    const { triggerLabel, title, description, actionLabel, cancelLabel, size, actionVariant, showMedia } = props
    const sizeAttr   = size !== "default"          ? ` size="${size}"`             : ""
    const actionAttr = actionVariant !== "default"  ? ` variant="${actionVariant}"` : ""
    const mediaBlock = showMedia
      ? `\n              <AlertDialogMedia>\n                <AlertCircle />\n              </AlertDialogMedia>`
      : ""
    const iconLine = showMedia ? `import { AlertCircle } from "lucide-react"\n` : ""
    const named = ["AlertDialog", "AlertDialogAction", "AlertDialogCancel",
      "AlertDialogContent", "AlertDialogDescription", "AlertDialogFooter",
      "AlertDialogHeader", showMedia ? "AlertDialogMedia" : null,
      "AlertDialogTitle", "AlertDialogTrigger"].filter(Boolean).join(", ")
    return `${iconLine}import { Button } from "@/components/ui/button"
import {
  ${named}
} from "@/components/ui/alert-dialog"

export default function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">${triggerLabel || "Open dialog"}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent${sizeAttr}>
        <AlertDialogHeader>${mediaBlock}
          <AlertDialogTitle>${title || "Are you sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            ${description || "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>${cancelLabel || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction${actionAttr}>${actionLabel || "Continue"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`
  },
})
