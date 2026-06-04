import { defineComponent } from "../types"
import {
  Table, TableHeader, TableBody, TableFooter as TableFoot,
  TableHead, TableRow, TableCell, TableCaption,
} from "@/components/ui/table"

export const tableEntry = defineComponent<{
  rows: string
  showCaption: boolean
  showFooter: boolean
}>({
  id: "table",
  name: "Table",
  description: {
    en: "A responsive table component for displaying structured data.",
    es: "Un componente de tabla responsivo para mostrar datos estructurados.",
  },
  category: "Components",
  filePath: "components/ui/table.tsx",
  controls: {
    rows:        { type: "select",  options: ["3", "4", "5"], defaultValue: "4" },
    showCaption: { type: "boolean", defaultValue: false },
    showFooter:  { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { rows, showCaption, showFooter } = props
    const data = [
      { invoice: "INV-001", status: "Paid",    method: "Credit Card", amount: "$250.00" },
      { invoice: "INV-002", status: "Pending",  method: "PayPal",      amount: "$150.00" },
      { invoice: "INV-003", status: "Unpaid",   method: "Bank Transfer", amount: "$350.00" },
      { invoice: "INV-004", status: "Paid",    method: "Credit Card", amount: "$450.00" },
      { invoice: "INV-005", status: "Pending",  method: "PayPal",      amount: "$550.00" },
    ].slice(0, Number(rows))
    return (
      <Table>
        {showCaption && <TableCaption>A list of recent invoices.</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.invoice}>
              <TableCell className="font-medium">{row.invoice}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell className="text-right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {showFooter && (
          <TableFoot>
            <TableRow>
              <TableCell colSpan={3} className="font-medium">Total</TableCell>
              <TableCell className="text-right font-medium">$1,750.00</TableCell>
            </TableRow>
          </TableFoot>
        )}
      </Table>
    )
  },
  generateCode: (props) => {
    const { showCaption, showFooter } = props
    const parts = ["Table", "TableHeader", "TableBody", "TableHead", "TableRow", "TableCell"]
    if (showCaption) parts.push("TableCaption")
    if (showFooter)  parts.push("TableFooter")
    const captionLine = showCaption ? `\n  <TableCaption>A list of recent invoices.</TableCaption>` : ""
    const footerBlock = showFooter
      ? `\n  <TableFooter>\n    <TableRow>\n      <TableCell colSpan={3}>Total</TableCell>\n      <TableCell className="text-right">$1,750.00</TableCell>\n    </TableRow>\n  </TableFooter>`
      : ""
    return `import { ${parts.join(", ")} } from "@/components/ui/table"

export default function Example() {
  return (
    <Table>${captionLine}
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV-001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>${footerBlock}
    </Table>
  )
}`
  },
})
