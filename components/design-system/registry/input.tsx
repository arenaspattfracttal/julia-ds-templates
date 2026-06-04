import React from "react"
import { defineComponent } from "../types"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ButtonIcon } from "./_shared"

// ─── INPUT generateCode helpers ───────────────────────────────────────────────

function buildInputTag(attrs: string[]): string {
  return attrs.length <= 1
    ? `<Input${attrs.length ? " " + attrs[0] : ""} />`
    : ["<Input", ...attrs.map(a => `  ${a}`), "/>"].join("\n")
}

function buildInputWrapper(hasIcon: boolean, iconLeft: string, inputTag: string): string {
  if (!hasIcon) return inputTag
  const iconLine = `<${iconLeft} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />\n    `
  return `<div className="relative">\n    ${iconLine}${inputTag.split("\n").join("\n    ")}\n    </div>`
}

function buildInputLabel(showLabel: boolean, label: string, required: boolean): string {
  if (!showLabel || !label) return ""
  const content = `${label}${required ? `{" "}<span className="text-destructive" aria-hidden="true">*</span>` : ""}`
  return `<label className="text-sm font-medium">\n      ${content}\n    </label>\n    `
}

function InputWithWrapper({
  placeholder, type, disabled, required, invalid, iconLeft, showButton, clearable,
}: {
  placeholder: string; type: string; disabled: boolean; required: boolean
  invalid: boolean; iconLeft: string; showButton: boolean; clearable: boolean
}) {
  const hasIcon = iconLeft && iconLeft !== "none"
  const wrapperCls = hasIcon ? "relative flex-1 min-w-0" : showButton ? "flex-1 min-w-0" : ""
  const isClearable = clearable && type !== "search"
  return (
    <div className={wrapperCls}>
      {hasIcon && <ButtonIcon name={iconLeft} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />}
      <Input
        placeholder={placeholder}
        type={type as React.ComponentProps<typeof Input>["type"]}
        disabled={disabled}
        required={required || undefined}
        aria-invalid={invalid ? "true" : undefined}
        clearable={isClearable || undefined}
        defaultValue={isClearable ? "Sample value" : undefined}
        className={hasIcon ? "pl-8" : undefined}
      />
    </div>
  )
}

export const inputEntry = defineComponent<{
  type: string
  showLabel: boolean
  label: string
  placeholder: string
  showMessage: boolean
  description: string
  disabled: boolean
  required: boolean
  invalid: boolean
  iconLeft: string
  showButton: boolean
  clearable: boolean
}>({
  id: "input",
  name: "Input",
  description: {
    en: "Displays a form input field for text-based data entry.",
    es: "Muestra un campo de formulario para la entrada de texto.",
  },
  category: "Components",
  filePath: "components/ui/input.tsx",
  previewWidth: 400,
  controls: {
    type:        { type: "select",  options: ["text","email","password","number","search","url","tel","file"], defaultValue: "email" },
    showLabel:   { type: "boolean", defaultValue: true },
    label:       { type: "text",    defaultValue: "Email" },
    placeholder: { type: "text",    defaultValue: "your@email.com" },
    showMessage: { type: "boolean", defaultValue: false },
    description: { type: "text",    defaultValue: "We'll never share your email." },
    disabled:    { type: "boolean", defaultValue: false },
    required:    { type: "boolean", defaultValue: false },
    invalid:     { type: "boolean", defaultValue: false },
    iconLeft:    { type: "icon",    defaultValue: "none" },
    showButton:  { type: "boolean", defaultValue: false },
    clearable:   { type: "boolean", defaultValue: false },
  },
  controlVisible: (key, props) => {
    if (key === "label")     return !!props.showLabel
    if (key === "description") return !!props.showMessage
    if (key === "clearable") return props.type !== "search"
    return true
  },
  cascade: (key, value) => {
    if (key !== "type") return {}
    const presets: Record<string, { label: string; placeholder: string; showLabel: boolean }> = {
      text:     { label: "Name",     placeholder: "e.g. John Smith",      showLabel: true  },
      email:    { label: "Email",    placeholder: "your@email.com",        showLabel: true  },
      password: { label: "Password", placeholder: "••••••••",              showLabel: true  },
      number:   { label: "Amount",   placeholder: "0",                     showLabel: true  },
      search:   { label: "Search",   placeholder: "Search...",             showLabel: false },
      url:      { label: "Website",  placeholder: "https://example.com",   showLabel: true  },
      tel:      { label: "Phone",    placeholder: "+1 800 000 0000",       showLabel: true  },
      file:     { label: "File",     placeholder: "",                      showLabel: true  },
    }
    return presets[value as string] ?? {}
  },
  render: (props) => {
    const { showLabel, label, placeholder, type, disabled, showMessage, description, required, invalid, iconLeft, showButton, clearable } = props
    const inputEl = <InputWithWrapper placeholder={placeholder} type={type} disabled={disabled} required={required} invalid={invalid} iconLeft={iconLeft || "none"} showButton={showButton} clearable={clearable} />
    const labelEl = showLabel && label
      ? (
        <label className="text-sm font-medium text-foreground">
          {label}{required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
        </label>
      )
      : null
    const bodyEl = showButton
      ? <div className="flex gap-2">{inputEl}<Button size="sm">Send</Button></div>
      : inputEl
    const descEl = showMessage && description && !invalid
      ? <p className="text-xs text-muted-foreground">{description}</p>
      : null
    const errorEl = invalid
      ? <p className="text-xs text-destructive">This field is not valid.</p>
      : null
    return (
      <div className="w-full flex flex-col gap-0.5">
        {labelEl}
        {bodyEl}
        {descEl}
        {errorEl}
      </div>
    )
  },
  generateCode: (props) => {
    const { showLabel, label, placeholder, type, disabled, showMessage, description, required, invalid, iconLeft, showButton, clearable } = props
    const hasIcon = !!(iconLeft && iconLeft !== "none")
    const isClearable = clearable && type !== "search"
    const inputAttrs: string[] = []
    if (type !== "text") inputAttrs.push(`type="${type}"`)
    if (placeholder) inputAttrs.push(`placeholder="${placeholder}"`)
    if (isClearable) inputAttrs.push("clearable")
    if (disabled) inputAttrs.push("disabled")
    if (required) inputAttrs.push("required")
    if (invalid) inputAttrs.push('aria-invalid="true"')
    if (hasIcon) inputAttrs.push('className="pl-8"')
    const inputTag = buildInputTag(inputAttrs)
    const wrappedInput = buildInputWrapper(hasIcon, iconLeft, inputTag)
    const labelLine = buildInputLabel(showLabel, label, required)
    const descLine = showMessage && description && !invalid ? `\n    <p className="text-xs text-muted-foreground">${description}</p>` : ""
    const errorLine = invalid ? `\n    <p className="text-xs text-destructive">This field is not valid.</p>` : ""
    const inner = showButton
      ? `${labelLine}<div className="flex gap-2">\n      ${wrappedInput.split("\n").join("\n      ")}\n      <Button>Send</Button>\n    </div>${descLine}${errorLine}`
      : `${labelLine}${wrappedInput}${descLine}${errorLine}`
    const indented = inner.split("\n").map(l => `    ${l}`).join("\n")
    const imports = [
      hasIcon ? `import { ${iconLeft} } from "lucide-react"` : null,
      showButton ? 'import { Button } from "@/components/ui/button"' : null,
      'import { Input } from "@/components/ui/input"',
    ].filter(Boolean).join("\n")
    return `${imports}\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
  examples: [
    {
      title: "Default",
      render: () => (
        <div className="flex flex-col gap-1.5 w-60">
          <label className="text-sm font-medium">Email</label>
          <Input placeholder="your@email.com" />
        </div>
      ),
      code: `import { Input } from "@/components/ui/input"

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 w-60">
      <label className="text-sm font-medium">Email</label>
      <Input placeholder="your@email.com" />
    </div>
  )
}`,
    },
    {
      title: "With icon",
      render: () => (
        <div className="flex flex-col gap-1.5 w-60">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input placeholder="Search..." className="pl-8" />
          </div>
        </div>
      ),
      code: `import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 w-60">
      <label className="text-sm font-medium">Search</label>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input placeholder="Search..." className="pl-8" />
      </div>
    </div>
  )
}`,
    },
    {
      title: "With description",
      render: () => (
        <div className="flex flex-col gap-1.5 w-60">
          <label className="text-sm font-medium">Username</label>
          <Input placeholder="john_doe" />
          <p className="text-xs text-muted-foreground">This will be your public display name.</p>
        </div>
      ),
      code: `import { Input } from "@/components/ui/input"

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 w-60">
      <label className="text-sm font-medium">Username</label>
      <Input placeholder="john_doe" />
      <p className="text-xs text-muted-foreground">
        This will be your public display name.
      </p>
    </div>
  )
}`,
    },
    {
      title: "Error state",
      render: () => (
        <div className="flex flex-col gap-1.5 w-60">
          <label className="text-sm font-medium">Email</label>
          <Input placeholder="your@email.com" aria-invalid="true" defaultValue="not-an-email" />
          <p className="text-xs text-destructive">Please enter a valid email address.</p>
        </div>
      ),
      code: `import { Input } from "@/components/ui/input"

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 w-60">
      <label className="text-sm font-medium">Email</label>
      <Input
        placeholder="your@email.com"
        aria-invalid="true"
        defaultValue="not-an-email"
      />
      <p className="text-xs text-destructive">
        Please enter a valid email address.
      </p>
    </div>
  )
}`,
    },
    {
      title: "Disabled",
      render: () => (
        <div className="flex flex-col gap-1.5 w-60">
          <label className="text-sm font-medium text-muted-foreground">Email</label>
          <Input placeholder="your@email.com" disabled defaultValue="user@example.com" />
        </div>
      ),
      code: `import { Input } from "@/components/ui/input"

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 w-60">
      <label className="text-sm font-medium text-muted-foreground">Email</label>
      <Input
        placeholder="your@email.com"
        disabled
        defaultValue="user@example.com"
      />
    </div>
  )
}`,
    },
    {
      title: "With button",
      render: () => (
        <div className="flex flex-col gap-1.5 w-60">
          <label className="text-sm font-medium">Invite</label>
          <div className="flex gap-2">
            <Input placeholder="colleague@email.com" />
            <Button size="sm">Send</Button>
          </div>
        </div>
      ),
      code: `import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 w-60">
      <label className="text-sm font-medium">Invite</label>
      <div className="flex gap-2">
        <Input placeholder="colleague@email.com" />
        <Button size="sm">Send</Button>
      </div>
    </div>
  )
}`,
    },
  ],
})
