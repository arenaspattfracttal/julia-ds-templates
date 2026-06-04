import { defineComponent } from "../types"
import { DataTable, type ColumnDef } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"

// ─── Datos de demo ────────────────────────────────────────────────────────────

type Payment = {
  id:     string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email:  string
}

const DEMO_DATA: Payment[] = [
  { id: "m5gr84i9", amount: 316,  status: "success",    email: "ken99@yahoo.com"       },
  { id: "3u1reuv4", amount: 242,  status: "success",    email: "Abe45@gmail.com"        },
  { id: "derv1ws0", amount: 837,  status: "processing", email: "Monserrat44@gmail.com"  },
  { id: "5kma53ae", amount: 874,  status: "success",    email: "Silas22@gmail.com"      },
  { id: "bhqecj4p", amount: 721,  status: "failed",     email: "carmella@hotmail.com"   },
  { id: "p6hs8a7k", amount: 198,  status: "pending",    email: "natasha@example.com"    },
  { id: "x9qw2m1j", amount: 563,  status: "success",    email: "marcus@company.io"      },
  { id: "r4lz7n3t", amount: 445,  status: "processing", email: "sarah.j@domain.com"     },
  { id: "w2kd5p8y", amount: 1024, status: "failed",     email: "alex.dev@email.com"     },
  { id: "q8vb3m6n", amount: 89,   status: "pending",    email: "diana.prince@corp.com"  },
  { id: "h5nx9q2c", amount: 672,  status: "success",    email: "bruce.w@gmail.com"      },
  { id: "j7tc4r1m", amount: 310,  status: "processing", email: "clark.k@yahoo.com"      },
]

const STATUS_VARIANT: Record<Payment["status"], "success" | "warning" | "destructive" | "secondary"> = {
  success:    "success",
  processing: "warning",
  failed:     "destructive",
  pending:    "secondary",
}

const COLUMNS: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const s = row.getValue<Payment["status"]>("status")
      return <Badge variant={STATUS_VARIANT[s]} size="sm">{s}</Badge>
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-sm">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      return <span className="text-sm font-medium">${amount.toFixed(2)}</span>
    },
  },
]

// ─── Demo wrapper ─────────────────────────────────────────────────────────────

function DataTableDemo(props: {
  sorting:      boolean
  pagination:   boolean
  pageSize:     string
  emptyState:   boolean
  rowSelection: boolean
  globalFilter: boolean
  columnToggle: boolean
  striped:      boolean
  bordered:     boolean
}) {
  return (
    <div className="w-full max-w-2xl">
      <DataTable
        columns={COLUMNS}
        data={props.emptyState ? [] : DEMO_DATA}
        pageSize={Number(props.pageSize) || 5}
        pagination={props.pagination}
        sortable={props.sorting}
        rowSelection={props.rowSelection}
        globalFilter={props.globalFilter}
        columnToggle={props.columnToggle}
        striped={props.striped}
        bordered={props.bordered}
      />
    </div>
  )
}

// ─── Registry entry ───────────────────────────────────────────────────────────

export const dataTableEntry = defineComponent<{
  sorting:      boolean
  pagination:   boolean
  pageSize:     string
  emptyState:   boolean
  rowSelection: boolean
  globalFilter: boolean
  columnToggle: boolean
  striped:      boolean
  bordered:     boolean
}>({
  id: "data-table",
  name: "Data Table",
  description: {
    en: "Powerful table component built with TanStack Table. Supports sorting, filtering, pagination, row selection and column visibility.",
    es: "Tabla avanzada construida con TanStack Table. Soporta ordenación, búsqueda global, paginación, selección de filas y visibilidad de columnas.",
  },
  category: "Components",
  filePath: "components/ui/data-table.tsx",
  controls: {
    sorting:      { type: "boolean", defaultValue: true  },
    pagination:   { type: "boolean", defaultValue: true  },
    pageSize:     { type: "select",  options: ["5","10","20"], defaultValue: "5" },
    emptyState:   { type: "boolean", defaultValue: false },
    rowSelection: { type: "boolean", defaultValue: false },
    globalFilter: { type: "boolean", defaultValue: true  },
    columnToggle: { type: "boolean", defaultValue: true  },
    striped:      { type: "boolean", defaultValue: false },
    bordered:     { type: "boolean", defaultValue: false },
  },
  render:          (props) => <DataTableDemo {...props} />,
  compositorRender:(props) => <DataTableDemo {...props} />,
  generateCode: ({ pageSize, pagination, sorting, rowSelection, globalFilter, columnToggle, striped, bordered }) => `import { DataTable, type ColumnDef } from "@/components/ui/data-table"

type Payment = { id: string; amount: number; status: string; email: string }

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Estado" },
  { accessorKey: "email",  header: "Email"  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => \`$\${parseFloat(row.getValue("amount")).toFixed(2)}\`,
  },
]

export default function Example() {
  return (
    <DataTable
      columns={columns}
      data={data}
      pageSize={${pageSize}}
      pagination={${pagination}}
      sortable={${sorting}}
      rowSelection={${rowSelection}}
      globalFilter={${globalFilter}}
      columnToggle={${columnToggle}}
      striped={${striped}}
      bordered={${bordered}}
    />
  )
}`,
})
