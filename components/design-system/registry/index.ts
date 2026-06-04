import type { ComponentEntry } from "../types"

import { accordionEntry } from "./accordion"
import { alertEntry } from "./alert"
import { alertDialogEntry } from "./alert-dialog"
import { sonnerEntry } from "./sonner"
import { dialogEntry } from "./dialog"
import { dropdownMenuEntry } from "./dropdown-menu"
import { breadcrumbEntry } from "./breadcrumb"
import { carouselEntry } from "./carousel"
import { avatarEntry } from "./avatar"
import { badgeEntry } from "./badge"
import { buttonEntry } from "./button"
import { buttonGroupEntry } from "./button-group"
import { calendarEntry } from "./calendar"
import { datePickerEntry } from "./date-picker"
import { checkboxEntry } from "./checkbox"
import { inputEntry } from "./input"
import { progressEntry } from "./progress"
import { radioGroupEntry } from "./radio-group"
import { selectEntry } from "./select"
import { sliderEntry } from "./slider"
import { switchEntry } from "./switch"
import { tabsEntry } from "./tabs"
import { textareaEntry } from "./textarea"
import { tooltipEntry } from "./tooltip"
import { toggleGroupEntry } from "./toggle-group"
import { cardEntry } from "./card"
import { collapsibleEntry } from "./collapsible"
import { hoverCardEntry } from "./hover-card"
import { paginationEntry } from "./pagination"
import { popoverEntry } from "./popover"
import { scrollAreaEntry } from "./scroll-area"
import { separatorEntry } from "./separator"
import { tableEntry } from "./table"
import { dataTableEntry } from "./data-table"
import { toggleEntry } from "./toggle"
import { skeletonEntry } from "./skeleton"
import { sidebarEntry } from "./sidebar"
import { treeEntry }   from "./tree"
import { dotsEntry }   from "./dots"

export const components: ComponentEntry[] = [
  accordionEntry,
  alertEntry,
  alertDialogEntry,
  sonnerEntry,
  dialogEntry,
  dropdownMenuEntry,
  breadcrumbEntry,
  carouselEntry,
  avatarEntry,
  badgeEntry,
  buttonEntry,
  buttonGroupEntry,
  calendarEntry,
  datePickerEntry,
  checkboxEntry,
  inputEntry,
  progressEntry,
  radioGroupEntry,
  selectEntry,
  sliderEntry,
  switchEntry,
  tabsEntry,
  textareaEntry,
  tooltipEntry,
  toggleGroupEntry,
  cardEntry,
  collapsibleEntry,
  hoverCardEntry,
  paginationEntry,
  popoverEntry,
  scrollAreaEntry,
  separatorEntry,
  tableEntry,
  dataTableEntry,
  toggleEntry,
  skeletonEntry,
  sidebarEntry,
  treeEntry,
  dotsEntry,
]

export const categorizedComponents = components.reduce<Record<string, ComponentEntry[]>>(
  (acc, comp) => {
    if (!acc[comp.category]) acc[comp.category] = []
    acc[comp.category].push(comp)
    return acc
  },
  {}
)
