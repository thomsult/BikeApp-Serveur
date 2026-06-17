import type { ComponentsDestroyResponse, ComponentsResource, ComponentsStoreResponse, ComponentsUpdateResponse } from "@/client";
import { GenericCrud } from "../common/generic-crud";
import { useMutation, useQuery } from "@tanstack/react-query";
import { componentsDestroyMutation, componentsIndexOptions, componentsShowOptions, componentsStoreMutation, componentsUpdateMutation } from "@/client/@tanstack/react-query.gen";
// import type { ComponentBike } from "./bike";

const componentBikeCrud = new GenericCrud<ComponentsResource, ComponentsUpdateResponse, ComponentsStoreResponse, ComponentsDestroyResponse>({
  resourceName: "bikes/components",
  allowRequests: true,
  storagePrefix: "component-bikes:",
  resourceTitle(item) {
    return item.model ? `${item.model} ${item?.brand?.label}` : item.id;
  },
});


export const useComponentBike = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    ...componentsShowOptions({ path: { component: Number(id) } }),
    enabled: options?.enabled && !!id && !isNaN(Number(id)),
    select: (data) => data as ComponentsResource,
  })
}
export const useAllComponentBikes = () => {
  return useQuery({
    ...componentsIndexOptions(),
  })
}

export const useUpdateComponentBike = () => {
  return useMutation({
    ...componentsUpdateMutation(),
    ...componentBikeCrud.Update
  })
}
export const useCreateComponentBike = () => {
  return useMutation({
    ...componentsStoreMutation(),
    ...componentBikeCrud.Create
  })
}
export const useDeleteComponentBike = () => {
  return useMutation({
    ...componentsDestroyMutation(),
    ...componentBikeCrud.Delete
  })
}

