import type { TypeActivity } from "./type-activity";

export const activityTypeConstants: (TypeActivity & { refer?: string })[] = [
  {
    id: "default",
    label: "default",
    color: "#EF4444",
    refer: "default",
    family: "other",
  },
];

export const activityTypeFamilyConstants: TypeActivity["family"][] = [
  "ride",
  "maintenance",
  "event",
  "challenge",
  "training",
  "other",
];
