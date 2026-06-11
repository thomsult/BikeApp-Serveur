import { GenericCrud } from "../common/generic-crud";
import type { ComponentBike } from "./bike";

const componentBikeCrud = new GenericCrud<ComponentBike>({
  resourceName: "bikes/components",
  allowRequests: true,
  storagePrefix: "component-bikes:",
  resourceTitle(item) {
    return item.model ? `${item.model} ${item.brand.label}` : item.id;
  },
});

// Export des hooks
export const useComponentBike = componentBikeCrud.useItem;
export const useAllComponentBikes = componentBikeCrud.useAll;
export const useUpdateComponentBike = componentBikeCrud.useUpdate;
export const useCreateComponentBike = componentBikeCrud.useCreate;
export const useDeleteComponentBike = componentBikeCrud.useDelete;
