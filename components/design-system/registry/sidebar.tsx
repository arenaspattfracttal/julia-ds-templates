import React from "react"
import { defineComponent } from "../types"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarInput, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard as LayoutDashboardIcon,
  Inbox,
  Calendar as CalendarIcon,
  FileText,
  BarChart2 as BarChart2Icon,
  Users,
  Settings,
} from "lucide-react"

export const sidebarEntry = defineComponent<{
  variant: "sidebar" | "floating" | "inset"
  side: "left" | "right"
  collapsible: "offcanvas" | "icon" | "none"
  defaultOpen: boolean
  showSearch: boolean
}>({
  id: "sidebar",
  name: "Sidebar",
  description: {
    en: "A composable, accessible sidebar component with collapsible, floating, and icon-only variants.",
    es: "Un componente de barra lateral composable y accesible con variantes colapsable, flotante y solo-icono.",
  },
  category: "Components",
  filePath: "components/ui/sidebar.tsx",
  controls: {
    variant:     { type: "select",  options: ["sidebar", "floating", "inset"], defaultValue: "sidebar" },
    side:        { type: "select",  options: ["left", "right"], defaultValue: "left" },
    collapsible: { type: "select",  options: ["offcanvas", "icon", "none"], defaultValue: "icon" },
    defaultOpen: { type: "boolean", defaultValue: true },
    showSearch:  { type: "boolean", defaultValue: true },
  },
  render: (props) => {
    const { variant, side, collapsible, defaultOpen, showSearch } = props

    const NAV_ITEMS = [
      { label: "Dashboard",  Icon: LayoutDashboardIcon, active: true  },
      { label: "Inbox",      Icon: Inbox,               active: false },
      { label: "Calendar",   Icon: CalendarIcon,        active: false },
      { label: "Documents",  Icon: FileText,            active: false },
      { label: "Reports",    Icon: BarChart2Icon,       active: false },
      { label: "Team",       Icon: Users,               active: false },
    ]

    const SidebarDemo = () => (
      <SidebarProvider
        key={`${variant}-${side}-${collapsible}-${defaultOpen}`}
        defaultOpen={defaultOpen}
        style={{ "--sidebar-width": "14rem" } as React.CSSProperties}
        className="!min-h-0 h-[380px] overflow-hidden rounded-lg border"
      >
        <Sidebar variant={variant} side={side} collapsible={collapsible} className="!h-full static">
          <SidebarHeader className="border-b">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold shrink-0">
                    JD
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-sm">Julia DS</span>
                    <span className="text-xs text-muted-foreground">Design System</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            {showSearch && (
              <div className="px-2 pb-1">
                <SidebarInput placeholder="Search…" />
              </div>
            )}
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map(({ label, Icon, active }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton isActive={active} tooltip={label}>
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          {collapsible === "icon" && <SidebarRail />}
        </Sidebar>
        <SidebarInset className="flex flex-col min-w-0">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <SidebarSeparator orientation="vertical" className="h-4" />
            <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
          </header>
          <div className="flex flex-1 flex-col gap-3 p-4 overflow-auto">
            <div className="grid grid-cols-2 gap-3">
              {["Total Users", "Revenue", "Orders", "Growth"].map((t) => (
                <div key={t} className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">{t}</p>
                  <p className="text-lg font-semibold mt-1">—</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border bg-card p-3 flex-1">
              <p className="text-xs text-muted-foreground mb-2">Recent activity</p>
              {["Deployed v2.1", "PR merged", "Issue closed"].map((item) => (
                <p key={item} className="text-sm py-1 border-b border-border last:border-0 text-muted-foreground">{item}</p>
              ))}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )

    return <SidebarDemo />
  },
  generateCode: (props) => {
    const { variant, side, collapsible, defaultOpen, showSearch } = props
    const variantAttr    = variant    !== "sidebar"   ? ` variant="${variant}"`       : ""
    const sideAttr       = side       !== "left"      ? ` side="${side}"`             : ""
    const collapsibleAttr= collapsible!== "offcanvas" ? ` collapsible="${collapsible}"`: ""
    const defaultOpenAttr= !defaultOpen               ? ` defaultOpen={false}`        : ""
    const searchBlock = showSearch
      ? `\n        <div className="px-2 pb-1"><SidebarInput placeholder="Search…" /></div>`
      : ""
    const railBlock = collapsible === "icon" ? "\n      <SidebarRail />" : ""
    return `import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarInput, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Settings } from "lucide-react"

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home },
  { label: "Settings",  icon: Settings },
]

export default function Example() {
  return (
    <SidebarProvider${defaultOpenAttr}>
      <Sidebar${variantAttr}${sideAttr}${collapsibleAttr}>
        <SidebarHeader>${searchBlock}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map(({ label, icon: Icon }) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton tooltip={label}>
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
        ${railBlock.trim()}
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <SidebarSeparator orientation="vertical" className="h-4" />
          <span>Dashboard</span>
        </header>
        {/* main content */}
      </SidebarInset>
    </SidebarProvider>
  )
}`
  },
})
