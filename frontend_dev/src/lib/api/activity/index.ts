import { GenericCrud } from "../common/generic-crud";
import type { ActivityRideT, AnyActivityT } from "./activity.d";

const activityCrud = new GenericCrud<AnyActivityT>({
  resourceName: "activities",
  allowRequests: true,
  storagePrefix: "activities:",
  resourceTitle: (item) => item.title,
});

// Export des hooks
export const useActivity = activityCrud.useItem;
export const useAllActivities = activityCrud.useAll;
export const useUpdateActivity = activityCrud.useUpdate;
export const useCreateActivity = activityCrud.useCreate;
export const useDeleteActivity = activityCrud.useDelete;

export const useAllActivitiesRides = () => {
  const { data: activities = [], ...rest } = useAllActivities();
  const rides = activities.filter(
    (activity) => activity.typeFamily === "ride",
  ) as ActivityRideT[];
  return { data: rides, ...rest };
};
