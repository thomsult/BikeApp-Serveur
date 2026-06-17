import { t } from "i18next";
import { changeLanguage } from "@/lib/i18n/language-context";
import { queryClient } from "../common";
import type { Profil } from "./profil";
import { UserProfil } from "./profils";
import { Toast } from "@/lib/notification/toast-context";
import { type ProfileUpdateData, type ProfileUpdateError } from "@/client";
import { profileIndexOptions, profileIndexQueryKey, profileUpdateMutation } from "@/client/@tanstack/react-query.gen";
import { useQuery, useMutation, type UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Options } from "@/client/client";

const SuccessToast = (
  action: "update" | "create" | "delete",
  changedFields: string[],
) => {
  const title = "Votre profil";
  const excludedFields = ["updatedAt", "createdAt", "stats", "language", "darkMode", "offlineMode", "name"];
  const filteredFields = changedFields.filter(
    (field) => !excludedFields.includes(field),
  );
  const uniqueFields = Array.from(new Set(filteredFields));
  const fieldCount = uniqueFields.length;
  const field = uniqueFields
    .map((field) =>
      t(`app.profil.fields.${field}`, {
        defaultValue: t(`common.fields.${field}`, {
          defaultValue: field,
        }),
      }),
    );
  Toast.success({
    title: t("toast.successTitle", {
      resource: title,
      action: t(`common.actions.${action}`).toLowerCase(),
    }),
    message:
      fieldCount === 0
        ? t("toast.successMessage", {
          resource: title,
          action: t(`common.actions.${action}`).toLowerCase(),
        })
        : fieldCount <= 1
          ? t("toast.successMessage", {
            resource: field.join(",\n"),
            action: t(`common.actions.${action}`).toLowerCase(),
          })
          : t("toast.successMultipleFields", {
            count: fieldCount,
            action: t(`common.actions.${action}`).toLowerCase(),
          }),
    progress: true,
  });
};
const ErrorToast = (action: "update" | "create" | "delete", error: Error) => {
  Toast.error({
    title: t("toast.errorTitle", {
      resource: t("app.profil.fields.profil", {
        defaultValue: t("common.fields.profil", { defaultValue: "Profil" }),
      }),
      action: t(`common.actions.${action}`).toLowerCase(),
    }),
    message: t("toast.errorMessage", {
      resource: t("app.profil.fields.profil", {
        defaultValue: t("common.fields.profil", { defaultValue: "Profil" }),
      }),
      action: t(`common.actions.${action}`).toLowerCase(),
      error: error.message,
    }),
  });
};

const getChangedFields = <T extends object>(
  oldData: T | null,
  newData: Partial<T>,
) => {
  if (!oldData) return Object.keys(newData);

  return Object.keys(newData).filter(
    (key) => newData[key as keyof T] !== oldData[key as keyof T],
  );
};

export const useMyProfil = (): UseQueryResult<UserProfil, Error> => {
  return useQuery({
    ...profileIndexOptions(),
    select: (data) => {
      if (!data) {
        throw new Error("No profile data returned from server");
      }
      return new UserProfil(data);
    }
  });
};

export const useUpdateMyProfil = () => {
  const { mutationFn } = profileUpdateMutation();

  return useMutation<
    UserProfil,
    AxiosError<ProfileUpdateError>,
    Options<ProfileUpdateData>
  >({
    mutationFn: async (variables, context) => {
      const response = await mutationFn!(variables, context);
      return new UserProfil(response);
    },

    onSuccess: (apiItem, variable) => {

      if (apiItem.language) {
        changeLanguage(apiItem.language);
      }

      const oldData = queryClient.getQueryData<Profil>(profileIndexQueryKey());
      if (!oldData || !variable.body) {
        console.warn("No old profile data found in cache. Cannot determine changed fields.");
        return;
      }
      const changedFields = getChangedFields(oldData, variable.body as Partial<Profil>).filter(
        (field) => field !== "updatedAt" && field !== "createdAt" && field !== "stats" && field !== "language" && field !== "darkMode" && field !== "offlineMode" && field !== "name", // Exclude stats, updatedAt, createdAt, language, darkMode, and offlineMode from the changed fields list
      );

      queryClient.setQueryData<Profil>(
        ["profile", "item", { id: apiItem.id }],
        apiItem,
      );
      console.log("Updated profile data in cache:", changedFields);
      SuccessToast("update", changedFields);

    },
    onError: (error) => {
      ErrorToast("update", error);
    },
  });
};
