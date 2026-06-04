export type ColorSwatch = {
  /** Display name shown below the chip */
  name: string
  /** CSS variable name, e.g. "--primary" */
  variable: string
  /** Optional short description */
  description?: string
}

export type ColorGroup = {
  id: string
  name: string
  swatches: ColorSwatch[]
}

export const colorGroups: ColorGroup[] = [
  {
    id: "base",
    name: "Base",
    swatches: [
      { name: "Background",  variable: "--background",  description: "Page background" },
      { name: "Foreground",  variable: "--foreground",  description: "Default text" },
    ],
  },
  {
    id: "primary",
    name: "Primary",
    swatches: [
      { name: "Primary",            variable: "--primary" },
      { name: "Primary Foreground", variable: "--primary-foreground" },
    ],
  },
  {
    id: "secondary",
    name: "Secondary",
    swatches: [
      { name: "Secondary",            variable: "--secondary" },
      { name: "Secondary Foreground", variable: "--secondary-foreground" },
    ],
  },
  {
    id: "muted",
    name: "Muted",
    swatches: [
      { name: "Muted",            variable: "--muted" },
      { name: "Muted Foreground", variable: "--muted-foreground" },
    ],
  },
  {
    id: "accent",
    name: "Accent",
    swatches: [
      { name: "Accent",            variable: "--accent" },
      { name: "Accent Foreground", variable: "--accent-foreground" },
    ],
  },
  {
    id: "destructive",
    name: "Destructive",
    swatches: [
      { name: "Destructive",            variable: "--destructive" },
      { name: "Destructive Foreground", variable: "--destructive-foreground" },
    ],
  },
  {
    id: "card",
    name: "Card",
    swatches: [
      { name: "Card",            variable: "--card" },
      { name: "Card Foreground", variable: "--card-foreground" },
    ],
  },
  {
    id: "popover",
    name: "Popover",
    swatches: [
      { name: "Popover",            variable: "--popover" },
      { name: "Popover Foreground", variable: "--popover-foreground" },
    ],
  },
  {
    id: "utility",
    name: "Utility",
    swatches: [
      { name: "Border", variable: "--border", description: "Component borders" },
      { name: "Input",  variable: "--input",  description: "Input borders" },
      { name: "Ring",   variable: "--ring",   description: "Focus ring" },
    ],
  },
  {
    id: "charts",
    name: "Charts",
    swatches: [
      { name: "Chart 1", variable: "--chart-1" },
      { name: "Chart 2", variable: "--chart-2" },
      { name: "Chart 3", variable: "--chart-3" },
      { name: "Chart 4", variable: "--chart-4" },
      { name: "Chart 5", variable: "--chart-5" },
    ],
  },
  {
    id: "status",
    name: "Status",
    swatches: [
      { name: "Warning",             variable: "--warning" },
      { name: "Warning Foreground",  variable: "--warning-foreground" },
      { name: "Success",             variable: "--success" },
      { name: "Success Foreground",  variable: "--success-foreground" },
      { name: "Info",                variable: "--info" },
      { name: "Info Foreground",     variable: "--info-foreground" },
    ],
  },
]
