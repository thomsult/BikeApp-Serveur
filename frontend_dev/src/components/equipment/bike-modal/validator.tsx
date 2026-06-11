import { useTranslation } from "react-i18next";
import z from "zod";

export const useBikeValidator = () => {
  const { t } = useTranslation();

  const fileSchema = z
    .instanceof(File)
    .nullable()
    .optional()
    .refine((file) => {
      if (!file) return true; // autorise null/undefined
      return ["image/png", "image/jpeg"].includes(file.type);
    }, {
      message: "Format invalide (PNG ou JPEG uniquement)",
    })
    .refine((file) => {
      if (!file) return true;
      return file.size <= 2 * 1024 * 1024; // 2MB
    }, {
      message: "Fichier trop lourd (max 2MB)",
    });

  return z.object({
    name: z.string().min(1, {
      message: t('common.errors.required', {
        field: t('common.fields.name')
      })
    }),
    type: z.object({
      id: z.number(),
      label: z.string(),
    }, {
      message: t('common.errors.required', {
        field: t('common.fields.type')
      })
    }),
    preferred: z.boolean(),
    status: z.number().int().min(0).max(100),
    image: fileSchema.or(z.string()), // Accepte soit un fichier, soit une URL (string)
    components: z.array(z.any()).optional(), // Validation basique pour les composants, à adapter selon la structure réelle
    stats: z.object({
      distance: z.number().min(0, {
        message: t('common.errors.invalid', {
          field: t('common.stats.distance')
        })
      }).refine((value) => {
        // Accepte les nombres avec des virgules ou des points
        return /^-?\d*\.?\d*$/.test(value.toString());
      }, {
        message: t('common.errors.invalid', {
          field: t('common.stats.distance')
        })
      }),
      rides: z.number().min(0, {
        message: t('common.errors.invalid', {
          field: t('common.stats.rides_one')
        })
      }).refine((value) => {
        console.log("Validating rides:", value);
        // Accepte les nombres avec des virgules ou des points
        return /^-?\d*\.?\d*$/.test(value.toString());
      }, {
        message: t('common.errors.invalid', {
          field: t('common.stats.rides_one')
        })
      }),
      lastService: z.string().nullable().refine((value) => {
        if (!value) return true; // Accepte les valeurs nulles ou vides
        const date = new Date(value);
        return !isNaN(date.getTime());
      }, {
        message: t('common.errors.invalidDate', {
          field: t('common.stats.lastService')
        })
      }).refine((value) => {
        if (!value) return true; // Accepte les valeurs nulles ou vides
        const date = new Date(value);
        return date <= new Date();
      }, {
        message: t('common.errors.futureDate', {
          field: t('common.stats.lastService')
        })
      }),
      service: z.object({
        method: z.enum(["manual", "useLastServiceDate", "distanceInterval", "timeInterval", "ridesInterval", "none"]),
        manualNote: z.string().nullable().optional(),
      }),
    }),
  });

}
type BikeFormValues = z.infer<ReturnType<typeof useBikeValidator>>;