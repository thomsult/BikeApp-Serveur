import { useTranslation } from "react-i18next";
import z from "zod";

export const useAccessoriesBikeValidator = () => {
  const { t } = useTranslation();

  const typeSchema = z.object({
    id: z.number(),
    label: z.string(),
  }, {
    message: t('common.errors.required', {
      field: t('common.fields.type')
    })
  });

  const brandSchema = z.object({
    id: z.number(),
    label: z.string(),
  }, {
    message: t('common.errors.required', {
      field: t('common.fields.brand')
    })
  });

  return z.object({
    type: typeSchema,
    brand: brandSchema,
    // icon: z.string().optional(),
    status: z.number().int().min(0).max(100),
    model: z.string().min(1, {
      message: t('common.errors.required', {
        field: t('common.fields.model')
      })
    }),
    multiBike: z.boolean().optional(), // indicates if the component can be used on multiple bikes

  });

}