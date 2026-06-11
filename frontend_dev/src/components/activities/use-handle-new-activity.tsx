import { useAllBikes } from "@/lib/api/equipments";
import { useAllTypeActivities } from "@/lib/api/type-activity";
import { useRouter } from "@tanstack/react-router";
import { addHours, format, isFuture, isPast, setHours, setMinutes, setSeconds } from "date-fns";
import { useTranslation } from "react-i18next";
import { alertsConfirmation } from "../alerts";
import type { TypeActivity, TypeActivityFamily } from "@/lib/api/type-activity/type-activity";

export const useHandleNewActivity = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: bikes } = useAllBikes();
  const { data: typeActivities } = useAllTypeActivities();


  const handleNewActivity = async (selectedDate: Date, typeActivity: TypeActivityFamily) => {
    if (typeActivities?.length === 0) {
      const confirm = await alertsConfirmation({
        title: t("components.activities.noActivityTypeTitle"),
        message: t("components.activities.noActivityTypeMessage"),
        button: {
          cancel: t("common.actions.cancel"),
          confirm: t("common.activity-type.add_type"),
        }
      });
      if (confirm) {
        router.navigate({
          to: "/calendar",
          search: { "activity-type-modal": "new", refer: "calendar" },
        });
      }
      return;
    }
    if (!bikes?.length) {
      const confirm = await alertsConfirmation({
        title: t("app.equipment.bikes.emptyTitle"),
        message: t("app.equipment.bikes.emptyDescription"),
        button: {
          cancel: t("common.actions.cancel"),
          confirm: t("app.equipment.bikes.addBike"),
        }
      });
      if (confirm) {
        router.navigate({
          to: "/equipment",
          search: { bike: "new", refer: "calendar" },
        });
      }
      return;
    }


    router.navigate({
      to: '/calendar',
      search: {
        "activity-modal": "new",
        dt_start: selectedDate.toISOString(),
        dt_end: addHours(selectedDate, 1).toISOString(),
        description: "",
        title: "",
        type: typeActivity ? typeActivities?.find((type) => type.family === typeActivity)?.id : typeActivities?.[0]?.id,
        refer: "home"
      },
    });
  }
  return {
    handleNewActivity
  }


}