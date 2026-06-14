import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { FormField } from "@/components/ui/form-field";
import { ControlledSelectInput } from "@/components/ui/select-input";
import type { ActivityMaintenanceT } from "@/lib/api/activity/activity";
import { useAllBikes, useAllComponentBikes } from "@/lib/api/equipments";
import type { ID } from "@/lib/api/types";
import { type useForm, useStore } from "@tanstack/react-form";
import { use, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";


export const ActivityMaintenance = ({
  form,
  editable,
  initialValue,
}: {
  form: ReturnType<typeof useForm>;

  editable?: boolean;
  initialValue?: ActivityMaintenanceT | null;
}) => {
  const { data: bikes = [] } = useAllBikes();
  const { data: components = [] } = useAllComponentBikes();
  const { t } = useTranslation();

  const OptionBike = bikes.map((bike) => ({
    id: bike.id,
    label: `${bike.name} (${t("common.bike")} - ${bike?.type?.label})`, // ✅ vrai nom du vélo
    value: "bike:" + bike.id, // ✅ on préfixe pour différencier des composants
  }));

  const OptionComponent = components.map((comp) => ({
    id: comp.id,
    label: `${comp.model} (${comp.type?.label} - ${comp.brand?.label})`, // ✅ vrai nom du composant
    value: "component:" + comp.id, // ✅ on préfixe pour différencier des vélos
  }));


  const allOptions = [...OptionBike, ...OptionComponent];
  // const formState: ActivityMaintenanceT & { componentOrBike?: { label: string; value: string; id: string } } = useStore(form.store, (state) => state.values) as ActivityMaintenanceT & { componentOrBike?: { label: string; value: string; id: string } };





  const errors = useStore(form.store, (state) => state.errors);

  return allOptions.length > 0 ? (
    <div className="mb-4 flex flex-col gap-2">
      <p className="text-lg font-semibold">
        {t("components.activities.maintenanceDetails")}
      </p>
      <p className="text-sm text-gray-500">
        {t("components.activities.maintenanceDetailsDescription")}
      </p>

      <FormField
        required
        label={`${t("common.bike")} / ${t("common.accessory")}`}
      >
        {allOptions.length === 0 ? (
          <div>
            <p className="text-sm text-gray-500">
              {t("app.equipment.bikes.emptyTitle")} / {t("app.equipment.accessories.emptyTitle")}
            </p>
          </div>
        ) : (
          <ControlledSelectInput
            Field={form.Field}
            id="componentOrBike"
            type="object"
            options={allOptions}
            placeholder={`${t("app.equipment.bikes.title")} / ${t("app.equipment.accessories.title")}`}
            disabled={!editable}
            defaultValue={"bike:" + initialValue?.bike?.id || "component:" + initialValue?.component?.id || undefined}
            handleChange={(value, fieldHandleChange) => {
              if (!value || typeof value === "string") {
                form.setFieldValue("bike", null);
                form.setFieldValue("component", null);
                return;
              }
              const val = allOptions.find((o) => o.value === value.value);
              if (!val) {
                form.setFieldValue("bike", null);
                form.setFieldValue("component", null);
                return;
              }

              if (val.value.startsWith("bike")) {
                const bike = bikes.find((b) => b.id === Number(val.value.replace("bike:", "")));
                if (!bike) {
                  form.setFieldValue("bike", null);
                  form.setFieldValue("component", null);
                  return;
                }
                form.setFieldValue("bike", bike);
                form.setFieldValue("component", null);
              } else {
                const component = components.find((c) => c.id === Number(val.value.replace("component:", "")));
                if (!component) {
                  form.setFieldValue("component", null);
                  form.setFieldValue("bike", null);
                  return;
                }
                form.setFieldValue("component", component);
                form.setFieldValue("bike", null);
              }
            }}

          />
        )}
      </FormField>

    </div>
  ) : (
    <div className="mb-4 flex flex-col gap-2">
      <p>
        {t("app.equipment.bikes.emptyTitle")} / {t("app.equipment.accessories.emptyTitle")}
      </p>
      {
        Object.keys(errors).length > 0 && Object.entries(errors[0]).map(([key, value]) => key === "bike" && (
          <span key={key} className="text-sm text-red-500">
            {value[0].message}
          </span>
        ))
      }
      <p className="text-sm text-gray-500">
        {t("components.activities.noTypeDetails")}
      </p>
    </div>
  );
};
