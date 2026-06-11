import { GenericCrud } from "../common/generic-crud";
import type { AllSuggestions } from "./suggestion";

const SuggestionsCrud = new GenericCrud<AllSuggestions>({
  resourceName: "notifications",
  allowRequests: true,
  storagePrefix: "suggestions:",
  resourceTitle(item) {
    return item.title ? item.title : `suggestion ${item.id}`;
  },
});

// Export des hooks
const useAllSuggestions = SuggestionsCrud.useAll;
const useDeleteSuggestion = SuggestionsCrud.useDelete;
const useUpdateSuggestion = SuggestionsCrud.useUpdate;

export { useAllSuggestions, useDeleteSuggestion, useUpdateSuggestion };
