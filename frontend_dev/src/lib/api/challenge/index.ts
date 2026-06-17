import { t } from "i18next";
import { GenericCrud } from "../common/generic-crud";
import type { Challenge } from "./challenge";
import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import { challengesDestroyMutation, challengesIndexOptions, challengesShowOptions, challengesStoreMutation, challengesUpdateMutation } from "@/client/@tanstack/react-query.gen";
import type { ChallengesDestroyData, ChallengesDestroyError, ChallengesDestroyResponse, ChallengesIndexResponse, ChallengesShowResponse, ChallengesStoreResponse, ChallengesUpdateResponse } from "@/client";
import type { AxiosError } from "axios";
import type { Options } from "@/client/client";


const challengeCrud = new GenericCrud<ChallengesShowResponse, ChallengesUpdateResponse, ChallengesStoreResponse, ChallengesDestroyResponse>({
  resourceName: "/challenges",
  storagePrefix: "challenges:",
  allowRequests: true,
  resourceTitle(item) {
    if (item.title === "dayly challenges") {
      return t("components.day_progress.title") || item.title;
    }

    return item.title ? item.title : String(item.id);
  },
});

// Export des hooks
export const useChallenge = (id: string | null) => {
  return useQuery({
    ...challengesShowOptions({ path: { challenge: Number(id) } }),
    select: (data) => data,
  });
};
export const useAllChallenges = () => {
  return useQuery({
    ...challengesIndexOptions(),
    select: (data) => data,
  });
};

export const useUpdateChallenge = () => {
  return useMutation({
    ...challengesUpdateMutation(),
    ...challengeCrud.Update,
  })
}

export const useCreateChallenge = () => {
  return useMutation({
    ...challengesStoreMutation(),
    ...challengeCrud.Create,
  })
}
export const useDeleteChallenge = () => {
  return useMutation({
    ...challengesDestroyMutation(),
    ...challengeCrud.Delete,
  })
}
