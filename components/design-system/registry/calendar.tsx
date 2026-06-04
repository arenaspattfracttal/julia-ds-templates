import React from "react"
import { defineComponent } from "../types"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"

export const calendarEntry = defineComponent<{
  mode: string
  numberOfMonths: string
  showOutsideDays: boolean
  fixedWeeks: boolean
}>({
  id: "calendar",
  name: "Calendar",
  description: {
    en: "A calendar component for selecting single dates, multiple dates, or date ranges.",
    es: "Un componente de calendario para seleccionar fechas individuales, múltiples o rangos.",
  },
  category: "Components",
  filePath: "components/ui/calendar.tsx",
  controls: {
    mode:           { type: "select",  options: ["single","multiple","range"], defaultValue: "single" },
    numberOfMonths: { type: "select",  options: ["1","2"], defaultValue: "1" },
    showOutsideDays:{ type: "boolean", defaultValue: true },
    fixedWeeks:     { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { mode, showOutsideDays, numberOfMonths, fixedWeeks } = props
    const months = Number(numberOfMonths) || 1
    const cls = "rounded-xl border border-border"
    const shared = { numberOfMonths: months, showOutsideDays, fixedWeeks, className: cls }

    function SingleCalendar() {
      const [date, setDate] = React.useState<Date | undefined>(undefined)
      return <Calendar mode="single" selected={date} onSelect={setDate} {...shared} />
    }
    function MultipleCalendar() {
      const [dates, setDates] = React.useState<Date[] | undefined>(undefined)
      return <Calendar mode="multiple" selected={dates} onSelect={setDates} {...shared} />
    }
    function RangeCalendar() {
      const [range, setRange] = React.useState<DateRange | undefined>(undefined)
      return <Calendar mode="range" selected={range} onSelect={setRange} {...shared} />
    }

    if (mode === "range") return <RangeCalendar />
    if (mode === "multiple") return <MultipleCalendar />
    return <SingleCalendar />
  },
  generateCode: (props) => {
    const { mode, showOutsideDays, numberOfMonths, fixedWeeks } = props
    const months = Number(numberOfMonths) || 1
    const isRange = mode === "range"
    const isMultiple = mode === "multiple"
    const stateType = isRange
      ? "{ from: Date | undefined; to?: Date } | undefined"
      : isMultiple ? "Date[] | undefined" : "Date | undefined"
    const stateVar = isRange ? "range" : isMultiple ? "dates" : "date"
    const stateSetter = isRange ? "setRange" : isMultiple ? "setDates" : "setDate"
    const attrs = [
      `mode="${mode}"`,
      `selected={${stateVar}}`,
      `onSelect={${stateSetter}}`,
      months > 1 && `numberOfMonths={${months}}`,
      !showOutsideDays && `showOutsideDays={false}`,
      fixedWeeks && `fixedWeeks`,
      `className="rounded-xl border border-border"`,
    ].filter(Boolean) as string[]
    const tag = ["<Calendar", ...attrs.map(a=>`  ${a}`), "/>"].join("\n")
    const indented = tag.split("\n").map(l=>`    ${l}`).join("\n")
    return `"use client"\n\nimport { useState } from "react"\nimport { Calendar } from "@/components/ui/calendar"\n\nexport default function Example() {\n  const [${stateVar}, ${stateSetter}] = useState<${stateType}>(undefined)\n  return (\n${indented}\n  )\n}`
  },
})
