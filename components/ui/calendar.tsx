"use client"

import * as React from "react"
import { cn } from "cn"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-bgCard p-3",
        "[--cell-radius:0.375rem] [--cell-size:2.25rem]",
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),

        months: cn(
          "flex w-full min-w-[280px] flex-col gap-4",
          defaultClassNames.months
        ),

        month: cn(
          "flex w-full flex-col gap-4",
          defaultClassNames.month
        ),

        nav: cn(
          "absolute left-4 right-4 top-3 z-10 flex items-center justify-between",
          defaultClassNames.nav
        ),

        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-9 w-9 shrink-0 p-0 select-none",
          "aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),

        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-9 w-9 shrink-0 p-0 select-none",
          "aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),

        month_caption: cn(
          "flex h-9 w-full items-center justify-center px-9",
          defaultClassNames.month_caption
        ),

        dropdowns: cn(
          "flex h-9 w-full items-center justify-center gap-1.5",
          "text-sm font-medium",
          defaultClassNames.dropdowns
        ),

        dropdown_root: cn(
          "relative rounded-[var(--cell-radius)]",
          defaultClassNames.dropdown_root
        ),

        dropdown: cn(
          "absolute inset-0 bg-bgCard opacity-0",
          defaultClassNames.dropdown
        ),

        caption_label: cn(
          "select-none font-medium text-textSecondary",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-[var(--cell-radius)] text-sm [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-textMuted",
          defaultClassNames.caption_label
        ),

        month_grid: cn(
          "w-full border-collapse",
          defaultClassNames.month_grid
        ),

        weekdays: cn(
          "flex",
          defaultClassNames.weekdays
        ),

        weekday: cn(
          "flex-1 select-none rounded-[var(--cell-radius)]",
          "text-xs font-medium text-textMuted",
          defaultClassNames.weekday
        ),

        week: cn(
          "mt-1 flex w-full items-center justify-between",
          defaultClassNames.week
        ),

        week_number_header: cn(
          "w-9 select-none",
          defaultClassNames.week_number_header
        ),

        week_number: cn(
          "text-[0.8rem] text-textMuted select-none",
          defaultClassNames.week_number
        ),

        day: cn(
          "group/day relative flex h-9 flex-1 items-center justify-center",
          "p-0 text-center select-none",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-[var(--cell-radius)]"
            : "[&:first-child[data-selected=true]_button]:rounded-l-[var(--cell-radius)]",
          defaultClassNames.day
        ),

        range_start: cn(
          "relative isolate z-0 rounded-l-[var(--cell-radius)]",
          "bg-bgButton text-textSecondary",
          "after:absolute after:inset-y-0 after:right-0 after:w-2 after:bg-bgButton",
          defaultClassNames.range_start
        ),

        range_middle: cn(
          "rounded-none bg-bgButton/30 text-textSecondary",
          defaultClassNames.range_middle
        ),

        range_end: cn(
          "relative isolate z-0 rounded-r-[var(--cell-radius)]",
          "bg-bgButton text-textSecondary",
          "after:absolute after:inset-y-0 after:left-0 after:w-2 after:bg-bgButton",
          defaultClassNames.range_end
        ),

        today: cn(
          "rounded-[var(--cell-radius)] bg-bgButton/20 text-textSecondary",
          "data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),

        outside: cn(
          "text-textMuted aria-selected:text-textMuted",
          defaultClassNames.outside
        ),

        disabled: cn(
          "text-textMuted opacity-40",
          defaultClassNames.disabled
        ),

        hidden: cn(
          "invisible",
          defaultClassNames.hidden
        ),

        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...rootProps}
          />
        ),

        Chevron: ({ className, orientation, ...chevronProps }) => {
          const iconClassName = cn("h-4 w-4", className)

          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={iconClassName}
                {...chevronProps}
              />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={iconClassName}
                {...chevronProps}
              />
            )
          }

          return (
            <ChevronDownIcon
              className={iconClassName}
              {...chevronProps}
            />
          )
        },

        DayButton: (dayButtonProps) => (
          <CalendarDayButton
            locale={locale}
            {...dayButtonProps}
          />
        ),

        WeekNumber: ({ children, ...weekNumberProps }) => (
          <td {...weekNumberProps}>
            <div className="flex h-9 w-9 items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),

        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  locale?: Partial<Locale>
}) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus()
    }
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square h-full w-full",
        "min-w-[2.25rem] flex-col gap-1 border-0 p-0",
        "leading-none font-normal text-textSecondary",

        // Keyboard focus
        "group-data-[focused=true]/day:relative",
        "group-data-[focused=true]/day:z-10",
        "group-data-[focused=true]/day:border-ring",
        "group-data-[focused=true]/day:ring-[3px]",
        "group-data-[focused=true]/day:ring-ring/50",

        // Start date
        "data-[range-start=true]:rounded-l-[var(--cell-radius)]",
        "data-[range-start=true]:bg-bgButton",
        "data-[range-start=true]:text-textSecondary",

        // Dates between start and end
        "data-[range-middle=true]:rounded-none",
        "data-[range-middle=true]:bg-bgButton/30",
        "data-[range-middle=true]:text-textSecondary",

        // End date
        "data-[range-end=true]:rounded-r-[var(--cell-radius)]",
        "data-[range-end=true]:bg-bgButton",
        "data-[range-end=true]:text-textSecondary",

        // Single selected date
        "data-[selected-single=true]:bg-bgButton",
        "data-[selected-single=true]:text-textSecondary",

        "dark:hover:text-textSecondary",
        "[&>span]:text-xs [&>span]:opacity-70",

        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
