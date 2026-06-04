import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { defineComponent } from "../types"

function buildSonnerOptsLines(description: string, position: string, duration: string, dismissButton: boolean, type: string): string[] {
  const lines: string[] = []
  if (description) lines.push(`  description: "${description}",`)
  if (position !== "bottom-right") lines.push(`  position: "${position}",`)
  if (duration !== "4000") lines.push(`  duration: ${duration === "Infinity" ? "Infinity" : duration},`)
  const hasCancelBtn = dismissButton && type !== "promise"
  if (hasCancelBtn) lines.push(`  cancel: (\n    <Button size="sm" className="ml-auto" onClick={() => toast.dismiss(id)}>\n      Dismiss\n    </Button>\n  ),`)
  return lines
}

function buildSonnerToastCall(type: string, msg: string, opts: string, fn: string, hasCancelBtn: boolean): string {
  if (type === "promise") return `toast.promise(\n  fetchData(),\n  { loading: "Loading...", success: "${msg}", error: "Error." }\n)`
  if (hasCancelBtn) return `${fn}("${msg}"${opts ? `, ${opts}` : ""})`
  return opts ? `${fn}("${msg}", ${opts})` : `${fn}("${msg}")`
}

function buildSonnerFuncBody(hasCancelBtn: boolean, toastCall: string): string {
  if (hasCancelBtn) return `  function handleClick() {\n    let id: string | number\n    id = ${toastCall}\n  }`
  return `  // onClick={() => ${toastCall}}`
}

export const sonnerEntry = defineComponent<{
  type: string
  message: string
  description: string
  position: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  duration: string
  dismissButton: boolean
}>({
  id: "sonner",
  name: "Sonner",
  description: {
    en: "A toast notification system — stack, dismiss, and style messages with ease.",
    es: "Sistema de notificaciones toast — apila, descarta y estiliza mensajes fácilmente.",
  },
  category: "Components",
  filePath: "components/ui/sonner.tsx",
  controls: {
    type:        { type: "select",  options: ["default", "success", "error", "warning", "info", "loading", "promise"], defaultValue: "default" },
    message:     { type: "text",    defaultValue: "Your changes have been saved." },
    description: { type: "text",    defaultValue: "" },
    position:    { type: "select",  options: ["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right"], defaultValue: "bottom-center" },
    duration:     { type: "select",  options: ["2000","4000","8000","Infinity"], defaultValue: "4000" },
    dismissButton: { type: "boolean", defaultValue: true },
  },
  render: (props) => {
    const { type, message, description, position, duration, dismissButton } = props
    const msg = message || "Your changes have been saved."
    function fire() {
      let id: string | number = ""

      const cancelButton = dismissButton
        ? (
          <Button size="sm" variant="default" className="ml-auto shrink-0" onClick={() => toast.dismiss(id)}>
            Dismiss
          </Button>
        )
        : undefined

      const opts = {
        description: description || undefined,
        position,
        duration: duration === "Infinity" ? Infinity : Number(duration),
        ...(cancelButton ? { cancel: cancelButton } : {}),
      }

      if (type === "success")      id = toast.success(msg, opts)
      else if (type === "error")   id = toast.error(msg, opts)
      else if (type === "warning") id = toast.warning(msg, opts)
      else if (type === "info")    id = toast.info(msg, opts)
      else if (type === "loading") id = toast.loading(msg, opts)
      else if (type === "promise") {
        toast.promise(
          new Promise<string>((res) => setTimeout(() => res("Done!"), 2000)),
          { loading: "Loading...", success: msg, error: "Something went wrong.", position }
        )
      } else id = toast(msg, opts)
    }

    return (
      <Button onClick={fire} variant="outline">
        Show sonner
      </Button>
    )
  },
  generateCode: (props) => {
    const { type, message, description, position, duration, dismissButton } = props
    const msg = message || "Your changes have been saved."
    const hasCancelBtn = dismissButton && type !== "promise"
    const optsLines = buildSonnerOptsLines(description, position, duration, dismissButton, type)
    const opts = optsLines.length ? `{\n${optsLines.join("\n")}\n}` : ""
    const fn = type === "default" ? "toast" : type === "promise" ? "toast.promise" : `toast.${type}`
    const toastCall = buildSonnerToastCall(type, msg, opts, fn, hasCancelBtn)
    const funcBody = buildSonnerFuncBody(hasCancelBtn, toastCall)
    return `import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function Example() {
${funcBody}

  return (
    <Button variant="outline" onClick={handleClick}>
      Show toast
    </Button>
  )
}

// Mount <Toaster /> once in your root layout:
// import { Toaster } from "@/components/ui/sonner"
// <Toaster richColors position="bottom-right" />`
  },
})
