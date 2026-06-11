import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { ControlledSelectInput } from "@/components/ui/select-input";
import type { AnyActivityT, RecurrenceFrequency } from "@/lib/api/activity/activity";
import { useStore, type useForm } from "@tanstack/react-form";
import { ControlledInput } from "@/components/ui/input";


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


export const RecurrenceActivity = ({
  form,
  editable,
}: {
  form: ReturnType<typeof useForm>;
  editable?: boolean;
}) => {
  const { t } = useTranslation();
  const formState = useStore(form.store, (state) => state.values) as AnyActivityT;

  return (
    <Card className="p-4 bg-background"
    >
      <FormField label={t("common.fields.recurrenceFrequency")}>
        <ControlledSelectInput
          key={"recurrence.frequency"}
          Field={form.Field as any}
          id="recurrence.frequency"
          placeholder={t("common.placeholders.recurrenceFrequency")}
          options={RecurrenceFrequencyOptions.map((opt) => ({
            label: t(`common.recurrence-frequency.${opt}`),
            value: opt,
          })) as { label: string; value: any }[]}
          disabled={!editable}
          defaultValue={formState.recurrence?.frequency || "none"}
        />
      </FormField>
      {formState.recurrence?.frequency !== "none" && formState.recurrence?.frequency !== undefined && (
        <>
          <FormField label={t("common.fields.recurrenceInterval")}>
            <ControlledInput
              key={"recurrence.interval"}
              Field={form.Field as any}
              id="recurrence.interval"
              placeholder={t("common.placeholders.recurrenceInterval")}
              type="number"
              disabled={!editable || formState.recurrence?.frequency === "manually"}
              suffix={t("common.units.days_long", {
                count:
                  formState.recurrence?.frequency !== "manually"
                    ? IntervalByFrequency[
                    (formState.recurrence?.frequency ||
                      "none") as RecurrenceFrequency
                    ]
                    : formState.recurrence?.interval,
              })}
            />
          </FormField>
        </>
      )}
    </Card>
  );
};
