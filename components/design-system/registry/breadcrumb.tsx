import React from "react"
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
import { defineComponent } from "../types"

export const breadcrumbEntry = defineComponent<{
  appearance: string
  itemCount: string
  separator: string
  showEllipsis: boolean
}>({
  id: "breadcrumb",
  name: "Breadcrumb",
  description: {
    en: "Displays the current page's location within a navigational hierarchy.",
    es: "Muestra la ubicación de la página actual dentro de una jerarquía de navegación.",
  },
  category: "Components",
  filePath: "components/ui/breadcrumb.tsx",
  controls: {
    appearance:   { type: "select",  options: ["chips", "default"],  defaultValue: "chips" },
    itemCount:    { type: "select",  options: ["2", "3", "4", "5"], defaultValue: "4" },
    separator:    { type: "select",  options: ["chevron", "slash"],  defaultValue: "chevron" },
    showEllipsis: { type: "boolean", defaultValue: false },
  },
  cascade: (key, value) => {
    if (key === "showEllipsis" && value === true) return { itemCount: "4" }
    return {}
  },
  controlVisible: (key, props) => {
    if (key === "showEllipsis") return Number(props.itemCount) >= 3
    return true
  },
  render: (props) => {
    const { appearance, itemCount, separator, showEllipsis } = props
    const isChips = appearance === "chips"
    const count = Number(itemCount)
    const ALL_ITEMS = ["Home", "Documents", "Projects", "Design", "Current"]
    const items = ALL_ITEMS.slice(0, count)
    const chip         = isChips ? "bg-muted px-2 py-0.5 rounded-md" : undefined
    const chipEllipsis = isChips ? "bg-muted px-2 py-1 rounded-md size-auto" : undefined
    const Sep = () => separator === "slash"
      ? <BreadcrumbSeparator><span>/</span></BreadcrumbSeparator>
      : <BreadcrumbSeparator />

    if (showEllipsis && count >= 3) {
      const lastTwo = items.slice(-2)
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className={chip}>{items[0]}</BreadcrumbLink>
            </BreadcrumbItem>
            <Sep />
            <BreadcrumbItem><BreadcrumbEllipsis className={chipEllipsis} /></BreadcrumbItem>
            <Sep />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className={chip}>{lastTwo[0]}</BreadcrumbLink>
            </BreadcrumbItem>
            <Sep />
            <BreadcrumbItem>
              <BreadcrumbPage className={chip}>{lastTwo[1]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
    }

    return (
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && <Sep />}
              <BreadcrumbItem>
                {i < items.length - 1
                  ? <BreadcrumbLink href="#" className={chip}>{item}</BreadcrumbLink>
                  : <BreadcrumbPage className={chip}>{item}</BreadcrumbPage>
                }
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    )
  },
  generateCode: (props) => {
    const { appearance, itemCount, separator, showEllipsis } = props
    const isChips = appearance === "chips"
    const count = Number(itemCount)
    const ALL_ITEMS = ["Home", "Documents", "Projects", "Design", "Current"]
    const items = ALL_ITEMS.slice(0, count)
    const needsEllipsis = showEllipsis && count >= 3

    const sepTag = separator === "slash"
      ? `<BreadcrumbSeparator><span>/</span></BreadcrumbSeparator>`
      : `<BreadcrumbSeparator />`

    const imports = [
      "Breadcrumb", "BreadcrumbList", "BreadcrumbItem", "BreadcrumbLink",
      "BreadcrumbPage", "BreadcrumbSeparator",
      ...(needsEllipsis ? ["BreadcrumbEllipsis"] : []),
    ].join(", ")

    const chip         = isChips ? ` className="bg-muted px-2 py-0.5 rounded-md"` : ""
    const chipEllipsis = isChips ? ` className="bg-muted px-2 py-1 rounded-md size-auto"` : ""

    let itemsJSX: string
    if (needsEllipsis) {
      const lastTwo = items.slice(-2)
      itemsJSX = [
        `      <BreadcrumbItem>`,
        `        <BreadcrumbLink href="#"${chip}>${items[0]}</BreadcrumbLink>`,
        `      </BreadcrumbItem>`,
        `      ${sepTag}`,
        `      <BreadcrumbItem><BreadcrumbEllipsis${chipEllipsis} /></BreadcrumbItem>`,
        `      ${sepTag}`,
        `      <BreadcrumbItem>`,
        `        <BreadcrumbLink href="#"${chip}>${lastTwo[0]}</BreadcrumbLink>`,
        `      </BreadcrumbItem>`,
        `      ${sepTag}`,
        `      <BreadcrumbItem>`,
        `        <BreadcrumbPage${chip}>${lastTwo[1]}</BreadcrumbPage>`,
        `      </BreadcrumbItem>`,
      ].join("\n")
    } else {
      itemsJSX = items.map((item, i) => {
        const content = i < items.length - 1
          ? `        <BreadcrumbLink href="#"${chip}>${item}</BreadcrumbLink>`
          : `        <BreadcrumbPage${chip}>${item}</BreadcrumbPage>`
        const sep = i > 0 ? `      ${sepTag}\n` : ""
        return `${sep}      <BreadcrumbItem>\n${content}\n      </BreadcrumbItem>`
      }).join("\n")
    }

    return `import { ${imports} } from "@/components/ui/breadcrumb"

export default function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
${itemsJSX}
      </BreadcrumbList>
    </Breadcrumb>
  )
}`
  },
})
