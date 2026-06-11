import { isSameDay } from "date-fns";
import { useState, useCallback } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCalendar } from "./use-calendar";
import { cn } from "@/lib/utils";
import type { CellDate } from "./calendar.dt";
import { Button } from "../ui/button";

interface CalendarProps {
  selectedDate: CellDate | null;
  children?: (date: CellDate) => React.ReactNode;
  onDayPress?: (dayObj: CellDate) => void;
  onDoubleClick?: (dayObj: CellDate) => void;
  setSelectedMonth?: (date: Date) => void;
}

const DayCell = ({
  day,
  isCurrentMonth,
  month,
  year,
  date,
  children,
  onDayPress,
  onDoubleClick,
  selectedDate,
}: {
  day: number;
  isCurrentMonth: boolean;
  month: number;
  year: number;
  date: Date;
  children?: React.ReactNode;
  onDayPress?: (dayObj: CellDate) => void;
  onDoubleClick?: (dayObj: CellDate) => void;
  selectedDate: boolean;
}) => {
  const isToday = isSameDay(date, new Date());
  const handlePress = useCallback(() => onDayPress?.({ day, isCurrentMonth, month, year, date }), [onDayPress, day, isCurrentMonth, month, year, date]);
  const handleDoubleClick = useCallback(() => onDoubleClick?.({ day, isCurrentMonth, month, year, date }), [onDoubleClick, day, isCurrentMonth, month, year, date]);

  return (
    <button
      className="aspect-square w-[14.28%] p-1"
      onClick={handlePress}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={cn(
          "relative flex h-full items-center justify-center rounded-lg cursor-pointer",
          selectedDate && "bg-primary/30",
          !selectedDate && isToday && "bg-primary/20",
          !selectedDate && !isToday && isCurrentMonth && "bg-background",
          !selectedDate && !isToday && !isCurrentMonth && "bg-muted/20",
        )}
      >
        <span
          className={cn(
            "text-base font-semibold",
            selectedDate && "text-accent-foreground/80",
            !selectedDate && isToday && "text-accent-foreground/80",
            !selectedDate && !isToday && isCurrentMonth && "text-accent-foreground/80",
            !selectedDate && !isToday && !isCurrentMonth && "text-accent-foreground/20",
          )}
        >
          {day}
        </span>
        {children}
      </div>
    </button>
  );
};

const CalendarMonthHeader = ({
  dateFullMonthAndYear,
  changeMonth,
}: {
  dateFullMonthAndYear: string;
  changeMonth: (delta: number) => void;
}) => {
  const onPrev = useCallback(() => changeMonth(-1), [changeMonth]);
  const onNext = useCallback(() => changeMonth(1), [changeMonth]);
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
      <Button variant="tertiary" size="icon" onClick={onPrev}>
        <ChevronLeftIcon size={16} />
      </Button>

      <span className="flex-1 text-center text-xl font-bold capitalize">
        {dateFullMonthAndYear}
      </span>

      <Button variant="tertiary" size="icon" onClick={onNext}>
        <ChevronRightIcon size={16} />
      </Button>
    </div>
  );
};

export default function Calendar({
  selectedDate,
  setSelectedMonth,
  children,
  onDayPress,
  onDoubleClick,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { getDaysInMonth, changeMonth, monthNames, dayNames } = useCalendar({
    currentDate,
    setCurrentDate,
  });

  const handleChangeMonth = (delta: number) => {
    changeMonth(delta);
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedMonth?.(newDate);
  };

  return (
    <div className="flex flex-col gap-2">
      <CalendarMonthHeader
        dateFullMonthAndYear={`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
        changeMonth={handleChangeMonth}
      />

      <div className="rounded-xl border border-border bg-card p-4">
        {/* Jours de la semaine */}
        <div className="mb-2 flex">
          {dayNames.map((day, index) => (
            <div key={index} className="flex flex-1 items-center justify-center py-2">
              <span className="text-xs font-semibold capitalize">{day}</span>
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="flex flex-wrap">
          {getDaysInMonth(currentDate).map((dayObj) => (
            <DayCell
              key={`${dayObj.year}-${dayObj.month}-${dayObj.day}-${dayObj.isCurrentMonth}`}
              selectedDate={isSameDay(
                selectedDate?.date || new Date(0),
                new Date(dayObj.year, dayObj.month, dayObj.day),
              )}
              onDayPress={onDayPress}
              onDoubleClick={onDoubleClick}
              {...dayObj}
            >
              {children ? children(dayObj) : undefined}
            </DayCell>
          ))}
        </div>
      </div>
    </div>
  );
}