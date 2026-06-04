"use client"

import { type ApiProp } from "./api-reference-data"
import { translations } from "./i18n"
import { useViewer } from "./viewer-context"
import { cn } from "@/lib/utils"

export function ApiTable({ props }: { props: ApiProp[] }) {
  const { lang } = useViewer()
  const t = translations[lang].apiTable

  return (
    <div className="rounded-xl border border-border overflow-hidden text-sm">
      {/* Header */}
      <div className="grid grid-cols-[160px_1fr_100px_1fr] border-b border-border bg-muted">
        {[t.colProp, t.colType, t.colDefault, t.colDescription].map((h) => (
          <div key={h} className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {props.map((p) => (
          <div
            key={p.prop}
            className="grid grid-cols-[160px_1fr_100px_1fr] hover:bg-muted/50 transition-colors"
          >
            {/* Prop name */}
            <div className="px-4 py-3 flex items-start gap-1.5">
              <code className="text-xs font-mono font-semibold text-foreground leading-relaxed break-all">
                {p.prop}
              </code>
              {p.required && (
                <span className="mt-0.5 text-[10px] font-bold text-destructive uppercase shrink-0">req</span>
              )}
            </div>

            {/* Type */}
            <div className="px-4 py-3">
              <code className={cn(
                "text-[10px] font-mono leading-relaxed break-all",
                p.type.startsWith("(")
                  ? "text-muted-foreground"
                  : "text-info",
              )}>
                {p.type}
              </code>
            </div>

            {/* Default */}
            <div className="px-4 py-3">
              {p.default !== undefined ? (
                <code className="text-xs font-mono text-muted-foreground">{p.default}</code>
              ) : (
                <span className="text-muted-foreground/40 text-xs">—</span>
              )}
            </div>

            {/* Description */}
            <div className="px-4 py-3 text-xs text-muted-foreground leading-relaxed">
              {p.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
