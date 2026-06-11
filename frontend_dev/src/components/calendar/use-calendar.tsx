import { useMemo } from "react";
import { getExtLocalLanguage } from "@/lib/i18n/utils";
import i18next from "i18next";

export const useCalendar = ({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}) => {
  // const language = locale?.languageCode || "fr";
  const language = i18next.language || getExtLocalLanguage() || "fr"; // Fallback à "fr" si i18next.language est indéfini

  // 0 = dimanche, 1 = lundi
  const firstDayOfWeek = useMemo(() => {
    const region = language.toUpperCase() || "FR";
    return ["US", "CA", "MX", "BR", "EN"].includes(region) ? 0 : 1;
  }, [language]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const start = (firstDay.getDay() - firstDayOfWeek + 7) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: {
      day: number;
      isCurrentMonth: boolean;
      month: number;
      year: number;
      date: Date;
    }[] = [];

    // Mois précédent
    for (let i = start - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;

      days.push({
        day,
        isCurrentMonth: false,
        month: m,
        year: y,
        date: new Date(y, m, day),
      });
    }

    // Mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        month,
        year,
        date: new Date(year, month, day),
      });
    }

    // Mois suivant (42 cellules)
    while (days.length < 42) {
      const day = days.length - (start + daysInMonth) + 1;
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;

      days.push({
        day,
        isCurrentMonth: false,
        month: m,
        year: y,
        date: new Date(y, m, day),
      });
    }

    return days;
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) =>
      new Date(2024, i, 1).toLocaleString(language, { month: "long" }),
    );
  }, [language]);

  const dayNames = useMemo(() => {
    // 2023-01-01 = dimanche (repère fiable)
    const baseSunday = new Date(2023, 0, 1);

    return Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (i + firstDayOfWeek) % 7;
      const date = new Date(baseSunday);
      date.setDate(baseSunday.getDate() + dayIndex);

      return date.toLocaleDateString(language, {
        weekday: "short",
      });
    });
  }, [language, firstDayOfWeek]);

  return {
    getDaysInMonth,
    changeMonth,
    monthNames,
    dayNames,
  };
};
