"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, X } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type DatePickerMode   = "single" | "multiple" | "range"
export type DateFormat       = "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd" | "d 'de' MMMM, yyyy"
export type DatePickerValue  = Date | Date[] | DateRange | undefined
export type { DateRange }

interface DatePickerProps {
  mode?:        DatePickerMode
  value?:       DatePickerValue
  onChange?:    (value: DatePickerValue) => void
  placeholder?: string
  disabled?:    boolean
  clearable?:   boolean
  dateFormat?:  DateFormat
  label?:       string
  className?:   string
}

function fmtDate(d: Date, fmt: DateFormat) {
  return format(d, fmt, { locale: fmt.includes("MMMM") ? es : undefined })
}

function getDisplay(
  mode: DatePickerMode,
  value: DatePickerValue,
  fmt: DateFormat,
): string | null {
  if (!value) return null

  if (mode === "single") {
    return value instanceof Date ? fmtDate(value, fmt) : null
  }

  if (mode === "multiple") {
    const dates = value as Date[]
    if (!dates?.length) return null
    return dates.length === 1
      ? fmtDate(dates[0], fmt)
      : `${dates.length} fechas seleccionadas`
  }

  if (mode === "range") {
    const r = value as DateRange
    if (!r?.from) return null
    return r.to
      ? `${fmtDate(r.from, fmt)} – ${fmtDate(r.to, fmt)}`
      : fmtDate(r.from, fmt)
  }

  return null
}

function hasValue(mode: DatePickerMode, value: DatePickerValue): boolean {
  if (!value) return false
  if (mode === "multiple") return (value as Date[]).length > 0
  if (mode === "range") return !!(value as DateRange)?.from
  return true
}

function DatePickerCalendar({
  mode, value, onChange, draftRange, onRangeDayClick, setOpen,
}: {
  mode:             DatePickerMode
  value:            DatePickerValue
  onChange:         DatePickerProps["onChange"]
  draftRange:       DateRange | undefined
  onRangeDayClick:  (day: Date) => void
  setOpen:          (v: boolean) => void
}) {
  if (mode === "single") {
    return (
      <Calendar
        mode="single"
        selected={value as Date}
        onSelect={(d) => { onChange?.(d); if (d) setOpen(false) }}
        autoFocus
      />
    )
  }
  if (mode === "multiple") {
    return (
      <Calendar
        mode="multiple"
        selected={value as Date[]}
        onSelect={(d) => onChange?.(d)}
        autoFocus
      />
    )
  }
  return (
    <Calendar
      mode="range"
      selected={draftRange}
      onDayClick={onRangeDayClick}
      numberOfMonths={2}
      autoFocus
    />
  )
}

export function DatePicker({
  mode        = "single",
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  disabled    = false,
  clearable   = true,
  dateFormat  = "dd/MM/yyyy",
  label,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  // Rango: estado interno que conducimos manualmente vía onDayClick para
  // evitar el reducer de react-day-picker (que extiende/recorta en vez de
  // reiniciar). `pickingStart` indica si el próximo clic define el inicio.
  const [draftRange, setDraftRange]   = useState<DateRange | undefined>(undefined)
  const [pickingStart, setPickingStart] = useState(true)

  const display  = getDisplay(mode, value, dateFormat)
  const occupied = hasValue(mode, value)

  function handleOpenChange(next: boolean) {
    if (next && mode === "range") {
      // Al abrir: sembrar el draft con el valor actual y resetear el ciclo
      setDraftRange(value as DateRange | undefined)
      setPickingStart(true)
    }
    setOpen(next)
  }

  function handleRangeDayClick(day: Date) {
    if (pickingStart) {
      // Primer clic: reinicia el rango con el nuevo inicio (sin `to`)
      const next: DateRange = { from: day, to: undefined }
      setDraftRange(next)
      onChange?.(next)
      setPickingStart(false)
    } else {
      // Segundo clic: completa el rango ordenando inicio/fin y cierra
      const from = draftRange?.from ?? day
      const ordered: DateRange = day.getTime() < from.getTime()
        ? { from: day, to: from }
        : { from, to: day }
      setDraftRange(ordered)
      onChange?.(ordered)
      setPickingStart(true)
      setOpen(false)
    }
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    setDraftRange(undefined)
    setPickingStart(true)
    onChange?.(undefined)
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label className="text-xs text-muted-foreground">{label}</Label>
      )}

      <Popover open={open} onOpenChange={disabled ? undefined : handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "dark:bg-input/30",
              !occupied && "text-muted-foreground",
            )}
          >
            <span className="flex-1 text-left truncate">
              {display ?? placeholder}
            </span>

            {clearable && occupied && !disabled && (
              <X
                className="size-3.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleClear}
              />
            )}

            <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <DatePickerCalendar
            mode={mode}
            value={value}
            onChange={onChange}
            draftRange={draftRange}
            onRangeDayClick={handleRangeDayClick}
            setOpen={setOpen}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
