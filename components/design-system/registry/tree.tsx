import { Folder, FileText, File, Settings, Users, Database } from "lucide-react"
import { defineComponent } from "../types"
import { Tree, type TreeNode } from "@/components/ui/tree"

const SAMPLE_DATA: TreeNode[] = [
  {
    id: "1",
    label: "Activos",
    icon: Database,
    children: [
      {
        id: "1-1",
        label: "Equipos",
        icon: Folder,
        children: [
          { id: "1-1-1", label: "Refrigerador industrial", icon: File },
          { id: "1-1-2", label: "Compresor central",       icon: File },
          { id: "1-1-3", label: "Generador de respaldo",   icon: File },
        ],
      },
      {
        id: "1-2",
        label: "Instalaciones",
        icon: Folder,
        children: [
          { id: "1-2-1", label: "Planta Norte", icon: File },
          { id: "1-2-2", label: "Planta Sur",   icon: File },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Configuración",
    icon: Settings,
    children: [
      { id: "2-1", label: "General",   icon: FileText },
      { id: "2-2", label: "Usuarios",  icon: Users    },
      { id: "2-3", label: "Seguridad", icon: FileText },
    ],
  },
]

export const treeEntry = defineComponent<{
  showIcons: boolean
  twoLines:  boolean
  bordered:  boolean
}>({
  id: "tree",
  name: "Tree",
  description: {
    en: "Hierarchical tree view with expand/collapse and selection.",
    es: "Vista de árbol jerárquica con expansión, colapso y selección.",
  },
  category: "Display",
  filePath: "components/ui/tree.tsx",
  previewWidth: 320,
  controls: {
    showIcons: { type: "boolean", defaultValue: true  },
    twoLines:  { type: "boolean", defaultValue: false },
    bordered:  { type: "boolean", defaultValue: true  },
  },
  render: (props) => {
    const baseData: TreeNode[] = props.twoLines
      ? [
          {
            id: "1", label: "Activos", icon: Database,
            description: "Gestión de activos físicos",
            children: [
              { id: "1-1", label: "Equipos",       icon: Folder,   description: "Maquinaria y equipos",
                children: [
                  { id: "1-1-1", label: "Refrigerador industrial", icon: File, description: "Activo #RF-001" },
                  { id: "1-1-2", label: "Compresor central",       icon: File, description: "Activo #CP-002" },
                ],
              },
              { id: "1-2", label: "Instalaciones", icon: Folder,   description: "Infraestructura física" },
            ],
          },
          { id: "2", label: "Configuración", icon: Settings, description: "Ajustes del sistema",
            children: [
              { id: "2-1", label: "General",   icon: FileText, description: "Parámetros generales" },
              { id: "2-2", label: "Usuarios",  icon: Users,    description: "Cuentas de acceso"    },
            ],
          },
        ]
      : SAMPLE_DATA

    const data: TreeNode[] = props.showIcons
      ? baseData
      : JSON.parse(JSON.stringify(baseData, (k, v) => k === "icon" ? undefined : v))

    return (
      <Tree
        data={data}
        defaultExpandedIds={["1", "1-1", "1-2", "2"]}
        bordered={props.bordered}
        onOpen={(id) => console.log("Abrir activo:", id)}
        className="w-[280px] h-64"
      />
    )
  },
  generateCode: () => `import { Tree } from "@/components/ui/tree"
import { Folder, File, Settings } from "lucide-react"

const data = [
  {
    id: "1",
    label: "Activos",
    icon: Folder,
    children: [
      { id: "1-1", label: "Equipos",       icon: Folder, children: [
        { id: "1-1-1", label: "Refrigerador", icon: File },
      ]},
    ],
  },
  { id: "2", label: "Configuración", icon: Settings },
]

export default function Example() {
  return (
    <div className="w-64 rounded-lg border bg-background">
      <Tree data={data} defaultExpandedIds={["1"]} />
    </div>
  )
}`,
})
