import { useTranslation } from "react-i18next";
import z from "zod";

export const useBikeValidator = () => {
  const { t } = useTranslation();

  const getBase64Info = (base64: string) => {
    let mimeType = "octet/stream";

    if (base64.startsWith("/9j/")) mimeType = "image/jpeg";
    else if (base64.startsWith("iVBORw0KGgo")) mimeType = "image/png";
    else if (base64.startsWith("UklGR")) mimeType = "image/webp";
    else if (base64.startsWith("R0lGODdh") || base64.startsWith("R0lGODlh")) mimeType = "image/gif";

    const padding = (base64.match(/=+$/) || [""])[0].length;
    const sizeInBytes = (base64.length * 3) / 4 - padding;

    return { mimeType, sizeInBytes };
  };

  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const fileSchema = z.object({
    file: z.instanceof(File).optional(),
    base64: z.string().optional(),
  }).refine((data) => {
    if (!data.file && !data.base64) return true;

    const fileType = data.file
      ? data.file.type
      : data.base64
        ? getBase64Info(data.base64).mimeType
        : "octet/stream";

    return ACCEPTED_TYPES.includes(fileType);
  }, {
    message: t('common.errors.invalidFormat', {
      field: t('common.fields.image'),
      formats: "PNG, JPEG, GIF ou WEBP uniquement"
    })
  }).refine((data) => {
    if (!data.file && !data.base64) return true;

    const fileSize = data.file
      ? data.file.size
      : data.base64
        ? getBase64Info(data.base64).sizeInBytes
        : 0;

    return fileSize <= 2 * 1024 * 1024; // 2MB
  }, {
    message: t('common.errors.fileTooLarge', {
      field: t('common.fields.image'),
      size: "2MB"
    })
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
    image: fileSchema.or(z.string()).nullable(), // Accepte soit un fichier, soit une URL (string)
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
