import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, LayoutTemplate } from "lucide-react"

interface Template {
  id: string
  title: string
  description: string
  category: string
  status: "ready" | "wip"
}

const templates: Template[] = [
  {
    id: "asset-list",
    title: "Listado de activos",
    description: "Vista de tabla con filtros, búsqueda y paginación para listados de activos.",
    category: "Listados",
    status: "wip",
  },
  {
    id: "work-order-form",
    title: "Formulario de OT",
    description: "Formulario completo para creación y edición de órdenes de trabajo.",
    category: "Formularios",
    status: "wip",
  },
  {
    id: "dashboard",
    title: "Dashboard KPIs",
    description: "Panel de métricas con gráficos, tarjetas de resumen y filtros de fecha.",
    category: "Dashboards",
    status: "wip",
  },
]

const categoryColors: Record<string, string> = {
  Listados: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Formularios: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Dashboards: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
}

export function TemplateGallery() {
  const [search, setSearch] = useState("")

  const filtered = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LayoutTemplate className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold leading-none">Julia DS Templates</h1>
              <p className="text-xs text-muted-foreground mt-1">Fracttal · React 19 + Tailwind v4 + shadcn/ui</p>
            </div>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar template..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Templates disponibles</h2>
          <p className="text-muted-foreground mt-1">
            {filtered.length} template{filtered.length !== 1 ? "s" : ""} · Añade los tuyos en{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">templates/</code>
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <LayoutTemplate className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No hay templates que coincidan con &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((template) => (
              <Card key={template.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    <Badge
                      variant="outline"
                      className={template.status === "ready" ? "border-green-500 text-green-600" : "border-orange-400 text-orange-500"}
                    >
                      {template.status === "ready" ? "Listo" : "En progreso"}
                    </Badge>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${categoryColors[template.category] ?? "bg-muted text-muted-foreground"}`}>
                    {template.category}
                  </span>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <CardDescription className="text-sm leading-relaxed">
                    {template.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full" disabled={template.status === "wip"}>
                    {template.status === "ready" ? "Ver template" : "Próximamente"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
