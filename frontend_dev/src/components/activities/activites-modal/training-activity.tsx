import { useTranslation } from "react-i18next";
import { ControlledInput } from "@/components/ui/input";

import type { ActivityTrainingT } from "@/lib/api/activity/activity";
import { TrainingTypeOptions } from "@/lib/api/activity/constants";
import type { FieldType } from ".";
import { FormField } from "@/components/ui/form-field";
import { ControlledSelectInput } from "@/components/ui/select-input";
import type { useForm } from "@tanstack/react-form";

export const ActivityTraining = ({
  form,
  Field,
  editable,
}: {
  form: ReturnType<typeof useForm>;
  Field: FieldType;
  editable?: boolean;
  initialValue: ActivityTrainingT | null;
}) => {
  const { t } = useTranslation();
  return (
    <div className="mb-4 flex flex-col gap-2">
      <p className="text-lg font-semibold">
        {t("components.activities.trainingDetails")}
      </p>
      <p className="text-sm text-gray-500">
        {t("components.activities.trainingDetailsDescription")}
      </p>
      <FormField
        label={t("components.activities.field", {
          field: t("common.fields.trainingType"),
        })}
      >
        <Field name="trainingType">
          {(field) => (
            <ControlledSelectInput
              id="trainingType"
              Field={Field as any}
              disabled={!editable}
              options={TrainingTypeOptions.map((type) => ({
                label: t(`common.training-type.${type}`),
                value: type,
              }))}
              defaultValue={field.state.value}
              placeholder={t("common.select.trainingType")}
              onChange={field.handleChange}
            />

          )}
        </Field>
      </FormField>

      <FormField
        label={t("components.activities.field", {
          field: t("common.fields.duration"),
        })}
      >
        <ControlledInput
          id="duration"
          type="number"
          className="border-0 "
          Field={Field as any}
          disabled={!editable}
          placeholder={
            t("common.placeholders.duration") +
            " (" +
            t("common.units.duration.minutes") +
            ")"
          }
          suffix="min"
        />
      </FormField>
    </div>
  );
};
