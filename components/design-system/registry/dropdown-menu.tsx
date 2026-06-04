import React from "react"
import {
  User, CreditCard, Settings, Users, UserPlus, Plus, LogOut, Trash2,
  LayoutGrid, Activity, PanelLeft, PanelTop, PanelBottom, PanelRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger,
  DropdownMenuSubContent, DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { defineComponent } from "../types"

interface DropdownCheckboxesMenuProps {
  trigger: string; side: "bottom"|"top"|"left"|"right"; align: "start"|"center"|"end"
  showLabel: boolean; showIcons: boolean
}

function DropdownCheckboxesMenu({ trigger, side, align, showLabel, showIcons }: DropdownCheckboxesMenuProps) {
  const [showStatus, setShowStatus] = React.useState(true)
  const [showPanel, setShowPanel] = React.useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{trigger || "Open menu"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className="w-48">
        <DropdownMenuGroup>
          {showLabel && <DropdownMenuLabel>View options</DropdownMenuLabel>}
          <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
            {showIcons && <LayoutGrid />}
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
            {showIcons && <Activity />}
            Activity panel
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked disabled>
            {showIcons && <PanelLeft />}
            Sidebar (locked)
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DropdownRadioMenuProps {
  trigger: string; side: "bottom"|"top"|"left"|"right"; align: "start"|"center"|"end"
  showLabel: boolean; showIcons: boolean
}

function DropdownRadioMenu({ trigger, side, align, showLabel, showIcons }: DropdownRadioMenuProps) {
  const [position, setPosition] = React.useState("bottom")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{trigger || "Open menu"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className="w-44">
        <DropdownMenuGroup>
          {showLabel && <DropdownMenuLabel>Panel position</DropdownMenuLabel>}
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">
              {showIcons && <PanelTop />}
              Top
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">
              {showIcons && <PanelBottom />}
              Bottom
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">
              {showIcons && <PanelRight />}
              Right
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DropdownSubmenuMenuProps {
  trigger: string; side: "bottom"|"top"|"left"|"right"; align: "start"|"center"|"end"
  showLabel: boolean; showIcons: boolean; destructive: boolean
}

function DropdownSubmenuMenu({ trigger, side, align, showLabel, showIcons, destructive }: DropdownSubmenuMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{trigger || "Open menu"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className="w-48">
        <DropdownMenuGroup>
          {showLabel && <DropdownMenuLabel>My account</DropdownMenuLabel>}
          <DropdownMenuItem>
            {showIcons && <User />}
            Profile
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {showIcons && <Settings />}
              More options
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                {showIcons && <Settings />}
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                {showIcons && <CreditCard />}
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                {showIcons && <Users />}
                Team
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        {destructive && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              {showIcons && <Trash2 />}
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DropdownDefaultMenuProps {
  trigger: string; side: "bottom"|"top"|"left"|"right"; align: "start"|"center"|"end"
  showLabel: boolean; showIcons: boolean; showShortcuts: boolean; destructive: boolean
}

interface DefaultMenuItemProps {
  icon: React.ReactNode; label: string; shortcut?: string
  disabled?: boolean; variant?: "destructive"; showIcons: boolean; showShortcuts: boolean
}

function DefaultMenuItem({ icon, label, shortcut, disabled, variant, showIcons, showShortcuts }: DefaultMenuItemProps) {
  return (
    <DropdownMenuItem disabled={disabled} variant={variant}>
      {showIcons && icon}
      {label}
      {showShortcuts && shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
    </DropdownMenuItem>
  )
}

function DropdownDefaultMenu({ trigger, side, align, showLabel, showIcons, showShortcuts, destructive }: DropdownDefaultMenuProps) {
  const label = trigger || "Open menu"
  const si = showIcons
  const ss = showShortcuts
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className="w-52">
        <DropdownMenuGroup>
          {showLabel && <DropdownMenuLabel>My account</DropdownMenuLabel>}
          <DefaultMenuItem icon={<User />} label="Profile" shortcut="⇧⌘P" showIcons={si} showShortcuts={ss} />
          <DefaultMenuItem icon={<CreditCard />} label="Billing" shortcut="⌘B" showIcons={si} showShortcuts={ss} />
          <DefaultMenuItem icon={<Settings />} label="Settings" shortcut="⌘S" showIcons={si} showShortcuts={ss} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DefaultMenuItem icon={<Users />} label="Team" showIcons={si} showShortcuts={ss} />
          <DefaultMenuItem icon={<UserPlus />} label="Invite users" shortcut="⌘I" disabled showIcons={si} showShortcuts={ss} />
          <DefaultMenuItem icon={<Plus />} label="New team" shortcut="⌘T" showIcons={si} showShortcuts={ss} />
        </DropdownMenuGroup>
        {destructive && (
          <>
            <DropdownMenuSeparator />
            <DefaultMenuItem icon={<LogOut />} label="Log out" shortcut="⇧⌘Q" variant="destructive" showIcons={si} showShortcuts={ss} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function buildDropdownCheckboxesCode(trigger: string, contentAttrs: string, showLabel: boolean, showIcons: boolean, icon: (n: string) => string): string {
  const iconImport = showIcons ? `\nimport { LayoutGrid, Activity, PanelLeft } from "lucide-react"` : ""
  const labelBlock = showLabel ? `\n        <DropdownMenuLabel>View options</DropdownMenuLabel>` : ""
  return `"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuLabel, DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"${iconImport}

export default function Example() {
  const [showStatus, setShowStatus] = useState(true)
  const [showPanel, setShowPanel] = useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">${trigger || "Open menu"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>${labelBlock}
          <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>${icon("LayoutGrid")}
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>${icon("Activity")}
            Activity panel
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked disabled>${icon("PanelLeft")}
            Sidebar (locked)
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`
}

function buildDropdownRadioCode(trigger: string, showLabel: boolean, showIcons: boolean): string {
  const radioIconImport = showIcons ? `\nimport { PanelTop, PanelBottom, PanelRight } from "lucide-react"` : ""
  const ri = (name: string) => showIcons ? `\n            <${name} />` : ""
  return `"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"${radioIconImport}

export default function Example() {
  const [position, setPosition] = useState("bottom")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">${trigger || "Open menu"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>${showLabel ? `\n          <DropdownMenuLabel>Panel position</DropdownMenuLabel>` : ""}
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">${ri("PanelTop")}
              Top
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">${ri("PanelBottom")}
              Bottom
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">${ri("PanelRight")}
              Right
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`
}

function buildDropdownSubmenuCode(trigger: string, contentAttrs: string, showLabel: boolean, showIcons: boolean, destructive: boolean, icon: (n: string) => string): string {
  const iconImport = showIcons ? `\nimport { User, Settings, CreditCard, Users, Trash2 } from "lucide-react"` : ""
  const labelBlock = showLabel ? `\n        <DropdownMenuLabel>My account</DropdownMenuLabel>` : ""
  const destructiveBlock = destructive
    ? `\n      <DropdownMenuSeparator />\n      <DropdownMenuItem variant="destructive">${icon("Trash2")}\n        Delete\n      </DropdownMenuItem>`
    : ""
  const subImports = ["DropdownMenu", "DropdownMenuTrigger", "DropdownMenuContent",
    "DropdownMenuGroup", showLabel && "DropdownMenuLabel",
    "DropdownMenuItem", "DropdownMenuSeparator",
    "DropdownMenuSub", "DropdownMenuSubTrigger", "DropdownMenuSubContent",
  ].filter(Boolean).join(", ")
  return `import { Button } from "@/components/ui/button"
import {
  ${subImports}
} from "@/components/ui/dropdown-menu"${iconImport}

export default function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">${trigger || "Open menu"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent${contentAttrs ? ` ${contentAttrs}` : ""} className="w-48">
        <DropdownMenuGroup>${labelBlock}
          <DropdownMenuItem>${icon("User")}
            Profile
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>${icon("Settings")}
              More options
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>${icon("Settings")}
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>${icon("CreditCard")}
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>${icon("Users")}
                Team
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>${destructiveBlock}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`
}

function buildDropdownDefaultCode(trigger: string, contentAttrs: string, showLabel: boolean, showIcons: boolean, showShortcuts: boolean, destructive: boolean, icon: (n: string) => string, sc: (s: string) => string): string {
  const iconImport = showIcons ? `\nimport { User, CreditCard, Settings, Users, UserPlus, Plus, LogOut } from "lucide-react"` : ""
  const labelBlock = showLabel ? `\n        <DropdownMenuLabel>My account</DropdownMenuLabel>` : ""
  const destructiveBlock = destructive
    ? `\n      <DropdownMenuSeparator />\n      <DropdownMenuItem variant="destructive">${icon("LogOut")}\n        Log out${sc("⇧⌘Q")}\n      </DropdownMenuItem>`
    : ""
  const imports = ["DropdownMenu", "DropdownMenuTrigger", "DropdownMenuContent",
    "DropdownMenuGroup", showLabel && "DropdownMenuLabel",
    "DropdownMenuItem", destructive && "DropdownMenuSeparator",
    showShortcuts && "DropdownMenuShortcut",
  ].filter(Boolean).join(", ")
  return `import { Button } from "@/components/ui/button"
import {
  ${imports}
} from "@/components/ui/dropdown-menu"${iconImport}

export default function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">${trigger || "Open menu"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent${contentAttrs ? ` ${contentAttrs}` : ""} className="w-52">
        <DropdownMenuGroup>${labelBlock}
          <DropdownMenuItem>${icon("User")}
            Profile${sc("⇧⌘P")}
          </DropdownMenuItem>
          <DropdownMenuItem>${icon("CreditCard")}
            Billing${sc("⌘B")}
          </DropdownMenuItem>
          <DropdownMenuItem>${icon("Settings")}
            Settings${sc("⌘S")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>${icon("Users")}
            Team
          </DropdownMenuItem>
          <DropdownMenuItem disabled>${icon("UserPlus")}
            Invite users${sc("⌘I")}
          </DropdownMenuItem>
          <DropdownMenuItem>${icon("Plus")}
            New team${sc("⌘T")}
          </DropdownMenuItem>
        </DropdownMenuGroup>${destructiveBlock}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`
}

export const dropdownMenuEntry = defineComponent<{
  trigger: string
  variant: string
  side: "bottom" | "top" | "left" | "right"
  align: "start" | "center" | "end"
  showShortcuts: boolean
  showIcons: boolean
  showLabel: boolean
  destructive: boolean
}>({
  id: "dropdown-menu",
  name: "Dropdown Menu",
  description: {
    en: "Displays a menu to the user — triggered by a button — with support for items, groups, submenus, shortcuts, checkboxes, and radio items.",
    es: "Muestra un menú al usuario — activado por un botón — con soporte para items, grupos, submenús, atajos, checkboxes e items de radio.",
  },
  category: "Components",
  filePath: "components/ui/dropdown-menu.tsx",
  controls: {
    trigger:      { type: "text",    defaultValue: "Open menu" },
    variant:      { type: "select",  options: ["default", "checkboxes", "radio", "submenu"], defaultValue: "default" },
    side:         { type: "select",  options: ["bottom", "top", "left", "right"], defaultValue: "bottom" },
    align:        { type: "select",  options: ["start", "center", "end"], defaultValue: "start" },
    showShortcuts:{ type: "boolean", defaultValue: true },
    showIcons:    { type: "boolean", defaultValue: false },
    showLabel:    { type: "boolean", defaultValue: true },
    destructive:  { type: "boolean", defaultValue: true },
  },
  render: (props) => {
    const { trigger, variant, side, align, showShortcuts, showIcons, showLabel, destructive } = props
    if (variant === "checkboxes") return <DropdownCheckboxesMenu trigger={trigger} side={side} align={align} showLabel={showLabel} showIcons={showIcons} />
    if (variant === "radio") return <DropdownRadioMenu trigger={trigger} side={side} align={align} showLabel={showLabel} showIcons={showIcons} />
    if (variant === "submenu") return <DropdownSubmenuMenu trigger={trigger} side={side} align={align} showLabel={showLabel} showIcons={showIcons} destructive={destructive} />
    return <DropdownDefaultMenu trigger={trigger} side={side} align={align} showLabel={showLabel} showIcons={showIcons} showShortcuts={showShortcuts} destructive={destructive} />
  },
  generateCode: (props) => {
    const { trigger, variant, side, align, showShortcuts, showIcons, showLabel, destructive } = props
    const contentAttrs = [
      side !== "bottom" && `side="${side}"`,
      align !== "start" && `align="${align}"`,
    ].filter(Boolean).join(" ")
    const icon = (name: string) => showIcons ? `\n          <${name} />` : ""
    const sc = (s: string) => showShortcuts ? `\n          <DropdownMenuShortcut>${s}</DropdownMenuShortcut>` : ""

    if (variant === "checkboxes") return buildDropdownCheckboxesCode(trigger, contentAttrs, showLabel, showIcons, icon)
    if (variant === "radio") return buildDropdownRadioCode(trigger, showLabel, showIcons)
    if (variant === "submenu") return buildDropdownSubmenuCode(trigger, contentAttrs, showLabel, showIcons, destructive, icon)
    return buildDropdownDefaultCode(trigger, contentAttrs, showLabel, showIcons, showShortcuts, destructive, icon, sc)
  },
})
