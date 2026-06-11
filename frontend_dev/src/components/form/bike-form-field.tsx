import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { FormField } from "../ui/form-field";
import { ControlledSelectInput } from "../ui/select-input";
import type { ID } from "@/lib/api/types";
import type { Activity, ActivityRideT } from "@/lib/api/activity/activity";
import { useAllBikes } from "@/lib/api/equipments";
import type { Bike } from "@/lib/api/equipments/bike";

type optionsType = {
  label: string;
  value: ID | string;
  id: ID | string;
};

interface BikeFormFieldProps {
  editable?: boolean;
  defaultValue?: Partial<ActivityRideT>;
  Field: any;
  form: any;
  bikes: Partial<Bike>[];
};
export const BikeFormField = ({
  editable,
  defaultValue,
  Field,
  bikes,
}: BikeFormFieldProps) => {
  const { t } = useTranslation();

  const options = bikes
    ? bikes
      .map((bike) => {
        if (bike.id === undefined) {
          console.warn("Bike with undefined id found, skipping:", bike);
          return null; // Skip bikes with undefined id
        }
        return {
          label: ` ${bike.type?.label}   - ${bike.name}`,
          value: String(bike.id),
          id: bike.id,
        };
      })
      .filter((bike) => bike !== null)
    : [];
  return (
    <FormField
      label={t("components.activities.field", {
        field: t("common.bike"),
      })}
    >
      {options.length > 0 ? <ControlledSelectInput
        Field={Field as any}
        type="object"
        id="bike"
        suffix={
          (value) => {
            const bike = bikes.find((b) => String(b.id) === String(value));
            return bike ? `${bike.preferred ? "⭐️" : ""}` : "";
          }
        }

        options={options}
        placeholder={t("common.select.bike")}
        disabled={!editable}
        defaultValue={defaultValue?.bike ? options.find((o) => o.value === String(defaultValue.bike?.id))?.value : undefined}
      /> : <div>
        <Button disabled variant="outline" className="w-full">
          {t("app.equipment.bikes.emptyTitle")}
        </Button>
        <Button
          variant="outline"
          className="w-full mt-2"

        >
          {t("app.equipment.bikes.addBike")}
        </Button>
      </div>

      }
    </FormField>
  );
};