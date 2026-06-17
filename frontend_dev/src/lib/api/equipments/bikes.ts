import type { BikesDestroyResponse, BikesShowResponse, BikesStoreResponse, BikesUpdateResponse } from "@/client";
import { GenericCrud } from "../common/generic-crud";
import { useMutation, useQuery } from "@tanstack/react-query";
import { bikesDestroyMutation, bikesIndexOptions, bikesShowOptions, bikesStoreMutation, bikesUpdateMutation } from "@/client/@tanstack/react-query.gen";

const bikeCrud = new GenericCrud<BikesShowResponse, BikesUpdateResponse, BikesStoreResponse, BikesDestroyResponse>({
  resourceName: "bikes",
  storagePrefix: "bikes:",
  allowRequests: true,
  resourceTitle(item) {
    return item.name ? item.name : (item.id ?? "Unknown");
  },
});


export const useBike = (id: string) => {
  return useQuery({
    ...bikesShowOptions({ path: { bike: Number(id) } }),
  })
}
export const useAllBikes = () => {
  return useQuery({
    ...bikesIndexOptions(),
  })
}

export const useUpdateBike = () => {
  return useMutation({
    ...bikesUpdateMutation(),
    ...bikeCrud.Update
  })
}
export const useCreateBike = () => {
  return useMutation({
    ...bikesStoreMutation(),
    ...bikeCrud.Create
  })
}
export const useDeleteBike = () => {
  return useMutation({
    ...bikesDestroyMutation(),
    ...bikeCrud.Delete
  })
}
