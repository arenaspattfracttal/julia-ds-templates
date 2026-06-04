import * as LucideIcons from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

export type IconComponent = React.ComponentType<{ size?: number; className?: string }>
export type IconEntry = [string, IconComponent]

export interface IconCategory {
  id: string
  label: string
}

// ─── Icon list ────────────────────────────────────────────────────────────────
// Exclude: aliases ending in "Icon", internal "Lucide*" re-exports.
// Lucide exports forwardRef objects {$$typeof, render, displayName}.

export const ALL_ICONS: IconEntry[] = (Object.entries(LucideIcons) as [string, unknown][]).filter(
  ([name, val]) => {
    if (name.endsWith("Icon") || name.startsWith("Lucide")) return false
    if (!val || typeof val !== "object") return false
    return Object.prototype.hasOwnProperty.call(val, "render")
  }
) as IconEntry[]

/** Fast name → component lookup for the full icon set. */
export const ICONS_MAP: Map<string, IconComponent> = new Map(ALL_ICONS)

// ─── Category rules (first match wins) ───────────────────────────────────────

const RULES: [id: string, label: string, test: RegExp][] = [
  ["arrows",      "Arrows",             /Arrow|Chevron|^Move[A-Z]|^Corner(?:Up|Down|Left|Right)|^TrendingUp|^TrendingDown|^Rotate|^Flip[A-Z]|^Undo|^Redo|^Repeat|^Shuffle|ChevronsUp/],
  ["files",       "Files & Folders",    /^File|^Folder|^Archive|^Clipboard|^Copy$|^Save|^Notebook|^Sticky|^Download|^Upload|^Import|^Export/],
  ["shapes",      "Shapes",             /^Circle|^Square|^Triangle|^Diamond|^Hexagon|^Octagon|^Pentagon|^Cylinder|^Cone|^Pyramid|^Torus|^Rectangle|^Dot|^Ellipsis/],
  ["text",        "Text & Editing",     /^Text|^Align|^Bold|^Italic|^Underline|^Strikethrough|^Heading|^Pilcrow|^Baseline|^RemoveFormatting|^Superscript|^Subscript|^CaseUpper|^CaseLower|^CaseSensitive|^Indent|^Outdent|^WrapText|^Captions|^List[A-Z]/],
  ["layout",      "Layout & UI",        /^Layout|^Panel|^Sidebar|^Table|^Grid[A-Z]?$|^Columns|^Rows|^Separator|^Maximize|^Minimize|^Expand|^Shrink|^Focus|^Layers|^Kanban|^Between|^Gallery|^Funnel|^Menu|^MoreHorizontal|^MoreVertical|^Grip|^Split|^App|^Form|^Fold|^Mirror|^More|^Gantt/],
  ["charts",      "Charts & Data",      /^Chart|^Gauge|^Signal|^BarChart|^PieChart/],
  ["comms",       "Communication",      /^Mail|^Message|^Phone|^Bell|^Inbox|^Send|^Reply|^Forward|^Voicemail|^Rss|^Megaphone|^Radio|^Alert|^Link[^2]|^Link$/],
  ["datetime",    "Calendar & Time",    /^Calendar|^Clock|^Alarm|^Timer|^Watch|^Hourglass|^History|^Loader/],
  ["media",       "Media",              /^Play|^Pause|^Stop|^Volume|^Music|^Video|^Audio|^Film|^Mic|^Image|^Photo|^Camera|^Webcam|^Aperture|^Clapperboard|^Disc|^Podcast|^Captions/],
  ["maps",        "Navigation & Maps",  /^Map|^Navigation|^Compass|^Globe|^Pin|^Locate|^Route|^Flag|^Plane|^Train|^Car|^Bus|^Truck[^2]|^Bike|^Ship|^Parking/],
  ["users",       "Users & People",     /^User|^Users|^Person|^People|^Baby|^Bot|^Avatar|^Contact|^Group|^Team|^Hand|^Id/],
  ["security",    "Security",           /^Lock|^Unlock|^Key|^Shield|^Eye$|^Eye[A-Z]|^Fingerprint|^Scan|^Cctv/],
  ["dev",         "Development",        /^Code|^Terminal|^Git|^Database|^Server|^Bug|^Cpu|^Binary|^Brackets|^Braces|^Variable|^Function|^Hash|^Regex|^Package|^Test|^Flask|^Plug|^Iteration|^Log[A-Z]/],
  ["devices",     "Devices",            /^Monitor|^Laptop|^Tablet|^Smartphone|^Keyboard|^Mouse|^Printer|^Headphones|^Tv|^Desktop|^HardDrive|^Usb|^Battery|^Wifi|^Bluetooth|^Power|^Cable|^Flashlight/],
  ["nature",      "Nature & Weather",   /^Sun|^Moon|^Cloud|^Rain|^Snow|^Wind|^Storm|^Rainbow|^Leaf|^Tree|^Flower|^Mountain|^Wave|^Droplet|^Flame|^Snowflake|^Thermometer|^Umbrella|^Fish|^Bird|^Egg|^Ice/],
  ["food",        "Food & Drink",       /^Bean|^Beef|^Beer|^Cake|^Candy|^Fork|^Hop|^Milk|^Nut|^Pizza|^Coffee|^Cup|^Wine|^Sandwich|^Apple|^Cherry/],
  ["finance",     "Finance",            /^Dollar|^Euro|^Pound|^Bitcoin|^Wallet|^Credit|^Bank|^Coin|^Receipt|^Invoice|^Landmark|^Banknote|^Briefcase/],
  ["tools",       "Tools & Settings",   /^Settings|^Wrench|^Hammer|^Screwdriver|^Sliders|^Scissors|^Pen[A-Z]?$|^Pencil|^Brush|^Ruler|^Eraser|^Palette|^Pipette|^Search|^Zoom|^Filter|^Refresh|^Lasso|^Lens|^Paint|^Paintbrush|^Pointer|^Lightbulb|^Magnet/],
  ["health",      "Health & Medical",   /^Heart|^Activity|^Stethoscope|^Pill|^Syringe|^Hospital|^Ambulance|^Dna|^Virus|^Brain|^Ear|^Bone|^Bed/],
  ["buildings",   "Buildings & Places", /^House|^Building|^Home|^School|^Church|^Castle|^Tent|^Warehouse|^Store|^Hotel|^Door|^Lamp|^Brick|^Fence/],
  ["education",   "Education",          /^Book|^Library|^GraduationCap|^Microscope|^Telescope|^Atom|^Award|^Trophy|^Certificate|^Presentation|^Chalkboard/],
  ["math",        "Math & Logic",       /^Plus|^Minus|^Divide|^Multiply|^Equal|^Percent|^Calculator|^Sigma|^Pi|^Infinity|^Check|^X$|^XCircle|^XSquare|^Asterisk/],
  ["shopping",    "Shopping",           /^Cart|^Bag|^Shop|^Tag|^Barcode|^Ticket|^Gift|^Badge|^QrCode|^Truck$/],
  ["social",      "Social",             /^Share|^Bookmark|^ThumbsUp|^ThumbsDown|^Github|^Twitter|^Facebook|^Instagram|^Linkedin|^Star|^Like/],
  ["games",       "Games & Hobbies",    /^Chess|^Puzzle|^Gamepad|^Joystick|^Dice|^Cannabis|^Cigarette|^Mars|^Beer/],
  ["zodiac",      "Zodiac",             /^Zodiac/],
  ["other",       "Other",              /.*/],
]

export const ICON_CATEGORIES: IconCategory[] = RULES.map(([id, label]) => ({ id, label }))

// ─── Assign each icon to its first matching category ─────────────────────────

const _cat = new Map<string, string>()
for (const [name] of ALL_ICONS) {
  for (const [id, , re] of RULES) {
    if (re.test(name)) { _cat.set(name, id); break }
  }
}

export function getIconCategory(name: string): string {
  return _cat.get(name) ?? "other"
}

// Pre-grouped for efficient rendering
export const ICONS_BY_CATEGORY: Record<string, IconEntry[]> = {}
for (const { id } of ICON_CATEGORIES) ICONS_BY_CATEGORY[id] = []
for (const entry of ALL_ICONS) ICONS_BY_CATEGORY[getIconCategory(entry[0])].push(entry)

// Category list with counts (excluding empty ones)
export const CATEGORY_COUNTS: { id: string; label: string; count: number }[] =
  ICON_CATEGORIES
    .map(({ id, label }) => ({ id, label, count: ICONS_BY_CATEGORY[id]?.length ?? 0 }))
    .filter((c) => c.count > 0)
