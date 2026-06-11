import { getExtLocalLanguage } from "@/lib/i18n/utils";
import type { CellDate } from "./calendar.dt";

const formatDateDisplay = (date: CellDate) => {
  const d = date.date ? date.date : new Date(date.year, date.month, date.day);
  const langue = getExtLocalLanguage();
  return d.toLocaleDateString(langue, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
const formatDateTimeDisplay = (dateStr: string, language: string) => {
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleString(language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const formatMonthDisplay = (date: Date) => {
  const langue = getExtLocalLanguage();
  const formattedDate = date.toLocaleDateString(langue, {
    month: "long",
    year: "numeric",
  });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

export { formatDateDisplay, formatDateTimeDisplay, formatMonthDisplay };
