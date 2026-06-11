import { t } from "i18next";
import { createMutation, createQuery } from "react-query-kit";
import { changeLanguage, useSelectedLanguage } from "@/lib/i18n/language-context";
import { client, queryClient } from "../common";
import type { Profil } from "./profil";
import { UserProfil } from "./profils";
import { auth } from "@/lib/firebase/config";
import { Toast } from "@/lib/notification/toast-context";
import { setExtLocalLanguage } from "@/lib/i18n/utils";
import i18n from "@/lib/i18n";

const SuccessToast = (
  action: "update" | "create" | "delete",
  changedFields: string[],
) => {
  const title = "Votre profil";

  const field = changedFields
    .filter((f) => f !== "updatedAt" && f !== "createdAt")
    .filter((f) => f !== "stats" && f !== "darkMode") // Exclude stats, darkMode, and language from the field list
    .map((field) =>
      t(`app.profil.fields.${field}`, {
        defaultValue: t(`common.fields.${field}`, {
          defaultValue: field,
        }),
      }),
    );
  const fieldCount = field.length;
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

// Export des hooks
export const useMyProfil = createQuery<Profil, Error>({
  queryKey: ["profile", "item"],
  staleTime: 0,
  fetcher: async () => {
    const id = auth.currentUser?.uid;
    if (!id) {
      throw new Error("User not authenticated");
    }
    try {
      const response = await client.get(`profile`);
      const apiItem = new UserProfil({
        ...response.data,
      } as Profil);
      i18n.changeLanguage(apiItem.language, (err) => {
        if (err) {
          console.error("Error changing language:", err);
        }
      });
      return apiItem;
    } catch (e) {
      throw e;
    }
  },
});

export const useUpdateMyProfil = createMutation<
  { data: Profil; changedFields: string[] },
  Partial<Profil>,
  Error
>({
  mutationFn: async (item) => {
    if (!item.id) {
      throw new Error("Profil id is required for update");
    }
    const oldData = queryClient.getQueryData<Profil>(["profile", "item"]);
    if (item.language) {
      changeLanguage(item.language);
    }

    try {
      const response = await client.put(`profile/${item.id}`, item);
      const apiItem = new UserProfil(response.data as Profil);

      const changedFields = getChangedFields(oldData as Profil, item).filter(
        (field) => field !== "updatedAt" && field !== "createdAt" && field !== "stats" && field !== "language" && field !== "darkMode" && field !== "offlineMode" && field !== "name", // Exclude stats, updatedAt, createdAt, language, darkMode, and offlineMode from the changed fields list
      );
      console.log("Changed fields:", changedFields);

      return { data: apiItem, changedFields: changedFields };
    } catch {
      throw new Error("Failed to update profile and no local profile found");
    }
  },
  onSuccess: ({ data, changedFields }) => {
    queryClient.invalidateQueries({
      queryKey: ["profile", "all"],
    });
    queryClient.setQueryData<Profil>(
      ["profile", "item", { id: data.id }],
      data,
    );
    SuccessToast("update", changedFields);
  },
  onError: (error) => {
    ErrorToast("update", error);
  },
  mutationKey: ["profile", "update"],
});
