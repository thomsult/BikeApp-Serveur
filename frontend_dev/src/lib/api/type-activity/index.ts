import { GenericCrud } from "../common/generic-crud";
import type { TypeActivity } from "./type-activity";

const typeActivityCrud = new GenericCrud<TypeActivity>({
  resourceName: "activities/types",
  allowRequests: true, // Active les requêtes API pour ce CRUD
  storagePrefix: "type-activities:",
  resourceRelatedName: ["activities"], // Indique que les activités sont liées aux types d'activités
  resourceTitle(item) {
    return item.label ? item.label : item.id;
  },
});

// Export des hooks
export const useTypeActivity = typeActivityCrud.useItem;
export const useAllTypeActivities = typeActivityCrud.useAll;
export const useUpdateTypeActivity = typeActivityCrud.useUpdate;
export const useCreateTypeActivity = typeActivityCrud.useCreate;
export const useDeleteTypeActivity = typeActivityCrud.useDelete;

export * from "./constants";
