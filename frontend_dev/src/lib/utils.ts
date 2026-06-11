import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { intervalToDuration } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toInputDatetime = (value: string | Date) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 16);
};


export const toHHMMSS = (totalSeconds: number): string => {
  const { hours = 0, minutes = 0, seconds = 0 } = intervalToDuration({
    start: 0,
    end: totalSeconds * 1000,
  });

  return [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};
