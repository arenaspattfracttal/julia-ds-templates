"use client"

import {
  Home, ChevronDown, MessageCircle, ClipboardList, QrCode, WifiOff,
  Layers, UserRound, Network, ShieldCheck, FileText, DollarSign,
  Gauge, Activity, Target, Play, Users, TrendingUp, BarChart2,
  Monitor, LayoutDashboard, ClipboardCheck, Package,
  CircleDollarSign, BarChart3,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { FracttalOneLogo } from "./fracttal-one-logo"
import { translations, type Translation } from "../i18n"
import { useViewer } from "../viewer-context"

// ─── Types ────────────────────────────────────────────────────────────────────

type SidebarKey = keyof Translation["sidebar"]
type SubItem = { labelKey: SidebarKey; icon: LucideIcon }
type NavItem = { labelKey: SidebarKey; subItems?: SubItem[]; defaultOpen?: boolean }

// ─── Datos ────────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    labelKey: "catalogs",
    defaultOpen: false,
    subItems: [
      { labelKey: "assets",         icon: Layers    },
      { labelKey: "humanResources", icon: UserRound },
      { labelKey: "thirdParties",   icon: Network   },
    ],
  },
  { labelKey: "warehouses" },
  {
    labelKey: "tasks",
    defaultOpen: false,
    subItems: [
      { labelKey: "taskPlans",        icon: ClipboardList },
      { labelKey: "workOrders",       icon: FileText      },
      { labelKey: "budget",           icon: DollarSign    },
      { labelKey: "complianceSafety", icon: ShieldCheck   },
    ],
  },
  {
    labelKey: "monitoring",
    defaultOpen: false,
    subItems: [
      { labelKey: "meters",          icon: Gauge    },
      { labelKey: "fracttalSense",   icon: Activity },
      { labelKey: "fracttalOnboard", icon: Target   },
    ],
  },
  {
    labelKey: "automator",
    defaultOpen: false,
    subItems: [
      { labelKey: "events",      icon: Play  },
      { labelKey: "fracttalHub", icon: Users },
    ],
  },
  {
    labelKey: "businessIntelligence",
    defaultOpen: false,
    subItems: [
      { labelKey: "economicAnalysis",  icon: CircleDollarSign },
      { labelKey: "technicalAnalysis", icon: BarChart2        },
      { labelKey: "requestAnalysis",   icon: BarChart3        },
      { labelKey: "fracttalBI",        icon: TrendingUp       },
      { labelKey: "indicators",        icon: Monitor          },
      { labelKey: "dashboard",         icon: LayoutDashboard  },
    ],
  },
  { labelKey: "virtualDisk" },
  {
    labelKey: "requests",
    defaultOpen: false,
    subItems: [
      { labelKey: "workRequests",     icon: ClipboardCheck },
      { labelKey: "materialRequests", icon: Package        },
    ],
  },
]

// ─── Componente ───────────────────────────────────────────────────────────────

export function AppSidebar({ className }: { className?: string } = {}) {
  const t = translations[useViewer().lang]

  const quickAccess: { icon: LucideIcon; label: string }[] = [
    { icon: Home,    label: t.sidebar.quickHome    },
    { icon: QrCode,  label: t.sidebar.quickScanQR  },
    { icon: WifiOff, label: t.sidebar.quickOffline },
  ]

  return (
    <div className={`flex flex-col w-full max-w-[400px] h-full bg-background border-r${className ? ` ${className}` : ""}`}>

      {/* ── Logo ── */}
      <div className="h-20 shrink-0 flex items-center justify-center border-b">
        <FracttalOneLogo />
      </div>

      {/* ── Navegación (ScrollArea de Julia) ── */}
      <ScrollArea className="flex-1">

        {/* Accesos rápidos — contenedor propio */}
        <div className="flex justify-center gap-4 px-2 py-3">
          {quickAccess.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 w-[74px]">
              <Button variant="secondary" size="icon-lg">
                <Icon />
              </Button>
              <span className="text-xs font-medium leading-tight text-center text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Separator — hermano directo, sin padding lateral */}
        <Separator />

        {/* Items de navegación */}
        <div className="px-2 py-2 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {

            /* Leaf node — sin sub-ítems */
            if (!item.subItems) {
              return (
                <Button
                  key={item.labelKey}
                  variant="ghost"
                  className="w-full justify-start font-normal text-muted-foreground"
                >
                  {t.sidebar[item.labelKey]}
                </Button>
              )
            }

            /* Sección expandible */
            return (
              <Collapsible key={item.labelKey} defaultOpen={item.defaultOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group w-full justify-between font-normal text-muted-foreground"
                  >
                    <span>{t.sidebar[item.labelKey]}</span>
                    <ChevronDown className="size-4 shrink-0 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="flex flex-col gap-0.5 pb-1">
                    {item.subItems.map((sub) => (
                      <Button
                        key={sub.labelKey}
                        variant="ghost"
                        className="w-full justify-start font-normal text-foreground/80"
                      >
                        <sub.icon className="size-4 shrink-0 text-primary" />
                        {t.sidebar[sub.labelKey]}
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </div>

      </ScrollArea>

      {/* ── Footer ── */}
      <div className="shrink-0 flex flex-col border-t">
        <span className="px-4 pt-3 pb-1 text-[10px] font-medium text-muted-foreground/60 tracking-widest">
          {t.sidebar.onlineHelp}
        </span>
        <div className="flex gap-2 px-2 pb-3">
          <Button variant="secondary" className="flex-1">
            <MessageCircle />
            {t.sidebar.support}
          </Button>
          <Button variant="secondary" className="flex-1">
            <ClipboardList />
            {t.sidebar.createTicket}
          </Button>
        </div>
      </div>

    </div>
  )
}
