import type { TypesDestroyResponse, TypesShowResponse, TypesStoreResponse, TypesUpdateResponse } from "@/client";
import { GenericCrud } from "../common/generic-crud";
import { typesDestroyMutation, typesIndexOptions, typesShowOptions, typesStoreMutation, typesUpdateMutation } from "@/client/@tanstack/react-query.gen";
import { useMutation, useQuery } from "@tanstack/react-query";

const typeActivityCrud = new GenericCrud<TypesShowResponse, TypesUpdateResponse, TypesStoreResponse, TypesDestroyResponse>({
  resourceName: "activities/types",
  allowRequests: true, // Active les requêtes API pour ce CRUD
  storagePrefix: "type-activities:",
  resourceRelatedName: ["activities"], // Indique que les activités sont liées aux types d'activités
  resourceTitle(item) {
    return item.label ? item.label : item.id;
  },
});

// Export des hooks
export const useTypeActivity = (id: string | undefined) => {
  return useQuery({
    ...typesShowOptions({ path: { typeActivity: Number(id) } }),
  });
};
export const useAllTypeActivities = () => {
  return useQuery({
    ...typesIndexOptions(),
    select: (data) => data || [],
  });
};

export const useUpdateTypeActivity = (id: string | null) => {
  return useMutation({
    ...typesUpdateMutation({ path: { typeActivity: Number(id) } }),
    ...typeActivityCrud.Update
  });
}
export const useCreateTypeActivity = () => {
  return useMutation({
    ...typesStoreMutation(),
    ...typeActivityCrud.Create
  });
}
export const useDeleteTypeActivity = (id: string | null) => {
  return useMutation({
    ...typesDestroyMutation({ path: { typeActivity: Number(id) } }),
    ...typeActivityCrud.Delete
  });
}

export * from "./constants";
