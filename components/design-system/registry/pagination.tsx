import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis,
} from "@/components/ui/pagination"
import { defineComponent } from "../types"

export const paginationEntry = defineComponent<{
  currentPage: string
  totalPages: string
  showPrevNext: boolean
  showEllipsis: boolean
}>({
  id: "pagination",
  name: "Pagination",
  description: {
    en: "Pagination with page navigation, previous and next links.",
    es: "Paginación con navegación de páginas y enlaces anterior/siguiente.",
  },
  category: "Components",
  filePath: "components/ui/pagination.tsx",
  controls: {
    currentPage:  { type: "select",  options: ["1", "2", "3", "4", "5"], defaultValue: "3" },
    totalPages:   { type: "select",  options: ["5", "7", "10"],          defaultValue: "7" },
    showPrevNext: { type: "boolean", defaultValue: true },
    showEllipsis: { type: "boolean", defaultValue: true },
  },
  render: (props) => {
    const { currentPage, totalPages, showPrevNext, showEllipsis } = props
    const cur   = Number(currentPage)
    const total = Number(totalPages)
    const pages = Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1)
    return (
      <Pagination>
        <PaginationContent>
          {showPrevNext && (
            <PaginationItem>
              <PaginationPrevious href="#" aria-disabled={cur === 1} />
            </PaginationItem>
          )}
          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink href="#" isActive={p === cur}>{p}</PaginationLink>
            </PaginationItem>
          ))}
          {showEllipsis && total > 5 && (
            <PaginationItem><PaginationEllipsis /></PaginationItem>
          )}
          {showPrevNext && (
            <PaginationItem>
              <PaginationNext href="#" aria-disabled={cur === total} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    )
  },
  generateCode: (props) => {
    const { currentPage, showPrevNext, showEllipsis } = props
    const cur = Number(currentPage)
    const pages = [1, 2, 3, 4, 5]
    const pageItems = pages.map((p) =>
      `      <PaginationItem>\n        <PaginationLink href="#"${p === cur ? " isActive" : ""}>${p}</PaginationLink>\n      </PaginationItem>`
    ).join("\n")
    const prevItem = showPrevNext ? `      <PaginationItem>\n        <PaginationPrevious href="#" />\n      </PaginationItem>\n` : ""
    const nextItem = showPrevNext ? `\n      <PaginationItem>\n        <PaginationNext href="#" />\n      </PaginationItem>` : ""
    const ellipsisItem = showEllipsis ? `\n      <PaginationItem><PaginationEllipsis /></PaginationItem>` : ""
    const imports = ["Pagination", "PaginationContent", "PaginationItem", "PaginationLink"]
    if (showPrevNext) imports.push("PaginationPrevious", "PaginationNext")
    if (showEllipsis) imports.push("PaginationEllipsis")
    return `import { ${imports.join(", ")} } from "@/components/ui/pagination"

export default function Example() {
  return (
    <Pagination>
      <PaginationContent>
${prevItem}${pageItems}${ellipsisItem}${nextItem}
      </PaginationContent>
    </Pagination>
  )
}`
  },
})
