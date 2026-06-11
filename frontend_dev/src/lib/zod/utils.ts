import { z } from "zod";

export const idSchema = z.number({
  error: "ID must be a number",
}).or(z.string({
  error: "ID must be a string",
}));


export const selectSchema = z.object({
  id: idSchema,
  label: z.string(),
  value: z.string(),
});

export const sampleSchema = z.object({
  id: idSchema,
  label: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});