export interface ApiProp {
  prop: string
  type: string
  default?: string
  description: string
  required?: boolean
}

export const API_REFERENCE: Record<string, ApiProp[]> = {
  "button-group": [
    {
      prop: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Direction in which buttons are stacked.",
    },
    {
      prop: "className",
      type: "string",
      description: "Additional CSS classes for the group container.",
    },
    {
      prop: "children",
      type: "React.ReactNode",
      description: "Button, ButtonGroupSeparator, or ButtonGroupText elements.",
    },
    {
      prop: "ButtonGroupSeparator · orientation",
      type: '"horizontal" | "vertical"',
      default: '"vertical"',
      description: "Orientation of the separator line between buttons.",
    },
    {
      prop: "ButtonGroupText · asChild",
      type: "boolean",
      default: "false",
      description: "Merge props onto the immediate child element.",
    },
  ],

  carousel: [
    {
      prop: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Direction the carousel scrolls.",
    },
    {
      prop: "opts",
      type: "EmblaOptionsType",
      description: "Embla Carousel options object (e.g. { loop: true, align: 'start' }).",
    },
    {
      prop: "plugins",
      type: "EmblaPluginType[]",
      description: "Array of Embla plugin instances (e.g. Autoplay).",
    },
    {
      prop: "setApi",
      type: "(api: CarouselApi) => void",
      description: "Callback to obtain the Embla carousel API instance for programmatic control.",
    },
    {
      prop: "CarouselItem · className",
      type: "string",
      description: "Sizing classes for each slide, e.g. basis-1/2 or basis-1/3 for multi-item layouts.",
    },
    {
      prop: "CarouselPrevious · variant",
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      default: '"outline"',
      description: "Button variant for the previous arrow.",
    },
    {
      prop: "CarouselNext · variant",
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      default: '"outline"',
      description: "Button variant for the next arrow.",
    },
    {
      prop: "className",
      type: "string",
      description: "Additional CSS classes for the Carousel root element.",
    },
  ],

  breadcrumb: [
    {
      prop: "Breadcrumb · aria-label",
      type: "string",
      default: '"breadcrumb"',
      description: "Accessible label for the navigation landmark.",
    },
    {
      prop: "BreadcrumbLink · href",
      type: "string",
      description: "URL the breadcrumb link navigates to.",
    },
    {
      prop: "BreadcrumbLink · asChild",
      type: "boolean",
      default: "false",
      description: "Merge props onto the immediate child element (e.g. a router Link).",
    },
    {
      prop: "BreadcrumbSeparator · children",
      type: "React.ReactNode",
      description: "Custom separator node. Defaults to a ChevronRight icon.",
    },
    {
      prop: "className",
      type: "string",
      description: "Additional CSS classes applied to any sub-component.",
    },
  ],

  accordion: [
    {
      prop: "type",
      type: '"single" | "multiple"',
      required: true,
      description: "Whether one or multiple items can be open at a time.",
    },
    {
      prop: "value",
      type: "string | string[]",
      description: "Controlled open state. Use with onValueChange.",
    },
    {
      prop: "defaultValue",
      type: "string | string[]",
      description: "Uncontrolled initial open item(s).",
    },
    {
      prop: "onValueChange",
      type: "(value: string | string[]) => void",
      description: "Callback fired when the open state changes.",
    },
    {
      prop: "collapsible",
      type: "boolean",
      default: "false",
      description: 'Allow closing the open item (only for type="single").',
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables all accordion items when true.",
    },
    {
      prop: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"vertical"',
      description: "Orientation of the accordion.",
    },
  ],

  alert: [
    {
      prop: "variant",
      type: '"default" | "destructive"',
      default: '"default"',
      description: "Visual style variant of the alert.",
    },
    {
      prop: "className",
      type: "string",
      description: "Additional CSS classes for the alert container.",
    },
    {
      prop: "children",
      type: "React.ReactNode",
      description: "Content rendered inside the alert.",
    },
  ],

  avatar: [
    {
      prop: "size",
      type: '"default" | "sm" | "lg"',
      default: '"default"',
      description: "Controls the dimensions of the avatar.",
    },
    {
      prop: "src",
      type: "string",
      description: "Image URL for AvatarImage.",
    },
    {
      prop: "alt",
      type: "string",
      description: "Accessible alt text for the avatar image.",
    },
    {
      prop: "asChild",
      type: "boolean",
      default: "false",
      description: "Merge props onto the immediate child element.",
    },
    {
      prop: "delayMs",
      type: "number",
      default: "0",
      description: "Delay in ms before the fallback is shown.",
    },
    {
      prop: "onLoadingStatusChange",
      type: '(status: "idle" | "loading" | "loaded" | "error") => void',
      description: "Callback when the image loading status changes.",
    },
  ],

  badge: [
    {
      prop: "variant",
      type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"',
      default: '"default"',
      description: "Visual style variant of the badge.",
    },
    {
      prop: "className",
      type: "string",
      description: "Additional CSS classes for the badge.",
    },
    {
      prop: "asChild",
      type: "boolean",
      default: "false",
      description: "Merge props onto the immediate child element.",
    },
    {
      prop: "children",
      type: "React.ReactNode",
      description: "Content rendered inside the badge.",
    },
  ],

  button: [
    {
      prop: "variant",
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      default: '"default"',
      description: "Visual style variant of the button.",
    },
    {
      prop: "size",
      type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
      default: '"default"',
      description: "Size of the button.",
    },
    {
      prop: "asChild",
      type: "boolean",
      default: "false",
      description: "Render as a child element (e.g. <a>) instead of <button>.",
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables the button and prevents interaction.",
    },
    {
      prop: "type",
      type: '"button" | "submit" | "reset"',
      default: '"button"',
      description: "HTML button type attribute.",
    },
    {
      prop: "onClick",
      type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
      description: "Click event handler.",
    },
  ],

  calendar: [
    {
      prop: "mode",
      type: '"single" | "multiple" | "range"',
      default: '"single"',
      description: "Selection mode of the calendar.",
    },
    {
      prop: "selected",
      type: "Date | Date[] | DateRange | undefined",
      description: "Controlled selected date(s).",
    },
    {
      prop: "defaultMonth",
      type: "Date",
      description: "The month displayed on first render.",
    },
    {
      prop: "disabled",
      type: "Matcher | Matcher[]",
      description: "Dates to disable. Accepts a date, range, or matcher fn.",
    },
    {
      prop: "fromDate",
      type: "Date",
      description: "Earliest selectable date.",
    },
    {
      prop: "toDate",
      type: "Date",
      description: "Latest selectable date.",
    },
    {
      prop: "numberOfMonths",
      type: "number",
      default: "1",
      description: "Number of months to display side-by-side.",
    },
    {
      prop: "showOutsideDays",
      type: "boolean",
      default: "true",
      description: "Show days from adjacent months in the grid.",
    },
    {
      prop: "initialFocus",
      type: "boolean",
      default: "false",
      description: "Move focus to the calendar on mount.",
    },
    {
      prop: "captionLayout",
      type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"',
      default: '"label"',
      description: "Controls the calendar header — plain label or month/year dropdowns.",
    },
    {
      prop: "buttonVariant",
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
      default: '"ghost"',
      description: "Variant applied to the navigation and day buttons inside the calendar.",
    },
    {
      prop: "onSelect",
      type: "(value: Date | Date[] | DateRange | undefined) => void",
      description: "Callback fired when a date is selected. Signature varies with mode.",
    },
    {
      prop: "timeZone",
      type: "string",
      description: "User's IANA timezone for proper date display (e.g. 'America/New_York').",
    },
  ],

  checkbox: [
    {
      prop: "checked",
      type: "boolean | 'indeterminate'",
      description: "Controlled checked state of the checkbox.",
    },
    {
      prop: "defaultChecked",
      type: "boolean",
      default: "false",
      description: "Uncontrolled initial checked state.",
    },
    {
      prop: "onCheckedChange",
      type: "(checked: boolean | 'indeterminate') => void",
      description: "Callback fired when the checked state changes.",
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables the checkbox.",
    },
    {
      prop: "required",
      type: "boolean",
      default: "false",
      description: "Marks the checkbox as required in a form.",
    },
    {
      prop: "name",
      type: "string",
      description: "Name attribute for form submission.",
    },
    {
      prop: "value",
      type: "string",
      default: '"on"',
      description: "Value submitted in a form when checked.",
    },
    {
      prop: "id",
      type: "string",
      description: "HTML id — used to associate with a <label>.",
    },
  ],

  dialog: [
    {
      prop: "open",
      type: "boolean",
      description: "Controlled open state of the dialog.",
    },
    {
      prop: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Uncontrolled initial open state.",
    },
    {
      prop: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the open state changes.",
    },
    {
      prop: "modal",
      type: "boolean",
      default: "true",
      description: "When true, interaction outside the dialog is blocked.",
    },
    {
      prop: "children",
      type: "React.ReactNode",
      description: "Trigger, content, and other dialog sub-components.",
    },
    {
      prop: "showCloseButton",
      type: "boolean",
      default: "true",
      description: "Show or hide the default close (×) button on DialogContent.",
    },
  ],

  input: [
    {
      prop: "type",
      type: "string",
      default: '"text"',
      description: "HTML input type (text, email, password, number, etc.).",
    },
    {
      prop: "value",
      type: "string | number",
      description: "Controlled value of the input.",
    },
    {
      prop: "defaultValue",
      type: "string | number",
      description: "Uncontrolled initial value.",
    },
    {
      prop: "onChange",
      type: "(event: React.ChangeEvent<HTMLInputElement>) => void",
      description: "Callback fired on every value change.",
    },
    {
      prop: "placeholder",
      type: "string",
      description: "Placeholder text shown when the input is empty.",
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables the input.",
    },
    {
      prop: "readOnly",
      type: "boolean",
      default: "false",
      description: "Makes the input read-only.",
    },
    {
      prop: "required",
      type: "boolean",
      default: "false",
      description: "Marks the input as required in a form.",
    },
    {
      prop: "name",
      type: "string",
      description: "Name attribute for form submission.",
    },
    {
      prop: "id",
      type: "string",
      description: "HTML id — used to associate with a <label>.",
    },
    {
      prop: "className",
      type: "string",
      description: "Additional CSS classes for the input.",
    },
  ],

  progress: [
    {
      prop: "value",
      type: "number | null",
      description: "Current progress value (0–max). Pass null to show an indeterminate animated state.",
    },
    {
      prop: "max",
      type: "number",
      default: "100",
      description: "Maximum value of the progress bar.",
    },
    {
      prop: "getValueLabel",
      type: "(value: number, max: number) => string",
      description: "Function to build the accessible aria-valuetext label.",
    },
    {
      prop: "asChild",
      type: "boolean",
      default: "false",
      description: "Merge props onto the immediate child element.",
    },
    {
      prop: "className",
      type: "string",
      description: "Additional CSS classes for the progress root.",
    },
  ],

  "radio-group": [
    {
      prop: "value",
      type: "string",
      description: "Controlled value of the selected radio item.",
    },
    {
      prop: "defaultValue",
      type: "string",
      description: "Uncontrolled initial selected value.",
    },
    {
      prop: "onValueChange",
      type: "(value: string) => void",
      description: "Callback fired when the selected value changes.",
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables all radio items in the group.",
    },
    {
      prop: "required",
      type: "boolean",
      default: "false",
      description: "Marks the group as required in a form.",
    },
    {
      prop: "name",
      type: "string",
      description: "Name attribute shared by all radio items for form submission.",
    },
    {
      prop: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"vertical"',
      description: "Orientation used for keyboard navigation.",
    },
    {
      prop: "loop",
      type: "boolean",
      default: "true",
      description: "Whether keyboard navigation loops from last to first item.",
    },
  ],

  select: [
    {
      prop: "value",
      type: "string",
      description: "Controlled value of the select.",
    },
    {
      prop: "defaultValue",
      type: "string",
      description: "Uncontrolled initial value.",
    },
    {
      prop: "onValueChange",
      type: "(value: string) => void",
      description: "Callback fired when the selected value changes.",
    },
    {
      prop: "open",
      type: "boolean",
      description: "Controlled open state of the dropdown.",
    },
    {
      prop: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Uncontrolled initial open state.",
    },
    {
      prop: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the open state changes.",
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables the select.",
    },
    {
      prop: "required",
      type: "boolean",
      default: "false",
      description: "Marks the select as required in a form.",
    },
    {
      prop: "name",
      type: "string",
      description: "Name attribute for form submission.",
    },
    {
      prop: "placeholder",
      type: "string",
      description: "Text shown in SelectTrigger when no value is selected.",
    },
    {
      prop: "dir",
      type: '"ltr" | "rtl"',
      description: "Reading direction for keyboard navigation.",
    },
    {
      prop: "SelectTrigger · size",
      type: '"default" | "sm"',
      default: '"default"',
      description: "Visual size of the trigger button.",
    },
    {
      prop: "SelectContent · position",
      type: '"item-aligned" | "popper"',
      default: '"popper"',
      description: "Positioning strategy of the dropdown relative to the trigger.",
    },
  ],

  slider: [
    {
      prop: "value",
      type: "number[]",
      description: "Controlled value(s). Array supports multi-thumb sliders.",
    },
    {
      prop: "defaultValue",
      type: "number[]",
      description: "Uncontrolled initial value(s).",
    },
    {
      prop: "onValueChange",
      type: "(value: number[]) => void",
      description: "Callback fired continuously while dragging.",
    },
    {
      prop: "onValueCommit",
      type: "(value: number[]) => void",
      description: "Callback fired only when the user releases the thumb.",
    },
    {
      prop: "min",
      type: "number",
      default: "0",
      description: "Minimum value of the slider.",
    },
    {
      prop: "max",
      type: "number",
      default: "100",
      description: "Maximum value of the slider.",
    },
    {
      prop: "step",
      type: "number",
      default: "1",
      description: "Step increment between values.",
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables the slider.",
    },
    {
      prop: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Orientation of the slider.",
    },
    {
      prop: "inverted",
      type: "boolean",
      default: "false",
      description: "Reverses the direction of the slider.",
    },
    {
      prop: "minStepsBetweenThumbs",
      type: "number",
      default: "0",
      description: "Minimum distance between thumbs in a range slider.",
    },
  ],

  switch: [
    {
      prop: "checked",
      type: "boolean",
      description: "Controlled checked (on) state of the switch.",
    },
    {
      prop: "defaultChecked",
      type: "boolean",
      default: "false",
      description: "Uncontrolled initial checked state.",
    },
    {
      prop: "onCheckedChange",
      type: "(checked: boolean) => void",
      description: "Callback fired when the checked state changes.",
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables the switch.",
    },
    {
      prop: "required",
      type: "boolean",
      default: "false",
      description: "Marks the switch as required in a form.",
    },
    {
      prop: "name",
      type: "string",
      description: "Name attribute for form submission.",
    },
    {
      prop: "value",
      type: "string",
      default: '"on"',
      description: "Value submitted in a form when checked.",
    },
    {
      prop: "id",
      type: "string",
      description: "HTML id — used to associate with a <label>.",
    },
    {
      prop: "size",
      type: '"default" | "sm" | "lg"',
      default: '"default"',
      description: "Controls the visual size of the switch thumb and track.",
    },
  ],

  tabs: [
    {
      prop: "value",
      type: "string",
      description: "Controlled value of the active tab.",
    },
    {
      prop: "defaultValue",
      type: "string",
      description: "Uncontrolled initial active tab value.",
    },
    {
      prop: "onValueChange",
      type: "(value: string) => void",
      description: "Callback fired when the active tab changes.",
    },
    {
      prop: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Orientation of the tabs list.",
    },
    {
      prop: "dir",
      type: '"ltr" | "rtl"',
      description: "Reading direction for keyboard navigation.",
    },
    {
      prop: "activationMode",
      type: '"automatic" | "manual"',
      default: '"automatic"',
      description: "Whether tabs activate on focus or only on explicit selection.",
    },
    {
      prop: "TabsList · variant",
      type: '"default" | "line"',
      default: '"default"',
      description: "Visual style of TabsList — pill/filled or underline.",
    },
  ],

  textarea: [
    {
      prop: "value",
      type: "string",
      description: "Controlled value of the textarea.",
    },
    {
      prop: "defaultValue",
      type: "string",
      description: "Uncontrolled initial value.",
    },
    {
      prop: "onChange",
      type: "(event: React.ChangeEvent<HTMLTextAreaElement>) => void",
      description: "Callback fired on every value change.",
    },
    {
      prop: "placeholder",
      type: "string",
      description: "Placeholder text shown when the textarea is empty.",
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables the textarea.",
    },
    {
      prop: "readOnly",
      type: "boolean",
      default: "false",
      description: "Makes the textarea read-only.",
    },
    {
      prop: "required",
      type: "boolean",
      default: "false",
      description: "Marks the textarea as required in a form.",
    },
    {
      prop: "rows",
      type: "number",
      description: "Visible number of text lines.",
    },
    {
      prop: "name",
      type: "string",
      description: "Name attribute for form submission.",
    },
    {
      prop: "id",
      type: "string",
      description: "HTML id — used to associate with a <label>.",
    },
    {
      prop: "className",
      type: "string",
      description: "Additional CSS classes for the textarea.",
    },
  ],

  "toggle-group": [
    {
      prop: "type",
      type: '"single" | "multiple"',
      required: true,
      description: "Whether only one or multiple items can be active at a time.",
    },
    {
      prop: "value",
      type: "string | string[]",
      description: "Controlled value of the active item(s).",
    },
    {
      prop: "defaultValue",
      type: "string | string[]",
      description: "Uncontrolled initial active item(s).",
    },
    {
      prop: "onValueChange",
      type: "(value: string | string[]) => void",
      description: "Callback fired when the active value changes.",
    },
    {
      prop: "variant",
      type: '"default" | "outline"',
      default: '"default"',
      description: "Visual style of the toggle items.",
    },
    {
      prop: "size",
      type: '"sm" | "default" | "lg"',
      default: '"default"',
      description: "Size applied to all toggle items in the group.",
    },
    {
      prop: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Layout direction of the toggle items.",
    },
    {
      prop: "spacing",
      type: "number",
      default: "0",
      description: "Gap between items in spacing units. 0 collapses borders for a connected look.",
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables all toggle items in the group.",
    },
    {
      prop: "ToggleGroupItem · value",
      type: "string",
      required: true,
      description: "Unique value identifying this item within the group.",
    },
    {
      prop: "ToggleGroupItem · disabled",
      type: "boolean",
      default: "false",
      description: "Disables this specific item independently of the group.",
    },
    {
      prop: "className",
      type: "string",
      description: "Additional CSS classes for the group container.",
    },
  ],

  skeleton: [
    {
      prop: "className",
      type: "string",
      description: "Controls the size and shape of the skeleton. Use Tailwind classes for width, height, and border-radius (e.g. rounded-full for circles).",
    },
  ],

  card: [
    { prop: "CardHeader",      type: "React.ReactNode", description: "Optional header slot — wrap CardTitle, CardDescription, and CardAction inside." },
    { prop: "CardTitle",       type: "React.ReactNode", description: "Primary heading of the card." },
    { prop: "CardDescription", type: "React.ReactNode", description: "Subtitle or supporting text below the title." },
    { prop: "CardAction",      type: "React.ReactNode", description: "Action element pinned to the top-right of the header (e.g. a button or badge)." },
    { prop: "CardContent",     type: "React.ReactNode", description: "Main body of the card. No padding restriction — use className to adjust." },
    { prop: "CardFooter",      type: "React.ReactNode", description: "Optional footer slot. Commonly used for actions or metadata." },
    { prop: "className",       type: "string",           description: "Additional CSS classes applied to the Card root." },
  ],

  collapsible: [
    { prop: "open",           type: "boolean",              description: "Controlled open state." },
    { prop: "defaultOpen",    type: "boolean", default: "false", description: "Initial open state when used uncontrolled." },
    { prop: "onOpenChange",   type: "(open: boolean) => void", description: "Callback fired when the open state changes." },
    { prop: "disabled",       type: "boolean", default: "false", description: "Prevents toggling when true." },
    { prop: "CollapsibleTrigger · asChild", type: "boolean", default: "false", description: "Merge props onto the child element instead of rendering a button." },
  ],

  "hover-card": [
    { prop: "openDelay",  type: "number",  default: "700",      description: "Delay in milliseconds before the card opens on hover." },
    { prop: "closeDelay", type: "number",  default: "300",      description: "Delay in milliseconds before the card closes after hover ends." },
    { prop: "HoverCardContent · side",   type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred side of the trigger to render the card." },
    { prop: "HoverCardContent · align",  type: '"start" | "center" | "end"',          default: '"center"', description: "Alignment of the card relative to the trigger." },
    { prop: "HoverCardContent · sideOffset", type: "number", default: "4", description: "Distance in pixels from the trigger." },
  ],

  label: [
    { prop: "htmlFor",   type: "string",  description: "ID of the form element this label is associated with." },
    { prop: "disabled",  type: "boolean", default: "false", description: "Visually dims the label (pair with a disabled input)." },
    { prop: "className", type: "string",  description: "Additional CSS classes." },
    { prop: "children",  type: "React.ReactNode", required: true, description: "Label text or content." },
  ],

  pagination: [
    { prop: "PaginationLink · isActive", type: "boolean", default: "false", description: "Marks the link as the current page (applies outline variant)." },
    { prop: "PaginationLink · size",     type: "string",  default: '"icon"', description: "Button size inherited from buttonVariants." },
    { prop: "PaginationPrevious / PaginationNext", type: "React.ComponentProps<typeof PaginationLink>", description: "Previous and next navigation links. Accept all PaginationLink props." },
    { prop: "PaginationEllipsis", type: "React.ComponentProps<'span'>", description: "Visual ellipsis indicator for skipped pages." },
  ],

  popover: [
    { prop: "open",         type: "boolean",              description: "Controlled open state." },
    { prop: "defaultOpen",  type: "boolean", default: "false", description: "Initial open state when used uncontrolled." },
    { prop: "onOpenChange", type: "(open: boolean) => void", description: "Callback fired when the open state changes." },
    { prop: "PopoverContent · side",       type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred side of the trigger." },
    { prop: "PopoverContent · align",      type: '"start" | "center" | "end"',          default: '"center"', description: "Alignment relative to the trigger." },
    { prop: "PopoverContent · sideOffset", type: "number", default: "4", description: "Distance in pixels from the trigger." },
  ],

  "scroll-area": [
    { prop: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Scroll direction exposed by ScrollBar." },
    { prop: "className",   type: "string", description: "Use to set a fixed height/width (e.g. h-[200px] w-48) — required for scroll to engage." },
    { prop: "children",    type: "React.ReactNode", required: true, description: "Content that overflows and becomes scrollable." },
  ],

  separator: [
    { prop: "orientation",  type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction of the separator line." },
    { prop: "decorative",   type: "boolean", default: "true", description: "When true the separator is hidden from assistive tech (aria-hidden)." },
    { prop: "className",    type: "string", description: "Additional CSS classes, e.g. to control length or color." },
  ],

  table: [
    { prop: "TableHeader",  type: "React.ReactNode", description: "Contains one or more TableRow with TableHead cells." },
    { prop: "TableBody",    type: "React.ReactNode", description: "Contains the data rows (TableRow + TableCell)." },
    { prop: "TableFooter",  type: "React.ReactNode", description: "Optional footer row for totals or summaries." },
    { prop: "TableCaption", type: "React.ReactNode", description: "Accessible caption rendered below the table." },
    { prop: "TableHead · className", type: "string", description: "Use text-right for numeric columns." },
    { prop: "TableCell · colSpan",   type: "number", description: "Spans the cell across multiple columns." },
  ],

  toggle: [
    { prop: "variant",          type: '"default" | "outline"', default: '"default"', description: "Visual style of the toggle button." },
    { prop: "size",             type: '"default" | "sm" | "lg"', default: '"default"', description: "Size of the toggle." },
    { prop: "pressed",          type: "boolean", description: "Controlled pressed state." },
    { prop: "defaultPressed",   type: "boolean", default: "false", description: "Initial pressed state when uncontrolled." },
    { prop: "onPressedChange",  type: "(pressed: boolean) => void", description: "Callback fired when pressed state changes." },
    { prop: "disabled",         type: "boolean", default: "false", description: "Disables the toggle." },
    { prop: "aria-label",       type: "string", required: true, description: "Accessible label — required when the toggle has no visible text." },
  ],

  sidebar: [
    {
      prop: "SidebarProvider · defaultOpen",
      type: "boolean",
      default: "true",
      description: "Whether the sidebar is open by default.",
    },
    {
      prop: "SidebarProvider · open",
      type: "boolean",
      description: "Controlled open state. Pair with onOpenChange for full control.",
    },
    {
      prop: "SidebarProvider · onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the sidebar open state changes.",
    },
    {
      prop: "Sidebar · variant",
      type: '"sidebar" | "floating" | "inset"',
      default: '"sidebar"',
      description: "Visual style of the sidebar. Floating adds a rounded, elevated panel. Inset embeds the sidebar inside the content area.",
    },
    {
      prop: "Sidebar · side",
      type: '"left" | "right"',
      default: '"left"',
      description: "Which side of the viewport the sidebar appears on.",
    },
    {
      prop: "Sidebar · collapsible",
      type: '"offcanvas" | "icon" | "none"',
      default: '"offcanvas"',
      description: "Collapse behavior. offcanvas slides off-screen, icon shrinks to icon-only width, none disables collapse.",
    },
    {
      prop: "SidebarMenuButton · isActive",
      type: "boolean",
      default: "false",
      description: "Marks the menu item as currently active.",
    },
    {
      prop: "SidebarMenuButton · tooltip",
      type: "string | React.ComponentProps<typeof TooltipContent>",
      description: "Tooltip shown when the sidebar is collapsed to icon-only mode.",
    },
    {
      prop: "SidebarMenuButton · size",
      type: '"default" | "sm" | "lg"',
      default: '"default"',
      description: "Size of the menu button.",
    },
    {
      prop: "SidebarInput · placeholder",
      type: "string",
      description: "Placeholder text for the search input inside the sidebar.",
    },
    {
      prop: "useSidebar()",
      type: "{ state, open, setOpen, isMobile, toggleSidebar }",
      description: "Hook that exposes the sidebar context. Must be used inside SidebarProvider.",
    },
  ],
}
