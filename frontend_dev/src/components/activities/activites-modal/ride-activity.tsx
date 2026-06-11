import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import type { ActivityRideT } from "@/lib/api/activity/activity";
import { useAllBikes } from "@/lib/api/equipments";
import { useTranslation } from "react-i18next";
import { ControlledSelectInput } from "@/components/ui/select-input";
import type { FieldType } from ".";
import { useRouter } from "@tanstack/react-router";
import { type useForm, useStore } from "@tanstack/react-form";
import { BikeFormField } from "@/components/form/bike-form-field";



export const ActivityRide = ({
  form,
  Field,
  editable,
  initialValue,
  handleClickNewRideItinerary,
}: {
  form: ReturnType<typeof useForm>;
  Field: FieldType;
  editable?: boolean;
  initialValue: ActivityRideT | null;
  handleClickNewRideItinerary: () => void;
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const errors = useStore(form.store, (state) => state.errors);
  const { data: bikes } = useAllBikes();


  return bikes && bikes.length > 0 ? (
    <div className="mb-4 flex flex-col gap-2">
      <p className="text-lg font-semibold">
        {t("components.activities.rideDetails")}
      </p>
      <p className="text-sm text-gray-500">
        {t("components.activities.rideDetailsDescription")}
      </p>

      <BikeFormField
        Field={Field as any}
        form={form}
        editable={editable}
        defaultValue={initialValue}
        bikes={bikes}
      />
      {/* Waypoints / Itinerary field */}
      <FormField
        label={t("components.activities.field", {
          field: t("common.fields.itinerary"),
        })}
      >
        <Field name="waypoints" >
          {(field) => (
            <>
              <Button
                disabled={!editable}
                onClick={handleClickNewRideItinerary}
                variant="outline"
                className="w-full mt-4  flex justify-center"
              >
                {field.state.value?.length > 0
                  ? t("components.activities.editItinerary")
                  : t("components.activities.addItinerary")}
              </Button>
              {!field.state.meta.isValid && (
                <p className="mt-1 text-sm text-red-500">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </>
          )}
        </Field>
      </FormField>
    </div >
  ) : (
    <div className="mb-4 flex flex-col gap-2">
      <p>
        {t("app.equipment.bikes.emptyTitle")}
      </p>
      <p className="text-sm text-gray-500">
        {t("components.activities.noTypeDetails")}
      </p>
      {
        Object.keys(errors).length > 0 && Object.entries(errors[0]).map(([key, value]) => key === "bike" && (
          <span key={key} className="text-sm text-red-500">
            {value[0].message}
          </span>
        ))
      }
    </div>
  );
};