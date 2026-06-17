import { useMutation, useQuery } from "@tanstack/react-query";
import { GenericCrud } from "../common/generic-crud";
import type { ActivityRideT, AnyActivityT, TypeActivity } from "./activity.d";
import { activitiesDestroyMutation, activitiesIndexOptions, activitiesShowOptions, activitiesStoreMutation, activitiesUpdateMutation } from "@/client/@tanstack/react-query.gen";
import type { ActivitiesDestroyResponse, ActivitiesShowResponse, ActivitiesStoreResponse, ActivitiesUpdateResponse } from "@/client";

const activityCrud = new GenericCrud<ActivitiesShowResponse, ActivitiesUpdateResponse, ActivitiesStoreResponse, ActivitiesDestroyResponse>({
  resourceName: "activities",
  allowRequests: true,
  storagePrefix: "activities:",
  resourceTitle: (item) => item.title,
});



// Export des hooks
export const useActivity = <T extends TypeActivity = AnyActivityT>(id: string | null) => {
  return useQuery({
    ...activitiesShowOptions({ path: { activity: Number(id) } }),
    enabled: !!id,
    select: (data) => data as T,
  });
};


export const useAllActivities = <T extends TypeActivity = AnyActivityT>() => {
  return useQuery({
    ...activitiesIndexOptions(),
    select: (data) => data as T[],
  });

};
export const useUpdateActivity = (id: string | null) => {
  return useMutation({
    ...activitiesUpdateMutation({ path: { activity: Number(id) } }),
    ...activityCrud.Update,
  });
}
export const useCreateActivity = () => {
  return useMutation({
    ...activitiesStoreMutation(),
    ...activityCrud.Create,
  });
}
export const useDeleteActivity = (id: string | null) => {
  return useMutation({
    ...activitiesDestroyMutation({ path: { activity: Number(id) } }),
    ...activityCrud.Delete,
  });
}

export const useAllActivitiesRides = () => {
  const { data: activities = [], ...rest } = useAllActivities<TypeActivity>();
  const rides = activities.filter(
    (activity) => activity.typeFamily === "ride",
  ) as ActivityRideT[];
  return { data: rides, ...rest };
};
