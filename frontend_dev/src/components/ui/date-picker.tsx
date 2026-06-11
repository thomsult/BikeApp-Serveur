
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format as formatDns } from "date-fns"
import { getExtLocalLanguage } from "@/lib/i18n/utils"


interface DatePickerInputProps {
  editable?: boolean;
  title?: string;
  placeholder?: string;
  mode?: "date" | "time" | "datetime";
  value?: string;
  onChangeText?: (dateStr: string) => void;
  format?: (date: Date) => string;
  display?: string;
}
function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  const locales = getExtLocalLanguage() || "en-US"
  return date.toLocaleDateString(locales, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function DatePickerInput({
  editable = true,
  title,
  placeholder,
  mode = "date",
  value,
  onChangeText,
  format,
  display = "dd/MM/yyyy",
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date>(
    value ? new Date(value) : new Date()
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)

  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value)
      if (isValidDate(newDate)) {
        setDate(newDate)
        setMonth(newDate)
      }
    }
  }, [value])
  return (
    <Field >
      {title && <FieldLabel>{title}</FieldLabel>}
      <InputGroup className="flex-1">
        <InputGroupInput
          id="date-required"
          contentEditable="plaintext-only"
          readOnly
          value={value ? formatDns(date, display) : undefined}
          placeholder={placeholder}
          onClick={() => {
            if (editable) setOpen(true)
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker"
                variant="ghost"
                size="icon-sm"
                aria-label="Select date"
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-2 bg-card"
              align="end"
              alignOffset={-4}
              sideOffset={10}

            >
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                buttonVariant="outline"
                autoFocus
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date as Date)
                  onChangeText?.(format ? format(date as Date) : formatDate(date as Date))
                  // setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

