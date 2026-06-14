import type { ActivityMaintenanceT, ActivityRideT, ActivityTrainingT, AnyActivityT } from "@/lib/api/activity/activity";
import type { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type { FieldType } from ".";
import { ActivityRide } from "./ride-activity";
import { ActivityTraining } from "./training-activity";
import { ActivityMaintenance } from "./maintenance-activity";
import { useEffect } from "react";
import { useAllBikes } from "@/lib/api/equipments";





export const ActivityByType = ({
  form,
  Field,
  activityType,
  editable = true,
  initialValue,
  handleClickNewRideItinerary,
}: {
  form: ReturnType<typeof useForm>;
  Field: FieldType;
  activityType: string;
  editable?: boolean;
  initialValue: AnyActivityT | null;
  handleClickNewRideItinerary: () => void;
}) => {
  const { t } = useTranslation();
  const { data: allBikes } = useAllBikes();

  useEffect(() => {
    // Clear bike and component fields when switching to a type that doesn't use them
    if (activityType === "training") {
      form.setFieldValue("bike", null);
      form.setFieldValue("component", null);
    }
    if (activityType === "ride") {
      const preferredBike = allBikes?.find(bike => bike.preferred);
      if (preferredBike) {
        form.setFieldValue("bike", preferredBike);
      } else {
        form.setFieldValue("bike", null);
      }
      form.setFieldValue("trainingType", undefined);
      form.setFieldValue("duration", undefined);
      form.setFieldValue("itinerary", null);
      form.setFieldValue("component", null);
    }

    if (activityType === "event" || activityType === "other") {
      form.setFieldValue("bike", null);
      form.setFieldValue("component", null);
      form.setFieldValue("itinerary", null);
      form.setFieldValue("trainingType", undefined);
      form.setFieldValue("duration", undefined);
    }
  }, [activityType, form]);
  switch (activityType) {
    case "ride":

      return (
        <ActivityRide
          Field={Field}
          form={form}
          editable={editable}
          initialValue={initialValue as ActivityRideT | null}
          handleClickNewRideItinerary={handleClickNewRideItinerary}
        />
      );
    case "training":
      // form.setFieldValue("bike", null);
      // form.setFieldValue('component', null);
      return (
        <ActivityTraining
          Field={Field}
          form={form}
          editable={editable}
          initialValue={initialValue as ActivityTrainingT | null}
        />
      );
    case "maintenance":
      return (
        <ActivityMaintenance
          form={form}
          editable={editable}
          initialValue={initialValue as ActivityMaintenanceT | null}
        />
      );
    default:
      return (
        <p className="text-sm text-gray-500">
          {t("components.activities.noTypeDetails")}
          {activityType}
        </p>
      );
  }
};