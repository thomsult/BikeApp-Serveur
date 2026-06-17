import { useAllBikes } from "@/lib/api/equipments";
import { useAllTypeActivities } from "@/lib/api/type-activity";
import { useRouter } from "@tanstack/react-router";
import { addHours } from "date-fns";
import { useTranslation } from "react-i18next";
import { alertsConfirmation } from "../alerts";
import type { TypeActivityFamily } from "@/lib/api/type-activity/type-activity";
import type { AnyActivityT } from "@/lib/api/activity/activity";
import { useQueryClient } from "@tanstack/react-query";
import { activitiesShowOptions } from "@/client/@tanstack/react-query.gen";

export const useHandleActivity = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  // const { data: bikes } = useAllBikes();
  const { data: typeActivities } = useAllTypeActivities();


  const handleNewActivity = async (selectedDate: Date = new Date(), typeActivity: TypeActivityFamily = "other") => {
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
    // if (!bikes?.length) {
    //   const confirm = await alertsConfirmation({
    //     title: t("app.equipment.bikes.emptyTitle"),
    //     message: t("app.equipment.bikes.emptyDescription"),
    //     button: {
    //       cancel: t("common.actions.cancel"),
    //       confirm: t("app.equipment.bikes.addBike"),
    //     }
    //   });
    //   if (confirm) {
    //     router.navigate({
    //       to: "/equipment",
    //       search: { bike: "new", refer: "calendar" },
    //     });
    //   }
    //   return;
    // }


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



  const handleActivity = async (activityQuery: AnyActivityT) => {
    const activity: AnyActivityT = await queryClient.fetchQuery(
      {
        ...activitiesShowOptions({ path: { activity: Number(activityQuery.id) } }),
      }
    );

    if (!activity) {
      window.alert(t("components.activities.activityNotFound"));
      return;
    }

    if (activity.typeFamily === "ride") {
      router.navigate({
        to: "/ride",
        search: {
          id: activity.id,
          refer: "calendar",
        },
      });
      return;
    }

    router.navigate({
      to: "/calendar",
      search: {
        "activity-modal": activity.id,
        refer: "home",
      },
    });
  };





  return {
    handleNewActivity,
    handleActivity
  }


}