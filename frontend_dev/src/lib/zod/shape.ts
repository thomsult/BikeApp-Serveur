import { z } from "zod";
import { idSchema, sampleSchema, selectSchema } from "./utils";
import type { TypeActivity } from "../api/type-activity/type-activity";
import type { optionsProps } from "@/components/ui/select-input";

const bikeTypeShape = z.object({
  id: idSchema,
  label: z.string(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
});

const statsShape = z.object({
  distance: z.number(),
  rides: z.number(),
  lastService: z.string().nullable(), // ISO date string
  service: z.object({
    method: z.enum([
      "useLastServiceDate",
      "distanceInterval",
      "timeInterval",
      "ridesInterval",
      "none",
      "manual",
    ]),
    intervalDistance: z.number().optional(),
    intervalTime: z.number().optional(),
    intervalRides: z.number().optional(),
    manualNote: z.string().nullable().optional(),
  }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
const bikeImageShape = z.object({ file: z.instanceof(File), base64: z.string() }).or(z.string()).nullable();


export const componentShape = z.object({
  id: idSchema,
  model: z.string(),
  multiBike: z.boolean().optional(),
  status: z.number(),
  type: sampleSchema, // Placeholder, à remplacer par la validation complète du type de composant dès que possible
  brand: sampleSchema, // Placeholder, à remplacer par la validation complète de la marque de composant dès que possible
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
});
export const recurrenceShape = z.object({
  frequency: z.enum([
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "manually",
    "none",
  ]),
  interval: z.number().optional(),
});


export const bikeShape = z.object({
  id: idSchema,
  name: z.string(),
  preferred: z.boolean(),
  type: bikeTypeShape,
  status: z.number(),
  image: bikeImageShape,
  components: z.array(componentShape),
  stats: statsShape,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});



export const typeSelectShape = (select: TypeActivity[] | undefined, invalidMessage: string) => {
  if (selectSchema.safeParse(select).success) {
    return z.transform((value, ctx) => {
      const found = select?.find((option) => option.id === (value as optionsProps).id);
      if (!found) {
        ctx.addIssue({
          code: "custom",
          message: invalidMessage,
        });
        return z.NEVER;
      }
      return found;
    });
  } else {
    return z.any();
  }
};

export const dateShape = (invalidMessage: string) => z.transform((str: string, ctx) => {
  const date = new Date(str);
  if (isNaN(date.getTime())) {
    ctx.addIssue({
      code: "custom",
      message: invalidMessage,
    });
    return z.NEVER;
  }
  return date;
})