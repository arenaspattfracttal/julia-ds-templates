# Julia DS Templates — Reglas de proyecto

## Tablas

**Siempre usar `<DataTable>` para datos tabulares.** Nunca usar `<Table>` manual ni construir listas mobile a mano.

```tsx
import { DataTable, type ColumnDef } from "@/components/ui/data-table"

// Wrapper obligatorio
<div className="flex-1 overflow-hidden flex flex-col min-h-0">
  <DataTable
    columns={COLUMNS}
    data={DATA}
    border={false}
    resizable
    reorder
    rowSelection
    globalFilter
    columnToggle
    rowDensity
    onAdd={() => {}}
    onRefresh={() => {}}
    rowActions={(_row) => ( /* elipsis + dropdown */ )}
    onBulkDelete={() => {}}
    mobileView={isMobile}
  />
</div>
```

- `mobileView={isMobile}` activa la vista de tarjetas integrada — no crear listas mobile custom
- `rowActions` siempre: `EllipsisVertical` icon → `Tooltip > TooltipTrigger asChild > DropdownMenuTrigger asChild > Button variant="ghost" size="icon-xs"`
- Nunca múltiples botones de acción visibles en la fila (Eye/Pencil/Trash2 inline)

## Reglas generales Julia DS

- Solo átomos/componentes de `components/ui/` — nunca recrearlos
- Solo tokens semánticos, sin colores hardcoded (`#hex`, `bg-gray-*`, etc.)
- Topbar: siempre `<TopbarBar>` / `<TopbarBarMobile>`, nunca HTML manual
- Toolbar: `rounded-lg border bg-background p-3 shrink-0` — flotante, nunca pegada
- Botón Guardar en demos: siempre `disabled`
- Solo `lucide-react` para iconos (`size-3`, `size-3.5`, `size-4`, `size-5`)
