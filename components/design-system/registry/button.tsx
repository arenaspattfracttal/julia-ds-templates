import React from "react"
import { defineComponent } from "../types"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonIcon } from "./_shared"

function buildButtonInner(loading: boolean, isIconSize: boolean, iconLeft: string, iconRight: string, children: string): string {
  if (loading) {
    return isIconSize
      ? `\n  <Loader2 className="animate-spin" />\n`
      : `\n  <Loader2 className="animate-spin" />\n  ${children || "Button"}\n`
  }
  if (isIconSize) {
    const singleIcon = iconLeft !== "none" ? iconLeft : iconRight !== "none" ? iconRight : "Mail"
    return `\n  <${singleIcon} />\n`
  }
  const leftPart  = iconLeft  !== "none" ? `\n  <${iconLeft} />` : ""
  const rightPart = iconRight !== "none" ? `\n  <${iconRight} />` : ""
  const hasIcons  = leftPart || rightPart
  return hasIcons
    ? `${leftPart}\n  ${children || "Button"}${rightPart}\n`
    : children || "Button"
}

function buildButtonAttrs(variant: string, size: string, disabled: boolean, loading: boolean, invalid: boolean): string[] {
  const attrs: string[] = []
  if (variant !== "default") attrs.push(`variant="${variant}"`)
  if (size    !== "default") attrs.push(`size="${size}"`)
  if (disabled || loading)   attrs.push("disabled")
  if (invalid)               attrs.push('aria-invalid="true"')
  return attrs
}

function buildButtonIconImport(loading: boolean, isIconSize: boolean, iconLeft: string, iconRight: string): string {
  const usedIcons = new Set<string>()
  if (loading) {
    usedIcons.add("Loader2")
  } else if (isIconSize) {
    const singleIcon = iconLeft !== "none" ? iconLeft : iconRight !== "none" ? iconRight : "Mail"
    usedIcons.add(singleIcon)
  } else {
    if (iconLeft  !== "none") usedIcons.add(iconLeft)
    if (iconRight !== "none") usedIcons.add(iconRight)
  }
  return usedIcons.size ? `import { ${[...usedIcons].join(", ")} } from "lucide-react"\n` : ""
}

export const buttonEntry = defineComponent<{
  children: string
  variant: string
  size: string
  iconLeft: string
  iconRight: string
  loading: boolean
  disabled: boolean
  invalid: boolean
}>({
  id: "button",
  name: "Button",
  description: {
    en: "Displays a button or a component that looks like a button.",
    es: "Muestra un botón o un componente que se parece a un botón.",
  },
  category: "Components",
  filePath: "components/ui/button.tsx",
  controls: {
    children:  { type: "text",    defaultValue: "Button" },
    variant:   { type: "select",  options: ["default","destructive","outline","secondary","ghost","link"], defaultValue: "default" },
    size:      { type: "select",  options: ["default","xs","sm","lg","icon","icon-xs","icon-sm","icon-lg"], defaultValue: "default" },
    iconLeft:  { type: "icon", defaultValue: "none" },
    iconRight: { type: "icon", defaultValue: "none" },
    loading:   { type: "boolean", defaultValue: false },
    disabled:  { type: "boolean", defaultValue: false },
    invalid:   { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { size, children, variant, disabled, loading, iconLeft, iconRight, invalid } = props
    const isIconSize = size.startsWith("icon")
    let content: React.ReactNode
    if (loading) {
      content = <><Loader2 className="animate-spin" />{!isIconSize && (children || "Button")}</>
    } else if (isIconSize) {
      const singleIcon = iconLeft !== "none" ? iconLeft : iconRight !== "none" ? iconRight : "Mail"
      content = <ButtonIcon name={singleIcon} />
    } else {
      content = (
        <>
          {iconLeft !== "none" && <ButtonIcon name={iconLeft} />}
          {children || "Button"}
          {iconRight !== "none" && <ButtonIcon name={iconRight} />}
        </>
      )
    }
    return (
      <Button size={size as React.ComponentProps<typeof Button>["size"]} variant={variant as React.ComponentProps<typeof Button>["variant"]}
        disabled={disabled || loading} aria-invalid={invalid ? "true" : undefined}>
        {content}
      </Button>
    )
  },
  generateCode: (props) => {
    const { children, size, variant, disabled, loading, iconLeft, iconRight, invalid } = props
    const isIconSize = size.startsWith("icon")
    const inner = buildButtonInner(loading, isIconSize, iconLeft, iconRight, children)
    const attrs = buildButtonAttrs(variant, size, disabled, loading, invalid)
    const attrStr = attrs.length === 0 ? "" : attrs.length === 1 ? ` ${attrs[0]}` : `\n  ${attrs.join("\n  ")}\n`
    const ml = attrs.length >= 2
    const tag = ml
      ? `<Button${attrStr}>${inner.startsWith("\n") ? inner : `\n  ${inner}\n`}</Button>`
      : `<Button${attrStr}>${inner}</Button>`
    const indented = tag.split("\n").map(l => `    ${l}`).join("\n")
    const iconImport = buildButtonIconImport(loading, isIconSize, iconLeft, iconRight)
    return `${iconImport}import { Button } from "@/components/ui/button"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
