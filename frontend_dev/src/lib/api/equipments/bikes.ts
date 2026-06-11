import { GenericCrud } from "../common/generic-crud";
import type { Bike } from "./bike";

const bikeCrud = new GenericCrud<Partial<Bike>>({
  resourceName: "bikes",
  storagePrefix: "bikes:",
  allowRequests: true,
  resourceTitle(item) {
    return item.name ? item.name : (item.id ?? "Unknown");
  },
});

// Export des hooks
export const useBike = bikeCrud.useItem;
export const useAllBikes = bikeCrud.useAll;
export const useUpdateBike = bikeCrud.useUpdate;
export const useCreateBike = bikeCrud.useCreate;
export const useDeleteBike = bikeCrud.useDelete;
