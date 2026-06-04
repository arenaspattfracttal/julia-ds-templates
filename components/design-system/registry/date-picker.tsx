import { defineComponent } from "../types"
import { useState } from "react"
import { DatePicker, type DateFormat, type DatePickerMode, type DateRange, type DatePickerValue } from "@/components/ui/date-picker"

function DatePickerDemo(props: {
  mode:       DatePickerMode
  placeholder: string
  disabled:   boolean
  clearable:  boolean
  dateFormat: DateFormat
  showLabel:  boolean
  label:      string
}) {
  const [single,   setSingle]   = useState<Date | undefined>(undefined)
  const [multiple, setMultiple] = useState<Date[] | undefined>(undefined)
  const [range,    setRange]    = useState<DateRange | undefined>(undefined)

  const value: DatePickerValue =
    props.mode === "multiple" ? multiple :
    props.mode === "range"    ? range    :
    single

  function handleChange(v: DatePickerValue) {
    if (props.mode === "multiple") setMultiple(v as Date[] | undefined)
    else if (props.mode === "range") setRange(v as DateRange | undefined)
    else setSingle(v as Date | undefined)
  }

  return (
    <div className="w-72">
      <DatePicker
        mode={props.mode}
        value={value}
        onChange={handleChange}
        placeholder={props.placeholder}
        disabled={props.disabled}
        clearable={props.clearable}
        dateFormat={props.dateFormat}
        label={props.showLabel ? props.label : undefined}
      />
    </div>
  )
}

export const datePickerEntry = defineComponent<{
  mode:       DatePickerMode
  placeholder: string
  disabled:   boolean
  clearable:  boolean
  dateFormat: DateFormat
  showLabel:  boolean
  label:      string
}>({
  id: "date-picker",
  name: "Date Picker",
  description: {
    en: "An input that opens a calendar popover. Supports single date, multiple dates and date range.",
    es: "Un input que abre un calendario en popover. Soporta fecha única, múltiple y rango de fechas.",
  },
  category: "Components",
  filePath: "components/ui/date-picker.tsx",
  controls: {
    mode:        { type: "select",  options: ["single", "multiple", "range"], defaultValue: "single" },
    showLabel:   { type: "boolean", defaultValue: false },
    label:       { type: "text",    defaultValue: "Fecha" },
    placeholder: { type: "text",    defaultValue: "Seleccionar fecha" },
    clearable:   { type: "boolean", defaultValue: true  },
    disabled:    { type: "boolean", defaultValue: false },
    dateFormat:  {
      type: "select",
      options: ["dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd", "d 'de' MMMM, yyyy"],
      defaultValue: "dd/MM/yyyy",
    },
  },
  controlVisible: (key, props) => {
    if (key === "label") return props.showLabel
    return true
  },
  render: (props) => <DatePickerDemo {...props} />,
  compositorRender: (props) => (
    <div className="w-full">
      <DatePickerDemo {...props} />
    </div>
  ),
  generateCode: (props) => {
    const { mode, placeholder, disabled, clearable, dateFormat, showLabel, label } = props
    const isRange    = mode === "range"
    const isMultiple = mode === "multiple"
    const stateType  = isRange ? "DateRange | undefined" : isMultiple ? "Date[] | undefined" : "Date | undefined"
    const importLine = isRange
      ? `import { DatePicker, type DateRange } from "@/components/ui/date-picker"`
      : `import { DatePicker } from "@/components/ui/date-picker"`

    const attrs = [
      mode !== "single" ? `mode="${mode}"` : null,
      `value={date}`,
      `onChange={setDate}`,
      showLabel     ? `label="${label}"` : null,
      placeholder !== "Seleccionar fecha" ? `placeholder="${placeholder}"` : null,
      !clearable    ? `clearable={false}` : null,
      disabled      ? `disabled` : null,
      dateFormat !== "dd/MM/yyyy" ? `dateFormat="${dateFormat}"` : null,
    ].filter(Boolean).join("\n    ")

    return `import { useState } from "react"
${importLine}

export default function Example() {
  const [date, setDate] = useState<${stateType}>(undefined)
  return (
    <DatePicker
    ${attrs}
    />
  )
}`
  },
})
