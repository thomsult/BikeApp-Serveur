import { notificationsDestroy, type NotificationsDestroyResponse, type NotificationsIndexResponse, type NotificationsShowResponse, type NotificationsShowResponses, type NotificationsUpdateResponse } from "@/client";
import { GenericCrud } from "../common/generic-crud";
import type { AllSuggestions } from "./suggestion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationsDestroyMutation, notificationsIndexOptions, notificationsUpdateMutation } from "@/client/@tanstack/react-query.gen";

const SuggestionsCrud = new GenericCrud<NotificationsShowResponse, NotificationsUpdateResponse, NotificationsShowResponses, NotificationsDestroyResponse>({
  resourceName: "notifications",
  allowRequests: true,
  storagePrefix: "suggestions:",
  resourceTitle(item) {
    return item.title ? item.title : `suggestion ${item.id}`;
  },
});

// Export des hooks
const useAllSuggestions = () => {
  return useQuery({
    ...notificationsIndexOptions(),
    select: (data: NotificationsIndexResponse) => data,
  })
}
const useDeleteSuggestion = () => {
  return useMutation({
    ...notificationsDestroyMutation(),
    ...SuggestionsCrud.Delete
  })
}
const useUpdateSuggestion = () => {
  return useMutation({
    ...notificationsUpdateMutation(),
    ...SuggestionsCrud.Update
  })
}
export { useAllSuggestions, useDeleteSuggestion, useUpdateSuggestion };
