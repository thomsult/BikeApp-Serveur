import type { RecurrenceFrequency } from "./activity";

export const RecurrenceFrequencyOptions: RecurrenceFrequency[] = [
  "none",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "manually",
];

export const IntervalByFrequency: { [key in RecurrenceFrequency]: number } = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  yearly: 365,
  none: 0,
  manually: 0,
};
export const TrainingTypeOptions = [
  "interval",
  "endurance",
  "tempo",
  "recovery",
] as const;
