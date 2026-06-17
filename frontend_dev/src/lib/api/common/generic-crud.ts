// lib/api/generic-crud.ts

import { AxiosError } from "axios";
import { t } from "i18next";
import type { UUIDString } from "../types";
import { type Error, queryClient } from "./";
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

type CrudAction<T, V = OptionalCrud> = {
  onError: (error: Error, variables: V) => void;
  onSuccess: (
    data: T,
    variables: V,
    onMutateResult?: any,
    context?: any,
  ) => void;
};



export class GenericCrud<Store extends { id?: UUIDString }, Update extends { id?: UUIDString }, Create, Delete> {
  private resourceName: string;
  private resourceRelatedName?: string[];
  private storagePrefix: string;
  private allowRequests = false; // Permet de désactiver les requêtes API si besoin
  private resourceTitle?: (item: Store) => string;

  constructor(config: CrudConfig<Store>) {
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
        keyof Store,
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

  private SuccessToast(action: "update" | "create" | "delete", item: any) {
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
  Update: CrudAction<Update> = {
    onError: (error, variables) => this.showError(error, variables, "update"),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [this.resourceName, "all"],
      });
      queryClient.setQueryData<Update>(
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
  }
  Create: CrudAction<Create> = {
    onError: (error, variables) => this.showError(error, variables, "create"),
    onSuccess: (data, variables) => {
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
  }

  Delete: CrudAction<Delete> = {
    onError: (error, variables) => this.showError(error, variables, "delete"),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.removeQueries({
        queryKey: [this.resourceName, "item", { id: variables.id }],
      });
      if (this.resourceRelatedName) {
        this.resourceRelatedName.forEach((related) => {
          queryClient.invalidateQueries({
            queryKey: [related, "all"],
          });
        });
      }
      console.log("Delete success", data, variables, onMutateResult, context);
      if (variables?.option?.toast !== false) {
        this.SuccessToast("delete", variables);
      }
    },
  }
}
