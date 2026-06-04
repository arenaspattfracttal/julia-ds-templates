import { ICONS_MAP } from "../icon-categories"

// ─── Button icon helper ───────────────────────────────────────────────────────
// Helper compartido: usado por los entries de button y de input.

export function ButtonIcon({ name, className }: { name: string; className?: string }) {
  if (!name || name === "none") return null
  const Icon = ICONS_MAP.get(name)
  return Icon ? <Icon className={className} /> : null
}
