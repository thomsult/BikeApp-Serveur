// lib/api/generic-crud.ts

import { AxiosError } from "axios";
import { t } from "i18next";
import { createMutation, createQuery } from "react-query-kit";
import { getExtLocalLanguage } from "@/lib/i18n/utils";
// import { Toast } from "@/lib/notification/toast-context";
// import { storage, zustandStorage } from "@/lib/storage";
import type { UUIDString } from "../types";
import { client, type Error, queryClient } from "./";
import { Toast } from "@/lib/notification/toast-context";

interface CrudConfig<T> {
  resourceName: string;
  resourceRelatedName?: string[];
  storagePrefix: string;
  resourceTitle?: (item: T) => string; // Optionnel, pour les messages de toast
  allowRequests?: boolean; // Optionnel, pour activer les requêtes API
}
interface OptionalCrud {
  toast?: boolean; // Optionnel, pour contrôler l'affichage des toasts
  [key: string]: any; // Permet d'ajouter d'autres options si nécessaire
}

export class GenericCrud<T extends { id?: UUIDString }> {
  private resourceName: string;
  private resourceRelatedName?: string[];
  private storagePrefix: string;
  private allowRequests = false; // Permet de désactiver les requêtes API si besoin
  private resourceTitle?: (item: T) => string;

  constructor(config: CrudConfig<T>) {
    this.resourceName = config.resourceName;
    this.resourceRelatedName = config.resourceRelatedName;
    this.storagePrefix = config.storagePrefix;
    this.resourceTitle = config.resourceTitle;
    this.allowRequests = config.allowRequests ?? false; // Par défaut, les requêtes sont désactivées
  }
  showError = (
    error: Error,
    variables: OptionalCrud,
    action: "update" | "create" | "delete",
  ) => {
    if (error instanceof AxiosError && error.response?.status === 422) {
      const message = (error.response?.data?.errors as Record<
        keyof T,
        string[]
      >) || {
        error: [error.message],
      };
      return Toast.error({
        title: t("toast.errorTitle", {
          resource: this.resourceName,
          action: t(`common.actions.update`).toLowerCase(),
        }),
        message: Object.entries(message)
          .map(([_, errors]) => `${errors.join(", ")}`)
          .join("\n"),
        duration: 5000,
      });
    }
    if (error && variables?.option?.toast !== false) {
      return this.ErrorToast(action, error);
    }
  };

  private SuccessToast(action: "update" | "create" | "delete", item: T) {
    const title = this.resourceTitle
      ? this.resourceTitle(item)
      : `${this.resourceName} ${item.id}`;
    return Toast.success({
      title: t("toast.successTitle", {
        resource: title,
        action: t(`common.actions.${action}`).toLowerCase(),
      }),
      message: t("toast.successMessage", {
        resource: title,
        action: t(`common.actions.${action}`).toLowerCase(),
      }),
      progress: true,
    });
  }
  private ErrorToast(action: "update" | "create" | "delete", error: Error) {
    return Toast.error({
      title: t("toast.errorTitle", {
        resource: this.resourceName,
        action: t(`common.actions.${action}`).toLowerCase(),
      }),
      message: t("toast.errorMessage", {
        resource: this.resourceName,
        action: t(`common.actions.${action}`).toLowerCase(),
        error: error.message,
      }),
    });
  }

  // GET single item
  get useItem() {
    return createQuery<T, { id: string }, Error>({
      queryKey: [this.resourceName, "item"],
      staleTime: 0,
      fetcher: async ({ id }) => {
        if (!id) throw new Error("ID is required");
        try {
          if (this.allowRequests) {
            const response = await client.get(`${this.resourceName}/${id}`);
            const apiItem = response.data as T;
            return apiItem;
          }
          return null as any; // Ou une valeur par défaut si les requêtes sont désactivées
        } catch (e) {
          throw e;
        }
      },
    });
  }

  // GET all items
  get useAll() {
    return createQuery<T[], void, Error>({
      queryKey: [this.resourceName, "all"],
      fetcher: async () => {
        try {
          if (this.allowRequests) {
            const response = await client.get(`${this.resourceName}/`, {
              headers: {
                "Accept-Language": getExtLocalLanguage(),
              },
            });
            const apiItems = response.data as T[];
            return apiItems;
          }
          return null as any; // Ou une valeur par défaut si les requêtes sont désactivées
        } catch (e) {
          throw e;
        }
      },
    });
  }

  // UPDATE item
  get useUpdate() {
    return createMutation<T, T & { option?: OptionalCrud }, Error>({
      mutationKey: [`update${this.resourceName}`],

      mutationFn: async (item) => {
        if (this.allowRequests) {
          const response = await client.put(
            `${this.resourceName}/${item.id}`,
            item,
          );
          const apiItem = response.data as T;
          return apiItem;
        }
        return item;
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: [this.resourceName, "all"],
        });
        queryClient.setQueryData<T>(
          [this.resourceName, "item", { id: data.id }],
          data,
        );
        if (this.resourceRelatedName) {
          this.resourceRelatedName.forEach((related) => {
            queryClient.invalidateQueries({
              queryKey: [related, "all"],
            });
          });
        }
        if (variables?.option?.toast !== false) {
          this.SuccessToast("update", data);
        }
      },
      onError: (error, variables) => this.showError(error, variables, "update"),
    });
  }

  // CREATE item
  get useCreate() {
    return createMutation<T, T & { option?: OptionalCrud }, Error>({
      mutationKey: [`create${this.resourceName}`],
      mutationFn: async (item) => {
        if (this.allowRequests) {
          const response = await client.post(`${this.resourceName}/`, item);
          const apiItem = response.data as T;
          return apiItem;
        }
        return item;
      },
      onSuccess: (data, variables) => {
        // ✅ Mise à jour optimiste du cache
        queryClient.setQueryData<T[]>([this.resourceName, "all"], (old) =>
          old ? [data, ...old] : [data],
        );
        queryClient.setQueryData<T>(
          [this.resourceName, "item", { id: data.id }],
          data,
        );
        // ✅ Puis invalidation pour refetch si nécessaire
        queryClient.invalidateQueries({
          queryKey: [this.resourceName, "all"],
        });
        if (this.resourceRelatedName) {
          this.resourceRelatedName.forEach((related) => {
            queryClient.invalidateQueries({
              queryKey: [related, "all"],
            });
          });
        }
        if (variables?.option?.toast !== false) {
          this.SuccessToast("create", data);
        }
      },
      onError: (error, variables) => this.showError(error, variables, "create"),
    });
  }

  // DELETE item
  get useDelete() {
    return createMutation<T, T & { option?: OptionalCrud }, Error>({
      mutationKey: [`delete${this.resourceName}`],
      mutationFn: async (item) => {
        if (this.allowRequests) {
          await client.delete(`${this.resourceName}/${item.id}`);
        }
        return item;
      },
      onSuccess: (item, variables) => {
        // ✅ Mise à jour optimiste
        queryClient.setQueryData<T[]>([this.resourceName, "all"], (old) =>
          old ? old.filter((i) => i.id !== item.id) : old,
        );
        queryClient.removeQueries({
          queryKey: [this.resourceName, "item", item],
        });
        // ✅ Puis invalidation
        queryClient.invalidateQueries({
          queryKey: [this.resourceName, "all"],
        });
        if (this.resourceRelatedName) {
          this.resourceRelatedName.forEach((related) => {
            queryClient.invalidateQueries({
              queryKey: [related, "all"],
            });
          });
        }
        if (variables?.option?.toast !== false) {
          this.SuccessToast("delete", item);
        }
      },
      onError: (error, variables) => this.showError(error, variables, "delete"),
    });
  }
}
