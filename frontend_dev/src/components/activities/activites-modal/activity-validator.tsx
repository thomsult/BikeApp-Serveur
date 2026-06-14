import type { TypeActivity } from "@/lib/api/type-activity/type-activity";
import { bikeShape, componentShape, dateShape, recurrenceShape, typeSelectShape } from "@/lib/zod/shape";
import { addDays, isBefore } from "date-fns";
import { useTranslation } from "react-i18next";
import z from "zod";



export const useValidationSchema = ({
  limitDate,
  typeActivities,
}: {
  limitDate: Date;
  typeActivities: TypeActivity[] | undefined;
}) => {
  const { t } = useTranslation();
  // ─── Validator principal ──────────────────────────────────────────────────────

  return z.object({
    title: z.string({
      error: t("common.errors.required", {
        field: t("common.fields.title"),
      }),
    })
      .min(1, {
        message: t("common.errors.required", {
          field: t("common.fields.title"),
        }),
      }),
    type: typeSelectShape(
      typeActivities,
      t("common.errors.required", {
        field: t("common.fields.type"),
      })
    ),

    dt_start: dateShape(t("common.errors.invalid", {
      field: t("common.fields.dt_start"),
    })),

    dt_end: dateShape(t("common.errors.invalid", {
      field: t("common.fields.dt_end"),
    })),

    notes: z.string().optional(),
    recurrence: recurrenceShape.nullable(),
    bike: bikeShape.nullable().optional(),
    component: componentShape.nullable().optional(),
    itinerary: z.string().optional(),
    trainingType: z.enum(["interval", "endurance", "tempo", "recovery"]).optional(),
    duration: z.number().optional(),
    shareUrl: z.string().default("").optional(),
  })
    .superRefine((data, ctx) => {
      const { dt_start, dt_end, recurrence, type } = data;

      // ── Dates ────────────────────────────────────────────────────────────────
      if (isBefore(dt_start, limitDate) || isBefore(dt_end, limitDate) || isBefore(dt_start, new Date())) {
        const futureLimitDate = addDays(limitDate, 1);
        ctx.addIssue({
          code: "custom",
          path: ["dt_start"],
          message: t("common.errors.invalid_with_date", {
            field: t("common.fields.dt_start"),
            date: futureLimitDate.toLocaleDateString(),
          }),
        });
      }

      if (isBefore(dt_end, dt_start)) {
        ctx.addIssue({
          code: "custom",
          path: ["dt_end"],
          message: t("common.errors.endDateBeforeStartDate"),
        });
      }

      // ── Recurrence ───────────────────────────────────────────────────────────
      if (
        recurrence &&
        recurrence.frequency !== "none" &&
        recurrence.frequency !== "manually" &&
        !recurrence.interval
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["recurrence", "interval"],
          message: t("common.errors.required", {
            field: t("common.fields.recurrenceInterval"),
          }),
        });
      }
      // --- Validation conditionnelle par type d'activité  ─────────────────────
      // ── Validation conditionnelle par type d'activité ────────────────────────
      const activityType = typeActivities?.find((ta) => Number(ta.id) === Number(type));


      if (activityType?.family === "ride") {
        if (!data.bike && !data.itinerary) {
          ctx.addIssue({
            code: "custom",
            path: ["bike", "componentOrBike"],
            message: t("components.activities.rideRequiresBikeOrEquipment"),
          });
        }
      }

      if (activityType?.family === "training") {
        if (!data.trainingType) {
          ctx.addIssue({
            code: "custom",
            path: ["trainingType"],
            message: t("common.errors.required", {
              field: t("common.fields.trainingType"),
            }),
          });
        }
        if (!data.duration || data.duration < 1) {
          ctx.addIssue({
            code: "custom",
            path: ["duration"],
            message: t("common.errors.invalid", {
              field: t("common.fields.duration"),
            }),
          });
        }
      }

      if (activityType?.family === "maintenance") {
        if (!data.bike && !data.component) {
          ctx.addIssue({
            code: "custom",
            path: ["bike", "componentOrBike"],
            message: t(
              "components.activities.maintenanceBikeOrComponentRequired"
            ),
          });
        }
      }
      return;
    });

};

