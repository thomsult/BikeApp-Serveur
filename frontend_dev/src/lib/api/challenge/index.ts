import { t } from "i18next";
import { GenericCrud } from "../common/generic-crud";
import type { Challenge } from "./challenge";

const challengeCrud = new GenericCrud<Challenge>({
  resourceName: "/challenges",
  storagePrefix: "challenges:",
  allowRequests: true,
  resourceTitle(item) {
    if (item.title === "dayly challenges") {
      return t("components.day_progress.title") || item.title;
    }

    return item.title ? item.title : item.id;
  },
});

// Export des hooks
export const useChallenge = challengeCrud.useItem;
export const useAllChallenges = challengeCrud.useAll;
export const useUpdateChallenge = challengeCrud.useUpdate;

export const useCreateChallenge = challengeCrud.useCreate;
export const useDeleteChallenge = challengeCrud.useDelete;
