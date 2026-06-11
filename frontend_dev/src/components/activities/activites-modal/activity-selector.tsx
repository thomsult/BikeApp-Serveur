import type { ActivityMaintenanceT, ActivityRideT, ActivityTrainingT, AnyActivityT } from "@/lib/api/activity/activity";
import type { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type { FieldType } from ".";
import { ActivityRide } from "./ride-activity";
import { ActivityTraining } from "./training-activity";
import { ActivityMaintenance } from "./maintenance-activity";





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
        </p>
      );
  }
};